<template>
  <div class="wrapper">
    <div v-if="userInfo">
      欢迎您，尊敬的 {{ userInfo.userName }}
      <el-button type="primary" link class="mgl-20" @click="logout">退出</el-button>
    </div>
    <router-link v-else to="/login">用户登录</router-link>
    <br />
    <router-link to="/stu/list">学生信息</router-link>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus';

const router = useRouter()
const userInfo = ref(null)
onMounted(() => {
  userInfo.value = JSON.parse(localStorage.getItem('userInfo'))
})

const logout = () => {
  ElMessageBox.confirm('确认退出？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localStorage.removeItem('userInfo')
    localStorage.removeItem('authToken')
    router.push('/login')
  })
}

</script>
<style scoped lang='scss'>
.wrapper {
  padding: 20px;
}
</style>