// pages/share/share.js
Page({
  data: {
    cocktail: null,
    shareCode: '',
    sharePath: '',
    shareImageUrl: '',
    showCode: false,
    showQrCode: false,
    error: null
  },

  onLoad(options) {
    const app = getApp();
    const payload = app.cocktailLibrary.createSharePayload({
      id: options.id,
      name: options.name
    });

    if (!payload) {
      this.setData({
        error: '未找到可分享的配方'
      });
      wx.showToast({
        title: '未找到配方',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    this.setData({
      cocktail: {
        id: payload.cocktailId,
        name: payload.cocktailName,
        description: payload.description
      },
      shareCode: payload.shareCode,
      sharePath: payload.sharePath,
      shareImageUrl: payload.shareImageUrl,
      error: null
    });

    wx.setNavigationBarTitle({
      title: `分享${payload.cocktailName}`
    });
  },

  copyShareCode() {
    if (!this.data.shareCode) {
      return;
    }

    wx.setClipboardData({
      data: this.data.shareCode,
      success: () => {
        wx.showToast({ title: '口令已复制' });
      }
    });
  },

  copySharePath() {
    if (!this.data.sharePath) {
      return;
    }

    wx.setClipboardData({
      data: this.data.sharePath,
      success: () => {
        wx.showToast({ title: '路径已复制' });
      }
    });
  },

  previewShareImage() {
    if (!this.data.shareImageUrl) {
      this.copySharePath();
      return;
    }

    wx.previewImage({
      urls: [this.data.shareImageUrl]
    });
  },
  
  onMethodSelect(e) {
    const method = e.currentTarget.dataset.method;
    if (method === 'code') {
      this.setData({ showCode: true, showQrCode: false });
    } else if (method === 'qrcode') {
      this.setData({ showCode: false, showQrCode: true });
    }
  },

  onShareAppMessage() {
    return {
      title: this.data.cocktail ? `分享${this.data.cocktail.name}配方` : '分享鸡尾酒配方',
      path: this.data.sharePath || '/pages/index/index',
      imageUrl: this.data.shareImageUrl || ''
    };
  }
});
