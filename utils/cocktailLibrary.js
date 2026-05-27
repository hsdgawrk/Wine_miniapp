const cocktailDraft = require('./cocktailDraft');
const cocktailTransfer = require('./cocktailTransfer');

const CUSTOM_COCKTAILS_KEY = 'customCocktails';

const builtInCocktails = [
  {
    id: '1',
    name: '马提尼',
    emoji: '🍸',
    category: '经典',
    description: '优雅与经典的完美结合，干练口感中透露着杜松子的芬芳',
    history: '马提尼是经典鸡尾酒的代表，常被视为干练、简洁与仪式感的象征。',
    difficulty: '简单',
    time: '3分钟',
    popularity: 95,
    ingredients: ['金酒', '干味美思', '橄榄', '柠檬皮']
  },
  {
    id: '2',
    name: '曼哈顿',
    emoji: '🥃',
    category: '经典',
    description: '威士忌的醇厚与甜味美思的柔和，造就了这款永恒的经典',
    history: '曼哈顿以威士忌为主体，口感成熟稳重，是美式经典调酒的重要代表。',
    difficulty: '中等',
    time: '5分钟',
    popularity: 88,
    ingredients: ['威士忌', '甜味美思', '安格斯特拉苦精', '樱桃']
  },
  {
    id: '3',
    name: '莫吉托',
    emoji: '🌿',
    category: '清爽',
    description: '薄荷叶的清香与朗姆酒的甘甜，夏日午后的完美选择',
    history: '莫吉托源自加勒比风味，薄荷、青柠与朗姆酒让它成为清爽型鸡尾酒的代表。',
    difficulty: '简单',
    time: '4分钟',
    popularity: 92,
    ingredients: ['白朗姆酒', '薄荷叶', '青柠汁', '苏打水', '白糖']
  },
  {
    id: '4',
    name: '血腥玛丽',
    emoji: '🍅',
    category: '早餐酒',
    description: '浓郁的番茄汁与伏特加的深度融合，醒酒解腻的理想选择',
    history: '血腥玛丽以番茄汁和伏特加为核心，咸鲜辛辣的风味让它常出现在早午餐场景。',
    difficulty: '简单',
    time: '5分钟',
    popularity: 78,
    ingredients: ['伏特加', '番茄汁', '柠檬汁', '伍斯特郡酱', '塔巴斯科辣椒酱', '芹菜盐']
  },
  {
    id: '5',
    name: '玛格丽特',
    emoji: '🥭',
    category: '热带',
    description: '龙舌兰酒的烈性搭配青柠的酸爽，热情如火的墨西哥风情',
    history: '玛格丽特以龙舌兰酒、橙酒和青柠构成酸甜平衡，盐边是它鲜明的饮用仪式。',
    difficulty: '中等',
    time: '6分钟',
    popularity: 89,
    ingredients: ['银龙舌兰酒', '三重橙酒', '青柠汁', '粗盐', '青柠片']
  },
  {
    id: '6',
    name: '长岛冰茶',
    emoji: '🧊',
    category: '烈酒',
    description: '多种烈酒的完美调和，看似清淡实则浓烈，喝酒人的挑战',
    history: '长岛冰茶混合多种烈酒，以类似冰茶的外观和强烈酒体形成反差。',
    difficulty: '困难',
    time: '8分钟',
    popularity: 85,
    ingredients: ['伏特加', '朗姆酒', '金酒', '龙舌兰酒', '三重橙酒', '柠檬汁', '可乐']
  },
  {
    id: '7',
    name: '威士忌酸',
    emoji: '🍋',
    category: '酸甜',
    description: '威士忌的醇香与柠檬的酸甜交织，层次丰富的口感体验',
    history: '威士忌酸属于 Sour 家族，利用柠檬和糖浆平衡威士忌酒体。',
    difficulty: '简单',
    time: '4分钟',
    popularity: 82,
    ingredients: ['波本威士忌', '柠檬汁', '糖浆', '蛋白', '安格斯特拉苦精']
  },
  {
    id: '8',
    name: '大都会',
    emoji: '💗',
    category: '时尚',
    description: '粉红色的浪漫外表下，隐藏着伏特加与蔓越莓的完美和谐',
    history: '大都会以伏特加和蔓越莓构成明亮外观，是都市风格鸡尾酒的代表。',
    difficulty: '简单',
    time: '3分钟',
    popularity: 87,
    ingredients: ['伏特加', '三重橙酒', '蔓越莓汁', '青柠汁']
  }
];

