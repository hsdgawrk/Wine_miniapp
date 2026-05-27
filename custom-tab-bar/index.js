const mainTabState = require('../utils/mainTabState');

Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: "/pages/index/index",
        text: "首页",
        code: "01",
        action: "菜单",
        tab: "home"
      },
      {
        pagePath: "/pages/index/index",
        text: "添加",
        code: "+",
        action: "新配方",
        tab: "add"
      }
    ]
  },

  methods: {
    switchTab(e) {
      const path = e.currentTarget.dataset.path;
      const tab = mainTabState.normalizeMainTab(e.currentTarget.dataset.tab);
      const index = mainTabState.getSelectedIndex(tab);
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];

      if (currentPage && typeof currentPage.switchMainTab === 'function') {
        currentPage.switchMainTab({
          currentTarget: {
            dataset: { tab, index }
          }
        });
        this.setData({ selected: index });
        return;
      }

      const app = getApp();
      const pendingStore = mainTabState.createPendingMainTabStore(app && app.globalData);
      pendingStore.write(tab);

      if (index === this.data.selected) {
        return;
      }

      wx.switchTab({
        url: path,
        success: () => {
          this.setData({ selected: index });
        }
      });
    }
  }
});
