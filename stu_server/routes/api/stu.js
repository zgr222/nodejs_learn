const express = require('express')
const router = express.Router()

const StuModel = require('../../models/StuModel')
const moment = require('moment')
const { regFn } = require('../../utils')

// 导入中间件
const checkTokenMiddleware = require('../../middlewares/checkToken')

// 学生列表
router.post('/list', checkTokenMiddleware, async (req, res) => {

  const total = await StuModel.countDocuments(regFn(req, ['name', 'sex']))
  const { pageSize, pageNum } = req.body
  const skip = (pageNum - 1) * pageSize
  // console.log('total :>> ', StuModel.count());
  // 获取学生集合信息
  StuModel.find(regFn(req, ['name', 'sex']))
  .limit(pageSize)
  .skip(skip)
  .sort({ createDate: -1 })
  .then((response) => {
    res.json({
      code: 0,
      msg: '读取成功',
      data: {
        total: total,
        list: response,
        pageNum,
        pageSize
      }
    })
  }).catch(() => {
    res.json({
      code: 1001,
      msg: '读取失败',
      data: false
    })
  })
})

// 新增学生
router.post('/add', checkTokenMiddleware, (req, res) => {
  // 插入数据库
  StuModel.create({
    ...req.body,
    birthday: moment(req.body.birthday).format('YYYY-MM-DD'),
    createDate: moment().format('YYYY-MM-DD HH:mm:ss')
  }).then(data => {
    res.json({
      code: 0,
      msg: '保存成功',
      data: true
    })
  }).catch(err => {
    res.json({
      code: 1001,
      msg: '保存失败',
      data: false
    })
  })
})

// 修改学生信息
router.post('/update', checkTokenMiddleware, (req, res) => {
  const { _id } = req.body 
  if (!_id) {
    return res.json({
      code: 1001,
      msg: '学生id不能为空',
      data: false
    })
  }
  StuModel.updateOne({_id: req.body._id}, { ...req.body }).then(() => {
    res.json({
      code: 0,
      msg: '保存成功',
      data: true
    })
  }).catch(() => {
    res.json({
      code: 1001,
      msg: '保存失败',
      data: false
    })
  })
})

// 删除学生
router.delete('/delete/:id', checkTokenMiddleware, (req, res) => {
  let id = req.params.id
  StuModel.deleteOne({_id: id}).then(() => {
    res.json({
      code: 0,
      msg: '删除成功',
      data: true
    })
  }).catch(() => {
    res.json({
      code: 1001,
      msg: '删除失败',
      data: false
    })
  })
})

module.exports = router