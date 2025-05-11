<template>
    <div class="container">
      <!-- 导航栏 -->
      <nav class="nav-bar">
        <div class="logo">
          <h1>西易平台</h1>
        </div>

        <!-- 搜索栏 -->
        <div class="search-box">
          <div class="search-input-wrapper">
            <input
              type="text"
              placeholder="搜索商品或服务..."
              v-model="searchKeyword"
              @keyup.enter="handleSearch"
              class="search-input"
            >
            <button class="search-btn" @click="handleSearch">
              <svg class="search-icon" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="nav-items">
          <router-link to="/">首页</router-link>
          <router-link to="/show">买入</router-link>
          <router-link to="/buy">卖出</router-link>
          <router-link to="/lend">借入</router-link>
          <router-link to="/borrow">租出</router-link>
          <button class="publish-btn" @click="handlePublish">发布物品</button>
          <!-- 登录状态显示 -->
          <div v-if="isLoggedIn" class="user-info">
           <div class="avatar-container" @click="goToProfile">
          <!-- 显示用户头像，使用默认头像示例 -->
            <img
            :src="user.avatar || '../avatar.png'"
            class="user-avatar"
            alt="用户头像"
            >
           </div>
          </div>

          <router-link
          v-else
          to="/login"
          class="login-btn"
          >
          登录/注册
          </router-link>
        </div>
      </nav>

      <div class="recommend-section">
        <h2 class="section-title">推荐区</h2>
          <div class="recommend-card">
          <div class="recommend-grid">
            <div
              v-for="item in recommendItems"
             :key="item.id"
             class="recommend-item"
             @click="handleRecommendClick(item)"
           >
              <div class="recommend-icon">{{ item.emoji }}</div>
              <div class="recommend-info">
               <h3>{{ item.name }}</h3>
               <p>{{ item.description }}</p>
             </div>
            </div>
         </div>
       </div>
      </div>


      <!-- 商品展示区 -->
      <h2 class="section-title">最新商品</h2>
      <div class="product-section">
        <div class="product-list">
          <div
            v-for="product in products"
            :key="product.id"
            class="product-card"
            @click="handleProductClick(product)"
          >
          <!-- 新增类型标签 -->
          <div class="type-tag" :class="'type-' + protype[product.type]">
            {{ protype[product.type] }} <!-- 显示类型文字 -->
          </div>

          <div class="product-image-wrapper">
            <img :src="product.imageUrl" class="product-image" alt="商品图片">
          </div>
          <div class="product-info">
            <h3>{{ product.title }}</h3>
            <p v-if="product.type === 0 || product.type === 1" class="price">{{ product.price }}元</p>
            <p v-if="product.type === 2 || product.type === 3" class="price">{{ product.price }}元/天</p>
            <p class="description">{{ product.contentBrief }}</p>
          </div>
        </div>
        </div>
        <div v-if="loading" class="no-more">加载中...</div>
        <div v-if="noMore" class="no-more">没有更多数据了</div>
      </div>

      <!-- 底部信息 -->
      <footer class="footer">
        <p>&copy; 2025 西易平台 版权所有</p>
        <div class="footer-links">
          <router-link to="/about">关于我们</router-link>
          <router-link to="/terms">服务条款</router-link>
          <router-link to="/contact">联系我们</router-link>
        </div>
      </footer>
    </div>
  </template>

<script lang="ts" setup name="Home">
  import { ref,computed,onMounted,onUnmounted, onBeforeMount } from 'vue'
  import {useRouter} from 'vue-router'
  import {type ProductInter,type Products} from '@/types'
  import axios from 'axios'
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';

  const Props = defineProps(['Ptype'])
  //const products = ProductsStore.getProductsByPtype(Props.Ptype)
  const searchKeyword = ref('')
  const isLoggedIn = ref(false)
  const router = useRouter()
  const loading = ref(false)
  const noMore = ref(false)
  let page = 1
  const pageSize = 8
  let productTimestamp = Date.now()
  const protype =['买','卖','租','借']
  const products = ref<ProductInter[]>([]);
  const hasError = ref(false); // 标志位，记录是否已经显示过错误提示

  const user = ref({
    id: '',
    nickname: '',
    username: '',
    avatar: '',
    phone: '',
  });
  const handleSearch = () => {
    console.log('搜索关键词:', searchKeyword.value);
    if (!searchKeyword.value.trim()) {
      toast('请输入搜索关键词！'); // 提示用户输入关键词
      return;
    }

    // 跳转到 /search 路由，并传递搜索关键词
    router.push({
      path: '/search',
      query: { keyword: searchKeyword.value.trim() }
    });
  }


// 推荐区数据
interface RecommendItem {
  id: number
  name: string
  emoji: string
  description: string
  keyword: string
}

