/**
 * 主页面 - 配方展示和搜索
 * @description 应用首页，展示鸡尾酒配方列表和搜索功能
 * @author 开发团队
 * @version 2.0.0
 */

const mainTabState = require('../../utils/mainTabState');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ...mainTabState.createInitialMainTabState(),

    // 每日推荐配方
    randomCocktail: null,
    
    // 当前日期信息
    currentDate: {
      year: '',
      month: '',
      day: '',
      weekday: ''
    },
    
    // 搜索相关
    searchQuery: '',
    searchDebounceTimer: null,
    
    // 配方数据
    cocktails: [],
    filteredCocktails: [],
    
    // 页面状态
    isLoading: false,
    isSearching: false,
    error: null,
    
    // 分页相关（为未来扩展预留）
    currentPage: 1,
    pageSize: 20,
    hasMore: false,
    
    // 统计信息
    totalCount: 0,
    filteredCount: 0,

    addPreviewIngredients: ['基酒', '酸味', '甜味', '装饰'],
    addPreviewSteps: [
      { number: 1, placeholder: '记录备杯、加冰或预冷方式' },
      { number: 2, placeholder: '记录倒酒顺序、摇和或搅拌方式' },
      { number: 3, placeholder: '记录过滤、装饰和出杯状态' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.log('📱 主页面加载开始');
    
    this.setData({ isLoading: true });
    
    try {
      this.initPageData();
    } catch (error) {
      this.handlePageError(error, '页面初始化');
    } finally {
      this.setData({ isLoading: false });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('✅ 主页面渲染完成');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('👀 主页面显示');

    const app = getApp();
    if (app && typeof app.ensureDarkWindowBackground === 'function') {
      app.ensureDarkWindowBackground();
    }

    const pendingStore = mainTabState.createPendingMainTabStore(app && app.globalData);
    const pendingMainTab = pendingStore.consume();
    if (pendingMainTab) {
      this.setMainTab(pendingMainTab, { scrollToTop: false });
    } else {
      this.syncTabBarSelection(this.data.activeMainTab);
    }

    // 刷新数据（可能在其他页面添加了新配方）
    if ((pendingMainTab || this.data.activeMainTab) === 'home') {
      this.refreshCocktailData();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('主页面隐藏');
    
    // 清除搜索防抖定时器
    if (this.data.searchDebounceTimer) {
      clearTimeout(this.data.searchDebounceTimer);
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log('🗑️ 主页面卸载');
    
    // 清理定时器
    if (this.data.searchDebounceTimer) {
      clearTimeout(this.data.searchDebounceTimer);
    }

    if (this.mainTabTransitionTimer) {
      clearTimeout(this.mainTabTransitionTimer);
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log('🔄 用户下拉刷新');
    
    this.refreshPageData()
      .finally(() => {
        wx.stopPullDownRefresh();
      });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log('📄 用户触底加载更多');
    
    // 为未来的分页加载功能预留
    if (this.data.hasMore && !this.data.isLoading) {
      this.loadMoreCocktails();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '一起学习调酒吧！',
      desc: '发现更多经典鸡尾酒配方',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    };
  },

  /**
   * 初始化页面数据
   * @description 获取全局数据并初始化页面状态
   */
  initPageData() {
    const app = getApp();
    
    if (!app || !app.cocktailLibrary) {
      throw new Error('配方库未初始化');
    }

    const cocktails = this.decorateCocktails(app.cocktailLibrary.listCocktails());
    const randomCocktail = this.decorateCocktail(app.cocktailLibrary.getDailyCocktail());
    const currentDate = app.cocktailLibrary.getCurrentDateInfo();

    this.setData({
      cocktails,
      filteredCocktails: cocktails,
      randomCocktail,
      currentDate,
      totalCount: cocktails.length,
      filteredCount: cocktails.length,
      error: null
    });

    console.log(`📊 配方数据加载完成，共 ${cocktails.length} 个配方`);
  },

  /**
   * 获取当前日期信息
   * @returns {Object} 格式化的日期信息
   */
  getCurrentDateInfo() {
    const now = new Date();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    
    return {
      year: now.getFullYear().toString(),
      month: months[now.getMonth()],
      day: now.getDate().toString().padStart(2, '0'),
      weekday: weekdays[now.getDay()]
    };
  },

  /**
   * 刷新页面数据
   * @returns {Promise} 刷新完成的promise
   */
  async refreshPageData() {
    this.setData({ isLoading: true });
    
    try {
      // 模拟网络请求延迟
      await this.delay(500);
      
      this.initPageData();
      
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1500
      });
      
    } catch (error) {
      this.handlePageError(error, '刷新数据');
    } finally {
      this.setData({ isLoading: false });
    }
  },

  /**
   * 刷新配方数据（不显示loading）
   * @description 静默刷新，通常在从其他页面返回时调用
   */
  refreshCocktailData() {
    try {
      const app = getApp();
      const cocktails = this.decorateCocktails(app.cocktailLibrary
        ? app.cocktailLibrary.listCocktails()
        : app.globalData.cocktails || []);
      const filteredCocktails = this.filterCocktails(cocktails, this.data.searchQuery);

      this.setData({
        cocktails,
        filteredCocktails,
        totalCount: cocktails.length,
        filteredCount: filteredCocktails.length,
        randomCocktail: app.cocktailLibrary
          ? this.decorateCocktail(app.cocktailLibrary.getDailyCocktail())
          : this.decorateCocktail(this.getRandomCocktail(cocktails))
      });
      
      console.log(`🔄 配方数据已更新，当前 ${cocktails.length} 个配方`);
    } catch (error) {
      console.warn('⚠️ 刷新配方数据失败:', error);
    }
  },

  /**
   * 获取随机推荐配方
   * @param {Array} cocktails 配方列表
   * @returns {Object|null} 随机配方或null
   */
  getRandomCocktail(cocktails) {
    if (!cocktails || cocktails.length === 0) {
      return null;
    }

    // 基于日期生成随机种子，确保同一天返回相同配方
    const today = new Date().toDateString();
    const seed = this.hashCode(today);
    const randomIndex = Math.abs(seed) % cocktails.length;
    
    return cocktails[randomIndex];
  },

  /**
   * 字符串哈希函数
   * @param {string} str 输入字符串
   * @returns {number} 哈希值
   */
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转为32位整数
    }
    return hash;
  },

  /**
   * 搜索处理函数（防抖）
   * @param {Object} e 事件对象
   */
  onSearch(e) {
    const query = e.detail.value;
    
    // 更新搜索查询
    this.setData({ searchQuery: query });
    
    // 清除之前的定时器
    if (this.data.searchDebounceTimer) {
      clearTimeout(this.data.searchDebounceTimer);
    }
    
    // 设置防抖定时器
    const timer = setTimeout(() => {
      this.performSearch(query);
    }, 300); // 300ms防抖延迟
    
    this.setData({ searchDebounceTimer: timer });
  },

  /**
   * 执行搜索
   * @param {string} query 搜索关键词
   */
  performSearch(query) {
    try {
      this.setData({ isSearching: true });
      
      const filteredCocktails = this.filterCocktails(this.data.cocktails, query);
      
      this.setData({
        filteredCocktails,
        filteredCount: filteredCocktails.length,
        isSearching: false
      });

      console.log(`🔍 搜索完成: "${query}", 找到 ${filteredCocktails.length} 个结果`);
      
    } catch (error) {
      this.handlePageError(error, '搜索配方');
    }
  },

  /**
   * 过滤配方数据
   * @param {Array} cocktails 原始配方列表
   * @param {string} query 搜索查询
   * @returns {Array} 过滤后的配方列表
   */
  filterCocktails(cocktails, query) {
    const app = getApp();
    if (app && app.cocktailLibrary) {
      return this.decorateCocktails(app.cocktailLibrary.searchCocktails(query));
    }

    if (!query || query.trim() === '') {
      return this.decorateCocktails(cocktails);
    }

    const lowerQuery = query.toLowerCase().trim();
    
    return this.decorateCocktails(cocktails.filter(cocktail => {
      // 搜索名称、描述、成分
      const searchableText = [
        cocktail.name || '',
        cocktail.description || '',
        cocktail.difficulty || '',
        ...(cocktail.ingredients || [])
      ].join(' ').toLowerCase();
      
      return searchableText.includes(lowerQuery);
    }));
  },

  /**
   * 补齐列表展示所需的派生字段，减少 WXML 中的复杂表达式。
   * @param {Array} cocktails 配方列表
   * @returns {Array} 补齐展示字段后的配方列表
   */
  decorateCocktails(cocktails) {
    return (cocktails || []).map((cocktail, index) => this.decorateCocktail(cocktail, index));
  },

  /**
   * 补齐单个配方的展示字段。
   * @param {Object} cocktail 配方对象
   * @param {number} index 列表索引
   * @returns {Object|null} 补齐展示字段后的配方
   */
  decorateCocktail(cocktail, index = 0) {
    if (!cocktail) {
      return null;
    }

    const ingredients = cocktail.ingredients || [];
    const preview = ingredients.slice(0, 3).join(' / ');

    return {
      ...cocktail,
      listIndex: String(index + 1).padStart(2, '0'),
      ingredientsPreview: `${preview}${ingredients.length > 3 ? ' / ...' : ''}`
    };
  },

  /**
   * 导航到配方详情页
   * @param {Object} e 事件对象
   */
  navigateToCocktailDetail(e) {
    try {
      const cocktailId = e.currentTarget.dataset.id;
      const cocktailName = e.currentTarget.dataset.name;
      
      if (!cocktailId && !cocktailName) {
        throw new Error('配方信息不完整');
      }

      // 记录用户行为
      console.log(`👆 用户点击配方: ${cocktailName || cocktailId}`);

      wx.navigateTo({
        url: `/pages/cocktail-detail/cocktail-detail?id=${cocktailId}&name=${encodeURIComponent(cocktailName || '')}`,
        success: () => {
          console.log('✅ 导航到详情页成功');
        },
        fail: (error) => {
          console.error('❌ 导航到详情页失败:', error);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none',
            duration: 2000
          });
        }
      });

    } catch (error) {
      this.handlePageError(error, '打开配方详情');
    }
  },

  /**
   * 导航到添加配方页
   */
  navigateToAddCocktail() {
    this.setMainTab(mainTabState.MAIN_TABS.ADD);
  },

  switchMainTab(e) {
    const tab = e.currentTarget.dataset.tab || mainTabState.MAIN_TABS.HOME;
    this.setMainTab(tab);
  },

  setMainTab(tab, options = {}) {
    const selection = mainTabState.selectMainTab(this.data, tab, options);
    this.syncTabBarSelection(selection.tab);

    if (!selection.changed) {
      return;
    }

    if (this.mainTabTransitionTimer) {
      clearTimeout(this.mainTabTransitionTimer);
    }

    this.setData(selection.patch);

    wx.setNavigationBarTitle({
      title: selection.title
    });

    if (selection.shouldRefreshCocktails) {
      this.refreshCocktailData();
    }

    if (selection.shouldScrollToTop && typeof wx.pageScrollTo === 'function') {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 120
      });
    }

    this.mainTabTransitionTimer = setTimeout(() => {
      this.setData(mainTabState.clearTransition());
    }, 260);
  },

  syncTabBarSelection(tab = this.data.activeMainTab) {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: mainTabState.getSelectedIndex(tab) });
    }
  },

  returnHomeTab() {
    this.setMainTab(mainTabState.MAIN_TABS.HOME);
  },

  /**
   * 点击每日推荐
   */
  onDailyRecommendTap() {
    if (this.data.randomCocktail) {
      this.navigateToCocktailDetail({
        currentTarget: {
          dataset: {
            id: this.data.randomCocktail.id,
            name: this.data.randomCocktail.name
          }
        }
      });
    }
  },

  /**
   * 清除搜索
   */
  clearSearch() {
    this.setData({
      searchQuery: '',
      filteredCocktails: this.data.cocktails,
      filteredCount: this.data.totalCount
    });
    
    console.log('🧹 搜索已清除');
  },

  /**
   * 加载更多配方（为未来分页功能预留）
   */
  async loadMoreCocktails() {
    console.log('📄 加载更多配方');
    // 预留给未来的分页功能
  },

  /**
   * 错误处理函数
   * @param {Error} error 错误对象
   * @param {string} context 错误上下文
   */
  handlePageError(error, context = '未知操作') {
    const errorMessage = error.message || '未知错误';
    
    console.error(`❌ ${context}错误:`, error);
    
    this.setData({
      error: {
        message: errorMessage,
        context,
        timestamp: new Date().toISOString()
      },
      isLoading: false,
      isSearching: false
    });

    // 显示用户友好的错误提示
    wx.showToast({
      title: `${context}失败`,
      icon: 'none',
      duration: 2000
    });
  },

  /**
   * 重试操作
   */
  retryOperation() {
    console.log('🔄 用户点击重试');
    
    this.setData({ error: null });
    this.onLoad();
  },

  /**
   * 延迟函数
   * @param {number} ms 延迟毫秒数
   * @returns {Promise} 延迟Promise
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
});
