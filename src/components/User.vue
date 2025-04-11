<template>
  <div class="container">
    <nav class="nav">
      <div class="logo">
        <h1>西易平台</h1>
      </div>
      <div class="nav-buttons">
        <router-link to="/" class="nav-button">回到首页</router-link>
        <button class="nav-button logout" @click="handleLogout">退出登录</button>
      </div>
    </nav>
    <div class="profile-container">
      <div class="function-navigation">
        <div class="title">
          <p>个人中心</p>
        </div>
        <div>
          <router-link to="/user/personalInfo" active-class="select">个人信息</router-link>
          <router-link to="/user/changeInfo" active-class="select">修改个人信息</router-link>
          <router-link to="/user/productRecord" active-class="select">帖子记录</router-link>
          <router-link to="/user/transactionRecord" active-class="select">交易记录</router-link>
        </div>
      </div>
      <div class="router-view-container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
const handleLogout = () => {
  // 这里添加退出登录的逻辑
  console.log('用户点击了退出登录');
  // 实际应用中可能需要：
  // 1. 清除用户token
  // 2. 跳转到登录页
  // localStorage.removeItem('token');
  // router.push('/login');
};
</script>

<style scoped>

.container {
  width: 100%;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  overflow: auto;
}

.profile-container {
  width: 100%;
  display: flex;
  height: calc(100vh - 100px);
  overflow: hidden;
  margin-top: 10px;
}


.function-navigation {
  width: 200px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  border-radius: 5px;
  border: 1px solid rgba(232, 220, 220, 0.885);
  background-color: rgb(248, 253, 246);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.function-navigation .title {
  text-align: center;
  font-weight: 500;
  color: rgb(138, 127, 127);
  font-size: 30px;
  border-bottom: 1px solid rgba(232, 220, 220, 0.885);
  padding: 15px 0;
  margin: 0;
}

.function-navigation a {
  display: block;
  text-align: center;
  height: 80px;
  line-height: 80px;
  border-bottom: 1px solid rgba(232, 220, 220, 0.885);
  background-color: rgb(248, 253, 246);
  text-decoration: none;
  color: rgb(102, 102, 102);
  font-size: 18px;
  letter-spacing: 5px;
  transition: all 0.3s ease;
}

.function-navigation a.select {
  background-color: #64967E;
  color: #ffc268;
  font-weight: 900;
  text-shadow: 0 0 1px black;
  font-family: 微软雅黑;
}

.function-navigation a:hover {
  background-color: rgb(238, 241, 241);
  transform: translateX(5px);
}


.router-view-container {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  background-color: white;
  border: 1px solid rgba(232, 220, 220, 0.885);
  border-radius: 5px;
  margin-left: 20px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}


.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  

  background: linear-gradient(60deg, 
    rgba(255,255,0,0.8), 
    rgba(0,255,255,0.8), 
    rgba(255,165,0,0.8));
  background-size: 300% 300%;
  animation: GradientBackground 8s ease infinite;
}


@keyframes GradientBackground {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}


.nav::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 0%, transparent 40%);
  z-index: -1;
  animation: Pulse 12s ease infinite;
}

@keyframes Pulse {
  0% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.05); }
  100% { opacity: 0.8; transform: scale(1); }
}


.logo h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  position: relative;
  text-shadow: 
    0 2px 4px rgba(0,0,0,0.1),
    0 0 10px rgba(255,255,255,0.3);
  animation: TextGlow 3s ease-in-out infinite alternate;
}

@keyframes TextGlow {
  from { text-shadow: 0 0 5px rgba(255,255,255,0.5); }
  to { text-shadow: 0 0 15px rgba(255,255,255,0.8); }
}

.nav-buttons {
  display: flex;
  gap: 15px;
}

.nav-button {
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: #2c3e50;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.nav-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: all 0.6s ease;
}

.nav-button:hover {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.nav-button:hover::after {
  left: 100%;
}

.logout {
  background-color: #ff6b6b;
  color: white;
  border: none;
}

.logout:hover {
  background-color: #ff5252;
}
</style>