const detailedStepsByName = {
  '莫吉托': [
    {
      number: 1,
      instruction: '在杯中加入10片新鲜薄荷叶',
      tips: '轻轻拍打薄荷叶释放香味，不要用力捣碎',
      estimatedTime: 1,
      animation: 'fadeIn'
    },
    {
      number: 2,
      instruction: '加入15ml新鲜柠檬汁',
      tips: '使用新鲜柠檬榨汁，避免使用浓缩柠檬汁',
      estimatedTime: 1,
      animation: 'slideIn'
    },
    {
      number: 3,
      instruction: '倒入60ml白朗姆酒',
      tips: '选择品质较好的白朗姆酒，口感会更佳',
      estimatedTime: 1,
      animation: 'zoomIn'
    },
    {
      number: 4,
      instruction: '加入适量苏打水并轻轻搅拌',
      tips: '苏打水要冰镇过，搅拌时避免破坏薄荷叶',
      estimatedTime: 1,
      animation: 'fadeIn'
    },
    {
      number: 5,
      instruction: '用柠檬片和薄荷叶装饰',
      tips: '装饰不仅美观，还能增加香气',
      estimatedTime: 1,
      animation: 'slideIn'
    }
  ],
  '玛格丽特': [
    {
      number: 1,
      instruction: '用柠檬片擦拭杯沿，蘸上盐边',
      tips: '盐边能平衡玛格丽特的酸味',
      estimatedTime: 2,
      animation: 'fadeIn'
    },
    {
      number: 2,
      instruction: '在调酒器中加入45ml龙舌兰酒',
      tips: '使用100%龙舌兰制作的酒效果最佳',
      estimatedTime: 1,
      animation: 'slideIn'
    },
    {
      number: 3,
      instruction: '加入15ml橙皮酒',
      tips: 'Cointreau或Triple Sec都可以',
      estimatedTime: 1,
      animation: 'zoomIn'
    },
    {
      number: 4,
      instruction: '倒入20ml新鲜柠檬汁',
      tips: '新鲜柠檬汁是关键，不能用瓶装的',
      estimatedTime: 1,
      animation: 'fadeIn'
    },
    {
      number: 5,
      instruction: '加冰摇匀，过滤倒入杯中',
      tips: '摇制15-20秒，让所有成分充分混合',
      estimatedTime: 2,
      animation: 'slideIn'
    }
  ],
  '曼哈顿': [
    {
      number: 1,
      instruction: '在调酒杯中加入60ml威士忌',
      tips: '推荐使用黑麦威士忌或波本威士忌',
      estimatedTime: 1,
      animation: 'fadeIn'
    },
    {
      number: 2,
      instruction: '倒入30ml甜味威末酒',
      tips: '选择品质好的意大利甜味威末酒',
      estimatedTime: 1,
      animation: 'slideIn'
    },
    {
      number: 3,
      instruction: '加入2-3滴安格仕苦酒',
      tips: '苦酒用量要适中，太多会掩盖其他味道',
      estimatedTime: 1,
      animation: 'zoomIn'
    },
    {
      number: 4,
      instruction: '加冰搅拌30秒',
      tips: '搅拌而不是摇制，保持酒体的丝滑质感',
      estimatedTime: 1,
      animation: 'fadeIn'
    },
    {
      number: 5,
      instruction: '过滤倒入鸡尾酒杯，用樱桃装饰',
      tips: '预冷鸡尾酒杯能保持最佳口感',
      estimatedTime: 1,
      animation: 'slideIn'
    }
  ]
};

const defaultStorageAdapter = {
  getCustomCocktails() {
    return [];
  },
  setCustomCocktails() {}
};

