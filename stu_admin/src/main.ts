import '../styles/index.scss'
import App from './App.vue'
import router from './routes';
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import { UseVueError, UseWindowError } from './hooks/UseError.js';

const app = createApp(App)

UseWindowError()
UseVueError(app)
// app.config.errorHandler = (err, vm, info) => {
//   console.log('err :>> ', err);
//   console.log('vm :>> ', vm);
//   console.log('info :>> ', info);
// }


// 全局引用elemen-plus icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(ElementPlus)
app.mount('#app')
