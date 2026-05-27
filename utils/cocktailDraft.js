const TIME_PATTERN = /^(\d+)(分钟|min|mins|小时|hours?)$/i;
const DEFAULT_ANIMATIONS = ['fadeIn', 'slideIn', 'zoomIn'];
const MAX_NAME_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 100;
const MAX_INGREDIENTS = 30;
const MAX_INGREDIENT_LENGTH = 20;
const MAX_STEPS = 30;
const MAX_STEP_LENGTH = 200;

const ACTIONS = {
  INPUT_NAME: 'inputName',
  INPUT_DESCRIPTION: 'inputDescription',
  INPUT_TIME: 'inputTime',
  SELECT_DIFFICULTY: 'selectDifficulty',
  SELECT_CATEGORY: 'selectCategory',
  SELECT_EMOJI: 'selectEmoji',
  INPUT_INGREDIENT: 'inputIngredient',
  ADD_INGREDIENT: 'addIngredient',
  REMOVE_INGREDIENT: 'removeIngredient',
  ADD_STEP: 'addStep',
  UPDATE_STEP: 'updateStep',
  REMOVE_STEP: 'removeStep',
  MOVE_STEP: 'moveStep',
  RESET: 'reset'
};

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
  const rawIngredients = normalizeIngredientOrder(data.ingredients);
  const hasEmptyIngredient = rawIngredients.some((item) => !item.trim());
  const hasLongIngredient = rawIngredients.some((item) => item.trim().length > MAX_INGREDIENT_LENGTH);
  const hasDuplicateIngredient = hasDuplicates(rawIngredients.map((item) => item.trim()).filter(Boolean));
  const hasLongStep = orderedSteps.some((step) => step.instruction.trim().length > MAX_STEP_LENGTH);
  const errors = {};
  const errorMessages = [];

  if (!draft.name) {
    errors.name = '请输入配方名称';
    errorMessages.push('配方名称未填写');
  } else if (draft.name.length > MAX_NAME_LENGTH) {
    errors.name = `配方名称不能超过${MAX_NAME_LENGTH}个字符`;
    errorMessages.push('配方名称过长');
  }

  if (!draft.description) {
    errors.description = '请输入配方描述';
    errorMessages.push('配方描述未填写');
  } else if (draft.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `配方描述不能超过${MAX_DESCRIPTION_LENGTH}个字符`;
    errorMessages.push('配方描述过长');
  }

  if (draft.ingredients.length === 0) {
    errors.ingredients = '请至少添加一种成分';
    errorMessages.push('未添加任何成分');
  } else if (rawIngredients.length > MAX_INGREDIENTS) {
    errors.ingredients = `成分最多添加${MAX_INGREDIENTS}种`;
    errorMessages.push('成分数量过多');
  } else if (hasEmptyIngredient) {
    errors.ingredients = '成分名称不能为空';
    errorMessages.push('成分名称为空');
  } else if (hasLongIngredient) {
    errors.ingredients = `单个成分不能超过${MAX_INGREDIENT_LENGTH}个字符`;
    errorMessages.push('成分名称过长');
  } else if (hasDuplicateIngredient) {
    errors.ingredients = '成分不能重复';
    errorMessages.push('成分重复');
  }

  if (!draft.steps.length || hasEmptyStep) {
    errors.steps = '请完善所有制作步骤';
    errorMessages.push('制作步骤不完整');
  } else if (orderedSteps.length > MAX_STEPS) {
    errors.steps = `制作步骤最多添加${MAX_STEPS}步`;
    errorMessages.push('制作步骤数量过多');
  } else if (hasLongStep) {
    errors.steps = `单个制作步骤不能超过${MAX_STEP_LENGTH}个字符`;
    errorMessages.push('制作步骤过长');
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
    } else if (text.length > MAX_NAME_LENGTH) {
      errors.name = `配方名称不能超过${MAX_NAME_LENGTH}个字符`;
    } else {
      delete errors.name;
    }
  }

  if (field === 'description') {
    if (!text) {
      errors.description = '请输入配方描述';
    } else if (text.length > MAX_DESCRIPTION_LENGTH) {
      errors.description = `配方描述不能超过${MAX_DESCRIPTION_LENGTH}个字符`;
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
  if (normalizedIngredients.length >= MAX_INGREDIENTS) {
    return { ingredients: normalizedIngredients, error: `成分最多添加${MAX_INGREDIENTS}种` };
  }

  if (ingredient.length > MAX_INGREDIENT_LENGTH) {
    return { ingredients: normalizedIngredients, error: `单个成分不能超过${MAX_INGREDIENT_LENGTH}个字符` };
  }

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
  if (normalizedSteps.length >= MAX_STEPS) {
    return {
      steps: normalizedSteps,
      error: `制作步骤最多添加${MAX_STEPS}步`
    };
  }

  const animation = animations[normalizedSteps.length % animations.length] || 'fadeIn';
  return {
    steps: [
      ...normalizedSteps,
      {
        number: normalizedSteps.length + 1,
        instruction: '',
        animation
      }
    ],
    error: ''
  };
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

function reduceDraftState(data, action = {}) {
  const formErrors = data.formErrors || {};
  const type = action.type;

  if (type === ACTIONS.INPUT_NAME) {
    return patchResult({
      cocktailName: action.value,
      formErrors: validateField('name', action.value, formErrors)
    });
  }

  if (type === ACTIONS.INPUT_DESCRIPTION) {
    return patchResult({
      cocktailDescription: action.value,
      formErrors: validateField('description', action.value, formErrors)
    });
  }

  if (type === ACTIONS.INPUT_TIME) {
    return patchResult({
      time: action.value,
      formErrors: validateField('time', action.value, formErrors)
    });
  }

  if (type === ACTIONS.SELECT_DIFFICULTY) {
    const index = Number(action.index);
    const difficulty = readOption(action.options, index, data.difficulty || '简单');
    return patchResult({ difficulty, difficultyIndex: index });
  }

  if (type === ACTIONS.SELECT_CATEGORY) {
    const index = Number(action.index);
    const category = readOption(action.options, index, data.category || '经典');
    return patchResult({ category, categoryIndex: index });
  }

  if (type === ACTIONS.SELECT_EMOJI) {
    const index = Number(action.index);
    const emoji = readOption(action.options, index, data.emoji || '🍸');
    return patchResult({ emoji, emojiIndex: index });
  }

  if (type === ACTIONS.INPUT_INGREDIENT) {
    return patchResult({ newIngredient: action.value });
  }

  if (type === ACTIONS.ADD_INGREDIENT) {
    const result = addIngredient(data.ingredients, data.newIngredient);
    if (result.error) {
      return patchResult({ ingredients: result.ingredients }, result.error);
    }

    const nextErrors = removeError(formErrors, 'ingredients');
    return patchResult({
      ingredients: result.ingredients,
      newIngredient: '',
      formErrors: nextErrors
    });
  }

  if (type === ACTIONS.REMOVE_INGREDIENT) {
    return patchResult({
      ingredients: removeIngredient(data.ingredients, action.index)
    });
  }

  if (type === ACTIONS.ADD_STEP) {
    const result = addStep(data.steps, action.animations);
    return patchResult({ steps: result.steps }, result.error);
  }

  if (type === ACTIONS.UPDATE_STEP) {
    const steps = updateStep(data.steps, action.index, action.value);
    const nextErrors = steps.every((step) => step.instruction.trim())
      ? removeError(formErrors, 'steps')
      : formErrors;

    return patchResult({ steps, formErrors: nextErrors });
  }

  if (type === ACTIONS.REMOVE_STEP) {
    const result = removeStep(data.steps, action.index);
    return patchResult({ steps: result.steps }, result.error);
  }

  if (type === ACTIONS.MOVE_STEP) {
    return patchResult({
      steps: moveStep(data.steps, action.index, action.direction)
    });
  }

  if (type === ACTIONS.RESET) {
    return patchResult({
      ...createInitialDraft(),
      difficultyIndex: 0,
      categoryIndex: 0,
      emojiIndex: 0
    });
  }

  return patchResult({});
}

function patchResult(patch, error = '') {
  return {
    patch,
    error
  };
}

function readOption(options, index, fallback) {
  if (!Array.isArray(options) || !options[index]) {
    return fallback;
  }
  return options[index];
}

function removeError(errors, key) {
  const nextErrors = { ...errors };
  delete nextErrors[key];
  return nextErrors;
}

function normalizeIngredientOrder(ingredients) {
  if (!Array.isArray(ingredients)) {
    return [];
  }

  return ingredients.map((item) => String(item || ''));
}

function hasDuplicates(items) {
  const seen = {};
  return items.some((item) => {
    if (seen[item]) {
      return true;
    }
    seen[item] = true;
    return false;
  });
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
  ACTIONS,
  createInitialDraft,
  toDraft,
  validateDraft,
  validateField,
  reduceDraftState,
  addIngredient,
  removeIngredient,
  addStep,
  updateStep,
  removeStep,
  moveStep,
  hasContent
};
