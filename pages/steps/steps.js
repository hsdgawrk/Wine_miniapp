Page({
  data: {
    steps: [],
    deckSteps: [],
    currentStep: 0,
    currentStepNumber: 0,
    currentProgress: 0,
    cocktailName: '',
    cocktailId: '',
    touchStartX: 0,
    touchStartY: 0,
    touchStartTime: 0
  },

  onLoad(options) {
    const app = getApp();
    const cocktail = app.cocktailLibrary.getCocktailDetail({
      id: options.id,
      name: options.name
    });
    const cocktailName = cocktail ? cocktail.name : '鸡尾酒';
    const fallbackSteps = app.cocktailLibrary.getCocktailSteps({ name: options.name });
    const stepsData = cocktail ? cocktail.steps : fallbackSteps;
    const steps = Array.isArray(stepsData) ? stepsData : [];

    this.setData({
      steps,
      cocktailName,
      cocktailId: cocktail ? cocktail.id : '',
      currentStep: 0,
      currentStepNumber: steps.length ? 1 : 0,
      currentProgress: this.calculateProgress(0, steps.length),
      deckSteps: this.buildDeckSteps(steps, 0)
    });

    wx.setNavigationBarTitle({
      title: `制作${cocktailName}`
    });
  },

  calculateProgress(current, total) {
    if (total === 0) return 0;
    return Math.round(((current + 1) / total) * 100);
  },

  buildDeckSteps(steps, currentStep) {
    const total = steps.length;

    return steps.map((step, index) => {
      const distance = index - currentStep;
      const absoluteDistance = Math.abs(distance);
      const displayNumber = step.number || index + 1;
      let stackClass = 'is-hidden';
      let zIndex = 1;

      if (distance === -2) {
        stackClass = 'is-far-prev';
        zIndex = 8;
      } else if (distance === -1) {
        stackClass = 'is-prev';
        zIndex = 14;
      } else if (distance === 0) {
        stackClass = 'is-current';
        zIndex = 24;
      } else if (distance === 1) {
        stackClass = 'is-next';
        zIndex = 13;
      } else if (distance === 2) {
        stackClass = 'is-far-next';
        zIndex = 7;
      }

      return {
        ...step,
        deckKey: `${displayNumber}-${index}`,
        displayNumber,
        positionText: `${index + 1}/${total}`,
        isCurrent: distance === 0,
        isVisible: absoluteDistance <= 2,
        stackClass,
        tone: index % 4,
        zIndex
      };
    });
  },

  updateCurrentStep(nextStep) {
    const total = this.data.steps.length;
    if (total === 0 || nextStep < 0 || nextStep > total - 1) {
      return;
    }

    this.setData({
      currentStep: nextStep,
      currentStepNumber: nextStep + 1,
      currentProgress: this.calculateProgress(nextStep, total),
      deckSteps: this.buildDeckSteps(this.data.steps, nextStep)
    });

    wx.vibrateShort({
      type: 'light'
    });
  },

  goPreviousStep() {
    this.updateCurrentStep(this.data.currentStep - 1);
  },

  goNextStep() {
    this.updateCurrentStep(this.data.currentStep + 1);
  },

  handleTouchStart(e) {
    const touch = e.touches && e.touches[0];
    if (!touch) return;

    this.setData({
      touchStartX: touch.clientX,
      touchStartY: touch.clientY,
      touchStartTime: Date.now()
    });
  },

  handleTouchMove() {
    return false;
  },

  handleTouchEnd(e) {
    const touch = e.changedTouches && e.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - this.data.touchStartX;
    const deltaY = touch.clientY - this.data.touchStartY;
    const elapsed = Date.now() - this.data.touchStartTime;
    const isHorizontalSwipe = Math.abs(deltaX) > 46 && Math.abs(deltaX) > Math.abs(deltaY) * 0.8;

    if (!isHorizontalSwipe || elapsed > 900) {
      return;
    }

    if (deltaX < 0) {
      this.goNextStep();
      return;
    }

    this.goPreviousStep();
  },

  finishCocktail() {
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

  navigateToHome() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({
        delta: pages.length - 1,
        fail: () => {
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }
      });
      return;
    }

    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  onShareAppMessage() {
    const query = this.data.cocktailId
      ? `id=${encodeURIComponent(this.data.cocktailId)}&name=${encodeURIComponent(this.data.cocktailName)}`
      : `name=${encodeURIComponent(this.data.cocktailName)}`;

    return {
      title: `我正在制作${this.data.cocktailName}`,
      path: `/pages/cocktail-detail/cocktail-detail?${query}`,
      imageUrl: ''
    };
  }
});
