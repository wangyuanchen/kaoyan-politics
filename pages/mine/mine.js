// mine.js
const licenseService = require('../../services/license.js')
const util = require('../../utils/util.js')

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    hasValidLicense: false,
    licenseKey: '',
    inputLicenseKey: '',
    showLicenseInput: false,
    progress: {
      studyDays: 0,
      completedChapters: 0,
      totalExercises: 0,
      correctRate: 0
    }
  },
  
  onLoad: function (options) {
    // 检查是否支持getUserProfile
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    
    // 检查是否有有效的密钥
    this.checkLicenseStatus()
    
    // 获取用户信息
    const app = getApp()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  
  onShow: function () {
    // 每次显示页面时检查密钥状态
    this.checkLicenseStatus()
  },
  
  // 检查密钥状态
  checkLicenseStatus: function () {
    const hasValidLicense = licenseService.hasValidLicense()
    const licenseKey = licenseService.getLicenseKey()
    
    this.setData({
      hasValidLicense: hasValidLicense,
      licenseKey: licenseKey
    })
    
    // 更新全局状态
    const app = getApp()
    app.globalData.hasValidLicense = hasValidLicense
    app.globalData.licenseKey = licenseKey
  },
  
  // 获取用户信息
  getUserProfile: function (e) {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const app = getApp()
        app.globalData.userInfo = res.userInfo
        
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  
  // 显示密钥输入框
  showLicenseInput: function () {
    this.setData({
      showLicenseInput: true,
      inputLicenseKey: this.data.licenseKey
    })
  },
  
  // 隐藏密钥输入框
  hideLicenseInput: function () {
    this.setData({
      showLicenseInput: false
    })
  },
  
  // 输入密钥
  inputLicense: function (e) {
    this.setData({
      inputLicenseKey: e.detail.value
    })
  },
  
  // 验证密钥
  verifyLicense: function () {
    const licenseKey = this.data.inputLicenseKey
    
    if (!licenseKey) {
      util.showToast('请输入密钥')
      return
    }
    
    // 显示加载中
    util.showLoading('验证中')
    
    // 使用模拟验证
    licenseService.mockVerifyLicense(licenseKey).then(res => {
      util.hideLoading()
      
      if (res.code === 0 && res.data.valid) {
        // 验证成功
        util.showToast('密钥验证成功', 'success')
        
        // 更新状态
        this.setData({
          hasValidLicense: true,
          licenseKey: licenseKey,
          showLicenseInput: false
        })
        
        // 更新全局状态
        const app = getApp()
        app.globalData.hasValidLicense = true
        app.globalData.licenseKey = licenseKey
      } else {
        // 验证失败
        util.showToast(res.message || '密钥验证失败')
      }
    }).catch(err => {
      util.hideLoading()
      util.showToast('验证失败，请稍后重试')
    })
  },
  
  // 清除密钥
  clearLicense: function () {
    util.showModal('提示', '确定要清除密钥吗？清除后需要重新输入密钥才能使用完整功能。').then(confirm => {
      if (confirm) {
        // 清除密钥
        licenseService.clearLicenseKey()
        
        // 更新状态
        this.setData({
          hasValidLicense: false,
          licenseKey: ''
        })
        
        // 更新全局状态
        const app = getApp()
        app.globalData.hasValidLicense = false
        app.globalData.licenseKey = ''
        
        util.showToast('密钥已清除')
      }
    })
  },
  
  // 跳转到关于页面
  navigateToAbout: function () {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },
  
  // 跳转到反馈页面
  navigateToFeedback: function () {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    })
  },
  
  // 复制客服微信
  copyWechat: function () {
    wx.setClipboardData({
      data: 'your_wechat_id',
      success: function () {
        util.showToast('微信号已复制', 'success')
      }
    })
  }
}) 