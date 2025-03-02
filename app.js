// app.js
App({
  onLaunch: function () {
    // 检查用户登录状态
    this.checkLoginStatus();
    
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;
  },
  
  // 检查登录状态
  checkLoginStatus: function () {
    const token = wx.getStorageSync('token');
    const licenseKey = wx.getStorageSync('licenseKey');
    
    if (token) {
      this.globalData.isLoggedIn = true;
    }
    
    if (licenseKey) {
      this.globalData.hasValidLicense = true;
      this.globalData.licenseKey = licenseKey;
    }
  },
  
  // 验证密钥
  verifyLicenseKey: function (licenseKey) {
    // 这里实现密钥验证逻辑
    // 简单示例：检查密钥格式和有效性
    if (!licenseKey || licenseKey.length < 16) {
      return {
        valid: false,
        message: '密钥格式不正确'
      };
    }
    
    // 在实际应用中，可以添加更复杂的验证逻辑
    // 例如：检查密钥前缀、校验和等
    const prefix = licenseKey.substring(0, 4);
    if (prefix !== 'KYZ-') {
      return {
        valid: false,
        message: '密钥无效'
      };
    }
    
    // 存储有效的密钥
    wx.setStorageSync('licenseKey', licenseKey);
    this.globalData.hasValidLicense = true;
    this.globalData.licenseKey = licenseKey;
    
    return {
      valid: true,
      message: '密钥验证成功'
    };
  },
  
  // 全局数据
  globalData: {
    userInfo: null,
    isLoggedIn: false,
    hasValidLicense: false,
    licenseKey: '',
    systemInfo: {},
    currentSubject: null
  }
}) 