function createCocktailLibrary(options = {}) {
  const storageAdapter = options.storageAdapter || defaultStorageAdapter;
  const now = options.now || (() => new Date());
  let customIdSequence = 0;
  const createId = options.createId || ((createdAt, draft) => {
    customIdSequence += 1;
    return createCustomId({
      ...draft,
      createdAt,
      idSeed: customIdSequence
    });
  });
  let customCocktails = [];
  let cocktails = mergeCocktails(builtInCocktails, customCocktails);

  function init() {
    const result = readCustomCocktails(storageAdapter, now);
    customCocktails = result.cocktails;
    cocktails = mergeCocktails(builtInCocktails, customCocktails);
    if (result.changed) {
      storageAdapter.setCustomCocktails(customCocktails.map(cloneCocktail));
    }
    return listCocktails();
  }

  function listCocktails() {
    return cocktails.map(cloneCocktail);
  }

  function listCustomCocktails() {
    return customCocktails.map(cloneCocktail);
  }

  function countCustomCocktails() {
    return customCocktails.length;
  }

  function searchCocktails(query) {
    return searchCollection(cocktails, query).map(cloneCocktail);
  }

  function searchCustomCocktails(query) {
    return searchCollection(customCocktails, query).map(cloneCocktail);
  }

  function getCocktailById(id) {
    const normalizedId = normalizeId(id);
    if (!normalizedId) {
      return null;
    }

    const cocktail = cocktails.find((item) => normalizeId(item.id) === normalizedId);
    return cocktail ? cloneCocktail(cocktail) : null;
  }

  function getCustomCocktailById(id) {
    const normalizedId = normalizeId(id);
    if (!normalizedId) {
      return null;
    }

    const cocktail = customCocktails.find((item) => normalizeId(item.id) === normalizedId);
    return cocktail ? cloneCocktail(cocktail) : null;
  }

  function getCocktailByName(name) {
    const normalizedName = decodeValue(name).trim();
    if (!normalizedName) {
      return null;
    }

    const cocktail = cocktails.find((item) => item.name === normalizedName);
    return cocktail ? cloneCocktail(cocktail) : null;
  }

  function getCocktailDetail(params = {}) {
    const cocktail = getCocktailById(params.id) || getCocktailByName(params.name);
    if (!cocktail) {
      return null;
    }

    const steps = getCocktailSteps({ id: cocktail.id, name: cocktail.name });
    return {
      ...cocktail,
      history: cocktail.source === 'built-in' ? (cocktail.history || buildDefaultHistory(cocktail)) : '',
      steps
    };
  }

  function getCocktailSteps(params = {}) {
    const cocktail = getCocktailById(params.id) || getCocktailByName(params.name);
    if (!cocktail) {
      return buildFallbackSteps('鸡尾酒');
    }

    if (cocktail.source === 'custom') {
      return normalizeSteps(cocktail.steps || []);
    }

    const sourceSteps = cocktail.steps && cocktail.steps.length
      ? cocktail.steps
      : detailedStepsByName[cocktail.name] || buildFallbackSteps(cocktail.name, cocktail.ingredients);

    return normalizeSteps(sourceSteps);
  }

  function getDailyCocktail(date = now()) {
    if (!cocktails.length) {
      return null;
    }

    const seedSource = toDateKey(date);
    const index = Math.abs(hashCode(seedSource)) % cocktails.length;
    return cloneCocktail(cocktails[index]);
  }

  function getCurrentDateInfo(date = now()) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    return {
      year: date.getFullYear().toString(),
      month: months[date.getMonth()],
      day: date.getDate().toString().padStart(2, '0'),
      weekday: weekdays[date.getDay()]
    };
  }

  function saveDraft(draft) {
    const validation = cocktailDraft.validateDraft(draftToFormData(draft), {
      existingCocktails: cocktails
    });
    if (!validation.isValid) {
      throw new Error(validation.message);
    }

    const createdAt = now().toISOString();
    const cocktail = normalizeCocktail({
      ...validation.draft,
      id: createId(createdAt, validation.draft),
      createdAt,
      updatedAt: createdAt,
      source: 'custom',
      popularity: normalizePopularity(validation.draft.popularity, validation.draft.name)
    });

    customCocktails = upsertCocktail(customCocktails, cocktail);
    persistCustomCocktails();

    return cloneCocktail(cocktail);
  }

  function updateCustomCocktail(id, draft) {
    const existing = getCustomCocktailById(id);
    if (!existing) {
      throw cocktailTransfer.createTransferError(cocktailTransfer.ERROR_CODES.COCKTAIL_NOT_FOUND);
    }

    const validation = cocktailDraft.validateDraft(draftToFormData(draft), {
      checkNameConflict: false
    });
    if (!validation.isValid) {
      throw new Error(validation.message);
    }

    const hasChanged = hasCustomContentChanged(existing, validation.draft);
    if (!hasChanged) {
      return cloneCocktail(existing);
    }

    if (cocktailDraft.findNameConflict(validation.draft.name, cocktails, existing.id)) {
      throw new Error('配方名称重复，请修改名称后再保存');
    }

    const updatedAt = now().toISOString();
    const cocktail = normalizeCocktail({
      ...existing,
      ...validation.draft,
      id: existing.id,
      createdAt: existing.createdAt || updatedAt,
      updatedAt,
      source: 'custom',
      history: '',
      popularity: normalizePopularity(existing.popularity, validation.draft.name)
    });

    customCocktails = upsertCocktail(customCocktails, cocktail);
    persistCustomCocktails();

    return cloneCocktail(cocktail);
  }

  function deleteCustomCocktail(id) {
    const normalizedId = normalizeId(id);
    const beforeLength = customCocktails.length;
    customCocktails = customCocktails.filter((cocktail) => normalizeId(cocktail.id) !== normalizedId);
    const deleted = customCocktails.length !== beforeLength;
    if (deleted) {
      persistCustomCocktails();
    }
    return deleted;
  }

  function deleteCustomCocktails(ids = []) {
    const idMap = ids.reduce((map, id) => {
      map[normalizeId(id)] = true;
      return map;
    }, {});
    const beforeLength = customCocktails.length;
    customCocktails = customCocktails.filter((cocktail) => !idMap[normalizeId(cocktail.id)]);
    const deletedCount = beforeLength - customCocktails.length;
    if (deletedCount > 0) {
      persistCustomCocktails();
    }
    return deletedCount;
  }

  function createImportPreview(text) {
    const importedDraft = cocktailTransfer.parseImportCode(text);
    return cocktailTransfer.buildImportPreview(importedDraft, cocktails);
  }

  function confirmImport(importPreview, targetName) {
    if (!importPreview || !importPreview.cocktail) {
      throw cocktailTransfer.createTransferError(cocktailTransfer.ERROR_CODES.IMPORT_CONTENT_INVALID);
    }

    const normalizedName = cocktailTransfer.validateImportTargetName(targetName, cocktails);
    const createdAt = now().toISOString();
    const draft = {
      ...importPreview.cocktail,
      name: normalizedName,
      description: importPreview.cocktail.description || cocktailDraft.DEFAULT_DESCRIPTION,
      time: importPreview.cocktail.time || cocktailDraft.DEFAULT_TIME,
      emoji: cocktailDraft.EMOJI_OPTIONS[0],
      history: ''
    };
    const validation = cocktailDraft.validateCocktail(draft, {
      existingCocktails: cocktails
    });
    if (!validation.isValid) {
      throw cocktailTransfer.createTransferError(cocktailTransfer.ERROR_CODES.IMPORT_CONTENT_INVALID);
    }

    const cocktail = normalizeCocktail({
      ...validation.draft,
      id: createId(createdAt, validation.draft),
      createdAt,
      updatedAt: createdAt,
      source: 'custom',
      emoji: cocktailDraft.EMOJI_OPTIONS[0],
      popularity: normalizePopularity(undefined, validation.draft.name)
    });

    customCocktails = upsertCocktail(customCocktails, cocktail);
    persistCustomCocktails();

    return cloneCocktail(cocktail);
  }

  function exportCustomCocktail(id) {
    const cocktail = getCocktailById(id);
    if (!cocktail) {
      throw cocktailTransfer.createTransferError(cocktailTransfer.ERROR_CODES.COCKTAIL_NOT_FOUND);
    }
    if (cocktail.source !== 'custom') {
      throw cocktailTransfer.createTransferError(cocktailTransfer.ERROR_CODES.EXPORT_NOT_CUSTOM);
    }

    const validation = cocktailDraft.validateCocktail(cocktail, {
      existingCocktails: cocktails,
      currentId: cocktail.id
    });
    if (!validation.isValid) {
      throw cocktailTransfer.createTransferError(cocktailTransfer.ERROR_CODES.EXPORT_CONTENT_INVALID, {
        errors: validation.errors,
        message: validation.message
      });
    }

    return cocktailTransfer.createImportCode(validation.draft);
  }

  function persistCustomCocktails() {
    cocktails = mergeCocktails(builtInCocktails, customCocktails);
    storageAdapter.setCustomCocktails(customCocktails.map(cloneCocktail));
  }

  return {
    init,
    listCocktails,
    listCustomCocktails,
    countCustomCocktails,
    searchCocktails,
    searchCustomCocktails,
    getCocktailById,
    getCustomCocktailById,
    getCocktailByName,
    getCocktailDetail,
    getCocktailSteps,
    getDailyCocktail,
    getCurrentDateInfo,
    saveDraft,
    updateCustomCocktail,
    deleteCustomCocktail,
    deleteCustomCocktails,
    createImportPreview,
    confirmImport,
    exportCustomCocktail
  };
}

