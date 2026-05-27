const TIME_PATTERN = /^([1-9]\d{0,2})(分钟|小时)$/;
const DEFAULT_ANIMATIONS = ['fadeIn', 'slideIn', 'zoomIn'];
const MAX_NAME_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 100;
const MAX_CATEGORY_LENGTH = 10;
const MAX_INGREDIENTS = 30;
const MAX_INGREDIENT_LENGTH = 20;
const MAX_STEPS = 30;
const MAX_STEP_LENGTH = 200;
const DEFAULT_DESCRIPTION = '-';
const DEFAULT_TIME = '未设置';
const EMPTY_PICKER_VALUE = '-';

const DIFFICULTY_OPTIONS = ['简单', '中等', '困难'];
const CATEGORY_OPTIONS = ['经典', '清爽', '热带', '烈酒', '早餐酒', '酸甜', '时尚', '创新'];
const EMOJI_OPTIONS = ['🍸', '🥃', '🌿', '🧊', '🍅', '🥭', '🍋', '💗', '🍹', '🥂', '🍷', '🎯'];
const TIME_NUMBER_OPTIONS = [
  EMPTY_PICKER_VALUE,
  ...Array.from({ length: 999 }, (_, index) => String(index + 1))
];
const TIME_UNIT_OPTIONS = [EMPTY_PICKER_VALUE, '分钟', '小时'];

const ACTIONS = {
  INPUT_NAME: 'inputName',
  INPUT_DESCRIPTION: 'inputDescription',
  INPUT_TIME: 'inputTime',
  SELECT_TIME_NUMBER: 'selectTimeNumber',
  SELECT_TIME_UNIT: 'selectTimeUnit',
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
    difficulty: DIFFICULTY_OPTIONS[0],
    time: DEFAULT_TIME,
    timeNumber: EMPTY_PICKER_VALUE,
    timeUnit: EMPTY_PICKER_VALUE,
    timeNumberIndex: 0,
    timeUnitIndex: 0,
    timeNeedsReselect: false,
    legacyTimeText: '',
    category: CATEGORY_OPTIONS[0],
    emoji: EMOJI_OPTIONS[0],
    ingredients: [],
    newIngredient: '',
    formErrors: {}
  };
}

function createDraftFromCocktail(cocktail = {}) {
  const timeSelection = parseTimeSelection(cocktail.time);
  const normalizedSteps = normalizeStepOrder(cocktail.steps || []);

  return {
    ...createInitialDraft(),
    cocktailName: cocktail.name || '',
    cocktailDescription: cocktail.description === DEFAULT_DESCRIPTION ? '' : (cocktail.description || ''),
    steps: normalizedSteps.length ? normalizedSteps : [{ number: 1, instruction: '', animation: 'fadeIn' }],
    difficulty: cocktail.difficulty || DIFFICULTY_OPTIONS[0],
    time: timeSelection.time,
    timeNumber: timeSelection.timeNumber,
    timeUnit: timeSelection.timeUnit,
    timeNumberIndex: timeSelection.timeNumberIndex,
    timeUnitIndex: timeSelection.timeUnitIndex,
    timeNeedsReselect: timeSelection.needsReselect,
    legacyTimeText: timeSelection.legacyTimeText,
    category: cocktail.category || CATEGORY_OPTIONS[0],
    emoji: cocktail.emoji || EMOJI_OPTIONS[0],
    ingredients: Array.isArray(cocktail.ingredients) ? cocktail.ingredients.map((item) => String(item || '')) : [],
    formErrors: {}
  };
}

function toDraft(data) {
  return {
    name: normalizeText(data.cocktailName),
    description: normalizeDescription(data.cocktailDescription),
    difficulty: data.difficulty || DIFFICULTY_OPTIONS[0],
    time: resolveTime(data).time,
    category: normalizeText(data.category) || CATEGORY_OPTIONS[0],
    emoji: data.emoji || EMOJI_OPTIONS[0],
    ingredients: normalizeIngredients(data.ingredients),
    steps: normalizeSteps(data.steps),
    history: ''
  };
}

