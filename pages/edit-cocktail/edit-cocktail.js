const cocktailDraft = require('../../utils/cocktailDraft');

const DRAFT_ACTIONS = cocktailDraft.ACTIONS;

Page({
  data: {
    ...cocktailDraft.createInitialDraft(),
    cocktailId: '',
    originalCocktail: null,
    isLoading: true,
    isSaving: false,
    error: '',
    difficultyOptions: cocktailDraft.DIFFICULTY_OPTIONS,
    categoryOptions: cocktailDraft.CATEGORY_OPTIONS,
    emojiOptions: cocktailDraft.EMOJI_OPTIONS,
    timeNumberOptions: cocktailDraft.TIME_NUMBER_OPTIONS,
    timeUnitOptions: cocktailDraft.TIME_UNIT_OPTIONS,
    difficultyIndex: 0,
    categoryIndex: 0,
    emojiIndex: 0,
    animationOptions: cocktailDraft.DEFAULT_ANIMATIONS
  },

  onLoad(options) {
    this.cocktailId = options.id || '';
    this.initialDraft = null;
    this.hasSaved = false;
    this.loadCocktail();
  },

  onShow() {
    const app = getApp();
    if (app && typeof app.ensureDarkWindowBackground === 'function') {
      app.ensureDarkWindowBackground();
    }
  },

  loadCocktail() {
    const app = getApp();
    const cocktail = app.cocktailLibrary.getCocktailById(this.cocktailId);

    if (!cocktail || cocktail.source !== 'custom') {
      this.setData({
        isLoading: false,
        error: cocktail ? '内置配方不能编辑' : '未找到配方'
      });
      return;
    }

    const draft = cocktailDraft.createDraftFromCocktail(cocktail);
    const categoryOptions = this.ensureOption(this.data.categoryOptions, draft.category);
    const emojiOptions = this.ensureOption(this.data.emojiOptions, draft.emoji);
    const difficultyOptions = this.ensureOption(this.data.difficultyOptions, draft.difficulty);
    this.initialDraft = draft;

    this.setData({
      ...draft,
      cocktailId: cocktail.id,
      originalCocktail: cocktail,
      categoryOptions,
      emojiOptions,
      difficultyOptions,
      categoryIndex: categoryOptions.indexOf(draft.category),
      emojiIndex: emojiOptions.indexOf(draft.emoji),
      difficultyIndex: difficultyOptions.indexOf(draft.difficulty),
      isLoading: false,
      error: ''
    });

    wx.setNavigationBarTitle({
      title: `编辑${cocktail.name}`
    });

    if (draft.timeNeedsReselect) {
      wx.showModal({
        title: '需要重新选择时间',
        content: `原制作时间「${draft.legacyTimeText}」不符合当前规则，请选择合法时间或保存为未设置。`,
        showCancel: false
      });
    }
  },

  ensureOption(options, value) {
    if (!value || options.includes(value)) {
      return options;
    }
    return [...options, value];
  },

  onInputName(e) {
    this.applyDraftAction({
      type: DRAFT_ACTIONS.INPUT_NAME,
      value: e.detail.value,
      validationOptions: this.getNameValidationOptions()
    });
  },

  onInputDescription(e) {
    this.applyDraftAction({
      type: DRAFT_ACTIONS.INPUT_DESCRIPTION,
      value: e.detail.value
    });
  },

  onDifficultyChange(e) {
    this.applyDraftAction({
      type: DRAFT_ACTIONS.SELECT_DIFFICULTY,
      index: e.detail.value,
      options: this.data.difficultyOptions
    });
  },

  onCategoryChange(e) {
    this.applyDraftAction({
      type: DRAFT_ACTIONS.SELECT_CATEGORY,
      index: e.detail.value,
      options: this.data.categoryOptions
    });
  },

  onEmojiChange(e) {
    this.applyDraftAction({
      type: DRAFT_ACTIONS.SELECT_EMOJI,
      index: e.detail.value,
      options: this.data.emojiOptions
    });
  },

  onTimeNumberChange(e) {
    const result = this.applyDraftAction({
      type: DRAFT_ACTIONS.SELECT_TIME_NUMBER,
      index: e.detail.value
    });
    if (result.error) {
      this.showDraftError(result.error);
    }
  },

  onTimeUnitChange(e) {
    const result = this.applyDraftAction({
      type: DRAFT_ACTIONS.SELECT_TIME_UNIT,
      index: e.detail.value
    });
    if (result.error) {
      this.showDraftError(result.error);
    }
  },

  onInputIngredient(e) {
    this.applyDraftAction({
      type: DRAFT_ACTIONS.INPUT_INGREDIENT,
      value: e.detail.value
    });
  },

  addIngredient() {
    const result = this.applyDraftAction({
      type: DRAFT_ACTIONS.ADD_INGREDIENT
    });
    if (result.error) {
      this.showDraftError(result.error);
    }
  },

  removeIngredient(e) {
    this.applyDraftAction({
      type: DRAFT_ACTIONS.REMOVE_INGREDIENT,
      index: e.currentTarget.dataset.index
    });
  },

  addStep() {
    const result = this.applyDraftAction({
      type: DRAFT_ACTIONS.ADD_STEP,
      animations: this.data.animationOptions
    });
    if (result.error) {
      this.showDraftError(result.error);
    }
  },

  onInputStep(e) {
    this.applyDraftAction({
      type: DRAFT_ACTIONS.UPDATE_STEP,
      index: e.currentTarget.dataset.index,
      value: e.detail.value
    });
  },

  removeStep(e) {
    const result = this.applyDraftAction({
      type: DRAFT_ACTIONS.REMOVE_STEP,
      index: e.currentTarget.dataset.index
    });
    if (result.error) {
      this.showDraftError(result.error);
    }
  },

  moveStepUp(e) {
    this.applyDraftAction({
      type: DRAFT_ACTIONS.MOVE_STEP,
      index: e.currentTarget.dataset.index,
      direction: 'up'
    });
  },

  moveStepDown(e) {
    this.applyDraftAction({
      type: DRAFT_ACTIONS.MOVE_STEP,
      index: e.currentTarget.dataset.index,
      direction: 'down'
    });
  },

  validateForm() {
    const validation = cocktailDraft.validateDraft(this.data, { checkNameConflict: false });
    if (validation.isValid && this.hasUnsavedChanges()) {
      const conflict = cocktailDraft.findNameConflict(
        validation.draft.name,
        this.getNameValidationOptions().existingCocktails,
        this.data.cocktailId
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
    this.setData({ formErrors: validation.errors });
    return validation;
  },

  saveCocktail() {
    if (this.data.isSaving) {
      return;
    }

    const validation = this.validateForm();
    if (!validation.isValid) {
      wx.showToast({
        title: validation.message,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    this.setData({ isSaving: true });

    try {
      const app = getApp();
      const savedCocktail = app.updateCustomCocktail
        ? app.updateCustomCocktail(this.data.cocktailId, validation.draft)
        : app.cocktailLibrary.updateCustomCocktail(this.data.cocktailId, validation.draft);

      if (!savedCocktail) {
        throw new Error('保存失败');
      }

      this.hasSaved = true;
      this.disableBeforeUnload();

      wx.showToast({
        title: '已保存',
        icon: 'success',
        duration: 1200
      });

      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/cocktail-detail/cocktail-detail?id=${encodeURIComponent(savedCocktail.id)}&name=${encodeURIComponent(savedCocktail.name)}`
        });
      }, 500);
    } catch (error) {
      wx.showToast({
        title: error.message || '保存失败',
        icon: 'none',
        duration: 2500
      });
    } finally {
      this.setData({ isSaving: false });
    }
  },

  navigateBack() {
    if (!this.hasUnsavedChanges()) {
      wx.navigateBack();
      return;
    }

    wx.showModal({
      title: '确认离开',
      content: '当前编辑内容尚未保存，离开后将丢弃修改。',
      confirmText: '离开',
      cancelText: '继续编辑',
      success: (res) => {
        if (res.confirm) {
          this.disableBeforeUnload();
          wx.navigateBack();
        }
      }
    });
  },

  hasUnsavedChanges() {
    return Boolean(
      this.initialDraft
      && !this.hasSaved
      && cocktailDraft.hasDraftChanged(this.initialDraft, this.data)
    );
  },

  updateBeforeUnloadGuard() {
    if (typeof wx.enableAlertBeforeUnload !== 'function' || typeof wx.disableAlertBeforeUnload !== 'function') {
      return;
    }

    if (this.hasUnsavedChanges()) {
      wx.enableAlertBeforeUnload({
        message: '当前编辑内容尚未保存，离开后将丢弃修改。'
      });
    } else {
      this.disableBeforeUnload();
    }
  },

  disableBeforeUnload() {
    if (typeof wx.disableAlertBeforeUnload === 'function') {
      wx.disableAlertBeforeUnload();
    }
  },

  getNameValidationOptions() {
    const app = getApp();
    return {
      existingCocktails: app && app.cocktailLibrary ? app.cocktailLibrary.listCocktails() : [],
      currentId: this.data.cocktailId
    };
  },

  applyDraftAction(action) {
    const result = cocktailDraft.reduceDraftState(this.data, action);

    if (Object.keys(result.patch).length) {
      this.setData(result.patch);
      this.updateBeforeUnloadGuard();
    }

    return result;
  },

  showDraftError(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  }
});
