/**
 * 调酒小程序 - 全局应用入口文件
 * @author 开发团队
 * @version 2.0.0
 * @description 管理全局数据和应用生命周期
 */

App({
  /**
   * 全局数据存储
   * @description 存储应用级别的共享数据
   */
  globalData: {
    // 配方数据库
    cocktails: [
      {
        id: 1,
        name: '马提尼',
        emoji: '🍸',
        category: '经典',
        description: '优雅与经典的完美结合，干练口感中透露着杜松子的芬芳',
        difficulty: '简单',
        time: '3分钟',
        popularity: 95,
        ingredients: ['金酒', '干味美思', '橄榄', '柠檬皮']
      },
      {
        id: 2,
        name: '曼哈顿',
        emoji: '🥃',
        category: '经典',
        description: '威士忌的醇厚与甜味美思的柔和，造就了这款永恒的经典',
        difficulty: '中等',
        time: '5分钟',
        popularity: 88,
        ingredients: ['威士忌', '甜味美思', '安格斯特拉苦精', '樱桃']
      },
      {
        id: 3,
        name: '莫吉托',
        emoji: '🌿',
        category: '清爽',
        description: '薄荷叶的清香与朗姆酒的甘甜，夏日午后的完美选择',
        difficulty: '简单',
        time: '4分钟',
        popularity: 92,
        ingredients: ['白朗姆酒', '薄荷叶', '青柠汁', '苏打水', '白糖']
      },
      {
        id: 4,
        name: '血腥玛丽',
        emoji: '🍅',
        category: '早餐酒',
        description: '浓郁的番茄汁与伏特加的深度融合，醒酒解腻的理想选择',
        difficulty: '简单',
        time: '5分钟',
        popularity: 78,
        ingredients: ['伏特加', '番茄汁', '柠檬汁', '伍斯特郡酱', '塔巴斯科辣椒酱', '芹菜盐']
      },
      {
        id: 5,
        name: '玛格丽特',
        emoji: '🥭',
        category: '热带',
        description: '龙舌兰酒的烈性搭配青柠的酸爽，热情如火的墨西哥风情',
        difficulty: '中等',
        time: '6分钟',
        popularity: 89,
        ingredients: ['银龙舌兰酒', '三重橙酒', '青柠汁', '粗盐', '青柠片']
      },
      {
        id: 6,
        name: '长岛冰茶',
        emoji: '🧊',
        category: '烈酒',
        description: '多种烈酒的完美调和，看似清淡实则浓烈，喝酒人的挑战',
        difficulty: '困难',
        time: '8分钟',
        popularity: 85,
        ingredients: ['伏特加', '朗姆酒', '金酒', '龙舌兰酒', '三重橙酒', '柠檬汁', '可乐']
      },
      {
        id: 7,
        name: '威士忌酸',
        emoji: '🍋',
        category: '酸甜',
        description: '威士忌的醇香与柠檬的酸甜交织，层次丰富的口感体验',
        difficulty: '简单',
        time: '4分钟',
        popularity: 82,
        ingredients: ['波本威士忌', '柠檬汁', '糖浆', '蛋白', '安格斯特拉苦精']
      },
      {
        id: 8,
        name: '大都会',
        emoji: '💗',
        category: '时尚',
        description: '粉红色的浪漫外表下，隐藏着伏特加与蔓越莓的完美和谐',
        difficulty: '简单',
        time: '3分钟',
        popularity: 87,
        ingredients: ['伏特加', '三重橙酒', '蔓越莓汁', '青柠汁']
      }
    ],
    
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
    error: null
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

      // 检查基础库版本
      this.checkLibVersion();
      
      // 初始化用户设置
      this.initUserSettings();
      
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
    return this.globalData.cocktails.find(cocktail => cocktail.id === id) || null;
  },

  /**
   * 添加新配方
   * @param {Object} cocktailData 配方数据
   * @returns {boolean} 添加是否成功
   */
  addCocktail(cocktailData) {
    try {
      const newCocktail = {
        id: Date.now(), // 使用时间戳作为临时ID
        ...cocktailData,
        createdAt: new Date().toISOString()
      };

      this.globalData.cocktails.push(newCocktail);
      
      // 持久化存储
      wx.setStorageSync('customCocktails', this.globalData.cocktails);
      
      return true;
    } catch (error) {
      this.handleError(error, '添加配方');
      return false;
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
