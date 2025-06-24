/**
 * 添加配方页面 - 用户自定义配方创建
 * @description 让用户创建和保存自定义鸡尾酒配方
 * @author 开发团队
 * @version 2.0.0
 */

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 基本配方信息
    cocktailName: '',
    cocktailDescription: '',
    
    // 制作步骤
    steps: [
      { number: 1, instruction: '', animation: 'fadeIn' }
    ],
    
    // 配方详细信息
    difficulty: '简单',
    time: '',
    ingredients: [],
    newIngredient: '',
    
    // 页面状态
    isLoading: false,
    isSaving: false,
    error: null,
    
    // 表单验证
    formErrors: {},
    
    // 选项数据
    difficultyOptions: ['简单', '中等', '困难'],
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('👀 添加配方页面显示');
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
    const value = e.detail.value;
    this.setData({ 
      cocktailName: value,
      'formErrors.name': null 
    });
    
    // 实时验证
    this.validateField('name', value);
  },

  /**
   * 配方描述输入处理
   * @param {Object} e 事件对象
   */
  onInputDescription(e) {
    const value = e.detail.value;
    this.setData({ 
      cocktailDescription: value,
      'formErrors.description': null 
    });
    
    this.validateField('description', value);
  },

  /**
   * 制作时间输入处理
   * @param {Object} e 事件对象
   */
  onInputTime(e) {
    const value = e.detail.value;
    this.setData({ time: value });
  },

  /**
   * 难度选择处理
   * @param {Object} e 事件对象
   */
  onDifficultyChange(e) {
    const index = e.detail.value;
    const difficulty = this.data.difficultyOptions[index];
    this.setData({ difficulty });
    
    console.log(`🎯 用户选择难度: ${difficulty}`);
  },

  /**
   * 新成分输入处理
   * @param {Object} e 事件对象
   */
  onInputIngredient(e) {
    this.setData({ newIngredient: e.detail.value });
  },

  /**
   * 添加成分
   */
  addIngredient() {
    const ingredient = this.data.newIngredient.trim();
    
    if (!ingredient) {
      wx.showToast({
        title: '请输入成分名称',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (this.data.ingredients.includes(ingredient)) {
      wx.showToast({
        title: '成分已存在',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const updatedIngredients = [...this.data.ingredients, ingredient];
    this.setData({
      ingredients: updatedIngredients,
      newIngredient: ''
    });

    console.log(`➕ 添加成分: ${ingredient}`);
  },

  /**
   * 删除成分
   * @param {Object} e 事件对象
   */
  removeIngredient(e) {
    const index = e.currentTarget.dataset.index;
    const ingredient = this.data.ingredients[index];
    
    const updatedIngredients = this.data.ingredients.filter((_, i) => i !== index);
    this.setData({ ingredients: updatedIngredients });

    console.log(`➖ 删除成分: ${ingredient}`);
  },

  /**
   * 添加制作步骤
   */
  addStep() {
    try {
      const newStep = { 
        number: this.data.steps.length + 1, 
        instruction: '', 
        animation: this.getNextAnimation()
      };
      
      const updatedSteps = [...this.data.steps, newStep];
      this.setData({ steps: updatedSteps });

      console.log(`➕ 添加步骤 ${newStep.number}`);
      
    } catch (error) {
      this.handleError(error, '添加步骤');
    }
  },

  /**
   * 获取下一个动画类型
   * @returns {string} 动画类型
   */
  getNextAnimation() {
    const { animationOptions } = this.data;
    const index = this.data.steps.length % animationOptions.length;
    return animationOptions[index];
  },

  /**
   * 步骤内容输入处理
   * @param {Object} e 事件对象
   */
  onInputStep(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    
    const updatedSteps = this.data.steps.map((step, i) =>
      i === index ? { ...step, instruction: value } : step
    );
    
    this.setData({ steps: updatedSteps });
  },

  /**
   * 删除制作步骤
   * @param {Object} e 事件对象
   */
  removeStep(e) {
    const index = e.currentTarget.dataset.index;
    
    if (this.data.steps.length <= 1) {
      wx.showToast({
        title: '至少保留一个步骤',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const updatedSteps = this.data.steps.filter((_, i) => i !== index);
    // 重新编号
    const reorderedSteps = updatedSteps.map((step, i) => ({
      ...step,
      number: i + 1
    }));
    
    this.setData({ steps: reorderedSteps });

    console.log(`➖ 删除步骤 ${index + 1}`);
  },

  /**
   * 向上移动步骤
   * @param {Object} e 事件对象
   */
  moveStepUp(e) {
    const index = e.currentTarget.dataset.index;
    
    if (index === 0) return;

    const steps = [...this.data.steps];
    [steps[index - 1], steps[index]] = [steps[index], steps[index - 1]];
    
    // 重新编号
    const reorderedSteps = steps.map((step, i) => ({
      ...step,
      number: i + 1
    }));
    
    this.setData({ steps: reorderedSteps });

    console.log(`⬆️ 步骤 ${index + 1} 上移`);
  },

  /**
   * 向下移动步骤
   * @param {Object} e 事件对象
   */
  moveStepDown(e) {
    const index = e.currentTarget.dataset.index;
    
    if (index === this.data.steps.length - 1) return;

    const steps = [...this.data.steps];
    [steps[index], steps[index + 1]] = [steps[index + 1], steps[index]];
    
    // 重新编号
    const reorderedSteps = steps.map((step, i) => ({
      ...step,
      number: i + 1
    }));
    
    this.setData({ steps: reorderedSteps });

    console.log(`⬇️ 步骤 ${index + 1} 下移`);
  },

  /**
   * 表单验证
   * @returns {boolean} 验证是否通过
   */
  validateForm() {
    const errors = {};
    let isValid = true;

    // 验证配方名称
    if (!this.data.cocktailName.trim()) {
      errors.name = '请输入配方名称';
      isValid = false;
    } else if (this.data.cocktailName.length > 20) {
      errors.name = '配方名称不能超过20个字符';
      isValid = false;
    }

    // 验证配方描述
    if (!this.data.cocktailDescription.trim()) {
      errors.description = '请输入配方描述';
      isValid = false;
    } else if (this.data.cocktailDescription.length > 100) {
      errors.description = '配方描述不能超过100个字符';
      isValid = false;
    }

    // 验证成分
    if (this.data.ingredients.length === 0) {
      errors.ingredients = '请至少添加一种成分';
      isValid = false;
    }

    // 验证制作步骤
    const hasEmptyStep = this.data.steps.some(step => !step.instruction.trim());
    if (hasEmptyStep) {
      errors.steps = '请完善所有制作步骤';
      isValid = false;
    }

    this.setData({ formErrors: errors });
    return isValid;
  },

  /**
   * 单个字段验证
   * @param {string} field 字段名
   * @param {string} value 字段值
   */
  validateField(field, value) {
    const errors = { ...this.data.formErrors };

    switch (field) {
      case 'name':
        if (!value.trim()) {
          errors.name = '请输入配方名称';
        } else if (value.length > 20) {
          errors.name = '配方名称不能超过20个字符';
        } else {
          delete errors.name;
        }
        break;

      case 'description':
        if (!value.trim()) {
          errors.description = '请输入配方描述';
        } else if (value.length > 100) {
          errors.description = '配方描述不能超过100个字符';
        } else {
          delete errors.description;
        }
        break;
    }

    this.setData({ formErrors: errors });
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
    if (!this.validateForm()) {
      wx.showToast({
        title: '请完善配方信息',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    this.setData({ isSaving: true });

    try {
      // 构建配方数据
      const cocktailData = {
        name: this.data.cocktailName.trim(),
        description: this.data.cocktailDescription.trim(),
        difficulty: this.data.difficulty,
        time: this.data.time || '未设置',
        ingredients: this.data.ingredients,
        steps: this.data.steps.filter(step => step.instruction.trim()),
        popularity: Math.floor(Math.random() * 20) + 80, // 随机初始评分
        image: '/images/default-cocktail.jpg'
      };

      // 保存到全局数据
      const app = getApp();
      const success = app.addCocktail(cocktailData);

      if (success) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        });

        console.log('✅ 配方保存成功:', cocktailData.name);

        // 延迟后返回
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        throw new Error('保存配方失败');
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
    if (!this.validateForm()) {
      wx.showToast({
        title: '请完善配方信息',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 这里可以实现预览功能
    console.log('👀 预览配方');
    wx.showModal({
      title: '预览配方',
      content: `${this.data.cocktailName}\n${this.data.cocktailDescription}\n共${this.data.steps.length}个步骤`,
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
          this.setData({
            cocktailName: '',
            cocktailDescription: '',
            steps: [{ number: 1, instruction: '', animation: 'fadeIn' }],
            difficulty: '简单',
            time: '',
            ingredients: [],
            newIngredient: '',
            formErrors: {}
          });

          console.log('🔄 表单已重置');
        }
      }
    });
  },

  /**
   * 返回上一页
   */
  navigateBack() {
    // 检查是否有未保存的数据
    const hasData = this.data.cocktailName || 
                   this.data.cocktailDescription || 
                   this.data.ingredients.length > 0 ||
                   this.data.steps.some(step => step.instruction);

    if (hasData) {
      wx.showModal({
        title: '确认离开',
        content: '当前页面有未保存的内容，确认离开吗？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack();
          }
        }
      });
    } else {
      wx.navigateBack();
    }
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
  }
});
