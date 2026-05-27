const mainTabState = require('../../utils/mainTabState');
const customCocktailManagement = require('../../utils/customCocktailManagement');

Page({
  data: {
    ...customCocktailManagement.createInitialState()
  },

  onLoad() {
    this.loadCustomCocktails();
  },

  onShow() {
    const app = getApp();
    if (app && typeof app.ensureDarkWindowBackground === 'function') {
      app.ensureDarkWindowBackground();
    }
    this.loadCustomCocktails();
  },

  loadCustomCocktails() {
    const app = getApp();
    const customCocktails = app.cocktailLibrary
      ? app.cocktailLibrary.listCustomCocktails()
      : [];

    this.setData(customCocktailManagement.buildStatePatch(customCocktails, this.data));
  },

  onSearch(e) {
    this.setData(customCocktailManagement.createSearchPatch(this.data, e.detail.value));
  },

  clearSearch() {
    this.setData(customCocktailManagement.createSearchPatch(this.data, ''));
  },

  onSortChange(e) {
    this.setData(customCocktailManagement.createSortPatch(this.data, e.detail.value));
  },

  toggleManageMode() {
    if (!this.data.customCocktails.length) {
      return;
    }

    this.setData(customCocktailManagement.createManageModePatch(this.data));
  },

  onItemTap(e) {
    const id = e.currentTarget.dataset.id;
    if (this.data.isManaging) {
      this.toggleSelected(id);
      return;
    }

    const cocktail = customCocktailManagement.findVisibleCocktail(this.data, id);
    if (!cocktail) {
      return;
    }

    wx.navigateTo({
      url: `/pages/cocktail-detail/cocktail-detail?id=${encodeURIComponent(cocktail.id)}&name=${encodeURIComponent(cocktail.name)}`
    });
  },

  toggleSelected(id) {
    this.setData(customCocktailManagement.createToggleSelectedPatch(this.data, id));
  },

  toggleSelectAllVisible() {
    this.setData(customCocktailManagement.createToggleAllVisiblePatch(this.data));
  },

  openMorePanel(e) {
    const id = e.currentTarget.dataset.id;
    const patch = customCocktailManagement.createOpenMorePatch(this.data, id);
    if (Object.keys(patch).length) {
      this.setData(patch);
    }
  },

  closeMorePanel() {
    this.setData(customCocktailManagement.createCloseMorePatch());
  },

  noopTouchMove() {},

  editActiveCocktail() {
    const cocktail = this.data.activeCocktail;
    if (!cocktail) {
      return;
    }

    this.closeMorePanel();
    wx.navigateTo({
      url: `/pages/edit-cocktail/edit-cocktail?id=${encodeURIComponent(cocktail.id)}`
    });
  },

  deleteActiveCocktail() {
    const cocktail = this.data.activeCocktail;
    if (!cocktail) {
      return;
    }

    this.closeMorePanel();
    this.confirmDeleteOne(cocktail);
  },

  confirmDeleteOne(cocktail) {
    wx.showModal({
      ...customCocktailManagement.createDeleteOneIntent(cocktail),
      success: (res) => {
        if (!res.confirm) {
          return;
        }

        const app = getApp();
        const deleted = app.deleteCustomCocktail
          ? app.deleteCustomCocktail(cocktail.id)
          : app.cocktailLibrary.deleteCustomCocktail(cocktail.id);
        if (deleted) {
          wx.showToast({ title: '已删除', icon: 'success' });
          this.loadCustomCocktails();
        }
      }
    });
  },

  confirmBatchDelete() {
    const selectedCount = this.data.selectedIds.length;
    if (!selectedCount) {
      wx.showToast({
        title: '请选择配方',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      ...customCocktailManagement.createBatchDeleteIntent(selectedCount),
      success: (res) => {
        if (!res.confirm) {
          return;
        }

        const app = getApp();
        const deletedCount = app.deleteCustomCocktails
          ? app.deleteCustomCocktails(this.data.selectedIds)
          : app.cocktailLibrary.deleteCustomCocktails(this.data.selectedIds);

        wx.showToast({
          title: `已删除${deletedCount}条`,
          icon: 'success'
        });

        this.setData(customCocktailManagement.createAfterBatchDeletePatch(this.data), () => {
          this.loadCustomCocktails();
        });
      }
    });
  },

  navigateToAdd() {
    const app = getApp();
    const pendingStore = mainTabState.createPendingMainTabStore(app && app.globalData);
    pendingStore.write(mainTabState.MAIN_TABS.ADD);

    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  navigateToImport() {
    wx.navigateTo({
      url: '/pages/import-export/import-export'
    });
  }
});
