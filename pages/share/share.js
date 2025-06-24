// pages/share/share.js
Page({
  data: {
    shareCode: 'COCKTAIL_001',
    shareImageUrl: 'https://example.com/qr-code.png',
    showCode: false,
    showQrCode: false
  },

  copyShareCode() {
    wx.setClipboardData({
      data: this.data.shareCode,
      success: () => {
        wx.showToast({ title: '口令已复制' });
      }
    });
  },

  previewShareImage() {
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
  }
});