const recommendItems = ref<RecommendItem[]>([
  { id: 1, name: '手机', emoji: '📱', description: '最新款手机推荐', keyword: '手机' },
  { id: 2, name: '衣服', emoji: '👗', description: '时尚潮流服饰', keyword: '衣服' },
  { id: 3, name: '家电', emoji: '🏠', description: '高性价比家电', keyword: '家电' },
  { id: 4, name: '书籍', emoji: '📚', description: '精选书籍推荐', keyword: '书籍' },
  { id: 5, name: '电脑', emoji: '💻', description: '高性能电脑推荐', keyword: '电脑' },
  { id: 6, name: '耳机', emoji: '🎧', description: '音质极佳耳机', keyword: '耳机' },
  { id: 7, name: '运动鞋', emoji: '👟', description: '舒适运动鞋', keyword: '运动鞋' },
  { id: 8, name: '手表', emoji: '⌚', description: '时尚手表推荐', keyword: '手表' },
  { id: 9, name: '家具', emoji: '🛋️', description: '实用家具推荐', keyword: '家具' },
  { id: 10, name: '相机', emoji: '📷', description: '高质量相机', keyword: '相机' },
  { id: 11, name: '乐器', emoji: '🎸', description: '精选乐器推荐', keyword: '乐器' },
  { id: 12, name: '化妆品', emoji: '💄', description: '热门化妆品', keyword: '化妆品' },
  { id: 13, name: '玩具', emoji: '🧸', description: '儿童玩具推荐', keyword: '玩具' },
  { id: 14, name: '健身器材', emoji: '🏋️', description: '家用健身器材', keyword: '健身器材' },
  { id: 15, name: '厨房用品', emoji: '🍳', description: '实用厨房用品', keyword: '厨房用品' },
  { id: 16, name: '旅行用品', emoji: '🧳', description: '必备旅行用品', keyword: '旅行用品' },
])
// 点击推荐项跳转到搜索页
const handleRecommendClick = (item: RecommendItem) => {
  console.log('点击推荐项:', item.name)
  router.push({
    path: '/search',
    query: { keyword: item.keyword },
  })
}

  const handlePublish = () => {
    if(isLoggedIn.value === false){
      toast.error('请先登录！', { autoClose: 2000 });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    } 
    router.push('/CreatePost');
    console.log('跳转到发布页面')
  }

  // 滚动处理
  const handleScroll = () => {
    const scrollTop = window.scrollY; // 当前滚动位置
    const windowHeight = window.innerHeight; // 可视窗口高度
    const documentHeight = document.documentElement.scrollHeight; // 文档总高度

    // 当滚动接近页面底部时加载更多数据
    if (scrollTop + windowHeight >= documentHeight - 50) {
      loadMore();
    }
  }

  const loadMore = async () => {
    if (loading.value || noMore.value) return;

    loading.value = true;

    try {
      const response = await axios.get('/api/post/time', {
        params: {
          pageNum: page,
          pageSize: 8,
        }
      });

      if (response.data.code === 1) {
        console.log('加载成功:', response.data);
        const { records, total } = response.data.data;

        // 将新数据追加到 products 中
        products.value = [...products.value, ...records];

        // 判断是否还有更多数据
        if (products.value.length >= total) {
          noMore.value = true;
        }

        page++; // 增加页码
        hasError.value = false; // 请求成功后重置错误状态
      } else {
        if (!hasError.value) {
          toast.error(`加载失败：${response.data.msg}`);
          hasError.value = true; // 设置错误状态，防止重复弹出
        }
      }
    } catch (error) {
      console.error('加载失败:', error);
      if (!hasError.value) {
        toast.error('加载失败，请稍后重试！');
        hasError.value = true; // 设置错误状态，防止重复弹出
      }
    } finally {
      loading.value = false;
    }
  };

  const handleProductClick = (product: ProductInter) => {
    if(isLoggedIn.value === false){
      toast.error('请先登录！', { autoClose: 2000 });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }
    const route1 = router.resolve({
      path:'/ProductDetail',
      query:{
        id: product.id,
        title: product.title,
      }
    });
  window.open(route1.href, '_blank'); // 新标签页打开
  }

  const checkTokenValidity =  async() => {
    const token = localStorage.getItem('token');
    const tokenExpiration = Number(localStorage.getItem('tokenExpiration'));

    if (!token || Date.now() > tokenExpiration) {
      // 清除本地存储中的登录信息
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      localStorage.setItem('isLoggedIn', 'false');
    }
  };

  // 检查登录状态
  const checkLoginStatus = () => {
    if(!localStorage.getItem('token')){
      isLoggedIn.value = false
      return
    }
    checkTokenValidity()
    isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
  }

  // 跳转到个人中心
  const goToProfile = () => {
    router.push('/user/personalInfo')
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
     const token = localStorage.getItem('token'); // 从 localStorage 获取 token
     console.log('token:', token);
      if (!token) {
      // alert('用户未登录，请先登录！');
      // return;
      }
      const response = await axios.get('/api/user/current', {
        headers: {
          Authorization: token, // 在请求头中添加 Authorization
        },
      });
      if (response.data.code === 1) {
        // 成功获取用户信息
        const data = response.data.data;
        user.value = {
          id: data.id,
          nickname: data.nickname || '未设置昵称',
          username: data.username,
          avatar: data.avatar, // 默认头像
          phone: data.phone || '未绑定手机号',
        };
        localStorage.setItem("userID",user.value.id)
        console.log('用户信息:', user.value);
        console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));
      } else {
        toast(response.data.msg);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      //alert('获取用户信息失败，请稍后重试！');
    }
  };

  onBeforeMount(async () =>{
    // 监听storage变化（用于其他页面登录后的状态同步）
    //localStorage.removeItem('token')
    checkLoginStatus()
    loadMore();
    window.addEventListener('storage', checkLoginStatus)
    window.addEventListener('scroll', handleScroll); // 监听窗口滚动事件
    if (localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('token')) {
      fetchUserInfo();
    }
  });

  // 移除监听器
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll); // 移除滚动事件监听
    window.removeEventListener('storage', checkLoginStatus)
  });

  interface Category {
    id: number
    name: string
    emoji: string
  }


