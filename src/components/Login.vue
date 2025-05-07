<template>
    <div class="login-container">
      <div class="login-card">
        <h2>用户登录</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <input
              v-model="username"
              type="text"
              placeholder="用户名"
              required
            >
          </div>

          <div class="form-group">
            <input
              v-model="password"
              type="password"
              placeholder="密码"
              required
            >
          </div>

          <button type="submit">登录</button>

          <div class="login-tips">
            <router-link to="/register">没有账号？立即注册</router-link>
          </div>
        </form>
      </div>
    </div>
  </template>

  <script setup lang="ts" name="Login">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  const router = useRouter()
  const username = ref('')
  const password = ref('')

  const handleSubmit =  async () =>  {
    // 简单前端验证
    if (!username.value || !password.value) {
      toast('请输入用户名和密码',{autoClose: 1000})
      return
    }
    try {
    const response = await axios.post('/api/user/login', {
      username: username.value,
      password: password.value,
    })

    if (response.data.code === 1) {
      const token = response.headers['token']
      console.log('token:', token)
      if (token) {
        localStorage.setItem('token', token) // 存储 token
        const expirationTime = Date.now() + 2 * 60 * 60 * 1000; // 当前时间 + 2 小时
        localStorage.setItem('tokenExpiration', expirationTime.toString());
      }
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', username.value)
      localStorage.setItem('userid',response.data.data.id)
      toast('登录成功！',{autoClose: 1000})
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      toast(response.data.msg,{autoClose: 3000})
    }
  } catch (error) {
    console.error('登录请求失败:', error)
    toast('登录失败，请稍后重试！')
  }
  }
  </script>

  <style scoped>
  .login-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f7fa;
  }

  .login-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 400px;
  }

  h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  input {
    width: 94%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }

  button {
    width: 100%;
    padding: 0.8rem;
    background: #00aaff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
  }

  .login-tips {
    margin-top: 1rem;
    text-align: center;
  }

  a {
    color: #00aaff;
    text-decoration: none;
    font-size: 0.9rem;
  }
  </style>
