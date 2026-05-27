const cocktailTransfer = require('../../utils/cocktailTransfer');

Page({
  data: {
    mode: 'import',
    isExport: false,
    modeTitle: '收录酒谱',
    modeEyebrow: 'IMPORT CODE',
    modeSubtitle: '粘贴酒谱文本，预览后收录到私藏',
    cocktailId: '',
    cocktail: null,
    importCode: '',
    importText: '',
    importPreview: null,
    targetName: '',
    errorCode: '',
    errorMessage: '',
    showEditExportAction: false,
    isReadingClipboard: false,
    isConfirming: false,
    canEditExportTarget: false
  },

  onLoad(options = {}) {
    const mode = options.id ? 'export' : 'import';
    const isExport = mode === 'export';
    this.setData({
      mode,
      isExport,
      modeTitle: isExport ? '分享酒谱' : '收录酒谱',
      modeEyebrow: isExport ? 'EXPORT CODE' : 'IMPORT CODE',
      modeSubtitle: isExport
        ? '把这条私藏酒谱转换为可复制文本'
        : '粘贴酒谱文本，预览后收录到私藏',
      cocktailId: options.id || ''
    });

    wx.setNavigationBarTitle({
      title: mode === 'export' ? '分享酒谱' : '收录酒谱'
    });

    if (mode === 'export') {
      this.prepareExport(options.id);
    }
  },

  onShow() {
    const app = getApp();
    if (app && typeof app.ensureDarkWindowBackground === 'function') {
      app.ensureDarkWindowBackground();
    }
  },

  prepareExport(id) {
    const app = getApp();
    const cocktail = app.cocktailLibrary.getCocktailById(id);

    if (!cocktail) {
      this.showError(cocktailTransfer.ERROR_CODES.COCKTAIL_NOT_FOUND);
      return;
    }

    this.setData({
      cocktail,
      canEditExportTarget: cocktail.source === 'custom'
    });

    try {
      const importCode = app.cocktailLibrary.exportCustomCocktail(id);
      this.setData({
        importCode,
        errorCode: '',
        errorMessage: ''
      });
    } catch (error) {
      this.showError(error.code || cocktailTransfer.ERROR_CODES.EXPORT_CONTENT_INVALID);
    }
  },

  onInputImportText(e) {
    this.setData({
      importText: e.detail.value,
      importPreview: null,
      targetName: '',
      errorCode: '',
      errorMessage: ''
    });
  },

  validateImportText() {
    const app = getApp();

    try {
      const importPreview = app.cocktailLibrary.createImportPreview(this.data.importText);
      this.setData({
        importPreview,
        targetName: importPreview.targetName,
        errorCode: '',
        errorMessage: ''
      });
    } catch (error) {
      this.setData({
        importPreview: null,
        targetName: ''
      });
      this.showError(error.code || cocktailTransfer.ERROR_CODES.IMPORT_FORMAT_INVALID);
    }
  },

  readClipboard() {
    if (this.data.isReadingClipboard) {
      return;
    }

    this.setData({ isReadingClipboard: true });

    wx.getClipboardData({
      success: (res) => {
        const data = res.data || '';
        this.setData({
          importText: data,
          importPreview: null,
          targetName: '',
          errorCode: '',
          errorMessage: ''
        }, () => {
          if (!String(data).trim()) {
            this.showError(cocktailTransfer.ERROR_CODES.IMPORT_FORMAT_INVALID);
            return;
          }
          this.validateImportText();
        });
      },
      fail: () => {
        this.showError(cocktailTransfer.ERROR_CODES.IMPORT_CLIPBOARD_FAILED);
      },
      complete: () => {
        this.setData({ isReadingClipboard: false });
      }
    });
  },

  onInputTargetName(e) {
    this.setData({
      targetName: e.detail.value,
      errorCode: '',
      errorMessage: ''
    });
  },

  confirmImport() {
    if (!this.data.importPreview || this.data.isConfirming) {
      return;
    }

    this.setData({ isConfirming: true });

    try {
      const app = getApp();
      const cocktail = app.cocktailLibrary.confirmImport(this.data.importPreview, this.data.targetName);
      app.globalData.cocktails = app.cocktailLibrary.listCocktails();

      wx.showToast({
        title: '已收录',
        icon: 'success',
        duration: 1200
      });

      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/cocktail-detail/cocktail-detail?id=${encodeURIComponent(cocktail.id)}&name=${encodeURIComponent(cocktail.name)}`
        });
      }, 500);
    } catch (error) {
      this.showError(error.code || cocktailTransfer.ERROR_CODES.IMPORT_CONTENT_INVALID);
    } finally {
      this.setData({ isConfirming: false });
    }
  },

  copyImportCode() {
    if (!this.data.importCode) {
      return;
    }

    wx.setClipboardData({
      data: this.data.importCode,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        });
      }
    });
  },

  navigateToEdit() {
    if (!this.data.cocktailId) {
      return;
    }

    wx.redirectTo({
      url: `/pages/edit-cocktail/edit-cocktail?id=${encodeURIComponent(this.data.cocktailId)}`
    });
  },

  showError(code) {
    this.setData({
      errorCode: code,
      errorMessage: cocktailTransfer.getErrorMessage(code),
      showEditExportAction: this.data.isExport
        && code === cocktailTransfer.ERROR_CODES.EXPORT_CONTENT_INVALID
        && this.data.canEditExportTarget
    });
  }
});
