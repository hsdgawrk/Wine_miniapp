/**
 * 调酒小程序 - 全局应用入口文件
 * @author 开发团队
 * @version 2.0.0
 * @description 管理全局数据和应用生命周期
 */

const {
  CUSTOM_COCKTAILS_KEY,
  builtInCocktails,
  createCocktailLibrary
} = require('./utils/cocktailLibrary');

const cocktailLibrary = createCocktailLibrary({
  storageAdapter: {
    getCustomCocktails() {
      return wx.getStorageSync(CUSTOM_COCKTAILS_KEY) || [];
    },
    setCustomCocktails(cocktails) {
      wx.setStorageSync(CUSTOM_COCKTAILS_KEY, cocktails);
    }
  }
});

const WINDOW_BACKGROUND_COLOR = '#12110f';

App({
  /**
   * 全局数据存储
   * @description 存储应用级别的共享数据
   */
  globalData: {
    // 配方数据库
    cocktails: builtInCocktails,
    
    // 用户偏好设置
    userSettings: {
      theme: 'light',
      language: 'zh-CN',
      notifications: true
    },
    
    // 应用版本信息
    appInfo: {
      version: '2.0.0',
      lastUpdate: '2024-06-24'
    },
    
    // 加载状态管理
    isLoading: false,
    
    // 错误状态管理
    error: null,

    // 首页内底部视图切换的待处理目标
    pendingMainTab: ''
  },

  cocktailLibrary,

  ensureDarkWindowBackground() {
    if (typeof wx.setBackgroundColor !== 'function') {
      return;
    }

    wx.setBackgroundColor({
      backgroundColor: WINDOW_BACKGROUND_COLOR,
      backgroundColorTop: WINDOW_BACKGROUND_COLOR,
      backgroundColorBottom: WINDOW_BACKGROUND_COLOR
    });
  },

  /**
   * 应用启动生命周期函数
   * @description 监听小程序初始化，在小程序启动时触发一次
   */
  onLaunch(options) {
    try {
      console.log('🚀 调酒小程序启动', {
        path: options.path,
        scene: options.scene,
        query: options.query
      });

      this.ensureDarkWindowBackground();

      // 检查基础库版本
      this.checkLibVersion();
      
      // 初始化用户设置
      this.initUserSettings();

      // 初始化配方库
      this.initCocktailLibrary();
      
      // 检查网络状态
      this.checkNetworkStatus();
      
      // 预加载关键资源
      this.preloadResources();
      
    } catch (error) {
      console.error('❌ 应用启动失败:', error);
      this.handleError(error, '应用启动');
    }
  },

  /**
   * 应用激活生命周期函数
   * @description 监听小程序启动或切前台
   */
  onShow(options) {
    console.log('👋 应用切换到前台', options);

    this.ensureDarkWindowBackground();
    
    // 重置错误状态
    this.globalData.error = null;
    
    // 检查网络状态
    this.checkNetworkStatus();
  },

  /**
   * 应用隐藏生命周期函数
   * @description 监听小程序切后台
   */
  onHide() {
    console.log('📱 应用切换到后台');
    
    // 保存用户数据
    this.saveUserData();
  },

  /**
   * 错误处理函数
   * @description 监听小程序发生脚本错误或 API 调用失败时触发
   */
  onError(error) {
    console.error('💥 全局错误:', error);
    
    this.handleError(error, '全局异常');
    
    // 上报错误信息（可选）
    this.reportError(error);
  },

  /**
   * 检查基础库版本
   * @description 确保小程序运行在支持的基础库版本上
   */
  checkLibVersion() {
    const systemInfo = wx.getSystemInfoSync();
    const requiredVersion = '2.10.0';
    
    if (this.compareVersion(systemInfo.SDKVersion, requiredVersion) < 0) {
      wx.showModal({
        title: '版本过低',
        content: `当前微信版本过低，无法使用该小程序。请升级到最新微信版本后重试。`,
        showCancel: false
      });
    }
  },

  /**
   * 版本比较函数
   * @param {string} v1 版本1
   * @param {string} v2 版本2
   * @returns {number} 比较结果
   */
  compareVersion(v1, v2) {
    const version1 = v1.split('.');
    const version2 = v2.split('.');
    const len = Math.max(version1.length, version2.length);

    while (version1.length < len) {
      version1.push('0');
    }
    while (version2.length < len) {
      version2.push('0');
    }

    for (let i = 0; i < len; i++) {
      const num1 = parseInt(version1[i]);
      const num2 = parseInt(version2[i]);

      if (num1 > num2) {
        return 1;
      } else if (num1 < num2) {
        return -1;
      }
    }
    return 0;
  },

  /**
   * 初始化用户设置
   * @description 从本地存储读取用户配置，如果没有则使用默认值
   */
  initUserSettings() {
    try {
      const settings = wx.getStorageSync('userSettings');
      if (settings) {
        this.globalData.userSettings = { ...this.globalData.userSettings, ...settings };
      }
    } catch (error) {
      console.warn('⚠️ 读取用户设置失败:', error);
    }
  },

  /**
   * 初始化配方库
   * @description 读取自定义配方并合并内置配方
   */
  initCocktailLibrary() {
    const cocktails = this.cocktailLibrary.init();
    this.globalData.cocktails = cocktails;
    console.log(`🍸 配方库初始化完成，共 ${cocktails.length} 个配方`);
  },

  /**
   * 检查网络状态
   * @description 检查当前网络连接状态
   */
  checkNetworkStatus() {
    wx.getNetworkType({
      success: (res) => {
        console.log('📶 网络状态:', res.networkType);
        
        if (res.networkType === 'none') {
          wx.showToast({
            title: '网络连接异常',
            icon: 'none',
            duration: 3000
          });
        }
      },
      fail: (error) => {
        console.warn('⚠️ 获取网络状态失败:', error);
      }
    });
  },

  /**
   * 预加载关键资源
   * @description 预加载应用所需的图片等资源
   */
  preloadResources() {
    const images = [];

    images.forEach((src) => {
      wx.getImageInfo({
        src,
        success: () => {
          console.log('✅ 预加载图片成功:', src);
        },
        fail: (error) => {
          console.warn('⚠️ 预加载图片失败:', src, error);
        }
      });
    });
  },

  /**
   * 通用错误处理函数
   * @param {Error} error 错误对象
   * @param {string} context 错误上下文
   */
  handleError(error, context = '未知') {
    const errorInfo = {
      message: error.message || '未知错误',
      stack: error.stack || '',
      context,
      timestamp: new Date().toISOString()
    };

    // 更新全局错误状态
    this.globalData.error = errorInfo;

    // 显示用户友好的错误提示
    wx.showToast({
      title: `${context}失败，请重试`,
      icon: 'none',
      duration: 3000
    });

    console.error(`❌ ${context}错误:`, errorInfo);
  },

  /**
   * 上报错误信息
   * @param {Error} error 错误对象
   * @description 可以对接错误监控服务
   */
  reportError(error) {
    // 这里可以集成第三方错误监控服务
    // 例如：腾讯云应用性能监控、阿里云ARMS等
    console.log('📊 错误上报:', error);
  },

  /**
   * 保存用户数据
   * @description 将用户设置保存到本地存储
   */
  saveUserData() {
    try {
      wx.setStorageSync('userSettings', this.globalData.userSettings);
      console.log('💾 用户数据保存成功');
    } catch (error) {
      console.warn('⚠️ 保存用户数据失败:', error);
    }
  },

  /**
   * 获取配方数据
   * @param {number} id 配方ID
   * @returns {Object|null} 配方对象
   */
  getCocktailById(id) {
    return this.cocktailLibrary.getCocktailById(id);
  },

  /**
   * 添加新配方
   * @param {Object} cocktailData 配方数据
   * @returns {boolean} 添加是否成功
   */
  addCocktail(cocktailData) {
    try {
      const cocktail = this.cocktailLibrary.saveDraft(cocktailData);
      this.globalData.cocktails = this.cocktailLibrary.listCocktails();
      return cocktail;
    } catch (error) {
      this.handleError(error, '添加配方');
      return null;
    }
  },

  updateCustomCocktail(id, cocktailData) {
    try {
      const cocktail = this.cocktailLibrary.updateCustomCocktail(id, cocktailData);
      this.globalData.cocktails = this.cocktailLibrary.listCocktails();
      return cocktail;
    } catch (error) {
      this.handleError(error, '编辑配方');
      return null;
    }
  },

  deleteCustomCocktail(id) {
    try {
      const deleted = this.cocktailLibrary.deleteCustomCocktail(id);
      this.globalData.cocktails = this.cocktailLibrary.listCocktails();
      return deleted;
    } catch (error) {
      this.handleError(error, '删除配方');
      return false;
    }
  },

  deleteCustomCocktails(ids) {
    try {
      const deletedCount = this.cocktailLibrary.deleteCustomCocktails(ids);
      this.globalData.cocktails = this.cocktailLibrary.listCocktails();
      return deletedCount;
    } catch (error) {
      this.handleError(error, '删除配方');
      return 0;
    }
  },

  /**
   * 设置加载状态
   * @param {boolean} loading 是否加载中
   */
  setLoading(loading) {
    this.globalData.isLoading = loading;
  }
});
