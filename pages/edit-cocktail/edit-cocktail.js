const cocktailDraftForm = require('../../utils/cocktailDraftForm');

const DRAFT_ACTIONS = cocktailDraftForm.ACTIONS;

Page({
  data: {
    ...cocktailDraftForm.createInitialFormData(),
    cocktailId: '',
    originalCocktail: null,
    isLoading: true,
    isSaving: false,
    error: '',
    difficultyIndex: 0,
    categoryIndex: 0,
    emojiIndex: 0
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
        error: cocktail ? '馆藏酒谱不能编辑' : '未找到酒谱'
      });
      return;
    }

    const draft = cocktailDraftForm.createFormDataFromCocktail(cocktail);
    this.initialDraft = draft;

    this.setData({
      ...draft,
      cocktailId: cocktail.id,
      originalCocktail: cocktail,
      isLoading: false,
      error: ''
    });

    wx.setNavigationBarTitle({
      title: `编辑${cocktail.name}`
    });

    if (draft.timeNeedsReselect) {
      wx.showModal({
        title: '重新选择时间',
        content: `原调制时间「${draft.legacyTimeText}」无法使用，请重新选择或留为未设置。`,
        showCancel: false
      });
    }
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

  onInputStepTime(e) {
    this.applyDraftAction({
      type: DRAFT_ACTIONS.UPDATE_STEP_TIME,
      index: e.currentTarget.dataset.index,
      value: e.detail.value
    });
  },

  onInputStepTip(e) {
    this.applyDraftAction({
      type: DRAFT_ACTIONS.UPDATE_STEP_TIP,
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
    const nameOptions = this.getNameValidationOptions();
    const validation = cocktailDraftForm.validateEdit(this.data, {
      initialDraft: this.initialDraft,
      hasSaved: this.hasSaved,
      existingCocktails: nameOptions.existingCocktails,
      currentId: nameOptions.currentId
    });
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
      title: '离开此页',
      content: '当前酒谱还没保存，离开后将丢弃修改。',
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
    return cocktailDraftForm.hasUnsavedChanges(this.initialDraft, this.data, this.hasSaved);
  },

  updateBeforeUnloadGuard() {
    if (typeof wx.enableAlertBeforeUnload !== 'function' || typeof wx.disableAlertBeforeUnload !== 'function') {
      return;
    }

    if (this.hasUnsavedChanges()) {
      wx.enableAlertBeforeUnload({
        message: '当前酒谱还没保存，离开后将丢弃修改。'
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
    return cocktailDraftForm.getNameValidationOptions(
      app && app.cocktailLibrary ? app.cocktailLibrary.listCocktails() : [],
      this.data.cocktailId
    );
  },

  applyDraftAction(action) {
    return cocktailDraftForm.applyDraftAction(this, action, {
      afterPatch: () => {
        this.updateBeforeUnloadGuard();
      }
    });
  },

  showDraftError(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  }
});
