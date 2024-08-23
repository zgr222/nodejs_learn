/**
 * 连接mongodb 数据库
 */
module.exports = function() {
  return new Promise((resolve, reject) => {
    const mongoose = require('mongoose')

    // 导入配置
    const { DBHOST, DBNAME, DBPORT } = require('../config/config')

    // 连接 mongodb 服务
    mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`)

    // 连接成功
    mongoose.connection.once('open', () => {
      resolve()
    })

    // 连接失败
    mongoose.connection.on('error', () => {
      reject()
    })

    mongoose.connection.on('close', () => {
      console.log('连接关闭 :>> ');
    })
  })
}