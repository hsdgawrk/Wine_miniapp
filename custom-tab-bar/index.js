Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: "/pages/index/index",
        text: "首页",
        code: "01",
        action: "菜单"
      },
      {
        pagePath: "/pages/add-cocktail/add-cocktail",
        text: "添加",
        code: "+",
        action: "新配方"
      }
    ]
  },

  methods: {
    switchTab(e) {
      const path = e.currentTarget.dataset.path;
      const index = Number(e.currentTarget.dataset.index);

      this.setData({ selected: index });

      wx.switchTab({
        url: path
      });
    }
  }
});
