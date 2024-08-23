import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getToken } from '@/utils/auth';
import router from '@/routes';

const service = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? '/api' : '',
  timeout: 20000
})

// 请求拦截，可在此处加token
service.interceptors.request.use(config => {
  if (localStorage.getItem('authToken')) {
    config.headers = {
      'Authorization': localStorage.getItem('authToken')
    }
  }
  return config
})

// 响应拦截，可在此处理状态码，数据返回
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 0) {
      if (res.code == 2001 || res.code == 2002) {
        ElMessageBox.confirm('登录过期，请重新登录', '提示', {
          confirmButtonText: '去登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.removeItem('token')
          router.push('/login')
        })
      } else {
        ElMessage.error(res.msg)
        return Promise.reject(response.data)
      }
    } else {
      return response.data?.data
    }
  },
  error => {
    ElMessage.error({
      message: error.message || '未知错误',
      duration: 2000
    })
    return Promise.reject(error)
  }
)

export default service