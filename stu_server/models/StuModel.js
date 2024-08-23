// 导入mongoose
const mongoose = require('mongoose')

// 创建文档的结构对象
// 设置集合中文档的属性以及属性值
const StuSchema = new mongoose.Schema({
  // 名称
  name: {
    type: String,
    required: true
  },
  // 性别
  sex: {
    type: Number,
    enum: [0, 1]
  },
  // 出生年月
  birthday: String,
  // 所处班级
  class: String,
  // 家庭住址
  address: String,
  // 创建时间
  createDate: String
})

// 创建模型对象
const StuModel = mongoose.model('stu', StuSchema)

module.exports = StuModel