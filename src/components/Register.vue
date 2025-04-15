<template>
    <div class="register-container">
      <div class="register-card">
        <h2>用户注册</h2>
        <form @submit.prevent="handleRegister">
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
  
          <div class="form-group">
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="确认密码"
              required
            >
          </div>
  
          <button type="submit">注册</button>
  
          <div class="register-tips">
            <router-link to="/login">已有账号？立即登录</router-link>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts" name="Register">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const router = useRouter()
  const username = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  
  const handleRegister = async () => {
    // 简单前端验证
    if (!username.value || !password.value || !confirmPassword.value) {
      alert('请填写所有字段')
      return
    }
    const validPattern = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/
    if (!validPattern.test(username.value)) {
      alert('用户名只能包含字母、数字和常见字符')
      return
    }

    if (!validPattern.test(password.value)) {
      alert('密码只能包含字母、数字和常见字符')
      return
   }
  
    if (password.value !== confirmPassword.value) {
      alert('两次输入的密码不一致')
      return
    }
    /*
    // 模拟注册成功
    localStorage.setItem('username', username.value)
    localStorage.setItem('password', password.value)
    localStorage.setItem('isLoggedIn', 'true')
    alert('注册成功！请登录')
  
    // 跳转到登录页面
    router.push('/')
    */
    try {
    const response = await axios.post('http://127.0.0.1:4523/m1/6138343-5830155-default/user/register', {
      username: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    })
    if (response.data.code === 1) {
      const token = response.headers['token']
      if (token) {
        localStorage.setItem('token', token) // 存储 token
      }
      alert('注册成功！')
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', username.value)
      router.push('/')
    } else {
      alert(response.data.message || '注册失败！')
    }
    } catch (error) {
    console.error('注册请求失败:', error)
    alert('注册失败，请稍后重试！')
   }
  }
  </script>
  
  <style scoped>
  .register-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f7fa;
  }
  
  .register-card {
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
    width: 100%;
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
  
  .register-tips {
    margin-top: 1rem;
    text-align: center;
  }
  
  a {
    color: #00aaff;
    text-decoration: none;
    font-size: 0.9rem;
  }
  </style>