function readCustomCocktails(storageAdapter, now) {
  try {
    const storedCocktails = storageAdapter.getCustomCocktails();
    if (!Array.isArray(storedCocktails)) {
      return {
        cocktails: [],
        changed: storedCocktails !== undefined
      };
    }

    let changed = false;
    const cocktails = storedCocktails
      .map((cocktail) => {
        const result = migrateCustomCocktail(cocktail, now);
        changed = changed || result.changed;
        return result.cocktail;
      })
      .filter((cocktail) => cocktail.name && !isBuiltInCocktail(cocktail));

    return {
      cocktails,
      changed: changed || cocktails.length !== storedCocktails.length
    };
  } catch (error) {
    console.warn('Failed to read custom cocktails:', error);
    return {
      cocktails: [],
      changed: false
    };
  }
}

function migrateCustomCocktail(cocktail, now) {
  const normalized = normalizeCocktail({
    ...cocktail,
    source: 'custom'
  });
  let changed = false;
  const timestamp = now().toISOString();

  if (!normalized.description) {
    normalized.description = cocktailDraft.DEFAULT_DESCRIPTION;
    changed = true;
  }
  if (!normalized.time) {
    normalized.time = cocktailDraft.DEFAULT_TIME;
    changed = true;
  }
  if (!normalized.createdAt) {
    normalized.createdAt = normalized.updatedAt || timestamp;
    changed = true;
  }
  if (!normalized.updatedAt) {
    normalized.updatedAt = normalized.createdAt || timestamp;
    changed = true;
  }
  if (normalized.history) {
    normalized.history = '';
    changed = true;
  }

  return {
    cocktail: normalized,
    changed
  };
}

