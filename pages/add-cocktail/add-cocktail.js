// pages/add-cocktail/add-cocktail.js
Page({
  data: {
    cocktailName: '',
    cocktailDescription: '',
    steps: [
      { number: 1, instruction: '', animation: 'fadeIn' }
    ]
  },

  onInputName(e) {
    this.setData({ cocktailName: e.detail.value });
  },

  onInputDescription(e) {
    this.setData({ cocktailDescription: e.detail.value });
  },

  addStep() {
    const newStep = { 
      number: this.data.steps.length + 1, 
      instruction: '', 
      animation: this.data.steps.length % 3 === 0 ? 'fadeIn' : 
                 this.data.steps.length % 3 === 1 ? 'slideIn' : 'zoomIn'
    };
    this.setData({
      steps: [...this.data.steps, newStep]
    });
  },

  onInputStep(e) {
    const index = e.currentTarget.dataset.index;
    const updatedSteps = this.data.steps.map((step, i) =>
      i === index ? { ...step, instruction: e.detail.value } : step
    );
    this.setData({ steps: updatedSteps });
  },

  removeStep(e) {
    const index = e.currentTarget.dataset.index;
    if (this.data.steps.length > 1) {
      const updatedSteps = this.data.steps.filter((_, i) => i !== index);
      // 更新步骤编号
      const reorderedSteps = updatedSteps.map((step, i) => ({
        ...step,
        number: i + 1
      }));
      this.setData({ steps: reorderedSteps });
    }
  },

  saveCocktail() {
    // 保存配方逻辑将在后续实现
    wx.showToast({ title: '保存成功' });
    // 这里可以添加将配方保存到全局数据或服务器的逻辑
    wx.navigateBack();
  },

  navigateBack() {
    wx.navigateBack();
  }
});
