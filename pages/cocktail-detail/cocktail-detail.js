// pages/cocktail-detail/cocktail-detail.js
Page({
  data: {
    cocktail: null,
    steps: [],
    error: null
  },

  onLoad(options) {
    const app = getApp();
    const cocktail = app.cocktailLibrary.getCocktailDetail({
      id: options.id,
      name: options.name
    });

    if (!cocktail) {
      this.setData({
        error: '未找到配方'
      });
      wx.showToast({
        title: '未找到配方',
        icon: 'none',
        duration: 2000
      });
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

  navigateToShare() {
    if (!this.data.cocktail) {
      return;
    }

    wx.navigateTo({
      url: `/pages/share/share?id=${encodeURIComponent(this.data.cocktail.id)}&name=${encodeURIComponent(this.data.cocktail.name)}`
    });
  }
});
