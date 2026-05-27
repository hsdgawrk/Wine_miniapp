const cocktailDraft = require('./cocktailDraft');

const IMPORT_PREFIX = 'COCKTAIL_V1:';

const ERROR_CODES = {
  IMPORT_FORMAT_INVALID: 'IMPORT_FORMAT_INVALID',
  IMPORT_VERSION_UNSUPPORTED: 'IMPORT_VERSION_UNSUPPORTED',
  IMPORT_CONTENT_INVALID: 'IMPORT_CONTENT_INVALID',
  IMPORT_NAME_CONFLICT: 'IMPORT_NAME_CONFLICT',
  IMPORT_CLIPBOARD_FAILED: 'IMPORT_CLIPBOARD_FAILED',
  EXPORT_NOT_CUSTOM: 'EXPORT_NOT_CUSTOM',
  EXPORT_CONTENT_INVALID: 'EXPORT_CONTENT_INVALID',
  COCKTAIL_NOT_FOUND: 'COCKTAIL_NOT_FOUND'
};

const ERROR_MESSAGES = {
  [ERROR_CODES.IMPORT_FORMAT_INVALID]: '导入码格式不正确',
  [ERROR_CODES.IMPORT_VERSION_UNSUPPORTED]: '暂不支持此版本的配方导入码',
  [ERROR_CODES.IMPORT_CONTENT_INVALID]: '配方内容不完整或不符合当前规则',
  [ERROR_CODES.IMPORT_NAME_CONFLICT]: '导入后名称已存在，请修改名称',
  [ERROR_CODES.IMPORT_CLIPBOARD_FAILED]: '无法读取剪贴板，请手动粘贴',
  [ERROR_CODES.EXPORT_NOT_CUSTOM]: '当前配方不可导出',
  [ERROR_CODES.EXPORT_CONTENT_INVALID]: '配方内容不符合当前规则，请先编辑并保存',
  [ERROR_CODES.COCKTAIL_NOT_FOUND]: '未找到配方'
};

function createImportCode(cocktail) {
  const payload = {
    name: cocktail.name,
    description: cocktail.description || cocktailDraft.DEFAULT_DESCRIPTION,
    category: cocktail.category,
    difficulty: cocktail.difficulty,
    time: cocktail.time || cocktailDraft.DEFAULT_TIME,
    ingredients: cocktail.ingredients || [],
    steps: (cocktail.steps || []).map((step) => ({
      instruction: step.instruction
    }))
  };

  return `${IMPORT_PREFIX}${encodeBase64Utf8(JSON.stringify(payload))}`;
}

function parseImportCode(text) {
  const trimmedText = String(text || '').trim();
  if (!trimmedText) {
    throw createTransferError(ERROR_CODES.IMPORT_FORMAT_INVALID);
  }

  if (!trimmedText.startsWith(IMPORT_PREFIX)) {
    if (/^COCKTAIL_[A-Za-z0-9]+:/.test(trimmedText)) {
      throw createTransferError(ERROR_CODES.IMPORT_VERSION_UNSUPPORTED);
    }
    throw createTransferError(ERROR_CODES.IMPORT_FORMAT_INVALID);
  }

  const encodedPayload = trimmedText.slice(IMPORT_PREFIX.length);
  if (!encodedPayload) {
    throw createTransferError(ERROR_CODES.IMPORT_FORMAT_INVALID);
  }

  let rawPayload = '';
  let parsedPayload = null;
  try {
    rawPayload = decodeBase64Utf8(encodedPayload);
    parsedPayload = JSON.parse(rawPayload);
  } catch (error) {
    throw createTransferError(ERROR_CODES.IMPORT_FORMAT_INVALID, { cause: error.message });
  }

  return normalizeImportedPayload(parsedPayload);
}

function normalizeImportedPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw createTransferError(ERROR_CODES.IMPORT_CONTENT_INVALID);
  }

  if (!isValidPayloadShape(payload)) {
    throw createTransferError(ERROR_CODES.IMPORT_CONTENT_INVALID);
  }

  const steps = Array.isArray(payload.steps)
    ? payload.steps.map((step) => ({
      instruction: step.instruction
    }))
    : [];

  const draftLike = {
    cocktailName: payload.name,
    cocktailDescription: payload.description || '',
    category: payload.category,
    difficulty: payload.difficulty,
    time: payload.time || cocktailDraft.DEFAULT_TIME,
    ingredients: Array.isArray(payload.ingredients) ? payload.ingredients : [],
    steps,
    emoji: cocktailDraft.EMOJI_OPTIONS[0]
  };

  const validation = cocktailDraft.validateDraft(draftLike, { checkNameConflict: false });
  if (!validation.isValid) {
    throw createTransferError(ERROR_CODES.IMPORT_CONTENT_INVALID, {
      errors: validation.errors,
      message: validation.message
    });
  }

  return validation.draft;
}

function isValidPayloadShape(payload) {
  const hasField = (field) => Object.prototype.hasOwnProperty.call(payload, field);
  const requiredTextFields = ['name', 'category', 'difficulty'];

  if (!requiredTextFields.every((field) => hasField(field) && typeof payload[field] === 'string' && cocktailDraft.normalizeText(payload[field]))) {
    return false;
  }

  if (!hasField('ingredients') || !Array.isArray(payload.ingredients) || payload.ingredients.some((item) => typeof item !== 'string')) {
    return false;
  }

  if (!hasField('steps') || !Array.isArray(payload.steps) || payload.steps.some((step) => (
    !step
    || typeof step !== 'object'
    || Array.isArray(step)
    || typeof step.instruction !== 'string'
  ))) {
    return false;
  }

  if (hasField('description') && payload.description !== null && typeof payload.description !== 'string') {
    return false;
  }

  if (hasField('time') && payload.time !== null && typeof payload.time !== 'string') {
    return false;
  }

  return true;
}

function buildImportPreview(importedDraft, existingCocktails = []) {
  const targetName = suggestAvailableName(importedDraft.name, existingCocktails);

  return {
    targetName,
    originalName: importedDraft.name,
    cocktail: {
      ...importedDraft,
      emoji: cocktailDraft.EMOJI_OPTIONS[0]
    },
    fields: {
      description: importedDraft.description || cocktailDraft.DEFAULT_DESCRIPTION,
      category: importedDraft.category,
      difficulty: importedDraft.difficulty,
      time: importedDraft.time || cocktailDraft.DEFAULT_TIME,
      ingredients: importedDraft.ingredients || [],
      steps: (importedDraft.steps || []).map((step, index) => ({
        ...step,
        number: index + 1
      }))
    }
  };
}

function validateImportTargetName(targetName, existingCocktails = []) {
  const normalizedName = cocktailDraft.normalizeText(targetName);
  if (!normalizedName || normalizedName.length > cocktailDraft.MAX_NAME_LENGTH) {
    throw createTransferError(ERROR_CODES.IMPORT_CONTENT_INVALID);
  }

  if (cocktailDraft.findNameConflict(normalizedName, existingCocktails)) {
    throw createTransferError(ERROR_CODES.IMPORT_NAME_CONFLICT);
  }

  return normalizedName;
}

function suggestAvailableName(name, existingCocktails = []) {
  const baseName = cocktailDraft.normalizeText(name);
  if (!cocktailDraft.findNameConflict(baseName, existingCocktails)) {
    return baseName;
  }

  for (let index = 2; index < 1000; index += 1) {
    const suffix = `（${index}）`;
    const maxBaseLength = cocktailDraft.MAX_NAME_LENGTH - suffix.length;
    const candidateBase = baseName.slice(0, Math.max(1, maxBaseLength));
    const candidate = `${candidateBase}${suffix}`;
    if (!cocktailDraft.findNameConflict(candidate, existingCocktails)) {
      return candidate;
    }
  }

  return baseName.slice(0, cocktailDraft.MAX_NAME_LENGTH);
}

function createTransferError(code, details = {}) {
  const error = new Error(getErrorMessage(code));
  error.code = code;
  error.details = details;
  return error;
}

function getErrorMessage(code) {
  return ERROR_MESSAGES[code] || '操作失败，请稍后重试';
}

function encodeBase64Utf8(value) {
  return encodeBase64(utf8ToBytes(String(value || '')));
}

function decodeBase64Utf8(value) {
  return bytesToUtf8(decodeBase64(String(value || '')));
}