function isBuiltInCocktail(cocktail) {
  return builtInCocktails.some((item) => normalizeId(item.id) === normalizeId(cocktail.id));
}

function mergeCocktails(baseCocktails, customItems) {
  const merged = baseCocktails.map((cocktail) => normalizeCocktail({ ...cocktail, source: 'built-in' }));
  customItems.forEach((cocktail) => {
    const normalized = normalizeCocktail({ ...cocktail, source: 'custom' });
    const index = merged.findIndex((item) => normalizeId(item.id) === normalizeId(normalized.id));
    if (index >= 0) {
      merged[index] = normalized;
    } else {
      merged.push(normalized);
    }
  });
  return merged;
}

function normalizeCocktail(cocktail) {
  const name = cocktailDraft.normalizeText(cocktail.name);
  const ingredients = Array.isArray(cocktail.ingredients)
    ? cocktail.ingredients.map((item) => cocktailDraft.normalizeText(item))
    : [];

  return {
    id: normalizeId(cocktail.id) || createCustomId(cocktail),
    name,
    emoji: cocktail.emoji || cocktailDraft.EMOJI_OPTIONS[0],
    category: cocktailDraft.normalizeText(cocktail.category) || cocktailDraft.CATEGORY_OPTIONS[0],
    description: cocktailDraft.normalizeText(cocktail.description),
    history: cocktailDraft.normalizeText(cocktail.history),
    difficulty: cocktail.difficulty || cocktailDraft.DIFFICULTY_OPTIONS[0],
    time: cocktailDraft.normalizeText(cocktail.time) || cocktailDraft.DEFAULT_TIME,
    popularity: normalizePopularity(cocktail.popularity, name),
    ingredients,
    steps: normalizeSteps(cocktail.steps || []),
    createdAt: cocktail.createdAt || '',
    updatedAt: cocktail.updatedAt || '',
    source: cocktail.source || 'custom'
  };
}

function normalizeSteps(steps) {
  if (!Array.isArray(steps)) {
    return [];
  }

  const animations = ['fadeIn', 'slideIn', 'zoomIn'];
  return steps.map((step, index) => ({
    number: index + 1,
    instruction: cocktailDraft.normalizeText(step && step.instruction),
    tips: step && step.tips ? step.tips : '',
    estimatedTime: step && step.estimatedTime ? step.estimatedTime : '',
    animation: step && step.animation ? step.animation : animations[index % animations.length]
  })).filter((step) => step.instruction);
}

