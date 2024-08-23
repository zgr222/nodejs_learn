// 导入jwt
const jwt = require('jsonwebtoken')

// 导入配置
const { tokenSecret } = require('../config/config')

module.exports = (req, res, next) => {
  // 获取token
  const token = req.headers?.authorization
  if (!token) {
    return res.json({
      code: 2001,
      msg: 'token缺失',
      data: null
    })
  }
  // 校验token
  jwt.verify(token, tokenSecret, (err, data) => {
    // 校验token是否正确
    if (err) {
      return res.json({
        code: 2002,
        msg: 'token错误',
        data: null
      })
    }
    // 可保存用户信息
    // req.user = data
    // 校验通过
    next()
  })
}