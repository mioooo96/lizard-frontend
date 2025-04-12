<template>
  <div class="personal-info">
    <h1>个人信息</h1>
    <div class="info-container">
      <div class="info-item avatar-item">
        <label>头像:</label>
        <img :src="user.avatar" alt="用户头像" class="avatar" />
      </div>
      <div class="info-item">
        <label>用户 ID:</label>
        <span>{{ user.id }}</span>
      </div>
      <div class="info-item">
        <label>昵称:</label>
        <span>{{ user.nickname }}</span>
      </div>
      <div class="info-item">
        <label>用户名:</label>
        <span>{{ user.username }}</span>
      </div>
      <div class="info-item">
        <label>密码:</label>
        <div class="info-content">
          <span>{{ showPassword ? user.password : '******' }}</span>
          <button class="toggle-btn" @click="togglePassword">
            {{ showPassword ? '隐藏' : '显示' }}
          </button>
        </div>
      </div>
      <div class="info-item">
        <label>电话号码:</label>
        <div class="info-content">
          <span>{{ showPhone ? user.phone : '******' }}</span>
          <button class="toggle-btn" @click="togglePhone">
            {{ showPhone ? '隐藏' : '显示' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 模拟用户数据
const user = ref({
  id: '12345',
  nickname: '小明',
  username: 'xiaoming',
  avatar: 'https://picx.zhimg.com/v2-e7dd8094bcac3702785d157792651690_r.jpg?source=2c26e567', // 替换为实际头像 URL
  password: '123456', // 出于安全考虑，通常不会直接显示密码
  phone: '123-456-7890',
});

// 控制密码和电话号码显示状态
const showPassword = ref(false);
const showPhone = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const togglePhone = () => {
  showPhone.value = !showPhone.value;
};
</script>

<style scoped>
.personal-info {
  width: 100%;
  min-height: 80%; /* 确保内容至少占满视口高度 */
  padding: 20px 40px; /* 调整内边距，避免内容过于紧凑 */
  background: #f9f9f9; /* 浅灰色背景 */
  box-sizing: border-box;
  overflow: hidden; /* 防止滚动条出现 */
}

h1 {
  text-align: center;
  margin-bottom: 30px; /* 调整标题与内容的间距 */
  font-size: 28px; /* 调整标题字体大小 */
  font-weight: bold;
}

.info-container {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 调整行间距 */
}

.info-item {
  display: flex;
  align-items: center;
  gap: 15px; /* 调整标签与内容的间距 */
}

.avatar-item {
  align-items: flex-start; /* 使 "头像:" 位于顶部 */
}

label {
  font-weight: bold;
  font-size: 18px; /* 放大标签字体 */
  width: 120px; /* 调整标签宽度 */
}

.avatar {
  width: 120px; /* 调整头像尺寸 */
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.info-content {
  display: flex;
  align-items: center;
  gap: 10px; /* 调整内容与按钮的间距 */
}

.toggle-btn {
  padding: 8px 16px; /* 调整按钮尺寸 */
  background-color: #00aaff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px; /* 调整按钮字体大小 */
}

.toggle-btn:hover {
  background-color: #008ecc;
}
</style>