<template>
  <div class="wrapper">
    <div class="container">
      <div class="content">
        <h2>用户登录</h2>
        <el-form ref="formRef" :model="formModel" :rules="rules">
          <el-form-item prop="userName">
            <el-input
              v-model="formModel.userName"
              placeholder="请输入账号"
              prefix-icon="User"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formModel.password"
              placeholder="请输入密码"
              type="password"
              show-password
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="text-right">
          <el-button type="primary" link @click="router.push('/register')">注册</el-button>
        </div>
        <div class="flex-center mgt-10">
          <el-button @click="router.replace('/')">返回</el-button>
          <el-button type="primary" @click="onSubmit">登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import md5 from 'md5';
import { login } from '@/api/user';
import { ElMessage } from 'element-plus';
import { setToken } from '@/utils/auth';

const router = useRouter()

const rules = reactive({
  userName: [{ required: true, message: '请输入账号' }],
  password: [{ required: true, message: '请输入密码' }]
})

const formRef = ref()

const formModel = ref({
  userName: '',
  password: ''
})

const onSubmit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      const params = {
        ...formModel.value,
        password: md5(formModel.value.password)
      }
      login(params).then(res => {
        if (res) {
          localStorage.setItem('userInfo', JSON.stringify(res))
          // setToken(res.accessToken)
          localStorage.setItem('authToken', res.accessToken)
          ElMessage.success('登录成功')
          router.replace('/')
        }
      })
    }
  })
}

onMounted(() => {
})

</script>
<style scoped lang='scss'>
.wrapper {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
  position: relative;
}
.container {
  height: 250px;
  width: 400px;
  background: #fff;
  position: absolute;
  left: calc(50% - 200px);
  top: calc(50% - 300px);
  border-radius: 10px;
  padding: 20px;
}
</style>