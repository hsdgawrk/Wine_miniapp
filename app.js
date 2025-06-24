// app.js
App({
  globalData: {
    cocktails: [
      { name: '马提尼', description: '经典的鸡尾酒之一' },
      { name: '曼哈顿', description: '甜美的口感' },
      { name: '莫吉托', description: '经典的夏日鸡尾酒' }
    ]
  },
  onLaunch() {
    // 小程序初始化逻辑
    console.log('App Launch');
  }
});