function buildFallbackSteps(cocktailName, ingredients = []) {
  const ingredientText = ingredients && ingredients.length
    ? ingredients.join('、')
    : '所需材料';

  return [
    {
      number: 1,
      instruction: `准备${ingredientText}`,
      tips: '确保材料新鲜且温度适宜',
      estimatedTime: 2,
      animation: 'fadeIn'
    },
    {
      number: 2,
      instruction: `按${cocktailName}配方比例混合所有成分`,
      tips: '先处理需要摇和或搅拌的基酒与辅料',
      estimatedTime: 3,
      animation: 'slideIn'
    },
    {
      number: 3,
      instruction: '倒入合适杯具并完成装饰',
      tips: '杯具预冷能让口感更稳定',
      estimatedTime: 2,
      animation: 'zoomIn'
    }
  ];
}

function buildDefaultHistory(cocktail) {
  return `${cocktail.name}是一款${cocktail.category || '经典'}风格的鸡尾酒，适合在熟悉基本技法后反复练习。`;
}

function upsertCocktail(items, cocktail) {
  const nextItems = items.map(cloneCocktail);
  const index = nextItems.findIndex((item) => normalizeId(item.id) === normalizeId(cocktail.id));
  if (index >= 0) {
    nextItems[index] = cloneCocktail(cocktail);
  } else {
    nextItems.push(cloneCocktail(cocktail));
  }
  return nextItems;
}

function searchCollection(items, query) {
  const trimmedQuery = String(query || '').trim().toLowerCase();
  if (!trimmedQuery) {
    return items;
  }

  return items.filter((cocktail) => {
    const searchableText = [
      cocktail.name,
      cocktail.description,
      cocktail.difficulty,
      cocktail.category,
      ...(cocktail.ingredients || [])
    ].join(' ').toLowerCase();

    return searchableText.includes(trimmedQuery);
  });
}

function draftToFormData(draft = {}) {
  if (Object.prototype.hasOwnProperty.call(draft, 'cocktailName')) {
    return draft;
  }

  return {
    cocktailName: draft.name,
    cocktailDescription: draft.description === cocktailDraft.DEFAULT_DESCRIPTION ? '' : draft.description,
    difficulty: draft.difficulty,
    category: draft.category,
    emoji: draft.emoji,
    time: draft.time,
    ingredients: draft.ingredients,
    steps: draft.steps
  };
}

function hasCustomContentChanged(existing, draft) {
  const existingComparable = toComparableCustomContent(existing);
  const draftComparable = toComparableCustomContent(draft);
  return JSON.stringify(existingComparable) !== JSON.stringify(draftComparable);
}

function toComparableCustomContent(cocktail = {}) {
  return {
    name: cocktailDraft.normalizeText(cocktail.name),
    description: cocktailDraft.normalizeText(cocktail.description) || cocktailDraft.DEFAULT_DESCRIPTION,
    category: cocktailDraft.normalizeText(cocktail.category),
    difficulty: cocktail.difficulty || '',
    time: cocktailDraft.normalizeText(cocktail.time) || cocktailDraft.DEFAULT_TIME,
    emoji: cocktail.emoji || cocktailDraft.EMOJI_OPTIONS[0],
    ingredients: (cocktail.ingredients || []).map((item) => cocktailDraft.normalizeText(item)),
    steps: (cocktail.steps || []).map((step) => cocktailDraft.normalizeText(step && step.instruction))
  };
}

function cloneCocktail(cocktail) {
  return {
    ...cocktail,
    ingredients: [...(cocktail.ingredients || [])],
    steps: (cocktail.steps || []).map((step) => ({ ...step }))
  };
}

function normalizeId(id) {
  if (id === undefined || id === null || id === '') {
    return '';
  }
  return String(id);
}

function createCustomId(seed) {
  const source = [
    seed && seed.createdAt,
    seed && seed.name,
    seed && seed.description,
    seed && seed.idSeed
  ].filter(Boolean).join('|') || 'cocktail';
  return `custom-${Math.abs(hashCode(source)).toString(36)}`;
}

function normalizePopularity(popularity, name = '') {
  const value = parseInt(popularity, 10);
  if (!Number.isNaN(value)) {
    return Math.max(0, Math.min(100, value));
  }
  return 80 + (Math.abs(hashCode(name || 'cocktail')) % 20);
}

function decodeValue(value) {
  try {
    return decodeURIComponent(value || '');
  } catch (error) {
    return String(value || '');
  }
}

function toDateKey(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function hashCode(value) {
  const text = String(value || '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

module.exports = {
  CUSTOM_COCKTAILS_KEY,
  builtInCocktails: builtInCocktails.map(cloneCocktail),
  createCocktailLibrary
};
