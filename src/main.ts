
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from 'pinia'
const app = createApp(App)
const pinia = createPinia()
app.use(router) // 必须注册路由
app.use(pinia)
app.mount('#app')