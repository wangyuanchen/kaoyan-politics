// API服务类
const util = require('../utils/util.js')

// 基础URL，实际开发中替换为你的服务器地址
const BASE_URL = 'https://api.example.com'

// 请求方法
const request = (url, method, data, needToken = true) => {
  return new Promise((resolve, reject) => {
    // 显示加载中
    util.showLoading()
    
    // 获取应用实例
    const app = getApp()
    
    // 构建请求头
    const header = {
      'content-type': 'application/json'
    }
    
    // 如果需要token，添加到请求头
    if (needToken) {
      const token = wx.getStorageSync('token')
      if (token) {
        header['Authorization'] = `Bearer ${token}`
      }
    }
    
    // 发起请求
    wx.request({
      url: `${BASE_URL}${url}`,
      method: method,
      data: data,
      header: header,
      success: (res) => {
        // 隐藏加载中
        util.hideLoading()
        
        // 请求成功
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // 未授权，清除token
          wx.removeStorageSync('token')
          app.globalData.isLoggedIn = false
          
          // 跳转到登录页
          wx.navigateTo({
            url: '/pages/mine/mine'
          })
          
          reject(new Error('登录已过期，请重新登录'))
        } else {
          // 其他错误
          reject(new Error(res.data.message || '请求失败'))
        }
      },
      fail: (err) => {
        // 隐藏加载中
        util.hideLoading()
        
        // 请求失败
        reject(new Error('网络请求失败，请检查网络连接'))
      }
    })
  })
}

// 验证密钥
const verifyLicense = (licenseKey) => {
  return request('/license/verify', 'POST', { licenseKey }, false)
}

// 获取考研政治科目列表
const getSubjects = () => {
  return request('/subjects', 'GET')
}

// 获取科目详情
const getSubjectDetail = (subjectId) => {
  return request(`/subjects/${subjectId}`, 'GET')
}

// 获取章节列表
const getChapters = (subjectId) => {
  return request(`/subjects/${subjectId}/chapters`, 'GET')
}

// 获取章节详情
const getChapterDetail = (chapterId) => {
  return request(`/chapters/${chapterId}`, 'GET')
}

// 获取练习题
const getExercises = (params) => {
  return request('/exercises', 'GET', params)
}

// 提交练习答案
const submitExercise = (data) => {
  return request('/exercises/submit', 'POST', data)
}

// 获取错题集
const getWrongExercises = () => {
  return request('/exercises/wrong', 'GET')
}

// 获取收藏题目
const getFavoriteExercises = () => {
  return request('/exercises/favorite', 'GET')
}

// 添加收藏
const addFavorite = (exerciseId) => {
  return request('/exercises/favorite', 'POST', { exerciseId })
}

// 取消收藏
const removeFavorite = (exerciseId) => {
  return request(`/exercises/favorite/${exerciseId}`, 'DELETE')
}

// 获取学习进度
const getProgress = () => {
  return request('/user/progress', 'GET')
}

// 更新学习进度
const updateProgress = (data) => {
  return request('/user/progress', 'POST', data)
}

// 模拟本地数据（当没有后端服务时使用）
const mockData = {
  // 模拟科目列表
  subjects: [
    { id: 1, name: '马克思主义基本原理', icon: '/images/subject1.png', description: '马克思主义哲学、政治经济学、科学社会主义' },
    { id: 2, name: '毛泽东思想和中国特色社会主义理论体系概论', icon: '/images/subject2.png', description: '毛泽东思想、邓小平理论、"三个代表"重要思想、科学发展观、习近平新时代中国特色社会主义思想' },
    { id: 3, name: '中国近现代史纲要', icon: '/images/subject3.png', description: '从鸦片战争到新中国成立、社会主义革命和建设、改革开放和社会主义现代化建设新时期' },
    { id: 4, name: '思想道德修养与法律基础', icon: '/images/subject4.png', description: '人生观、价值观、道德观教育、社会主义核心价值观、法律基础知识' }
  ],
  
  // 模拟章节列表（示例：马克思主义基本原理）
  chapters: {
    1: [
      { id: 101, name: '第一章 世界的物质性及发展规律', order: 1 },
      { id: 102, name: '第二章 实践与认识及其发展规律', order: 2 },
      { id: 103, name: '第三章 人类社会及其发展规律', order: 3 },
      { id: 104, name: '第四章 资本主义的本质及规律', order: 4 },
      { id: 105, name: '第五章 资本主义的发展及其趋势', order: 5 },
      { id: 106, name: '第六章 社会主义的发展及其规律', order: 6 }
    ]
  },
  
  // 模拟练习题（示例）
  exercises: [
    {
      id: 1001,
      type: 'single',
      question: '马克思主义哲学区别于旧哲学的显著特征是（）',
      options: [
        { id: 'A', content: '它的阶级性' },
        { id: 'B', content: '它的科学性' },
        { id: 'C', content: '它的革命性' },
        { id: 'D', content: '它的实践性' }
      ],
      answer: 'D',
      analysis: '马克思主义哲学区别于旧哲学的显著特征是它的实践性。马克思主义哲学把实践的观点引入认识论，创立了辩证唯物主义认识论，实现了哲学的变革。'
    },
    {
      id: 1002,
      type: 'multiple',
      question: '马克思主义的科学内涵主要包括（）',
      options: [
        { id: 'A', content: '马克思主义是科学的世界观和方法论' },
        { id: 'B', content: '马克思主义是关于无产阶级和人类解放的学说' },
        { id: 'C', content: '马克思主义是指导无产阶级和人民群众进行革命和建设的行动指南' },
        { id: 'D', content: '马克思主义是不断发展的开放的理论体系' }
      ],
      answer: 'ABCD',
      analysis: '马克思主义的科学内涵主要包括：马克思主义是科学的世界观和方法论；马克思主义是关于无产阶级和人类解放的学说；马克思主义是指导无产阶级和人民群众进行革命和建设的行动指南；马克思主义是不断发展的开放的理论体系。'
    }
  ]
}

// 获取模拟数据
const getMockSubjects = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: mockData.subjects
      })
    }, 500)
  })
}

const getMockChapters = (subjectId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: mockData.chapters[subjectId] || []
      })
    }, 500)
  })
}

const getMockExercises = (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: {
          list: mockData.exercises,
          total: mockData.exercises.length
        }
      })
    }, 500)
  })
}

module.exports = {
  // 正式API
  verifyLicense,
  getSubjects,
  getSubjectDetail,
  getChapters,
  getChapterDetail,
  getExercises,
  submitExercise,
  getWrongExercises,
  getFavoriteExercises,
  addFavorite,
  removeFavorite,
  getProgress,
  updateProgress,
  
  // 模拟API
  getMockSubjects,
  getMockChapters,
  getMockExercises
} 