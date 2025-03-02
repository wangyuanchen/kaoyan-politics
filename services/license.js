// 密钥验证服务
const util = require('../utils/util.js')

// 密钥前缀
const LICENSE_PREFIX = 'KYZ-'

// 密钥长度（不包括前缀）
const LICENSE_KEY_LENGTH = 12

// 密钥字符集
const LICENSE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

// 生成密钥
const generateLicenseKey = () => {
  let key = LICENSE_PREFIX
  for (let i = 0; i < LICENSE_KEY_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * LICENSE_CHARS.length)
    key += LICENSE_CHARS.charAt(randomIndex)
  }
  return key
}

// 验证密钥格式
const validateLicenseFormat = (licenseKey) => {
  if (!licenseKey || typeof licenseKey !== 'string') {
    return false
  }
  
  // 检查前缀
  if (!licenseKey.startsWith(LICENSE_PREFIX)) {
    return false
  }
  
  // 检查长度
  if (licenseKey.length !== LICENSE_PREFIX.length + LICENSE_KEY_LENGTH) {
    return false
  }
  
  // 检查字符是否在许可的字符集中
  const keyPart = licenseKey.substring(LICENSE_PREFIX.length)
  for (let i = 0; i < keyPart.length; i++) {
    if (LICENSE_CHARS.indexOf(keyPart.charAt(i)) === -1) {
      return false
    }
  }
  
  return true
}

// 验证密钥有效性（本地简单验证）
const verifyLicenseKey = (licenseKey) => {
  // 首先验证格式
  if (!validateLicenseFormat(licenseKey)) {
    return {
      valid: false,
      message: '密钥格式不正确'
    }
  }
  
  // 这里可以添加更复杂的验证逻辑
  // 例如：校验和、特定位置的字符规则等
  
  // 简单示例：检查是否包含特定字符组合
  const keyPart = licenseKey.substring(LICENSE_PREFIX.length)
  
  // 示例：检查是否包含至少一个'A'和一个'1'
  if (!keyPart.includes('A') || !keyPart.includes('1')) {
    return {
      valid: false,
      message: '密钥无效'
    }
  }
  
  return {
    valid: true,
    message: '密钥验证成功'
  }
}

// 保存密钥到本地存储
const saveLicenseKey = (licenseKey) => {
  try {
    wx.setStorageSync('licenseKey', licenseKey)
    return true
  } catch (e) {
    console.error('保存密钥失败', e)
    return false
  }
}

// 从本地存储获取密钥
const getLicenseKey = () => {
  try {
    return wx.getStorageSync('licenseKey')
  } catch (e) {
    console.error('获取密钥失败', e)
    return ''
  }
}

// 清除本地存储的密钥
const clearLicenseKey = () => {
  try {
    wx.removeStorageSync('licenseKey')
    return true
  } catch (e) {
    console.error('清除密钥失败', e)
    return false
  }
}

// 检查是否有有效的密钥
const hasValidLicense = () => {
  const licenseKey = getLicenseKey()
  if (!licenseKey) {
    return false
  }
  
  const result = verifyLicenseKey(licenseKey)
  return result.valid
}

// 模拟密钥验证（用于演示）
const mockVerifyLicense = (licenseKey) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = verifyLicenseKey(licenseKey)
      
      if (result.valid) {
        // 保存有效的密钥
        saveLicenseKey(licenseKey)
      }
      
      resolve({
        code: result.valid ? 0 : -1,
        message: result.message,
        data: {
          valid: result.valid,
          licenseKey: result.valid ? licenseKey : null
        }
      })
    }, 1000)
  })
}

// 模拟有效的密钥列表（用于演示）
const validLicenseKeys = [
  'KYZ-A1B2C3D4E5F6',
  'KYZ-12A45B78C90D',
  'KYZ-ABCDEF123456',
  'KYZ-A1B2C3D4E5F6'
]

// 检查密钥是否在有效列表中（用于演示）
const isInValidList = (licenseKey) => {
  return validLicenseKeys.includes(licenseKey)
}

module.exports = {
  generateLicenseKey,
  validateLicenseFormat,
  verifyLicenseKey,
  saveLicenseKey,
  getLicenseKey,
  clearLicenseKey,
  hasValidLicense,
  mockVerifyLicense,
  isInValidList
} 