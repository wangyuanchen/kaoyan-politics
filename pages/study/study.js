// study.js
const api = require('../../services/api.js')
const licenseService = require('../../services/license.js')
const util = require('../../utils/util.js')

Page({
  data: {
    hasValidLicense: false,
    currentSubject: null,
    chapters: [],
    loading: true
  },
  
  onLoad: function (options) {
    // 检查是否有有效的密钥
    const hasValidLicense = licenseService.hasValidLicense()
    this.setData({
      hasValidLicense: hasValidLicense
    })
    
    // 获取当前选中的科目
    const app = getApp()
    if (app.globalData.currentSubject) {
      this.setData({
        currentSubject: app.globalData.currentSubject
      })
      
      // 获取章节列表
      this.getChapters(app.globalData.currentSubject.id)
    }
  },
  
  onShow: function () {
    // 每次显示页面时检查密钥状态
    const hasValidLicense = licenseService.hasValidLicense()
    if (this.data.hasValidLicense !== hasValidLicense) {
      this.setData({
        hasValidLicense: hasValidLicense
      })
    }
    
    // 检查当前科目是否变化
    const app = getApp()
    if (app.globalData.currentSubject) {
      if (!this.data.currentSubject || this.data.currentSubject.id !== app.globalData.currentSubject.id) {
        this.setData({
          currentSubject: app.globalData.currentSubject
        })
        
        // 获取章节列表
        this.getChapters(app.globalData.currentSubject.id)
      }
    }
  },
  
  // 获取章节列表
  getChapters: function (subjectId) {
    // 检查是否有有效的密钥
    if (!this.data.hasValidLicense) {
      this.setData({
        chapters: [],
        loading: false
      })
      return
    }
    
    this.setData({
      loading: true
    })
    
    // 使用模拟数据
    api.getMockChapters(subjectId).then(res => {
      if (res.code === 0) {
        this.setData({
          chapters: res.data,
          loading: false
        })
      } else {
        util.showToast(res.message || '获取章节列表失败')
        this.setData({
          loading: false
        })
      }
    }).catch(err => {
      util.showToast('获取章节列表失败')
      this.setData({
        loading: false
      })
    })
  },
  
  // 点击章节
  onChapterTap: function (e) {
    const chapterId = e.currentTarget.dataset.id
    const chapterName = e.currentTarget.dataset.name
    
    // 检查是否有有效的密钥
    if (!this.data.hasValidLicense) {
      // 跳转到我的页面进行密钥验证
      wx.switchTab({
        url: '/pages/mine/mine'
      })
      return
    }
    
    // 跳转到章节详情页
    wx.navigateTo({
      url: `/pages/chapter/chapter?id=${chapterId}&name=${chapterName}`
    })
  },
  
  // 跳转到科目选择页
  navigateToSubjectSelect: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  
  // 下拉刷新
  onPullDownRefresh: function () {
    if (this.data.currentSubject) {
      this.getChapters(this.data.currentSubject.id)
    }
    wx.stopPullDownRefresh()
  }
}) 