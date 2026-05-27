const cocktailDraft = require('./cocktailDraft');

function createInitialFormData() {
  return withPickerData(cocktailDraft.createInitialDraft());
}

function createFormDataFromCocktail(cocktail = {}) {
  return withPickerData(cocktailDraft.createDraftFromCocktail(cocktail));
}

function withPickerData(draft) {
  const categoryOptions = ensureOption(cocktailDraft.CATEGORY_OPTIONS, draft.category);
  const emojiOptions = ensureOption(cocktailDraft.EMOJI_OPTIONS, draft.emoji);
  const difficultyOptions = ensureOption(cocktailDraft.DIFFICULTY_OPTIONS, draft.difficulty);

  return {
    ...draft,
    difficultyOptions,
    categoryOptions,
    emojiOptions,
    timeNumberOptions: cocktailDraft.TIME_NUMBER_OPTIONS,
    timeUnitOptions: cocktailDraft.TIME_UNIT_OPTIONS,
    difficultyIndex: Math.max(0, difficultyOptions.indexOf(draft.difficulty)),
    categoryIndex: Math.max(0, categoryOptions.indexOf(draft.category)),
    emojiIndex: Math.max(0, emojiOptions.indexOf(draft.emoji)),
    animationOptions: cocktailDraft.DEFAULT_ANIMATIONS
  };
}

function ensureOption(options, value) {
  if (!value || options.includes(value)) {
    return options;
  }
  return [...options, value];
}

function applyDraftAction(page, action, options = {}) {
  const result = cocktailDraft.reduceDraftState(page.data, action);

  if (Object.keys(result.patch).length) {
    page.setData(result.patch);
    if (typeof options.afterPatch === 'function') {
      options.afterPatch(result);
    }
  }

  return result;
}

function validateCreate(data, existingCocktails = []) {
  return cocktailDraft.validateDraft(data, {
    existingCocktails
  });
}

function validateEdit(data, options = {}) {
  const validation = cocktailDraft.validateDraft(data, { checkNameConflict: false });
  if (validation.isValid && hasUnsavedChanges(options.initialDraft, data, options.hasSaved)) {
    const conflict = cocktailDraft.findNameConflict(
      validation.draft.name,
      options.existingCocktails,
      options.currentId
    );
    if (conflict) {
      validation.isValid = false;
      validation.errors = {
        ...validation.errors,
        name: '已存在同名配方，请修改名称'
      };
      validation.message = '配方名称重复，请检查后重试';
    }
  }
  return validation;
}

function hasUnsavedChanges(initialDraft, currentDraft, hasSaved = false) {
  return Boolean(
    initialDraft
    && !hasSaved
    && cocktailDraft.hasDraftChanged(initialDraft, currentDraft)
  );
}

function hasCreateContent(data) {
  return cocktailDraft.hasContent(data);
}

function getNameValidationOptions(existingCocktails = [], currentId = '') {
  return currentId
    ? { existingCocktails, currentId }
    : { existingCocktails };
}

function createEmptyPickerPatch() {
  return createInitialFormData();
}

module.exports = {
  ACTIONS: cocktailDraft.ACTIONS,
  createInitialFormData,
  createFormDataFromCocktail,
  applyDraftAction,
  validateCreate,
  validateEdit,
  hasUnsavedChanges,
  hasCreateContent,
  getNameValidationOptions,
  createEmptyPickerPatch
};
