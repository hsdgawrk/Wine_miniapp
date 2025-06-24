// pages/steps/steps.js
Page({
  data: {
    steps: []
  },

  onLoad() {
    // 模拟从服务器获取步骤数据
    const stepsData = [
      { number: 1, instruction: '准备材料', animation: 'fadeIn' },
      { number: 2, instruction: '混合所有成分', animation: 'slideIn' },
      { number: 3, instruction: '倒入冰镇的玻璃杯中', animation: 'zoomIn' }
    ];

    this.setData({
      steps: stepsData
    });
  }
});
