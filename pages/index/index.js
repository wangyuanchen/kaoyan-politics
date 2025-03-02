const api = require('../../services/api.js')
const licenseService = require('../../services/license.js')
const util = require('../../utils/util.js')

Page({
  data: {
    subjects: [],
    hasValidLicense: false,
    loading: true,
    banners: [
      {
        id: 1,
        imageUrl: '/images/banner1.png',
        link: '/pages/study/study'
      },
      {
        id: 2,
        imageUrl: '/images/banner2.png',
        link: '/pages/practice/practice'
      }
    ]
  },
  
  onLoad: function (options) {
    // 检查是否有有效的密钥
    const hasValidLicense = licenseService.hasValidLicense()
    this.setData({
      hasValidLicense: hasValidLicense
    })
    
    // 获取科目列表
    this.getSubjects()
  },
  
  onShow: function () {
    // 每次显示页面时检查密钥状态
    const hasValidLicense = licenseService.hasValidLicense()
    if (this.data.hasValidLicense !== hasValidLicense) {
      this.setData({
        hasValidLicense: hasValidLicense
      })
    }
  },
  
  // 获取科目列表
  getSubjects: function () {
    this.setData({
      loading: true
    })
    
    // 使用模拟数据
    api.getMockSubjects().then(res => {
      if (res.code === 0) {
        this.setData({
          subjects: res.data,
          loading: false
        })
      } else {
        util.showToast(res.message || '获取科目列表失败')
        this.setData({
          loading: false
        })
      }
    }).catch(err => {
      util.showToast('获取科目列表失败')
      this.setData({
        loading: false
      })
    })
  },
  
  // 点击科目
  onSubjectTap: function (e) {
    const subjectId = e.currentTarget.dataset.id
    const subjectName = e.currentTarget.dataset.name
    
    // 检查是否有有效的密钥
    if (!this.data.hasValidLicense) {
      // 跳转到我的页面进行密钥验证
      wx.switchTab({
        url: '/pages/mine/mine'
      })
      return
    }
    
    // 保存当前选中的科目
    const app = getApp()
    app.globalData.currentSubject = {
      id: subjectId,
      name: subjectName
    }
    
    // 跳转到学习页面
    wx.switchTab({
      url: '/pages/study/study'
    })
  },
  
  // 点击轮播图
  onBannerTap: function (e) {
    const link = e.currentTarget.dataset.link
    
    // 检查是否有有效的密钥
    if (!this.data.hasValidLicense) {
      // 跳转到我的页面进行密钥验证
      wx.switchTab({
        url: '/pages/mine/mine'
      })
      return
    }
    
    // 跳转到对应页面
    wx.switchTab({
      url: link
    })
  },
  
  // 下拉刷新
  onPullDownRefresh: function () {
    this.getSubjects()
    wx.stopPullDownRefresh()
  }
}) 