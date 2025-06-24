// pages/index/index.js
Page({
  data: {
    randomCocktail: null,
    searchQuery: '',
    cocktails: [],
    filteredCocktails: []
  },


  onSearch(e) {
    const query = e.detail.value.toLowerCase();
    const filtered = this.data.cocktails.filter(cocktail => 
      cocktail.name.toLowerCase().includes(query) || 
      cocktail.description.toLowerCase().includes(query)
    );
    this.setData({ 
      searchQuery: query,
      filteredCocktails: filtered
    });
  },

  onLoad() {
    // 初始化加载随机鸡尾酒和配方列表
    const app = getApp();
    const cocktails = app.globalData.cocktails;
    this.setData({
      randomCocktail: { name: '莫吉托', description: '经典的夏日鸡尾酒' },
      cocktails: cocktails,
      filteredCocktails: cocktails
    });
  },

  navigateToCocktailDetail(e) {
    const name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: `/pages/cocktail-detail/cocktail-detail?name=${name}`
    });
  },

  navigateToAddCocktail() {
    wx.navigateTo({
      url: '/pages/add-cocktail/add-cocktail'
    });
  }
});
