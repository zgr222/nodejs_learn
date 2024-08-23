const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const UserModel = require('../../models/UserModel')
const { tokenExpiredTime, tokenSecret } = require('../../config/config')

// 注册
router.post('/regist', async (req, res) => {
  const { userName } = req.body
  const data = await UserModel.findOne({ userName })
  if (data) {
    return res.json({
      code: 1001,
      data: null,
      msg: '账号已存在'
    })
  }
  UserModel.create({
    ...req.body
  }).then(() => {
    res.json({
      code: 0,
      msg: '注册成功',
      data: true
    })
  }).catch(() => {
    res.json({
      code: 1001,
      msg: '注册失败',
      data: false
    })
  })
})

// 登录
router.post('/login', async (req, res) => {
  const { userName, password } = req.body
  const user = await UserModel.findOne({ userName })
  if (!user || user.password !== password) {
    return res.json({
      code: 1001,
      data: null,
      msg: '账号或密码错误'
    })
  }
  // 返回用户信息和token
  const token = jwt.sign({
    userName,
    _id: user._id
  }, tokenSecret, {
    expiresIn: tokenExpiredTime // 单位 s
  })
  res.json({
    code: 0,
    msg: '登录成功',
    data: {
      accessToken: token,
      userName: user.userName,
      _id: user._id
    }
  })
})

module.exports = router