function validateDraft(data, options = {}) {
  const draft = toDraft(data);
  const orderedSteps = normalizeStepOrder(data.steps);
  const rawIngredients = normalizeIngredientOrder(data.ingredients);
  const normalizedIngredients = rawIngredients.map(normalizeText);
  const errors = {};
  const errorMessages = [];
  const timeResult = resolveTime(data);

  if (!draft.name) {
    errors.name = '请输入配方名称';
    errorMessages.push('配方名称未填写');
  } else if (draft.name.length > MAX_NAME_LENGTH) {
    errors.name = `配方名称不能超过${MAX_NAME_LENGTH}个字符`;
    errorMessages.push('配方名称过长');
  } else if (options.checkNameConflict !== false && findNameConflict(draft.name, options.existingCocktails, options.currentId)) {
    errors.name = '已存在同名配方，请修改名称';
    errorMessages.push('配方名称重复');
  }

  const description = normalizeText(data.cocktailDescription);
  if (description && description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `简介不能超过${MAX_DESCRIPTION_LENGTH}个字符`;
    errorMessages.push('简介过长');
  }

  if (!draft.category) {
    errors.category = '请选择或填写分类';
    errorMessages.push('分类未填写');
  } else if (draft.category.length > MAX_CATEGORY_LENGTH) {
    errors.category = `分类不能超过${MAX_CATEGORY_LENGTH}个字符`;
    errorMessages.push('分类过长');
  }

  if (!DIFFICULTY_OPTIONS.includes(draft.difficulty)) {
    errors.difficulty = '制作难度不符合当前规则';
    errorMessages.push('制作难度不合法');
  }

  if (!timeResult.isValid) {
    errors.time = timeResult.message;
    errorMessages.push('制作时间不完整');
  }

  if (!rawIngredients.length) {
    errors.ingredients = '请至少添加一种成分';
    errorMessages.push('未添加任何成分');
  } else if (rawIngredients.length > MAX_INGREDIENTS) {
    errors.ingredients = `成分最多添加${MAX_INGREDIENTS}种`;
    errorMessages.push('成分数量过多');
  } else if (normalizedIngredients.some((item) => !item)) {
    errors.ingredients = '成分名称不能为空';
    errorMessages.push('成分名称为空');
  } else if (normalizedIngredients.some((item) => item.length > MAX_INGREDIENT_LENGTH)) {
    errors.ingredients = `单个成分不能超过${MAX_INGREDIENT_LENGTH}个字符`;
    errorMessages.push('成分名称过长');
  } else if (hasDuplicates(normalizedIngredients.map(normalizeComparable))) {
    errors.ingredients = '成分不能重复';
    errorMessages.push('成分重复');
  }

  if (!orderedSteps.length) {
    errors.steps = '请至少添加一个制作步骤';
    errorMessages.push('未添加制作步骤');
  } else if (orderedSteps.length > MAX_STEPS) {
    errors.steps = `制作步骤最多添加${MAX_STEPS}步`;
    errorMessages.push('制作步骤数量过多');
  } else if (orderedSteps.some((step) => !normalizeText(step.instruction))) {
    errors.steps = '请完善所有制作步骤';
    errorMessages.push('制作步骤不完整');
  } else if (orderedSteps.some((step) => normalizeText(step.instruction).length > MAX_STEP_LENGTH)) {
    errors.steps = `单个制作步骤不能超过${MAX_STEP_LENGTH}个字符`;
    errorMessages.push('制作步骤过长');
  }

  return {
    isValid: errorMessages.length === 0,
    errors,
    message: errorMessages.length ? `${errorMessages.join('、')}，请检查后重试` : '验证通过',
    draft
  };
}

function validateCocktail(cocktail, options = {}) {
  const draftData = createDraftFromCocktail(cocktail);
  const validation = validateDraft(draftData, options);

  if (draftData.timeNeedsReselect && options.allowLegacyTime !== true) {
    return {
      ...validation,
      isValid: false,
      errors: {
        ...validation.errors,
        time: '制作时间不符合当前规则'
      },
      message: '制作时间不符合当前规则，请检查后重试'
    };
  }

  return validation;
}

function validateField(field, value, currentErrors = {}, options = {}) {
  const errors = { ...currentErrors };
  const text = normalizeText(value);

  if (field === 'name') {
    if (!text) {
      errors.name = '请输入配方名称';
    } else if (text.length > MAX_NAME_LENGTH) {
      errors.name = `配方名称不能超过${MAX_NAME_LENGTH}个字符`;
    } else if (options.checkNameConflict !== false && findNameConflict(text, options.existingCocktails, options.currentId)) {
      errors.name = '已存在同名配方，请修改名称';
    } else {
      delete errors.name;
    }
  }

  if (field === 'description') {
    if (text && text.length > MAX_DESCRIPTION_LENGTH) {
      errors.description = `简介不能超过${MAX_DESCRIPTION_LENGTH}个字符`;
    } else {
      delete errors.description;
    }
  }

  if (field === 'time') {
    const timeResult = resolveTime({ time: value });
    if (!timeResult.isValid) {
      errors.time = timeResult.message;
    } else {
      delete errors.time;
    }
  }

  return errors;
}

