import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VueSetupExtend(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server:{
    proxy:{
      '/api': {
        target: 'http://47.122.116.174:8080', // 目标接口域名
        changeOrigin: true, // 是否跨域
        //rewrite:(path) => path.replace(/^\/api/, ''), // 重写接口
      },
    },
 },
})
