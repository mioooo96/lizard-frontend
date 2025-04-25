
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from 'pinia'
import 'vue3-toastify/dist/index.css';
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';

const app = createApp(App)
const pinia = createPinia()
app.use(router) // 必须注册路由
app.use(pinia)
app.mount('#app')
app.use(Vue3Toastify, {
    autoClose: 3000,
  } as ToastContainerOptions);