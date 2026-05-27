const mainTabState = require('../../utils/mainTabState');

Page({
  data: {
    customCocktails: [],
    visibleCocktails: [],
    searchQuery: '',
    sortOptions: ['最近修改', '名称'],
    sortMode: 'updatedAt',
    sortIndex: 0,
    sortLabel: '最近修改',
    isManaging: false,
    manageButtonText: '管理',
    selectedIds: [],
    selectedCount: 0,
    allVisibleSelected: false,
    showMorePanel: false,
    activeCocktail: null
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
    const visibleCocktails = this.buildVisibleCocktails(customCocktails, this.data.searchQuery, this.data.sortMode, this.data.selectedIds);

    this.setData({
      customCocktails,
      visibleCocktails,
      selectedCount: this.data.selectedIds.length,
      allVisibleSelected: this.areAllVisibleSelected(visibleCocktails, this.data.selectedIds)
    });
  },

  onSearch(e) {
    const searchQuery = e.detail.value;
    this.setData({
      searchQuery,
      selectedIds: [],
      selectedCount: 0,
      allVisibleSelected: false
    }, () => {
      this.refreshVisibleCocktails();
    });
  },

  clearSearch() {
    this.setData({
      searchQuery: '',
      selectedIds: [],
      selectedCount: 0,
      allVisibleSelected: false
    }, () => {
      this.refreshVisibleCocktails();
    });
  },

  onSortChange(e) {
    const sortIndex = Number(e.detail.value);
    const sortMode = sortIndex === 1 ? 'name' : 'updatedAt';
    this.setData({
      sortIndex,
      sortMode,
      sortLabel: this.data.sortOptions[sortIndex] || this.data.sortOptions[0],
      selectedIds: [],
      selectedCount: 0,
      allVisibleSelected: false
    }, () => {
      this.refreshVisibleCocktails();
    });
  },

  refreshVisibleCocktails() {
    const visibleCocktails = this.buildVisibleCocktails(
      this.data.customCocktails,
      this.data.searchQuery,
      this.data.sortMode,
      this.data.selectedIds
    );
    this.setData({
      visibleCocktails,
      allVisibleSelected: this.areAllVisibleSelected(visibleCocktails, this.data.selectedIds)
    });
  },

  buildVisibleCocktails(cocktails, query, sortMode, selectedIds) {
    const selectedMap = this.buildIdMap(selectedIds);
    const lowerQuery = String(query || '').trim().toLowerCase();
    let list = cocktails.filter((cocktail) => {
      if (!lowerQuery) {
        return true;
      }

      const searchableText = [
        cocktail.name,
        cocktail.description,
        cocktail.category,
        cocktail.difficulty,
        ...(cocktail.ingredients || [])
      ].join(' ').toLowerCase();

      return searchableText.includes(lowerQuery);
    });

    list = list.sort((a, b) => {
      if (sortMode === 'name') {
        return String(a.name || '').localeCompare(String(b.name || ''), 'zh-Hans-CN');
      }
      return Date.parse(b.updatedAt || b.createdAt || 0) - Date.parse(a.updatedAt || a.createdAt || 0);
    });

    return list.map((cocktail) => ({
      ...cocktail,
      isSelected: Boolean(selectedMap[cocktail.id]),
      ingredientCount: (cocktail.ingredients || []).length,
      updatedAtText: this.formatDate(cocktail.updatedAt || cocktail.createdAt),
      ingredientsPreview: (cocktail.ingredients || []).slice(0, 3).join(' / ')
    }));
  },

  formatDate(value) {
    if (!value) {
      return '未记录';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '未记录';
    }
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;
  },

  toggleManageMode() {
    const nextManaging = !this.data.isManaging;
    this.setData({
      isManaging: nextManaging,
      manageButtonText: nextManaging ? '完成' : '管理',
      selectedIds: [],
      selectedCount: 0,
      allVisibleSelected: false,
      showMorePanel: false,
      activeCocktail: null
    }, () => {
      this.refreshVisibleCocktails();
    });
  },

  onItemTap(e) {
    const id = e.currentTarget.dataset.id;
    if (this.data.isManaging) {
      this.toggleSelected(id);
      return;
    }

    const cocktail = this.data.visibleCocktails.find((item) => item.id === id);
    if (!cocktail) {
      return;
    }

    wx.navigateTo({
      url: `/pages/cocktail-detail/cocktail-detail?id=${encodeURIComponent(cocktail.id)}&name=${encodeURIComponent(cocktail.name)}`
    });
  },

  toggleSelected(id) {
    const selectedMap = this.buildIdMap(this.data.selectedIds);
    let selectedIds = [];

    if (selectedMap[id]) {
      selectedIds = this.data.selectedIds.filter((item) => item !== id);
    } else {
      selectedIds = [...this.data.selectedIds, id];
    }

    this.setData({
      selectedIds,
      selectedCount: selectedIds.length
    }, () => {
      this.refreshVisibleCocktails();
    });
  },

  toggleSelectAllVisible() {
    const visibleIds = this.data.visibleCocktails.map((cocktail) => cocktail.id);
    const selectedIds = this.data.allVisibleSelected ? [] : visibleIds;

    this.setData({
      selectedIds,
      selectedCount: selectedIds.length
    }, () => {
      this.refreshVisibleCocktails();
    });
  },

  openMorePanel(e) {
    const id = e.currentTarget.dataset.id;
    const activeCocktail = this.data.visibleCocktails.find((cocktail) => cocktail.id === id);
    if (!activeCocktail) {
      return;
    }

    this.setData({
      activeCocktail,
      showMorePanel: true
    });
  },

  closeMorePanel() {
    this.setData({
      activeCocktail: null,
      showMorePanel: false
    });
  },

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
      title: '批量删除',
      content: `确认删除所选 ${selectedCount} 条自定义配方吗？删除后不可恢复。`,
      confirmText: '删除',
      confirmColor: '#ff7a66',
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

        this.setData({
          selectedIds: [],
          selectedCount: 0,
          allVisibleSelected: false,
          isManaging: false
        }, () => {
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
  },

  buildIdMap(ids = []) {
    return ids.reduce((map, id) => {
      map[id] = true;
      return map;
    }, {});
  },

  areAllVisibleSelected(visibleCocktails, selectedIds) {
    if (!visibleCocktails.length) {
      return false;
    }
    const selectedMap = this.buildIdMap(selectedIds);
    return visibleCocktails.every((cocktail) => selectedMap[cocktail.id]);
  }
});
