const express = require('express');
const fs = require("fs-extra");
 // multer 中间件，用于处理 multiple/form-data 类型的表单数据，主用于上传文件
const multer = require('multer');
const path = require('path');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '../uploads'); // 存放完整文件
const TMP_DIR = path.join(__dirname, '../uploads/tmp'); // 存放切片

// 确保上传目录存在
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// 使用 Multer 处理文件切片
const upload = multer({ dest: TMP_DIR });

// 🚀 **1. 处理上传的切片**
router.post('/upload', upload.single('chunk'), (req, res) => {
  const { filename, hash, index, totalChunks } = req.body;
  const chunkDir = path.join(TMP_DIR, hash); // 存放此文件的切片

  // 确保切片文件夹存在
  if (!fs.existsSync(chunkDir)) fs.mkdirSync(chunkDir, { recursive: true });

  // 将切片移动到临时文件夹
  const chunkPath = path.join(chunkDir, index);
  fs.renameSync(req.file.path, chunkPath);

  console.log(`Chunk ${index}/${totalChunks} uploaded for ${filename}`);
  res.json({ message: 'Chunk uploaded successfully', index });
});

// 🚀 **2. 合并切片**
router.post('/merge', (req, res) => {
  const { filename, hash, totalChunks } = req.body;
  const filePath = path.join(UPLOAD_DIR, filename);
  const chunkDir = path.join(TMP_DIR, hash);

  const writeStream = fs.createWriteStream(filePath);

  // 按顺序读取所有切片并合并
  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(chunkDir, i.toString());
    if (fs.existsSync(chunkPath)) {
      const chunk = fs.readFileSync(chunkPath);
      writeStream.write(chunk);
      fs.unlinkSync(chunkPath); // 删除已合并的切片
    } else {
      return res.status(400).json({ message: `Missing chunk ${i}` });
    }
  }

  writeStream.end();
  fs.rmdirSync(chunkDir); // 删除空文件夹

  console.log(`File merged: ${filename}`);
  res.json({ message: 'File merged successfully', filename });
});

// 🚀 **3. 秒传检测**
router.post('/check-file', (req, res) => {
  const { hash, filename } = req.body;
  const filePath = path.join(UPLOAD_DIR, filename);
  if (fs.existsSync(filePath)) {
    return res.json({ shouldUpload: false, message: 'File already exists' });
  }
  
  // 检查已上传的切片
  const chunkDir = path.join(TMP_DIR, hash);
  const uploadedChunks = fs.existsSync(chunkDir) ? fs.readdirSync(chunkDir) : [];
  res.json({ shouldUpload: true, uploadedChunks });
});

module.exports = router;