function addIngredient(ingredients, rawIngredient) {
  const ingredient = normalizeText(rawIngredient);
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

  if (normalizedIngredients.map(normalizeComparable).includes(normalizeComparable(ingredient))) {
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
  const hasFilledStep = normalizeStepOrder(data.steps).some((step) => normalizeText(step.instruction));
  return Boolean(
    normalizeText(data.cocktailName) ||
    normalizeText(data.cocktailDescription) ||
    normalizeIngredients(data.ingredients).length ||
    normalizeText(data.newIngredient) ||
    hasFilledStep ||
    data.difficulty !== DIFFICULTY_OPTIONS[0] ||
    data.category !== CATEGORY_OPTIONS[0] ||
    data.emoji !== EMOJI_OPTIONS[0] ||
    data.timeNumber !== EMPTY_PICKER_VALUE ||
    data.timeUnit !== EMPTY_PICKER_VALUE
  );
}

function reduceDraftState(data, action = {}) {
  const formErrors = data.formErrors || {};
  const type = action.type;

  if (type === ACTIONS.INPUT_NAME) {
    return patchResult({
      cocktailName: action.value,
      formErrors: validateField('name', action.value, formErrors, action.validationOptions)
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

  if (type === ACTIONS.SELECT_TIME_NUMBER) {
    const index = Number(action.index);
    const timeNumber = readOption(TIME_NUMBER_OPTIONS, index, EMPTY_PICKER_VALUE);
    const next = resolveTimeSelection(timeNumber, data.timeUnit || EMPTY_PICKER_VALUE);
    return patchResult({
      ...next,
      timeNumberIndex: index,
      timeNeedsReselect: false,
      legacyTimeText: '',
      formErrors: next.isValid ? removeError(formErrors, 'time') : formErrors
    }, next.isValid ? '' : next.message);
  }

  if (type === ACTIONS.SELECT_TIME_UNIT) {
    const index = Number(action.index);
    const timeUnit = readOption(TIME_UNIT_OPTIONS, index, EMPTY_PICKER_VALUE);
    const next = resolveTimeSelection(data.timeNumber || EMPTY_PICKER_VALUE, timeUnit);
    return patchResult({
      ...next,
      timeUnitIndex: index,
      timeNeedsReselect: false,
      legacyTimeText: '',
      formErrors: next.isValid ? removeError(formErrors, 'time') : formErrors
    }, next.isValid ? '' : next.message);
  }

  if (type === ACTIONS.SELECT_DIFFICULTY) {
    const index = Number(action.index);
    const difficulty = readOption(action.options, index, data.difficulty || DIFFICULTY_OPTIONS[0]);
    return patchResult({ difficulty, difficultyIndex: index });
  }

  if (type === ACTIONS.SELECT_CATEGORY) {
    const index = Number(action.index);
    const category = readOption(action.options, index, data.category || CATEGORY_OPTIONS[0]);
    return patchResult({ category, categoryIndex: index });
  }

  if (type === ACTIONS.SELECT_EMOJI) {
    const index = Number(action.index);
    const emoji = readOption(action.options, index, data.emoji || EMOJI_OPTIONS[0]);
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
    const nextErrors = steps.every((step) => normalizeText(step.instruction))
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

function resolveTime(data = {}) {
  if (Object.prototype.hasOwnProperty.call(data, 'timeNumber') || Object.prototype.hasOwnProperty.call(data, 'timeUnit')) {
    return resolveTimeSelection(data.timeNumber || EMPTY_PICKER_VALUE, data.timeUnit || EMPTY_PICKER_VALUE);
  }

  const rawTime = normalizeText(data.time);
  if (!rawTime || rawTime === DEFAULT_TIME) {
    return {
      isValid: true,
      time: DEFAULT_TIME,
      message: ''
    };
  }

  const matched = rawTime.match(TIME_PATTERN);
  if (!matched) {
    return {
      isValid: false,
      time: rawTime,
      message: '制作时间需为1-999加分钟或小时'
    };
  }

  return {
    isValid: true,
    time: `${Number(matched[1])}${matched[2]}`,
    message: ''
  };
}

function resolveTimeSelection(timeNumber, timeUnit) {
  const normalizedNumber = String(timeNumber || EMPTY_PICKER_VALUE);
  const normalizedUnit = String(timeUnit || EMPTY_PICKER_VALUE);
  const isNumberEmpty = normalizedNumber === EMPTY_PICKER_VALUE;
  const isUnitEmpty = normalizedUnit === EMPTY_PICKER_VALUE;

  if (isNumberEmpty && isUnitEmpty) {
    return {
      isValid: true,
      time: DEFAULT_TIME,
      timeNumber: EMPTY_PICKER_VALUE,
      timeUnit: EMPTY_PICKER_VALUE,
      message: ''
    };
  }

  if (isNumberEmpty || isUnitEmpty) {
    return {
      isValid: false,
      time: '',
      timeNumber: normalizedNumber,
      timeUnit: normalizedUnit,
      message: '请完整选择制作时间'
    };
  }

  const numberValue = Number(normalizedNumber);
  if (!Number.isInteger(numberValue) || numberValue < 1 || numberValue > 999 || !['分钟', '小时'].includes(normalizedUnit)) {
    return {
      isValid: false,
      time: '',
      timeNumber: normalizedNumber,
      timeUnit: normalizedUnit,
      message: '制作时间需为1-999加分钟或小时'
    };
  }

  return {
    isValid: true,
    time: `${numberValue}${normalizedUnit}`,
    timeNumber: String(numberValue),
    timeUnit: normalizedUnit,
    message: ''
  };
}

function parseTimeSelection(time) {
  const rawTime = normalizeText(time);
  if (!rawTime || rawTime === DEFAULT_TIME) {
    return {
      time: DEFAULT_TIME,
      timeNumber: EMPTY_PICKER_VALUE,
      timeUnit: EMPTY_PICKER_VALUE,
      timeNumberIndex: 0,
      timeUnitIndex: 0,
      needsReselect: false,
      legacyTimeText: ''
    };
  }

  const matched = rawTime.match(TIME_PATTERN);
  if (!matched) {
    return {
      time: DEFAULT_TIME,
      timeNumber: EMPTY_PICKER_VALUE,
      timeUnit: EMPTY_PICKER_VALUE,
      timeNumberIndex: 0,
      timeUnitIndex: 0,
      needsReselect: true,
      legacyTimeText: rawTime
    };
  }

  const timeNumber = String(Number(matched[1]));
  const timeUnit = matched[2];
  return {
    time: `${timeNumber}${timeUnit}`,
    timeNumber,
    timeUnit,
    timeNumberIndex: TIME_NUMBER_OPTIONS.indexOf(timeNumber),
    timeUnitIndex: TIME_UNIT_OPTIONS.indexOf(timeUnit),
    needsReselect: false,
    legacyTimeText: ''
  };
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

  return ingredients.map(normalizeText).filter(Boolean);
}

function normalizeSteps(steps) {
  return normalizeStepOrder(steps)
    .map((step) => ({
      ...step,
      instruction: normalizeText(step.instruction)
    }))
    .filter((step) => step.instruction);
}

function normalizeStepOrder(steps) {
  if (!Array.isArray(steps)) {
    return [];
  }

  if (!steps.length) {
    return [{ number: 1, instruction: '', animation: 'fadeIn' }];
  }

  return steps.map((step, index) => ({
    number: index + 1,
    instruction: String(step && step.instruction ? step.instruction : ''),
    animation: step && step.animation ? step.animation : DEFAULT_ANIMATIONS[index % DEFAULT_ANIMATIONS.length]
  }));
}

function normalizeDescription(description) {
  const text = normalizeText(description);
  return text || DEFAULT_DESCRIPTION;
}

function normalizeText(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function normalizeComparable(value) {
  return normalizeText(value).toLowerCase();
}

function findNameConflict(name, cocktails = [], currentId = '') {
  if (!Array.isArray(cocktails)) {
    return null;
  }

  const comparableName = normalizeComparable(name);
  const normalizedCurrentId = currentId === undefined || currentId === null ? '' : String(currentId);
  if (!comparableName) {
    return null;
  }

  return cocktails.find((cocktail) => (
    normalizeComparable(cocktail && cocktail.name) === comparableName
    && String(cocktail && cocktail.id) !== normalizedCurrentId
  )) || null;
}

function hasDraftChanged(initialDraft, currentDraft) {
  return JSON.stringify(toComparableDraft(initialDraft)) !== JSON.stringify(toComparableDraft(currentDraft));
}

function toComparableDraft(data) {
  const draft = toDraft(data);
  return {
    ...draft,
    ingredients: draft.ingredients.map(normalizeText),
    steps: draft.steps.map((step) => normalizeText(step.instruction))
  };
}

module.exports = {
  ACTIONS,
  DEFAULT_ANIMATIONS,
  DEFAULT_DESCRIPTION,
  DEFAULT_TIME,
  EMPTY_PICKER_VALUE,
  DIFFICULTY_OPTIONS,
  CATEGORY_OPTIONS,
  EMOJI_OPTIONS,
  TIME_NUMBER_OPTIONS,
  TIME_UNIT_OPTIONS,
  MAX_NAME_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_CATEGORY_LENGTH,
  MAX_INGREDIENTS,
  MAX_INGREDIENT_LENGTH,
  MAX_STEPS,
  MAX_STEP_LENGTH,
  createInitialDraft,
  createDraftFromCocktail,
  toDraft,
  validateDraft,
  validateCocktail,
  validateField,
  reduceDraftState,
  addIngredient,
  removeIngredient,
  addStep,
  updateStep,
  removeStep,
  moveStep,
  hasContent,
  hasDraftChanged,
  normalizeText,
  normalizeComparable,
  normalizeIngredients,
  normalizeSteps,
  normalizeStepOrder,
  resolveTime,
  parseTimeSelection,
  findNameConflict
};
