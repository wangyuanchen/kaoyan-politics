// 格式化时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 显示提示信息
const showToast = (title, icon = 'none') => {
  wx.showToast({
    title: title,
    icon: icon,
    duration: 2000
  })
}

// 显示加载中
const showLoading = (title = '加载中') => {
  wx.showLoading({
    title: title,
    mask: true
  })
}

// 隐藏加载中
const hideLoading = () => {
  wx.hideLoading()
}

// 显示模态对话框
const showModal = (title, content, showCancel = true) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: title,
      content: content,
      showCancel: showCancel,
      success(res) {
        if (res.confirm) {
          resolve(true)
        } else if (res.cancel) {
          resolve(false)
        }
      },
      fail() {
        reject(new Error('显示对话框失败'))
      }
    })
  })
}

// 生成随机字符串
const randomString = (length = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 检查是否有效的密钥
const isValidLicenseKey = (key) => {
  if (!key || typeof key !== 'string') {
    return false
  }
  
  // 简单的密钥格式验证
  const keyPattern = /^KYZ-[A-Z0-9]{12}$/
  return keyPattern.test(key)
}

// 加密函数（简单示例）
const encrypt = (text, key) => {
  // 实际应用中应使用更安全的加密算法
  let result = ''
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return btoa(result) // Base64编码
}

// 解密函数（简单示例）
const decrypt = (encoded, key) => {
  try {
    const text = atob(encoded) // Base64解码
    let result = ''
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))
    }
    return result
  } catch (e) {
    return ''
  }
}

module.exports = {
  formatTime,
  showToast,
  showLoading,
  hideLoading,
  showModal,
  randomString,
  isValidLicenseKey,
  encrypt,
  decrypt
} 