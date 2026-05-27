Page({
  data: {
    cocktail: null,
    steps: [],
    error: null,
    showMorePanel: false
  },

  onLoad(options) {
    this.options = options || {};
    this.loadCocktail(this.options);
  },

  onShow() {
    if (this.options) {
      this.loadCocktail(this.options, { silent: true });
    }
  },

  loadCocktail(options = {}, settings = {}) {
    const app = getApp();
    const cocktail = app.cocktailLibrary.getCocktailDetail({
      id: options.id,
      name: options.name
    });

    if (!cocktail) {
      this.setData({
        cocktail: null,
        steps: [],
        error: '未找到配方',
        showMorePanel: false
      });
      if (!settings.silent) {
        wx.showToast({
          title: '未找到配方',
          icon: 'none',
          duration: 2000
        });
      }
      return;
    }

    this.setData({
      cocktail,
      steps: cocktail.steps,
      error: null
    });

    wx.setNavigationBarTitle({
      title: cocktail.name
    });
  },

  navigateToSteps() {
    if (!this.data.cocktail) {
      return;
    }

    wx.navigateTo({
      url: `/pages/steps/steps?id=${encodeURIComponent(this.data.cocktail.id)}&name=${encodeURIComponent(this.data.cocktail.name)}`
    });
  },

  openMorePanel() {
    if (!this.data.cocktail) {
      return;
    }
    this.setData({ showMorePanel: true });
  },

  closeMorePanel() {
    this.setData({ showMorePanel: false });
  },

  navigateToEdit() {
    if (!this.data.cocktail || this.data.cocktail.source !== 'custom') {
      return;
    }

    this.closeMorePanel();
    wx.navigateTo({
      url: `/pages/edit-cocktail/edit-cocktail?id=${encodeURIComponent(this.data.cocktail.id)}`
    });
  },

  navigateToExport() {
    if (!this.data.cocktail || this.data.cocktail.source !== 'custom') {
      return;
    }

    this.closeMorePanel();
    wx.navigateTo({
      url: `/pages/import-export/import-export?id=${encodeURIComponent(this.data.cocktail.id)}`
    });
  },

  confirmDelete() {
    if (!this.data.cocktail || this.data.cocktail.source !== 'custom') {
      return;
    }

    const cocktail = this.data.cocktail;
    this.closeMorePanel();

    wx.showModal({
      title: '删除自定义配方',
      content: `确认删除「${cocktail.name}」吗？删除后不可恢复。`,
      confirmText: '删除',
      confirmColor: '#ff7a66',
      success: (res) => {
        if (!res.confirm) {
          return;
        }

        const app = getApp();
        const deleted = app.deleteCustomCocktail
          ? app.deleteCustomCocktail(cocktail.id)
          : app.cocktailLibrary.deleteCustomCocktail(cocktail.id);

        if (!deleted) {
          wx.showToast({
            title: '删除失败',
            icon: 'none'
          });
          return;
        }

        wx.showToast({
          title: '已删除',
          icon: 'success',
          duration: 1200
        });

        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/custom-cocktails/custom-cocktails'
          });
        }, 500);
      }
    });
  }
});