function utf8ToBytes(value) {
  const bytes = [];
  for (let i = 0; i < value.length; i += 1) {
    let codePoint = value.charCodeAt(i);

    if (codePoint >= 0xd800 && codePoint <= 0xdbff && i + 1 < value.length) {
      const next = value.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        codePoint = ((codePoint - 0xd800) * 0x400) + (next - 0xdc00) + 0x10000;
        i += 1;
      }
    }

    if (codePoint < 0x80) {
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      bytes.push(0xc0 | (codePoint >> 6));
      bytes.push(0x80 | (codePoint & 0x3f));
    } else if (codePoint < 0x10000) {
      bytes.push(0xe0 | (codePoint >> 12));
      bytes.push(0x80 | ((codePoint >> 6) & 0x3f));
      bytes.push(0x80 | (codePoint & 0x3f));
    } else {
      bytes.push(0xf0 | (codePoint >> 18));
      bytes.push(0x80 | ((codePoint >> 12) & 0x3f));
      bytes.push(0x80 | ((codePoint >> 6) & 0x3f));
      bytes.push(0x80 | (codePoint & 0x3f));
    }
  }
  return bytes;
}

function bytesToUtf8(bytes) {
  let value = '';
  for (let i = 0; i < bytes.length;) {
    const byte1 = bytes[i];
    if (byte1 < 0x80) {
      value += String.fromCharCode(byte1);
      i += 1;
    } else if (byte1 >= 0xc0 && byte1 < 0xe0) {
      const byte2 = bytes[i + 1];
      value += String.fromCharCode(((byte1 & 0x1f) << 6) | (byte2 & 0x3f));
      i += 2;
    } else if (byte1 >= 0xe0 && byte1 < 0xf0) {
      const byte2 = bytes[i + 1];
      const byte3 = bytes[i + 2];
      value += String.fromCharCode(((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f));
      i += 3;
    } else {
      const byte2 = bytes[i + 1];
      const byte3 = bytes[i + 2];
      const byte4 = bytes[i + 3];
      const codePoint = ((byte1 & 0x07) << 18)
        | ((byte2 & 0x3f) << 12)
        | ((byte3 & 0x3f) << 6)
        | (byte4 & 0x3f);
      const adjusted = codePoint - 0x10000;
      value += String.fromCharCode(0xd800 + (adjusted >> 10));
      value += String.fromCharCode(0xdc00 + (adjusted & 0x3ff));
      i += 4;
    }
  }
  return value;
}

function encodeBase64(bytes) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';

  for (let i = 0; i < bytes.length; i += 3) {
    const byte1 = bytes[i];
    const byte2 = bytes[i + 1];
    const byte3 = bytes[i + 2];
    const triplet = (byte1 << 16) | ((byte2 || 0) << 8) | (byte3 || 0);

    output += alphabet[(triplet >> 18) & 0x3f];
    output += alphabet[(triplet >> 12) & 0x3f];
    output += i + 1 < bytes.length ? alphabet[(triplet >> 6) & 0x3f] : '=';
    output += i + 2 < bytes.length ? alphabet[triplet & 0x3f] : '=';
  }

  return output;
}

function decodeBase64(value) {
  const cleanValue = value;
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanValue) || cleanValue.length % 4 !== 0) {
    throw new Error('Invalid base64');
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const bytes = [];

  for (let i = 0; i < cleanValue.length; i += 4) {
    const chars = cleanValue.slice(i, i + 4);
    const sextets = chars.split('').map((char) => (char === '=' ? 0 : alphabet.indexOf(char)));
    if (sextets.some((valueIndex) => valueIndex < 0)) {
      throw new Error('Invalid base64');
    }

    const triplet = (sextets[0] << 18) | (sextets[1] << 12) | (sextets[2] << 6) | sextets[3];
    bytes.push((triplet >> 16) & 0xff);
    if (chars[2] !== '=') {
      bytes.push((triplet >> 8) & 0xff);
    }
    if (chars[3] !== '=') {
      bytes.push(triplet & 0xff);
    }
  }

  return bytes;
}

module.exports = {
  IMPORT_PREFIX,
  ERROR_CODES,
  ERROR_MESSAGES,
  createImportCode,
  parseImportCode,
  buildImportPreview,
  validateImportTargetName,
  suggestAvailableName,
  createTransferError,
  getErrorMessage
};
