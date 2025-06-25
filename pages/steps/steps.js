/**
 * 调酒步骤页面
 * @description 展示调酒制作的详细步骤，支持逐步完成和进度追踪
 * @author 开发团队
 * @version 2.0.0
 */

Page({
  /**
   * 页面的初始数据
   */
  data: {
    steps: [],           // 步骤数据
    currentStep: 0,      // 当前步骤索引
    currentProgress: 0,  // 当前进度百分比
    cocktailName: ''     // 当前制作的鸡尾酒名称
  },

  /**
   * 页面加载时执行
   */
  onLoad(options) {
    console.log('🍸 步骤页面加载', options);
    
    // 从URL参数获取鸡尾酒名称
    const cocktailName = options.name || '鸡尾酒';
    
    // 根据鸡尾酒名称获取详细步骤数据
    const stepsData = this.getDetailedSteps(cocktailName);
    
    this.setData({
      steps: stepsData,
      cocktailName: cocktailName,
      currentProgress: this.calculateProgress(0, stepsData.length)
    });
    
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: `制作${cocktailName}`
    });
  },

  /**
   * 根据鸡尾酒名称获取详细步骤
   * @param {string} cocktailName - 鸡尾酒名称
   * @returns {Array} 步骤数组
   */
  getDetailedSteps(cocktailName) {
    // 调酒步骤数据库
    const cocktailSteps = {
      '莫吉托': [
        {
          number: 1,
          instruction: '在杯中加入10片新鲜薄荷叶',
          tips: '轻轻拍打薄荷叶释放香味，不要用力捣碎',
          estimatedTime: 1,
          animation: 'fadeIn'
        },
        {
          number: 2,
          instruction: '加入15ml新鲜柠檬汁',
          tips: '使用新鲜柠檬榨汁，避免使用浓缩柠檬汁',
          estimatedTime: 1,
          animation: 'slideIn'
        },
        {
          number: 3,
          instruction: '倒入60ml白朗姆酒',
          tips: '选择品质较好的白朗姆酒，口感会更佳',
          estimatedTime: 1,
          animation: 'zoomIn'
        },
        {
          number: 4,
          instruction: '加入适量苏打水并轻轻搅拌',
          tips: '苏打水要冰镇过，搅拌时避免破坏薄荷叶',
          estimatedTime: 1,
          animation: 'fadeIn'
        },
        {
          number: 5,
          instruction: '用柠檬片和薄荷叶装饰',
          tips: '装饰不仅美观，还能增加香气',
          estimatedTime: 1,
          animation: 'slideIn'
        }
      ],
      '玛格丽特': [
        {
          number: 1,
          instruction: '用柠檬片擦拭杯沿，蘸上盐边',
          tips: '盐边能平衡玛格丽特的酸味',
          estimatedTime: 2,
          animation: 'fadeIn'
        },
        {
          number: 2,
          instruction: '在调酒器中加入45ml龙舌兰酒',
          tips: '使用100%龙舌兰制作的酒效果最佳',
          estimatedTime: 1,
          animation: 'slideIn'
        },
        {
          number: 3,
          instruction: '加入15ml橙皮酒',
          tips: 'Cointreau或Triple Sec都可以',
          estimatedTime: 1,
          animation: 'zoomIn'
        },
        {
          number: 4,
          instruction: '倒入20ml新鲜柠檬汁',
          tips: '新鲜柠檬汁是关键，不能用瓶装的',
          estimatedTime: 1,
          animation: 'fadeIn'
        },
        {
          number: 5,
          instruction: '加冰摇匀，过滤倒入杯中',
          tips: '摇制15-20秒，让所有成分充分混合',
          estimatedTime: 2,
          animation: 'slideIn'
        }
      ],
      '曼哈顿': [
        {
          number: 1,
          instruction: '在调酒杯中加入60ml威士忌',
          tips: '推荐使用黑麦威士忌或波本威士忌',
          estimatedTime: 1,
          animation: 'fadeIn'
        },
        {
          number: 2,
          instruction: '倒入30ml甜味威末酒',
          tips: '选择品质好的意大利甜味威末酒',
          estimatedTime: 1,
          animation: 'slideIn'
        },
        {
          number: 3,
          instruction: '加入2-3滴安格仕苦酒',
          tips: '苦酒用量要适中，太多会掩盖其他味道',
          estimatedTime: 1,
          animation: 'zoomIn'
        },
        {
          number: 4,
          instruction: '加冰搅拌30秒',
          tips: '搅拌而不是摇制，保持酒体的丝滑质感',
          estimatedTime: 1,
          animation: 'fadeIn'
        },
        {
          number: 5,
          instruction: '过滤倒入鸡尾酒杯，用樱桃装饰',
          tips: '预冷鸡尾酒杯能保持最佳口感',
          estimatedTime: 1,
          animation: 'slideIn'
        }
      ]
    };
    
    // 返回对应的步骤，如果没找到则返回默认步骤
    return cocktailSteps[cocktailName] || [
      {
        number: 1,
        instruction: '准备所需材料',
        tips: '确保所有材料新鲜且温度适宜',
        estimatedTime: 2,
        animation: 'fadeIn'
      },
      {
        number: 2,
        instruction: '按配方混合所有成分',
        tips: '严格按照配方比例，确保口感平衡',
        estimatedTime: 3,
        animation: 'slideIn'
      },
      {
        number: 3,
        instruction: '倒入适当的杯中并装饰',
        tips: '选择合适的杯型能提升饮用体验',
        estimatedTime: 2,
        animation: 'zoomIn'
      }
    ];
  },

  /**
   * 计算进度百分比
   * @param {number} current - 当前步骤
   * @param {number} total - 总步骤数
   * @returns {number} 进度百分比
   */
  calculateProgress(current, total) {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
  },

  /**
   * 完成单个步骤
   * @param {Object} e - 事件对象
   */
  completeStep(e) {
    const stepIndex = parseInt(e.currentTarget.dataset.step);
    const newCurrentStep = stepIndex + 1;
    const newProgress = this.calculateProgress(newCurrentStep, this.data.steps.length);
    
    console.log('✅ 完成步骤', stepIndex + 1);
    
    this.setData({
      currentStep: newCurrentStep,
      currentProgress: newProgress
    });
    
    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    });
    
    // 显示完成提示
    wx.showToast({
      title: '步骤已完成！',
      icon: 'success',
      duration: 1500
    });
    
    // 如果所有步骤完成，显示庆祝动画
    if (newCurrentStep >= this.data.steps.length) {
      this.showCompletionCelebration();
    }
  },

  /**
   * 显示完成庆祝动画
   */
  showCompletionCelebration() {
    wx.showToast({
      title: '🎉 制作完成！',
      icon: 'success',
      duration: 2000
    });
    
    // 强触觉反馈
    wx.vibrateLong();
    
    console.log('🎉 所有步骤已完成！');
  },

  /**
   * 完成调酒制作
   */
  finishCocktail() {
    console.log('🍸 完成调酒制作');
    
    // 显示完成提示
    wx.showModal({
      title: '制作完成',
      content: `恭喜您成功制作了${this.data.cocktailName}！是否返回首页？`,
      confirmText: '返回首页',
      cancelText: '再看看',
      success: (res) => {
        if (res.confirm) {
          this.navigateToHome();
        }
      }
    });
  },

  /**
   * 导航回首页
   */
  navigateToHome() {
    // 使用 navigateBack 如果是从首页跳转过来的
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({
        delta: pages.length - 1, // 回到首页
        success: () => {
          console.log('✅ 成功返回首页');
        },
        fail: (error) => {
          console.error('❌ 返回首页失败:', error);
          // 如果 navigateBack 失败，使用 reLaunch
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }
      });
    } else {
      // 如果页面栈只有当前页面，使用 reLaunch
      wx.reLaunch({
        url: '/pages/index/index'
      });
    }
  },

  /**
   * 页面显示时执行
   */
  onShow() {
    console.log('👁️ 步骤页面显示');
  },

  /**
   * 页面隐藏时执行
   */
  onHide() {
    console.log('🙈 步骤页面隐藏');
  },

  /**
   * 页面卸载时执行
   */
  onUnload() {
    console.log('💀 步骤页面卸载');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: `我正在制作${this.data.cocktailName}`,
      path: `/pages/cocktail-detail/cocktail-detail?name=${this.data.cocktailName}`,
      imageUrl: '' // 可以添加分享图片
    };
  }
});
