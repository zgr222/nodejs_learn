// 导入mongoose
const mongoose = require('mongoose')

// 创建文档的结构对象
// 设置集合中文档的属性以及属性值
const UserSchema = new mongoose.Schema({
  // 账号
  userName: {
    type: String,
    required: true
  },
  // 密码
  password: {
    type: String,
    required: true
  },
})

// 创建模型对象
const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel