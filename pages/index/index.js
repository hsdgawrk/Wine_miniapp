/**
 * 主页面 - 首页、添加和本机个人空间
 */

const mainTabState = require('../../utils/mainTabState');
const cocktailDraft = require('../../utils/cocktailDraft');

const DRAFT_ACTIONS = cocktailDraft.ACTIONS;

Page({
  data: {
    ...mainTabState.createInitialMainTabState(),
    ...cocktailDraft.createInitialDraft(),

    mainTabs: [
      { tab: 'home', text: '首页', code: '01', action: '菜单' },
      { tab: 'add', text: '添加', code: '+', action: '创建' },
      { tab: 'mine', text: '我的', code: 'ME', action: '配方' }
    ],

    randomCocktail: null,
    currentDate: {
      year: '',
      month: '',
      day: '',
      weekday: ''
    },

    searchQuery: '',
    searchDebounceTimer: null,
    cocktails: [],
    filteredCocktails: [],
    isLoading: false,
    isSaving: false,
    isSearching: false,
    error: null,
    currentPage: 1,
    pageSize: 20,
    hasMore: false,
    totalCount: 0,
    filteredCount: 0,
    customCount: 0,
    builtInCount: 0,

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

  onLoad() {
    this.setData({ isLoading: true });

    try {
      this.initPageData();
    } catch (error) {
      this.handlePageError(error, '页面初始化');
    } finally {
      this.setData({ isLoading: false });
    }
  },

  onShow() {
    const app = getApp();
    if (app && typeof app.ensureDarkWindowBackground === 'function') {
      app.ensureDarkWindowBackground();
    }

    const pendingStore = mainTabState.createPendingMainTabStore(app && app.globalData);
    const pendingMainTab = pendingStore.consume();
    if (pendingMainTab) {
      this.setMainTab(pendingMainTab, { scrollToTop: false, force: true });
    }

    this.refreshCocktailData();
  },

  onHide() {
    if (this.data.searchDebounceTimer) {
      clearTimeout(this.data.searchDebounceTimer);
    }
  },

  onUnload() {
    if (this.data.searchDebounceTimer) {
      clearTimeout(this.data.searchDebounceTimer);
    }

    if (this.mainTabTransitionTimer) {
      clearTimeout(this.mainTabTransitionTimer);
    }
  },

  onPullDownRefresh() {
    this.refreshPageData()
      .finally(() => {
        wx.stopPullDownRefresh();
      });
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.isLoading) {
      this.loadMoreCocktails();
    }
  },

  onShareAppMessage() {
    return {
      title: '一起学习调酒吧！',
      desc: '发现更多经典鸡尾酒配方',
      path: '/pages/index/index',
      imageUrl: ''
    };
  },

  initPageData() {
    const app = getApp();
    if (!app || !app.cocktailLibrary) {
      throw new Error('配方库未初始化');
    }

    const cocktails = this.decorateCocktails(app.cocktailLibrary.listCocktails());
    const customCount = app.cocktailLibrary.countCustomCocktails();
    const randomCocktail = this.decorateCocktail(app.cocktailLibrary.getDailyCocktail());
    const currentDate = app.cocktailLibrary.getCurrentDateInfo();

    this.setData({
      cocktails,
      filteredCocktails: this.filterDecoratedCocktails(cocktails, this.data.searchQuery),
      randomCocktail,
      currentDate,
      totalCount: cocktails.length,
      filteredCount: this.filterDecoratedCocktails(cocktails, this.data.searchQuery).length,
      customCount,
      builtInCount: Math.max(0, cocktails.length - customCount),
      error: null
    });
  },

  async refreshPageData() {
    this.setData({ isLoading: true });

    try {
      await this.delay(240);
      this.initPageData();

      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1500
      });
    } catch (error) {
      this.handlePageError(error, '刷新数据');
    } finally {
      this.setData({ isLoading: false });
    }
  },

  refreshCocktailData() {
    try {
      const app = getApp();
      if (!app || !app.cocktailLibrary) {
        return;
      }

      const cocktails = this.decorateCocktails(app.cocktailLibrary.listCocktails());
      const filteredCocktails = this.filterDecoratedCocktails(cocktails, this.data.searchQuery);
      const customCount = app.cocktailLibrary.countCustomCocktails();

      this.setData({
        cocktails,
        filteredCocktails,
        totalCount: cocktails.length,
        filteredCount: filteredCocktails.length,
        customCount,
        builtInCount: Math.max(0, cocktails.length - customCount),
        randomCocktail: this.decorateCocktail(app.cocktailLibrary.getDailyCocktail())
      });
    } catch (error) {
      console.warn('刷新配方数据失败:', error);
    }
  },

  onSearch(e) {
    const query = e.detail.value;
    this.setData({ searchQuery: query });

    if (this.data.searchDebounceTimer) {
      clearTimeout(this.data.searchDebounceTimer);
    }

    const timer = setTimeout(() => {
      this.performSearch(query);
    }, 300);

    this.setData({ searchDebounceTimer: timer });
  },

  performSearch(query) {
    try {
      this.setData({ isSearching: true });

      const filteredCocktails = this.filterDecoratedCocktails(this.data.cocktails, query);

      this.setData({
        filteredCocktails,
        filteredCount: filteredCocktails.length,
        isSearching: false
      });
    } catch (error) {
      this.handlePageError(error, '搜索配方');
    }
  },

  filterDecoratedCocktails(cocktails, query) {
    if (!query || !query.trim()) {
      return cocktails;
    }

    const lowerQuery = query.toLowerCase().trim();

    return (cocktails || []).filter((cocktail) => {
      const searchableText = [
        cocktail.name || '',
        cocktail.description || '',
        cocktail.difficulty || '',
        cocktail.category || '',
        ...(cocktail.ingredients || [])
      ].join(' ').toLowerCase();

      return searchableText.includes(lowerQuery);
    });
  },

  decorateCocktails(cocktails) {
    return (cocktails || []).map((cocktail, index) => this.decorateCocktail(cocktail, index));
  },

  decorateCocktail(cocktail, index = 0) {
    if (!cocktail) {
      return null;
    }

    const ingredients = cocktail.ingredients || [];
    const preview = ingredients.slice(0, 3).join(' / ');

    return {
      ...cocktail,
      listIndex: String(index + 1).padStart(2, '0'),
      sourceText: cocktail.source === 'custom' ? '自定义' : '内置',
      ingredientsPreview: `${preview}${ingredients.length > 3 ? ' / ...' : ''}`
    };
  },

  navigateToCocktailDetail(e) {
    try {
      const cocktailId = e.currentTarget.dataset.id;
      const cocktailName = e.currentTarget.dataset.name;

      if (!cocktailId && !cocktailName) {
        throw new Error('配方信息不完整');
      }

      wx.navigateTo({
        url: `/pages/cocktail-detail/cocktail-detail?id=${encodeURIComponent(cocktailId || '')}&name=${encodeURIComponent(cocktailName || '')}`,
        fail: () => {
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    } catch (error) {
      this.handlePageError(error, '打开配方详情');
    }
  },

  navigateToAddCocktail() {
    this.setMainTab(mainTabState.MAIN_TABS.ADD);
  },

  switchMainTab(e) {
    const tab = e.currentTarget.dataset.tab || mainTabState.MAIN_TABS.HOME;
    this.setMainTab(tab);
  },

  setMainTab(tab, options = {}) {
    const targetTab = mainTabState.normalizeMainTab(tab);
    if (
      !options.force
      && this.data.activeMainTab === mainTabState.MAIN_TABS.ADD
      && targetTab !== mainTabState.MAIN_TABS.ADD
      && cocktailDraft.hasContent(this.data)
    ) {
      wx.showModal({
        title: '确认离开',
        content: '添加配方草稿尚未保存，离开后将丢弃当前输入。',
        confirmText: '离开',
        cancelText: '继续填写',
        success: (res) => {
          if (res.confirm) {
            this.resetAddDraft();
            this.setMainTab(targetTab, { ...options, force: true });
          }
        }
      });
      return;
    }

    const selection = mainTabState.selectMainTab(this.data, targetTab, options);

    if (!selection.changed) {
      if (selection.tab === mainTabState.MAIN_TABS.HOME || selection.tab === mainTabState.MAIN_TABS.MINE) {
        this.refreshCocktailData();
      }
      return;
    }

    if (this.mainTabTransitionTimer) {
      clearTimeout(this.mainTabTransitionTimer);
    }

    this.setData(selection.patch);

    wx.setNavigationBarTitle({
      title: selection.title
    });

    if (selection.tab === mainTabState.MAIN_TABS.HOME || selection.tab === mainTabState.MAIN_TABS.MINE) {
      this.refreshCocktailData();
    }

    if (selection.shouldScrollToTop && typeof wx.pageScrollTo === 'function') {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 120
      });
    }

    this.mainTabTransitionTimer = setTimeout(() => {
      this.setData(mainTabState.clearTransition());
    }, 260);
  },

  returnHomeTab() {
    this.setMainTab(mainTabState.MAIN_TABS.HOME);
  },

  onDailyRecommendTap() {
    if (this.data.randomCocktail) {
      this.navigateToCocktailDetail({
        currentTarget: {
          dataset: {
            id: this.data.randomCocktail.id,
            name: this.data.randomCocktail.name
          }
        }
      });
    }
  },

  clearSearch() {
    this.setData({
      searchQuery: '',
      filteredCocktails: this.data.cocktails,
      filteredCount: this.data.totalCount
    });
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

  validateAddForm() {
    const validation = cocktailDraft.validateDraft(this.data, this.getNameValidationOptions());
    this.setData({ formErrors: validation.errors });
    return validation;
  },

  saveCocktail() {
    if (this.data.isSaving) {
      return;
    }

    const validation = this.validateAddForm();
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
      const savedCocktail = app.addCocktail ? app.addCocktail(validation.draft) : null;

      if (!savedCocktail) {
        throw new Error('配方保存失败，请稍后重试');
      }

      this.resetAddDraft();
      this.refreshCocktailData();

      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 1200
      });

      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/cocktail-detail/cocktail-detail?id=${encodeURIComponent(savedCocktail.id)}&name=${encodeURIComponent(savedCocktail.name)}`
        });
      }, 500);
    } catch (error) {
      this.handlePageError(error, '保存配方');
    } finally {
      this.setData({ isSaving: false });
    }
  },

  resetAddDraft() {
    this.setData({
      ...cocktailDraft.createInitialDraft(),
      difficultyIndex: 0,
      categoryIndex: 0,
      emojiIndex: 0
    });
  },

  getNameValidationOptions() {
    const app = getApp();
    return {
      existingCocktails: app && app.cocktailLibrary ? app.cocktailLibrary.listCocktails() : []
    };
  },

  applyDraftAction(action) {
    const result = cocktailDraft.reduceDraftState(this.data, action);

    if (Object.keys(result.patch).length) {
      this.setData(result.patch);
    }

    return result;
  },

  showDraftError(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  },

  navigateToCustomCocktails() {
    wx.navigateTo({
      url: '/pages/custom-cocktails/custom-cocktails'
    });
  },

  navigateToImport() {
    wx.navigateTo({
      url: '/pages/import-export/import-export'
    });
  },

  async loadMoreCocktails() {},

  handlePageError(error, context = '未知操作') {
    const errorMessage = error.message || '未知错误';

    console.error(`${context}错误:`, error);

    this.setData({
      error: {
        message: errorMessage,
        context,
        timestamp: new Date().toISOString()
      },
      isLoading: false,
      isSaving: false,
      isSearching: false
    });

    wx.showToast({
      title: `${context}失败`,
      icon: 'none',
      duration: 2000
    });
  },

  retryOperation() {
    this.setData({ error: null });
    this.onLoad();
  },

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
});
