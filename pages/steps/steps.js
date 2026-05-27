const stepsSession = require('../../utils/stepsSession');

Page({
  data: {
    steps: [],
    deckSteps: [],
    currentStep: 0,
    currentStepNumber: 0,
    currentProgress: 0,
    cocktailName: '',
    cocktailId: '',
    touchStart: null
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
    const session = stepsSession.createStepsSession(steps);

    this.setData({
      ...session,
      cocktailName,
      cocktailId: cocktail ? cocktail.id : '',
      touchStart: null
    });

    wx.setNavigationBarTitle({
      title: `调制${cocktailName}`
    });
  },

  updateCurrentStep(nextStep) {
    if (!this.data.steps.length || nextStep < 0 || nextStep > this.data.steps.length - 1) {
      return;
    }

    this.setData(stepsSession.goToStep(this.data, nextStep));

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
      touchStart: stepsSession.captureTouch(touch)
    });
  },

  handleTouchMove() {
    return false;
  },

  handleTouchEnd(e) {
    const touch = e.changedTouches && e.changedTouches[0];
    if (!touch || !this.data.touchStart) return;

    const direction = stepsSession.resolveSwipe(
      this.data.touchStart,
      stepsSession.captureTouch(touch)
    );

    this.setData({ touchStart: null });

    if (!direction) {
      return;
    }

    if (direction === 'next') {
      this.goNextStep();
      return;
    }

    this.goPreviousStep();
  },

  finishCocktail() {
    wx.showModal({
      title: '调制完成',
      content: `${this.data.cocktailName} 已调制完成，是否返回首页？`,
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
  }
});
