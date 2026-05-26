const TIME_PATTERN = /^(\d+)(分钟|min|mins|小时|hours?)$/i;
const DEFAULT_ANIMATIONS = ['fadeIn', 'slideIn', 'zoomIn'];

function createInitialDraft() {
  return {
    cocktailName: '',
    cocktailDescription: '',
    steps: [{ number: 1, instruction: '', animation: 'fadeIn' }],
    difficulty: '简单',
    time: '',
    category: '经典',
    emoji: '🍸',
    ingredients: [],
    newIngredient: '',
    formErrors: {}
  };
}

function toDraft(data) {
  return {
    name: String(data.cocktailName || '').trim(),
    description: String(data.cocktailDescription || '').trim(),
    difficulty: data.difficulty || '简单',
    time: String(data.time || '').trim() || '未设置',
    category: data.category || '经典',
    emoji: data.emoji || '🍸',
    ingredients: normalizeIngredients(data.ingredients),
    steps: normalizeSteps(data.steps),
    history: ''
  };
}

function validateDraft(data) {
  const draft = toDraft(data);
  const orderedSteps = normalizeStepOrder(data.steps);
  const hasEmptyStep = orderedSteps.some((step) => !step.instruction.trim());
  const errors = {};
  const errorMessages = [];

  if (!draft.name) {
    errors.name = '请输入配方名称';
    errorMessages.push('配方名称未填写');
  } else if (draft.name.length > 20) {
    errors.name = '配方名称不能超过20个字符';
    errorMessages.push('配方名称过长');
  }

  if (!draft.description) {
    errors.description = '请输入配方描述';
    errorMessages.push('配方描述未填写');
  } else if (draft.description.length > 100) {
    errors.description = '配方描述不能超过100个字符';
    errorMessages.push('配方描述过长');
  }

  if (draft.ingredients.length === 0) {
    errors.ingredients = '请至少添加一种成分';
    errorMessages.push('未添加任何成分');
  }

  if (!draft.steps.length || hasEmptyStep) {
    errors.steps = '请完善所有制作步骤';
    errorMessages.push('制作步骤不完整');
  }

  const rawTime = String(data.time || '').trim();
  if (rawTime && !TIME_PATTERN.test(rawTime)) {
    errors.time = '时间格式不正确，如：10分钟、15min';
    errorMessages.push('制作时间格式错误');
  }

  return {
    isValid: errorMessages.length === 0,
    errors,
    message: errorMessages.length ? `${errorMessages.join('、')}，请检查后重试` : '验证通过',
    draft
  };
}

function validateField(field, value, currentErrors = {}) {
  const errors = { ...currentErrors };
  const text = String(value || '').trim();

  if (field === 'name') {
    if (!text) {
      errors.name = '请输入配方名称';
    } else if (text.length > 20) {
      errors.name = '配方名称不能超过20个字符';
    } else {
      delete errors.name;
    }
  }

  if (field === 'description') {
    if (!text) {
      errors.description = '请输入配方描述';
    } else if (text.length > 100) {
      errors.description = '配方描述不能超过100个字符';
    } else {
      delete errors.description;
    }
  }

  if (field === 'time') {
    if (text && !TIME_PATTERN.test(text)) {
      errors.time = '时间格式不正确，如：10分钟、15min';
    } else {
      delete errors.time;
    }
  }

  return errors;
}

function addIngredient(ingredients, rawIngredient) {
  const ingredient = String(rawIngredient || '').trim();
  if (!ingredient) {
    return { ingredients: normalizeIngredients(ingredients), error: '请输入成分名称' };
  }

  const normalizedIngredients = normalizeIngredients(ingredients);
  if (normalizedIngredients.includes(ingredient)) {
    return { ingredients: normalizedIngredients, error: '成分已存在' };
  }

  return {
    ingredients: [...normalizedIngredients, ingredient],
    error: ''
  };
}

function removeIngredient(ingredients, index) {
  return normalizeIngredients(ingredients).filter((_, itemIndex) => itemIndex !== Number(index));
}

function addStep(steps, animations = DEFAULT_ANIMATIONS) {
  const normalizedSteps = normalizeStepOrder(steps);
  const animation = animations[normalizedSteps.length % animations.length] || 'fadeIn';
  return [
    ...normalizedSteps,
    {
      number: normalizedSteps.length + 1,
      instruction: '',
      animation
    }
  ];
}

function updateStep(steps, index, instruction) {
  return normalizeStepOrder(steps).map((step, itemIndex) => (
    itemIndex === Number(index) ? { ...step, instruction } : step
  ));
}

function removeStep(steps, index) {
  const normalizedSteps = normalizeStepOrder(steps);
  if (normalizedSteps.length <= 1) {
    return {
      steps: normalizedSteps,
      error: '至少保留一个步骤'
    };
  }

  return {
    steps: normalizeStepOrder(normalizedSteps.filter((_, itemIndex) => itemIndex !== Number(index))),
    error: ''
  };
}

function moveStep(steps, index, direction) {
  const normalizedSteps = normalizeStepOrder(steps);
  const fromIndex = Number(index);
  const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;

  if (toIndex < 0 || toIndex >= normalizedSteps.length) {
    return normalizedSteps;
  }

  const nextSteps = [...normalizedSteps];
  [nextSteps[fromIndex], nextSteps[toIndex]] = [nextSteps[toIndex], nextSteps[fromIndex]];
  return normalizeStepOrder(nextSteps);
}

function hasContent(data) {
  return Boolean(
    String(data.cocktailName || '').trim() ||
    String(data.cocktailDescription || '').trim() ||
    normalizeIngredients(data.ingredients).length ||
    normalizeSteps(data.steps).length
  );
}

function normalizeIngredients(ingredients) {
  if (!Array.isArray(ingredients)) {
    return [];
  }

  return ingredients.map((item) => String(item || '').trim()).filter(Boolean);
}

function normalizeSteps(steps) {
  return normalizeStepOrder(steps).filter((step) => step.instruction.trim());
}

function normalizeStepOrder(steps) {
  if (!Array.isArray(steps) || !steps.length) {
    return [{ number: 1, instruction: '', animation: 'fadeIn' }];
  }

  return steps.map((step, index) => ({
    number: index + 1,
    instruction: String(step.instruction || ''),
    animation: step.animation || DEFAULT_ANIMATIONS[index % DEFAULT_ANIMATIONS.length]
  }));
}

module.exports = {
  createInitialDraft,
  toDraft,
  validateDraft,
  validateField,
  addIngredient,
  removeIngredient,
  addStep,
  updateStep,
  removeStep,
  moveStep,
  hasContent
};
