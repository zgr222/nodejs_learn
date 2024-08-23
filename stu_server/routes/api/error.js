const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const SourceMap = require('source-map')

router.post('/reportVueError', async (req, res) => {
  const urlParams = req.body
  console.log('收到Vue错误报告', urlParams);

  const stack = urlParams.error.stack
  // 获取文件名
  const fileName = path.basename(stack.url)
  console.log('find... :>> ', stack.url, fileName, __dirname);
  // 查找map文件
  const filePath = path.join(__dirname, 'uploads', fileName + '.map')
  const readFile = function(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          console.log('readFileErr', err);
          return reject(err)
        }
        resolve(JSON.parse(data))
      })
    })
  }

  async function searchSource({ filePath, line, column }) {
    const rawSourceMap = await readFile(filePath)
    const consumer = await new SourceMap.SourceMapConsumer(rawSourceMap)
    const res = consumer.originalPositionFor({ line, column })

    consumer.destory()
    return res
  }

  let sourceMapParseReult = ''
  try {
    // 解析sourceMap结果
    sourceMapParseReult = await searchSource({ filePath, line: stack.line, column: stack.column })
  } catch (error) {
    sourceMapParseReult = error
  }
  console.log('解析结果', sourceMapParseReult);
  res.json({
    code: 0,
    msg: '错误上报成功',
    data: true
  })
  
})

module.exports = router