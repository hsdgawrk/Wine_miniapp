const MORE_PANEL_CLOSE_DISTANCE = 64;
const MORE_PANEL_CLOSE_DURATION = 220;
const MORE_PANEL_REBOUND_LIMIT = 220;

Page({
  data: {
    cocktail: null,
    steps: [],
    error: null,
    showMorePanel: false,
    morePanelTranslateY: 0,
    morePanelMaskOpacity: 1,
    morePanelDragging: false,
    morePanelClosing: false
  },

  onLoad(options) {
    this.options = options || {};
    this.loadCocktail(this.options);
  },

  onShow() {
    if (this.options) {
      this.loadCocktail(this.options, { silent: true });
    }
  },

  onUnload() {
    this.clearMorePanelCloseTimer();
  },

  loadCocktail(options = {}, settings = {}) {
    const app = getApp();
    const cocktail = app.cocktailLibrary.getCocktailDetail({
      id: options.id,
      name: options.name
    });

    if (!cocktail) {
      this.setData({
        cocktail: null,
        steps: [],
        error: '未找到酒谱',
        showMorePanel: false
      });
      if (!settings.silent) {
        wx.showToast({
          title: '未找到酒谱',
          icon: 'none',
          duration: 2000
        });
      }
      return;
    }

    this.setData({
      cocktail,
      steps: cocktail.steps,
      error: null
    });

    wx.setNavigationBarTitle({
      title: cocktail.name
    });
  },

  navigateToSteps() {
    if (!this.data.cocktail) {
      return;
    }

    wx.navigateTo({
      url: `/pages/steps/steps?id=${encodeURIComponent(this.data.cocktail.id)}&name=${encodeURIComponent(this.data.cocktail.name)}`
    });
  },

  openMorePanel() {
    if (!this.data.cocktail) {
      return;
    }
    this.clearMorePanelCloseTimer();
    this.morePanelTouchStartY = 0;
    this.morePanelTouchDeltaY = 0;
    this.morePanelExitY = this.getMorePanelExitY();
    this.setData({
      showMorePanel: true,
      morePanelTranslateY: this.morePanelExitY,
      morePanelMaskOpacity: 0,
      morePanelDragging: false,
      morePanelClosing: false
    });

    wx.nextTick(() => {
      if (!this.data.showMorePanel) {
        return;
      }

      this.setData({
        morePanelTranslateY: 0,
        morePanelMaskOpacity: 1
      });
    });
  },

  closeMorePanel() {
    if (!this.data.showMorePanel) {
      return;
    }

    this.animateMorePanelClose();
  },

  noopTouchMove() {},

  onMorePanelTouchStart(e) {
    if (this.data.morePanelClosing) {
      return;
    }

    const touch = e.touches && e.touches[0];
    this.clearMorePanelCloseTimer();
    this.morePanelTouchStartY = touch ? touch.clientY : 0;
    this.morePanelTouchDeltaY = 0;
    this.morePanelTouchStartTime = Date.now();
    this.setData({
      morePanelDragging: true,
      morePanelClosing: false
    });
  },

  onMorePanelTouchMove(e) {
    const touch = e.touches && e.touches[0];
    if (!touch || !this.morePanelTouchStartY) {
      return;
    }

    const dragY = this.getMorePanelDragY(touch.clientY - this.morePanelTouchStartY);
    this.morePanelTouchDeltaY = dragY;

    this.setData({
      morePanelTranslateY: dragY,
      morePanelMaskOpacity: this.getMorePanelMaskOpacity(dragY)
    });
  },

  onMorePanelTouchEnd() {
    const dragDuration = Math.max(1, Date.now() - (this.morePanelTouchStartTime || Date.now()));
    const dragVelocity = this.morePanelTouchDeltaY / dragDuration;

    if (this.morePanelTouchDeltaY > MORE_PANEL_CLOSE_DISTANCE || dragVelocity > 0.52) {
      this.animateMorePanelClose();
      return;
    }

    this.resetMorePanelTouch();
  },

  resetMorePanelTouch() {
    this.morePanelTouchStartY = 0;
    this.morePanelTouchDeltaY = 0;
    this.morePanelTouchStartTime = 0;

    if (this.data.showMorePanel && this.data.morePanelDragging) {
      this.setData({
        morePanelTranslateY: 0,
        morePanelMaskOpacity: 1,
        morePanelDragging: false,
        morePanelClosing: false
      });
    }
  },

  animateMorePanelClose() {
    this.clearMorePanelCloseTimer();
    this.morePanelTouchStartY = 0;
    this.morePanelTouchDeltaY = 0;
    this.morePanelTouchStartTime = 0;

    this.setData({
      morePanelTranslateY: this.getMorePanelExitY(),
      morePanelMaskOpacity: 0,
      morePanelDragging: false,
      morePanelClosing: true
    });

    this.morePanelCloseTimer = setTimeout(() => {
      this.morePanelCloseTimer = null;
      this.setData({
        showMorePanel: false,
        morePanelTranslateY: 0,
        morePanelMaskOpacity: 1,
        morePanelDragging: false,
        morePanelClosing: false
      });
    }, MORE_PANEL_CLOSE_DURATION);
  },

  clearMorePanelCloseTimer() {
    if (!this.morePanelCloseTimer) {
      return;
    }

    clearTimeout(this.morePanelCloseTimer);
    this.morePanelCloseTimer = null;
  },

  getMorePanelDragY(deltaY) {
    if (deltaY <= 0) {
      return 0;
    }

    if (deltaY <= MORE_PANEL_REBOUND_LIMIT) {
      return Math.round(deltaY);
    }

    return Math.round(MORE_PANEL_REBOUND_LIMIT + (deltaY - MORE_PANEL_REBOUND_LIMIT) * 0.28);
  },

  getMorePanelMaskOpacity(dragY) {
    return Math.max(0.24, 1 - dragY / 280).toFixed(2);
  },

  getMorePanelExitY() {
    if (this.morePanelExitY) {
      return this.morePanelExitY;
    }

    const fallbackExitY = 520;
    try {
      const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      this.morePanelExitY = Math.max(360, Math.round((windowInfo.windowHeight || fallbackExitY) * 0.62));
    } catch (error) {
      this.morePanelExitY = fallbackExitY;
    }

    return this.morePanelExitY;
  },

  navigateToEdit() {
    if (!this.data.cocktail || this.data.cocktail.source !== 'custom') {
      return;
    }

    this.closeMorePanel();
    wx.navigateTo({
      url: `/pages/edit-cocktail/edit-cocktail?id=${encodeURIComponent(this.data.cocktail.id)}`
    });
  },

  navigateToExport() {
    if (!this.data.cocktail || this.data.cocktail.source !== 'custom') {
      return;
    }

    this.closeMorePanel();
    wx.navigateTo({
      url: `/pages/import-export/import-export?id=${encodeURIComponent(this.data.cocktail.id)}`
    });
  },

  confirmDelete() {
    if (!this.data.cocktail || this.data.cocktail.source !== 'custom') {
      return;
    }

    const cocktail = this.data.cocktail;
    this.closeMorePanel();

    wx.showModal({
      title: '删除私藏酒谱',
      content: `要删除「${cocktail.name}」吗？删除后不可恢复。`,
      confirmText: '删除',
      confirmColor: '#ff7a66',
      success: (res) => {
        if (!res.confirm) {
          return;
        }

        const app = getApp();
        const deleted = app.deleteCustomCocktail
          ? app.deleteCustomCocktail(cocktail.id)
          : app.cocktailLibrary.deleteCustomCocktail(cocktail.id);

        if (!deleted) {
          wx.showToast({
            title: '删除失败',
            icon: 'none'
          });
          return;
        }

        wx.showToast({
          title: '已删除',
          icon: 'success',
          duration: 1200
        });

        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/custom-cocktails/custom-cocktails'
          });
        }, 500);
      }
    });
  }
});
