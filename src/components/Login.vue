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
  
  const router = useRouter()
  const username = ref('')
  const password = ref('')
  
  const handleSubmit = () => {
    // 简单前端验证
    if (!username.value || !password.value) {
      alert('请输入用户名和密码')
      return
    }
    //-------------------------------------------------------
    /*             向后端查询数据判断用户是否存在             */
    //-------------------------------------------------------
    // 模拟登录成功
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('username', username.value)
    
    // 跳转回首页
    if(username.value == 'StudentName' && password.value == '123456789'){
      alert('登陆成功！')
      router.push('/')
    }else{
      alert('用户名或密码错误！！！')
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