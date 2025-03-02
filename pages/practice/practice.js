// practice.js
const api = require('../../services/api.js')
const licenseService = require('../../services/license.js')
const util = require('../../utils/util.js')

Page({
  data: {
    hasValidLicense: false,
    tabs: [
      { id: 'all', name: '全部题目' },
      { id: 'wrong', name: '错题集' },
      { id: 'favorite', name: '收藏题目' }
    ],
    activeTab: 'all',
    exercises: [],
    loading: true,
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    hasMore: false
  },
  
  onLoad: function (options) {
    // 检查是否有有效的密钥
    const hasValidLicense = licenseService.hasValidLicense()
    this.setData({
      hasValidLicense: hasValidLicense
    })
    
    // 获取练习题
    this.getExercises()
  },
  
  onShow: function () {
    // 每次显示页面时检查密钥状态
    const hasValidLicense = licenseService.hasValidLicense()
    if (this.data.hasValidLicense !== hasValidLicense) {
      this.setData({
        hasValidLicense: hasValidLicense
      })
      
      // 重新获取练习题
      this.getExercises()
    }
  },
  
  // 切换标签
  switchTab: function (e) {
    const tabId = e.currentTarget.dataset.id
    
    if (tabId !== this.data.activeTab) {
      this.setData({
        activeTab: tabId,
        exercises: [],
        currentPage: 1,
        hasMore: false
      })
      
      // 获取练习题
      this.getExercises()
    }
  },
  
  // 获取练习题
  getExercises: function () {
    // 检查是否有有效的密钥
    if (!this.data.hasValidLicense && (this.data.activeTab === 'wrong' || this.data.activeTab === 'favorite')) {
      this.setData({
        exercises: [],
        loading: false,
        hasMore: false
      })
      return
    }
    
    this.setData({
      loading: true
    })
    
    const params = {
      page: this.data.currentPage,
      pageSize: this.data.pageSize,
      type: this.data.activeTab
    }
    
    // 使用模拟数据
    api.getMockExercises(params).then(res => {
      if (res.code === 0) {
        // 如果是第一页，直接设置数据
        if (this.data.currentPage === 1) {
          this.setData({
            exercises: res.data.list,
            totalCount: res.data.total,
            hasMore: res.data.list.length < res.data.total,
            loading: false
          })
        } else {
          // 否则，追加数据
          this.setData({
            exercises: this.data.exercises.concat(res.data.list),
            totalCount: res.data.total,
            hasMore: this.data.exercises.length + res.data.list.length < res.data.total,
            loading: false
          })
        }
      } else {
        util.showToast(res.message || '获取练习题失败')
        this.setData({
          loading: false
        })
      }
    }).catch(err => {
      util.showToast('获取练习题失败')
      this.setData({
        loading: false
      })
    })
  },
  
  // 加载更多
  loadMore: function () {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        currentPage: this.data.currentPage + 1
      })
      
      this.getExercises()
    }
  },
  
  // 点击练习题
  onExerciseTap: function (e) {
    const exerciseId = e.currentTarget.dataset.id
    
    // 检查是否有有效的密钥
    if (!this.data.hasValidLicense && this.data.exercises.findIndex(item => item.id === exerciseId) > 0) {
      // 跳转到我的页面进行密钥验证
      wx.switchTab({
        url: '/pages/mine/mine'
      })
      return
    }
    
    // 跳转到练习题详情页
    wx.navigateTo({
      url: `/pages/exercise/exercise?id=${exerciseId}`
    })
  },
  
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      currentPage: 1,
      hasMore: false
    })
    
    this.getExercises()
    wx.stopPullDownRefresh()
  },
  
  // 上拉加载更多
  onReachBottom: function () {
    this.loadMore()
  }
}) 