</script>

<style scoped>
  .container {
    width: 100%;
    min-height: 100vh; /* 确保容器至少撑满视口高度 */
    max-width: 1200px; /* 保留内容区域最大宽度 */
    margin: 0 auto;    /* 水平居中 */
    padding: 0 20px;
    display: flex;     /* 启用 Flex 布局 */
    flex-direction: column; /* 垂直方向排列子元素 */
  }

  .nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid #eee;
  }

  .logo h1 {
    color: #2c3e50;
    margin: 0;
  }

  .nav-items {
    display: flex;
    align-items: center;
    gap: 30px;
  }

  .nav-items a {
    color: #34495e;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
  }

  .nav-items a:hover {
    color: #00aaff;
  }

  .publish-btn {
    background: #00aaff;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .publish-btn:hover {
    background: #0090e0;
  }

  .search-box {
    margin: 20px 0;
    width: 400px;
  }

  .search-input-wrapper {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
  }

  .search-input {
    width: 100%;
    padding: 12px 20px;
    border: 2px solid #ddd;
    border-radius: 25px;
    font-size: 16px;
    padding-right: 25px;
  }

  .search-btn {
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0px;
  }

  .search-icon {
    width: 24px;
    height: 24px;
    fill: #666;
  }

  .product-section {
    height: auto; /* 设置固定高度 */
    overflow: visible; /* 启用垂直滚动 */
    scrollbar-width: none;
    -ms-overflow-style: none; /* IE 和 Edge */
  }

  .product-section::-webkit-scrollbar {
    display: none; /* 隐藏 Chrome、Safari 和 Edge 滚动条 */
  }

  .product-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 30px;
    margin: 30px 0;
  }

  .product-card {
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s;
    cursor: pointer;
  }

  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .product-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .product-info {
    padding: 15px;
    background: white;
  }

  .price {
    color: #e4393c;
    font-weight: bold;
    font-size: 1.2em;
    margin: 10px 0;
  }

  .section-title {
    color: #333;
    border-left: 4px solid #00aaff;
    padding-left: 10px;
    margin: 30px 0;
  }

  .footer {
    margin-top: 50px;
    padding: 30px 0;
    border-top: 1px solid #eee;
    text-align: center;
    color: #666;
  }

  .footer-links {
    margin-top: 15px;
  }

  .footer-links a {
    margin: 0 15px;
    color: #666;
    text-decoration: none;
    transition: color 0.3s;
  }

  .footer-links a:hover {
    color: #00aaff;
  }

  .product-card {
    position: relative; /* 为绝对定位标签提供参照 */
  /* 原有其他样式保持不变 */
  }

  .type-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  font-weight: bold;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  /* 不同交易类型颜色 */
  &.type-买 { background: #f39c12; }
  &.type-卖 { background: #e74c3c; }
  &.type-租 { background: #3498db; }
  &.type-借 { background: #2ecc71; }

  /* 可选：添加文字阴影提升可读性 */
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }

  /* 用户头像样式 */
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #00aaff;
  transition: transform 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.1);
}

.login-btn {
  /* 保持原有登录按钮样式 */
}

.category-list {
    display: flex;
    justify-content: center;
    gap: 130px;
    margin: 30px 0;
    flex-wrap: wrap;
  }

  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    transition: all 0.3s;
  }

  .category-item:hover {
    transform: translateY(-5px);
  }

  .category-icon {
    font-size: 40px;
    margin-bottom: 10px;
  }

  .no-more {
    text-align: center;
    margin: 20px 0;
    font-size: 18px;
    color: #999;
  }

  html, body {
  height: 100%;
  margin: 0;
  overflow: auto; /* 启用全局滚动 */
}

.recommend-section {
  margin: 30px 0;
}

.recommend-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4列布局 */
  gap: 20px;
}

.recommend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.recommend-item:hover {
  transform: translateY(-5px);
}

.recommend-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.recommend-info h3 {
  text-align: center;
  margin: 0;
  font-size: 14px;
  color: #333;
}

.recommend-info p {
  margin: 5px 0 0;
  font-size: 12px;
  color: #666;
}
</style>
