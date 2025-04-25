<template>
  <div class="login-container">
    <div class="login-card">
      <h2>删除账号</h2>
      <p class="warning-text">注意：删除账号后将不可恢复，请谨慎操作！</p>
      <form @submit.prevent="handleDeleteAccount">
        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="请输入密码"
            required
          />
        </div>
        <button type="submit" class="delete-button">确认删除</button>
      </form>
      <div class="login-tips">
        <router-link to="/">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: "DeleteAccount",
  setup() {
    const password = ref("");
    const router = useRouter();
    const handleDeleteAccount = async () => {
      if (!password.value) {
        toast("请输入密码！");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete("http://47.122.116.174:8080/api/user/deactivate", {
          headers: {
            Authorization: token,
          },
          data: {
            password: password.value,
          },
        });

        if (response.data.code === 1) {
          toast("账号已成功删除！", { autoClose: 1000 });
          localStorage.clear(); // 清除本地存储
          window.location.href = "/"; // 跳转到首页
        } else {
          toast(response.data.msg);
        }
      } catch (error) {
        console.error("删除账号请求失败:", error);
        toast("删除账号失败，请稍后重试！");
      }
    };

    return {
      password,
      handleDeleteAccount,
    };
  },
};
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.warning-text {
  color: #e74c3c;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1rem;
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

button.delete-button {
  background: #e74c3c;
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