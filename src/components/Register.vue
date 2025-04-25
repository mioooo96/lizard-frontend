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
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';

  const router = useRouter()
  const username = ref('')
  const password = ref('')
  const confirmPassword = ref('')

  const handleRegister = async () => {
    // 简单前端验证
    if (!username.value || !password.value || !confirmPassword.value) {
      toast('请填写所有字段')
      return
    }
    const nameValidPattern = /^\w{4,16}$/
    const passValidPattern = /^\w{8,32}$/
    if (!nameValidPattern.test(username.value)) {
      toast('用户名只能包含字母、数字和常见字符')
      return
    }

    if (!passValidPattern.test(password.value)) {
      toast('密码只能包含字母、数字和常见字符')
      return
   }

    if (password.value !== confirmPassword.value) {
      toast('两次输入的密码不一致')
      return
    }
    try {
      const response = await axios.post('/api/user/register', {
      username: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    })
    if (response.data.code === 1) {
      toast('注册成功！',{autoClose: 1000})
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } else {
      toast(response.data.msg)
    }
    } catch (error) {
    console.error('注册请求失败:', error)
    toast('注册失败，请稍后重试！')
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
