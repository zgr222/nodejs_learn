<template>
  <div>
    <input type="file" @change="handleFileChange">
    <progress :value="progress" max="100"></progress>
    <p>{{ progress.toFixed(2) }}% Uploaded</p>
    <button @click="pauseUpload($event)" :disabled="isPaused || !file">Pause</button>
    <button @click="resumeUpload" :disabled="!isPaused || !file">Resume</button>
    <button @click="cancelUpload" :disabled="!file">Cancel</button>
  </div>
</template>

<script setup>
import axios from 'axios';

const file = ref(null)
const progress = ref(0)
let isPaused = ref(false)
const uploadQueue = ref([]);
const currentChunkIndex = ref(0);
let controller = null;
let uploadedChunksList = [];

const chunkSize = 2 * 1024 * 1024; // 2MB
let totalChunks = 0;

const updateProgress = (index) => {
  progress.value = ((index + 1) / totalChunks) * 100;
}
const calculateHash = async (file) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const handleFileChange = async (e) => {
  file.value = e.target.files[0]
  if (!file.value) return;

  totalChunks = Math.ceil(file.value.size / chunkSize);
  const fileHash = await calculateHash(file.value);

  // 1️⃣ **秒传检查**
  const checkResponse = await axios.post('http://localhost:3000/upload/check-file', {
    hash: fileHash,
    filename: file.value.name
  });
  const { shouldUpload, uploadedChunks } = checkResponse.data;
  uploadedChunksList = uploadedChunks;

  if (!shouldUpload) {
    progress.value = 100;
    alert('秒传成功，无需上传');
    return;
  }

  // 2️⃣ **开始上传切片**
  for (let i = 0; i < totalChunks; i++) {
    if (uploadedChunksList.includes(i.toString())) {
      console.log(`Chunk ${i} already uploaded, skipping...`);
      updateProgress(i);
      continue;
    }

    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.value.size);
    const chunk = file.value.slice(start, end);

    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('filename', file.value.name);
    formData.append('hash', fileHash);
    formData.append('index', i);
    formData.append('totalChunks', totalChunks);

    controller = new AbortController();
    const signal = controller.signal;

    uploadQueue.value.push({ index: i, signal });

    try {
      await axios.post('http://localhost:3000/upload/upload', formData, {
        signal,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Upload aborted');
      } else {
        console.error('Upload error:', err);
      }
    }

    if (isPaused.value) {
      break; // 暂停
    }

    uploadedChunksList.push(i.toString());
    updateProgress(i);
  }

  // **合并切片**
  if (!isPaused.value) {
    await axios.post('http://localhost:3000/upload/merge', {
      filename: file.value.name,
      hash: fileHash,
      totalChunks
    });

    alert('Upload complete!');
  }
}
// 暂停上传
const pauseUpload = (event) => {
  event.preventDefault(); // 阻止浏览器默认行为
  if (controller) {
    controller.abort(); // 停止当前请求
    isPaused.value = true;
    console.log('Upload paused');
  }
}

// 恢复上传
const resumeUpload = () => {
  isPaused.value = false;
  handleFileChange({ target: { files: [file.value] } }); // 重新启动上传
}

// 取消上传
const cancelUpload = () => {
  isPaused.value = true;
  progress.value = 0;
  uploadedChunks = [];
  alert('Upload cancelled');
}
</script>

<style lang="scss" scoped></style>