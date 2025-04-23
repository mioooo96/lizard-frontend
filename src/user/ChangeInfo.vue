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
        <label>昵称:</label>
        <input v-model="user.nickname" type="text" class="info-input" @input="markAsModified" />
      </div>
      <div class="info-item">
        <label>电话号码:</label>
        <input v-model="user.phone" type="text" class="info-input" @input="markAsModified" />
      </div>
    </div>
    <div v-if="isModified" class="save-btn-container">
      <button class="save-btn" @click="saveChanges">保存修改</button>
    </div>

    <h2>修改密码</h2>
    <div class="info-container">
      <div class="info-item">
        <label>旧密码:</label>
        <input v-model="passwordForm.oldPassword" type="password" class="info-input" />
      </div>
      <div class="info-item">
        <label>新密码:</label>
        <input v-model="passwordForm.newPassword" type="password" class="info-input" />
      </div>
      <div class="info-item">
        <label>确认新密码:</label>
        <input v-model="passwordForm.confirmNewPassword" type="password" class="info-input" />
      </div>
    </div>
    <div class="save-btn-container">
      <button class="save-btn" @click="changePassword">修改密码</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

// 模拟用户数据
const user = reactive({
  id: '',
  nickname: '',
  username: '',
  avatar: '',
  phone: '',
  password: '******', // 密码通常不会通过接口返回，保持隐藏
});

// 控制密码和电话号码显示状态
const showPassword = ref(false);
const showPhone = ref(false);

// 标记是否有修改
const isModified = ref(false);

// 修改密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
});

// 获取 token
  const token = localStorage.getItem('token');
if (!token) {
 // alert('用户未登录，请先登录！');
 // throw new Error('用户未登录');
}

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:4523/m1/6138343-5830155-default/user/current', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.code === 1) {
      const data = response.data.data;
      user.id = data.id;
      user.nickname = data.nickname || '未设置昵称';
      user.username = data.username;
      user.avatar = data.avatar || 'https://via.placeholder.com/120'; // 默认头像
      user.phone = data.phone || '未绑定手机号';
    } else {
      //alert(response.data.msg || '获取用户信息失败！');
    }
  } catch (error) {
  //  console.error('获取用户信息失败:', error);
  //  alert('获取用户信息失败，请稍后重试！');//当前可能随机产生失败信息,先不警告
  }
};

// 处理头像更改
const handleAvatarChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      user.avatar = reader.result as string; // 将 Base64 数据赋值给 avatar
      markAsModified();
    };
    reader.readAsDataURL(file); // 将文件读取为 Base64 格式
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

// 保存用户信息
const saveChanges = async () => {
  try {
    const formData = new FormData();
    formData.append('nickname', user.nickname);
    formData.append('phone', user.phone);

    if (user.avatar && typeof user.avatar !== 'string') {
      formData.append('file', user.avatar as File);
    }

    const response = await axios.put('http://127.0.0.1:4523/m1/6138343-5830155-default/user/info', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.code === 1) {
      alert('用户信息修改成功！');
      isModified.value = false; // 重置修改状态
    } else {
      alert(response.data.msg || '用户信息修改失败！');
    }
  } catch (error) {
    console.error('用户信息修改失败:', error);
    alert('用户信息修改失败，请稍后重试！');
  }
};

// 修改密码
const changePassword = async () => {
  if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
    alert('请填写完整的密码信息！');
    return;
  }

  if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
    alert('新密码与确认密码不一致！');
    return;
  }

  try {
    const response = await axios.put('http://127.0.0.1:4523/m1/6138343-5830155-default/user/password', {
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
      confirmNewPassword: passwordForm.confirmNewPassword,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.code === 1) {
      alert('密码修改成功！');
      passwordForm.oldPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmNewPassword = '';
    } else {
      alert(response.data.msg || '密码修改失败！');
    }
  } catch (error) {
    console.error('密码修改失败:', error);
    alert('密码修改失败，请稍后重试！');
  }
};

// 在组件加载时获取用户信息
onMounted(() => {
  fetchUserInfo();
});
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

h2 {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 24px;
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
