<template>
  <div class="create-post">
    <h1>创建帖子</h1>
    <form @submit.prevent="submitPost" class="form-container">
      <div class="form-group">
        <label for="title">标题:</label>
        <input type="text" v-model="post.title" placeholder="请输入标题" />
      </div>
      <div class="form-group">
        <label for="images">上传图片:</label>
        <div class="image-container">
          <div v-for="(image, index) in post.images" :key="index" class="image-wrapper">
            <div class="image-preview">
              <img v-if="imagePreviews[index]" :src="imagePreviews[index]" alt="预览图" />
              <button type="button" class="delete-btn" @click="removeImage(index)">×</button>
            </div>
          </div>
          <!-- 添加图片按钮 -->
          <div class="add-image-wrapper" @click="triggerFileInput">
            <img src="/public/add-icon.png" alt="添加图片" class="add-image-icon" />
          </div>
          <!-- 隐藏的文件选择框 -->
          <input
            type="file"
            ref="fileInput"
            @change="handleAddImage"
            accept="image/*"
            style="display: none;"
          />
        </div>
      </div>
      <div class="form-group">
        <label for="type">类型:</label>
        <select v-model="post.type" required>
          <option value=null disabled>请选择类型</option>
          <option value="0">买</option>
          <option value="1">卖</option>
          <option value="2">租</option>
          <option value="3">借</option>
        </select>
      </div>
      <div class="form-group">
        <label for="price">预期价格:</label>
        <input type="number" v-model="post.price" placeholder="请输入价格"/>
      </div>
      <div class="form-group">
        <label for="content">内容:</label>
        <textarea v-model="post.content" placeholder="请输入内容"></textarea>
      </div>
      <button type="submit" class="submit-btn">提交帖子</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const router = useRouter(); // 获取路由实例

const post = ref({
  title: '',
  content: '',
  type: null as number | null,
  price: 0,
  images: [] as File[],
});

const imagePreviews = ref<string[]>([]); // 存储图片预览的 URL
const fileInput = ref<HTMLInputElement | null>(null); // 引用隐藏的文件输入框

const triggerFileInput = () => {
  // 触发隐藏的文件选择框
  fileInput.value?.click();
};

const handleAddImage = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    // 添加图片文件
    post.value.images.push(target.files[0]);

    // 更新图片预览
    imagePreviews.value.push(URL.createObjectURL(target.files[0]));
  }
};

const removeImage = (index: number) => {
  // 删除指定索引的图片
  post.value.images.splice(index, 1);
  imagePreviews.value.splice(index, 1); // 同时删除对应的预览图
};

const submitPost = async () => {
  // 检查必填字段
  if (!post.value.title.trim()) {
    toast.error('标题不能为空！');
    return;
  }
  if (post.value.images.length === 0) {
    toast.error('请至少上传一张图片！');
    return;
  }
  if (!post.value.type) {
    toast.error('请选择类型！');
    return;
  }
  if (!post.value.price) {
    toast.error('预期价格不能为零！');
    return;
  }
  if (!post.value.content.trim()) {
    toast.error('内容不能为空！');
    return;
  }



  const formData = new FormData();
  formData.append('title', post.value.title);
  formData.append('content', post.value.content);
  formData.append('type', post.value.type.toString());
  formData.append('price', post.value.price.toString());

  // 上传第一张图片
  if (post.value.images.length > 0 && post.value.images[0]) {
    formData.append('file', post.value.images[0]);
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('用户未登录，请先登录！');
      return;
    }

    // 调用 /api/post/create 接口
    const response = await axios.post('/api/post/create', formData, {
      headers: {
        Authorization: token,
      },
    });

    if (response.data.code === 1) {
      toast.success('帖子创建成功！帖子ID: ' + response.data.data);

      // 上传剩余图片
      const postId = response.data.data;
      await uploadAdditionalImages(postId);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待 1 秒
      // 跳转回 Home 页面
      router.push('/');
    } else {
      toast.error('创建帖子失败: ' + response.data.msg);
    }
  } catch (error) {
    toast.error('提交失败，请稍后重试！');
  }
};

// 上传多余的图片
const uploadAdditionalImages = async (postId: number) => {
  const token = localStorage.getItem('token');
  if (!token) return;

  for (let i = 1; i < post.value.images.length; i++) {
    const image = post.value.images[i];
    if (!image) continue;

    const formData = new FormData();
    formData.append('postId', postId.toString());
    formData.append('file', image);

    try {
      await axios.post('/api/post/image', formData, {
        headers: {
          Authorization: token,
        },
      });
    } catch (error) {
      console.error(`图片上传失败 (第 ${i + 1} 张):`, error);
    }
  }

  toast.success('所有图片上传完成！');
};
</script>

<style scoped>
.create-post {
  width: 80%; /* 占据整个屏幕宽度 */
  max-width: 800px; /* 设置最大宽度，保持居中 */
  margin: 0 auto; /* 水平居中 */
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  min-height: 80vh; /* 设置最小高度为屏幕高度 */
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中内容 */
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
}

input[type="text"],
input[type="number"],
textarea,
select {
  width: 100%; /* 确保所有输入框和下拉框宽度一致 */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box; /* 确保宽度包含内边距和边框 */
}

textarea {
  resize: none;
  height: 200px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.submit-btn {
  background-color: #00aaff;
  color: white;
  transition: background 0.3s;
}

.submit-btn:hover {
  background-color: #008ecc;
}

.image-container {
  display: flex;
  gap: 10px;
  overflow-x: auto; /* 启用水平滚动 */
  padding-bottom: 10px; /* 给滚动条留出空间 */
}

.image-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0; /* 防止图片缩小 */
}

.image-preview {
  width: 100%;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 50%; /* 确保按钮是圆形 */
  width: 24px; /* 设置固定宽度 */
  height: 24px; /* 设置固定高度，与宽度相等 */
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0; /* 移除默认的内边距 */
  box-sizing: border-box; /* 确保宽高包含边框 */
}

.delete-btn:hover {
  background-color: #d9363e;
}

.add-image-wrapper {
  width: 100px;
  height: 100px;
  border: 1px dashed #00aaff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0; /* 防止按钮缩小 */
}

.add-image-icon {
  width: 50%;
  height: 50%;
  object-fit: contain;
  opacity: 0.7;
}

.add-image-wrapper:hover .add-image-icon {
  opacity: 1;
}
</style>
