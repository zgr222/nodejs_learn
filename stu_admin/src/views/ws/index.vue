<template>
  <div>
    <h1>WebSocket Chat</h1>
    <button @click="sendMessage">Send Message</button>
    <ul>
        <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
    </ul>
  </div>
</template>

<script setup>

const messages = ref([])
let ws;
let reconnectTimer = null; // 记录重连定时器
let reconnectAttempts = 0; // 记录重连次数

// **创建 WebSocket 连接**
const connectWebSocket = () => {
  if (ws && ws.readyState === WebSocket.OPEN) return; // 避免重复连接

  ws = new WebSocket('ws://localhost:8848');

  ws.open = () => {
    console.log('Connected to WebSocket server');
    reconnectAttempts = 0; // 连接成功后重置重连次数
  }

  ws.onmessage = (event) => {
    if (event.data === 'ping') {
      console.log('get server ping check message...');
      ws.send(JSON.stringify({ data: 'pong' })); // 心跳检测，服务器 ping，客户端返回 pong
    } else {
      messages.value.push(event.data);
    }
  }

  ws.onclose = () => {
    console.log('WebSocket closed, attempting to reconnect...');
    attemptReconnect(); // 连接关闭时，尝试重连
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    ws.close(); // 发生错误时主动关闭连接，触发 `onclose` 进行重连
  };
}

// **尝试重连**
const attemptReconnect = () => {
  if (reconnectTimer) return; // 避免重复触发
  if (reconnectAttempts >= 5) {
    console.error('Max reconnect attempts reached, stopping reconnection.');
    return; // 限制最大重连次数，防止无限重连
  }

  reconnectTimer = setTimeout(() => {
    console.log(`Reconnecting... attempt ${reconnectAttempts + 1}`);
    reconnectAttempts++;
    connectWebSocket();
    reconnectTimer = null; // 清除定时器标记
  }, 3000); // 3 秒后尝试重连
};

onMounted(() => {
  connectWebSocket()
})
onBeforeUnmount(() => {
  if (ws) ws.close();
  if (reconnectTimer) clearTimeout(reconnectTimer);
});

const sendMessage = () => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ data: 'Hello from Vue!' }));
  }
};
</script>

<style scoped>

</style>