<template>
  <div class="change-info">
    <h1>修改个人信息</h1>
    <div class="info-container">
      <!-- 头像 -->
      <div class="info-item avatar-item">
        <label>头像:</label>
        <div class="avatar-container">
          <img :src="user.avatar" alt="用户头像" class="avatar" />
          <input type="file" class="file-input" @change="handleAvatarChange" />
          <button class="file-btn" @click="triggerFileInput">选择文件</button>
        </div>
      </div>
      <div class="info-item">
        <label>用户 ID:</label>
        <span>{{ user.id }}</span> <!-- 用户 ID 通常不可修改 -->
      </div>
      <div class="info-item">
        <label>昵称:</label>
        <input v-model="user.nickname" type="text" class="info-input" @input="markAsModified" />
      </div>
      <div class="info-item">
        <label>用户名:</label>
        <input v-model="user.username" type="text" class="info-input" @input="markAsModified" />
      </div>
      <div class="info-item">
        <label>密码:</label>
        <div class="info-content">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="user.password"
            class="info-input"
            @input="markAsModified"
          />
          <button class="toggle-btn" @click="togglePassword">
            {{ showPassword ? '隐藏' : '显示' }}
          </button>
        </div>
      </div>
      <div class="info-item">
        <label>电话号码:</label>
        <div class="info-content">
          <input
            :type="showPhone ? 'text' : 'password'"
            v-model="user.phone"
            class="info-input"
            @input="markAsModified"
          />
          <button class="toggle-btn" @click="togglePhone">
            {{ showPhone ? '隐藏' : '显示' }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="isModified" class="save-btn-container">
      <button class="save-btn" @click="saveChanges">保存修改</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

// 模拟用户数据
const user = reactive({
  id: '12345',
  nickname: '小明',
  username: 'xiaoming',
  avatar: 'https://picx.zhimg.com/v2-e7dd8094bcac3702785d157792651690_r.jpg?source=2c26e567', // 替换为实际头像 URL
  password: '123456',
  phone: '123-456-7890',
});

// 控制密码和电话号码显示状态
const showPassword = ref(false);
const showPhone = ref(false);

// 标记是否有修改
const isModified = ref(false);

// 处理头像更改
const handleAvatarChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      user.avatar = reader.result as string; // 将头像更新为 Base64 数据
      markAsModified();
    };
    reader.readAsDataURL(file);
  }
};

// 触发文件选择器
const triggerFileInput = () => {
  const fileInput = document.querySelector('.file-input') as HTMLInputElement;
  fileInput.click();
};

// 切换密码显示状态
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// 切换电话号码显示状态
const togglePhone = () => {
  showPhone.value = !showPhone.value;
};

// 标记为已修改
const markAsModified = () => {
  isModified.value = true;
};

// 保存修改
const saveChanges = () => {
  console.log('保存的用户信息:', user);
  isModified.value = false; // 保存后重置修改状态
};
</script>

<style scoped>
.change-info {
  width: 100%;
  min-height: 100%; /* 确保内容至少占满视口高度 */
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

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap:10px; /* 调整头像与按钮的间距 */
}

.avatar {
  width: 120px; /* 调整头像尺寸 */
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.file-input {
  display: none; /* 隐藏原始文件选择器 */
}

.file-btn {
  padding: 8px 16px; /* 调整按钮尺寸 */
  background-color: #00aaff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px; /* 调整按钮字体大小 */
}

.file-btn:hover {
  background-color: #008ecc;
}

.info-input {
  flex: 0.2; /* 将宽度从 1 减小到 0.9 */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
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

.save-btn-container {
  margin-top: 30px; /* 添加额外的间距 */
  text-align: right; /* 按钮靠右对齐 */
}

.save-btn {
  padding: 10px 20px;
  background-color: #00aaff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.save-btn:hover {
  background-color: #008ecc;
}
</style>