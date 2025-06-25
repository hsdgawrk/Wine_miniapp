// pages/cocktail-detail/cocktail-detail.js
Page({
  data: {
    cocktail: null,
    steps: []
  },

  onLoad(options) {
    const name = decodeURIComponent(options.name);
    // 模拟从服务器获取数据
    const cocktailData = {
      name: name,
      description: `${name}的简介`,
      history: '这是关于' + name + '的历史和文化背景。'
    };
    const stepsData = [
      { number: 1, instruction: '准备材料', animation: 'fadeIn' },
      { number: 2, instruction: '混合所有成分', animation: 'slideIn' },
      { number: 3, instruction: '倒入冰镇的玻璃杯中', animation: 'zoomIn' }
    ];

    this.setData({
      cocktail: cocktailData,
      steps: stepsData
    });
  },

  navigateToSteps() {
    wx.navigateTo({
      url: '/pages/steps/steps'
    });
  },

  navigateToShare() {
    wx.navigateTo({
      url: '/pages/share/share'
    });
  }
});
