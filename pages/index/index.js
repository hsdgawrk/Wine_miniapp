/**
 * 主页面 - 配方展示和搜索
 * @description 应用首页，展示鸡尾酒配方列表和搜索功能
 * @author 开发团队
 * @version 2.0.0
 */

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 每日推荐配方
    randomCocktail: null,
    
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
    filteredCount: 0
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
    
    // 刷新数据（可能在其他页面添加了新配方）
    this.refreshCocktailData();
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
    
    if (!app || !app.globalData) {
      throw new Error('应用全局数据未初始化');
    }

    const cocktails = app.globalData.cocktails || [];
    const randomCocktail = this.getRandomCocktail(cocktails);

    this.setData({
      cocktails,
      filteredCocktails: cocktails,
      randomCocktail,
      totalCount: cocktails.length,
      filteredCount: cocktails.length,
      error: null
    });

    console.log(`📊 配方数据加载完成，共 ${cocktails.length} 个配方`);
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
      const cocktails = app.globalData.cocktails || [];
      
      // 如果数据有变化，才更新
      if (cocktails.length !== this.data.totalCount) {
        this.setData({
          cocktails,
          filteredCocktails: this.filterCocktails(cocktails, this.data.searchQuery),
          totalCount: cocktails.length
        });
        
        console.log(`🔄 配方数据已更新，当前 ${cocktails.length} 个配方`);
      }
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
    if (!query || query.trim() === '') {
      return cocktails;
    }

    const lowerQuery = query.toLowerCase().trim();
    
    return cocktails.filter(cocktail => {
      // 搜索名称、描述、成分
      const searchableText = [
        cocktail.name || '',
        cocktail.description || '',
        cocktail.difficulty || '',
        ...(cocktail.ingredients || [])
      ].join(' ').toLowerCase();
      
      return searchableText.includes(lowerQuery);
    });
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
    try {
      console.log('👆 用户点击添加配方');
      
      wx.navigateTo({
        url: '/pages/add-cocktail/add-cocktail',
        success: () => {
          console.log('✅ 导航到添加页面成功');
        },
        fail: (error) => {
          console.error('❌ 导航到添加页面失败:', error);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none',
            duration: 2000
          });
        }
      });

    } catch (error) {
      this.handlePageError(error, '打开添加页面');
    }
  },

  /**
   * 点击每日推荐
   */
  onDailyRecommendTap() {
    if (this.data.randomCocktail) {
      // 找到对应的配方ID
      const cocktail = this.data.cocktails.find(
        item => item.name === this.data.randomCocktail.name
      );
      
      if (cocktail) {
        this.navigateToCocktailDetail({
          currentTarget: {
            dataset: {
              id: cocktail.id,
              name: cocktail.name
            }
          }
        });
      }
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
