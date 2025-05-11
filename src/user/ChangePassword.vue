<template>
  <div class="login-container">
    <div class="login-card">
      <h2>修改密码</h2>
      <form @submit.prevent="handleChangePassword">
        <div class="form-group">
          <input
            id="oldPassword"
            type="password"
            v-model="oldPassword"
            placeholder="请输入旧密码"
            required
          />
        </div>
        <div class="form-group">
          <input
            id="newPassword"
            type="password"
            v-model="newPassword"
            placeholder="请输入新密码"
            required
          />
        </div>
        <div class="form-group">
          <input
            id="confirmPassword"
            type="password"
            v-model="confirmPassword"
            placeholder="请再次输入新密码"
            required
          />
        </div>
        <button type="submit">提交修改</button>
      </form>
      <div class="login-tips">
        <router-link to="/">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: "ChangePassword",
  setup() {
    const oldPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const router = useRouter();

    const handleChangePassword = async () => {
      if (newPassword.value !== confirmPassword.value) {
        toast("两次输入的新密码不一致！");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          "/api/user/password",
          {
            oldPassword: oldPassword.value,
            newPassword: newPassword.value,
            confirmNewPassword: confirmPassword.value,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log("修改密码响应:", response.data);

        if (response.data.code === 1) {
          toast("密码修改成功！", { autoClose: 1000 });
          oldPassword.value = "";
          newPassword.value = "";
          confirmPassword.value = "";
          setTimeout(() => {
            router.push('/');
          }, 1000);
        } else {
          toast(response.data.msg);
        }
      } catch (error) {
        console.error("修改密码请求失败:", error);
        toast("修改密码失败，请稍后重试！");
      }
    };

    return {
      oldPassword,
      newPassword,
      confirmPassword,
      handleChangePassword,
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
