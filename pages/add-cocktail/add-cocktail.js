/**
 * 添加配方页面 - 用户自定义配方创建
 * @description 让用户创建和保存自定义鸡尾酒配方
 * @author 开发团队
 * @version 2.0.0
 */

const cocktailDraft = require('../../utils/cocktailDraft');
const DRAFT_ACTIONS = cocktailDraft.ACTIONS;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ...cocktailDraft.createInitialDraft(),
    
    // 页面状态
    isLoading: false,
    isSaving: false,
    error: null,
    isTabEntering: false,
    
    // 选项数据
    difficultyOptions: ['简单', '中等', '困难'],
    categoryOptions: ['经典', '清爽', '热带', '烈酒', '早餐酒', '酸甜', '时尚', '创新'],
    emojiOptions: ['🍸', '🥃', '🌿', '🧊', '🍅', '🥭', '🍋', '💗', '🍹', '🥂', '🍷', '🎯'],
    difficultyIndex: 0,
    categoryIndex: 0,
    emojiIndex: 0,
    animationOptions: ['fadeIn', 'slideIn', 'zoomIn']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('📝 添加配方页面加载');
    
    // 如果是编辑模式
    if (options.id) {
      this.loadCocktailForEdit(options.id);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('✅ 添加配方页面渲染完成');
    this.finishTabSwitchLoading();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('👀 添加配方页面显示');

    const app = getApp();
    if (app && typeof app.ensureDarkWindowBackground === 'function') {
      app.ensureDarkWindowBackground();
    }

    if (app && app.globalData && app.globalData.isTabSwitching) {
      this.playTabEnterTransition();
    }

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }

    this.finishTabSwitchLoading();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('🫥 添加配方页面隐藏');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log('🗑️ 添加配方页面卸载');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '我在创建新的鸡尾酒配方',
      desc: '一起来学习调酒吧！',
      path: '/pages/add-cocktail/add-cocktail'
    };
  },

  /**
   * 配方名称输入处理
   * @param {Object} e 事件对象
   */
  onInputName(e) {
    this.applyDraftAction({
      type: DRAFT_ACTIONS.INPUT_NAME,
      value: e.detail.value
    });
  },

  /**
   * 配方描述输入处理
   * @param {Object} e 事件对象
   */
  onInputDescription(e) {
    this.applyDraftAction({
      type: DRAFT_ACTIONS.INPUT_DESCRIPTION,
      value: e.detail.value
    });
  },

  /**
   * 制作时间输入处理
   * @param {Object} e 事件对象
   */
  onInputTime(e) {
    this.applyDraftAction({
      type: DRAFT_ACTIONS.INPUT_TIME,
      value: e.detail.value
    });
  },

  /**
   * 难度选择处理
   * @param {Object} e 事件对象
   */
  onDifficultyChange(e) {
    const result = this.applyDraftAction({
      type: DRAFT_ACTIONS.SELECT_DIFFICULTY,
      index: e.detail.value,
      options: this.data.difficultyOptions
    });
    const difficulty = result.patch.difficulty || this.data.difficulty;
    
    console.log(`🎯 用户选择难度: ${difficulty}`);
  },

  /**
   * 分类选择处理
   * @param {Object} e 事件对象
   */
  onCategoryChange(e) {
    const result = this.applyDraftAction({
      type: DRAFT_ACTIONS.SELECT_CATEGORY,
      index: e.detail.value,
      options: this.data.categoryOptions
    });
    const category = result.patch.category || this.data.category;
    
    console.log(`🏷️ 用户选择分类: ${category}`);
  },

  /**
   * 表情符号选择处理
   * @param {Object} e 事件对象
   */
  onEmojiChange(e) {
    const result = this.applyDraftAction({
      type: DRAFT_ACTIONS.SELECT_EMOJI,
      index: e.detail.value,
      options: this.data.emojiOptions
    });
    const emoji = result.patch.emoji || this.data.emoji;
    
    console.log(`😀 用户选择表情: ${emoji}`);
  },

  /**
   * 新成分输入处理
   * @param {Object} e 事件对象
   */
  onInputIngredient(e) {
    this.applyDraftAction({
      type: DRAFT_ACTIONS.INPUT_INGREDIENT,
      value: e.detail.value
    });
  },

  /**
   * 添加成分
   */
  addIngredient() {
    const result = this.applyDraftAction({
      type: DRAFT_ACTIONS.ADD_INGREDIENT
    });

    if (result.error) {
      this.showDraftError(result.error);
      return;
    }

    const addedIngredient = result.patch.ingredients[result.patch.ingredients.length - 1];
    console.log(`➕ 添加成分: ${addedIngredient}`);
  },

  /**
   * 删除成分
   * @param {Object} e 事件对象
   */
  removeIngredient(e) {
    const index = e.currentTarget.dataset.index;
    const ingredient = this.data.ingredients[index];
    this.applyDraftAction({
      type: DRAFT_ACTIONS.REMOVE_INGREDIENT,
      index
    });

    console.log(`➖ 删除成分: ${ingredient}`);
  },

  /**
   * 添加制作步骤
   */
  addStep() {
    try {
      const result = this.applyDraftAction({
        type: DRAFT_ACTIONS.ADD_STEP,
        animations: this.data.animationOptions
      });

      if (result.error) {
        this.showDraftError(result.error);
        return;
      }

      console.log(`➕ 添加步骤 ${result.patch.steps.length}`);
      
    } catch (error) {
      this.handleError(error, '添加步骤');
    }
  },

  /**
   * 步骤内容输入处理
   * @param {Object} e 事件对象
   */
  onInputStep(e) {
    this.applyDraftAction({
      type: DRAFT_ACTIONS.UPDATE_STEP,
      index: e.currentTarget.dataset.index,
      value: e.detail.value
    });
  },

  /**
   * 删除制作步骤
   * @param {Object} e 事件对象
   */
  removeStep(e) {
    const index = e.currentTarget.dataset.index;
    const result = this.applyDraftAction({
      type: DRAFT_ACTIONS.REMOVE_STEP,
      index
    });
    
    if (result.error) {
      this.showDraftError(result.error);
      return;
    }

    console.log(`➖ 删除步骤 ${index + 1}`);
  },

  /**
   * 向上移动步骤
   * @param {Object} e 事件对象
   */
  moveStepUp(e) {
    const index = e.currentTarget.dataset.index;
    this.applyDraftAction({
      type: DRAFT_ACTIONS.MOVE_STEP,
      index,
      direction: 'up'
    });

    console.log(`⬆️ 步骤 ${index + 1} 上移`);
  },

  /**
   * 向下移动步骤
   * @param {Object} e 事件对象
   */
  moveStepDown(e) {
    const index = e.currentTarget.dataset.index;
    this.applyDraftAction({
      type: DRAFT_ACTIONS.MOVE_STEP,
      index,
      direction: 'down'
    });

    console.log(`⬇️ 步骤 ${index + 1} 下移`);
  },

  /**
   * 表单验证
   * @returns {Object} 验证结果 {isValid: boolean, errors: Object, message: string}
   */
  validateForm() {
    const validation = cocktailDraft.validateDraft(this.data);
    this.setData({ formErrors: validation.errors });
    return validation;
  },

  /**
   * 保存配方
   */
  async saveCocktail() {
    console.log('💾 开始保存配方');

    // 防止重复提交
    if (this.data.isSaving) {
      return;
    }

    // 表单验证
    const validation = this.validateForm();
    if (!validation.isValid) {
      wx.showToast({
        title: validation.message,
        icon: 'none',
        duration: 3000
      });
      return;
    }

    this.setData({ isSaving: true });

    try {
      // 保存到全局数据
      const app = getApp();
      const savedCocktail = app.addCocktail ? app.addCocktail(validation.draft) : null;

      if (savedCocktail) {
        wx.showToast({
          title: '保存成功！',
          icon: 'success',
          duration: 2000
        });

        console.log('✅ 配方保存成功:', savedCocktail.name);

        // 延迟后跳转到首页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }, 1500);
      } else {
        throw new Error('配方保存失败，请稍后重试');
      }

    } catch (error) {
      this.handleError(error, '保存配方');
    } finally {
      this.setData({ isSaving: false });
    }
  },

  /**
   * 预览配方
   */
  previewCocktail() {
    const validation = this.validateForm();
    if (!validation.isValid) {
      wx.showToast({
        title: validation.message,
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 这里可以实现预览功能
    console.log('👀 预览配方');
    wx.showModal({
      title: '预览配方',
      content: `${validation.draft.name}\n${validation.draft.description}\n共${validation.draft.steps.length}个步骤`,
      showCancel: false
    });
  },

  /**
   * 重置表单
   */
  resetForm() {
    wx.showModal({
      title: '确认重置',
      content: '重置后将清空所有已填写的内容，确认继续吗？',
      success: (res) => {
        if (res.confirm) {
          this.applyDraftAction({
            type: DRAFT_ACTIONS.RESET
          });

          console.log('🔄 表单已重置');
        }
      }
    });
  },

  /**
   * 加载配方用于编辑（预留功能）
   * @param {string} id 配方ID
   */
  loadCocktailForEdit(id) {
    console.log(`📝 加载配方用于编辑: ${id}`);
    // 这里可以实现编辑现有配方的功能
  },

  /**
   * 取消并返回首页
   */
  navigateBack() {
    // 检查是否有未保存的内容
    const hasContent = cocktailDraft.hasContent(this.data);

    if (hasContent) {
      wx.showModal({
        title: '确认离开',
        content: '页面内容尚未保存，确认离开吗？',
        success: (res) => {
          if (res.confirm) {
            console.log('🔙 用户确认离开页面，跳转到首页');
            wx.switchTab({
              url: '/pages/index/index'
            });
          }
        }
      });
    } else {
      console.log('🔙 页面内容为空，直接跳转首页');
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  /**
   * 错误处理函数
   * @param {Error} error 错误对象
   * @param {string} context 错误上下文
   */
  handleError(error, context = '未知操作') {
    const errorMessage = error.message || '未知错误';
    
    console.error(`❌ ${context}错误:`, error);
    
    this.setData({
      error: {
        message: errorMessage,
        context,
        timestamp: new Date().toISOString()
      }
    });

    wx.showToast({
      title: `${context}失败`,
      icon: 'none',
      duration: 2000
    });
  },

  applyDraftAction(action) {
    const result = cocktailDraft.reduceDraftState(this.data, action);

    if (Object.keys(result.patch).length) {
      this.setData(result.patch);
    }

    return result;
  },

  showDraftError(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  },

  playTabEnterTransition() {
    this.setData({ isTabEntering: true });

    setTimeout(() => {
      this.setData({ isTabEntering: false });
    }, 260);
  },

  finishTabSwitchLoading() {
    const app = getApp();
    if (app && typeof app.finishTabSwitchLoadingAfterPaint === 'function') {
      app.finishTabSwitchLoadingAfterPaint();
    }
  }
});
