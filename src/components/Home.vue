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
          <router-link to="/show">卖出</router-link>
          <router-link to="/buy">买入</router-link>
          <router-link to="/lend">租出</router-link>
          <router-link to="/borrow">借入</router-link>
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

      <!-- 分类入口 -->
      <div class="category-section">
        <h2 class="section-title">功能专区</h2>
        <div class="category-list">
          <div 
            v-for="category in categories"
            :key="category.id"
            class="category-item"
            @click="handleCategoryClick(category)"
          >
            <div class="category-icon">{{ category.emoji }}</div>
            <span>{{ category.name }}</span>
          </div>
        </div>
      </div>

      <!-- 商品展示区 -->
      <h2 class="section-title">最新商品</h2>
      <div class="product-section" @scroll="handleScroll">
        <div class="product-list">
          <div 
            v-for="product in products"
            :key="product.id"
            class="product-card"
            @click="handleProductClick(product)"
          >
          <!-- 新增类型标签 -->
          <div class="type-tag" :class="'type-' + product.Ptype">
            {{ product.Ptype }} <!-- 显示类型文字 -->
          </div>

          <div class="product-image-wrapper">
            <img :src="product.image" class="product-image" alt="商品图片">
          </div>
          <div class="product-info">
            <h3>{{ product.title }}</h3>
            <p class="price">{{ product.price }}元/{{ product.unit }}</p>
            <p class="description">{{ product.description }}</p>
          </div>
        </div>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-if="noMore" class="no-more">没有更多数据了</div>
        </div>
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
  import { ref,computed,onMounted,onUnmounted } from 'vue'
  import {useRouter} from 'vue-router'
  import {type ProductInter,type Products} from '@/types'
  import { useProductsStore } from '@/store/Products'
  import axios from 'axios'
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  
  const Props = defineProps(['Ptype'])
  const ProductsStore = useProductsStore()
  //const products = ProductsStore.getProductsByPtype(Props.Ptype)
  const searchKeyword = ref('')
  const isLoggedIn = ref(false)
  const router = useRouter()
  const loading = ref(false)
  const noMore = ref(false)
  let page = 1
  const pageSize = 8
  let productTimestamp = Date.now()
  const products = ref<ProductInter[]>([
          {
            id: 1,
            title: '九成新智能手机',
            price: 1200,
            unit: '台',
            description: '华为Mate40，保护完好，功能正常',
            image: 'https://picx.zhimg.com/v2-e7dd8094bcac3702785d157792651690_r.jpg?source=2c26e567',
            Ptype: "卖"
          },
          {
            id: 2,
            title: '星铁二手号',
            price: 12,
            unit: '天',
            description: '满命账号',
            image: 'https://img0.baidu.com/it/u=916732440,3057481842&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500',
            Ptype: "租"
          },
          {
            id: 2,
            title: '我的世界',
            price: 12,
            unit: '天',
            description: '游戏',
            image: 'https://img1.baidu.com/it/u=1964365371,1566431102&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
            Ptype: "买"
          },
          {
            id: 2,
            title: 'It\'s MyGo!!!!!',
            price: 12,
            unit: '天',
            description: '满命账号',
            image: 'https://img2.baidu.com/it/u=1460146858,1748558553&fm=253&fmt=auto&app=120&f=JPEG?w=868&h=500',
            Ptype: "借"
          },
          {
            id: 2,
            title: 'Ave Mujica',
            price: 12,
            unit: '天',
            description: '满命账号',
            image: 'https://img0.baidu.com/it/u=522614871,2801739268&fm=253&fmt=auto&app=120&f=JPEG?w=866&h=500',
            Ptype: "租"
          }, 
          {
            id: 3,
            title: '二手数码相机',
            price: 1500,
            unit: '台',
            description: '佳能EOS 200D',
            image: 'https://img0.baidu.com/it/u=2751675099,3859055809&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=800',
            Ptype: '买'
          },
          {
            id: 3,
            title: '西安电子科技大学',
            price: 150000000,
            unit: '所',
            description: '一所大专',
            image: 'https://pic.rmb.bdstatic.com/bjh/240424/news/c5b8f069d4bfff04db4661e8543fe24b7669.jpeg',
            Ptype: '买'
          }]);

  const user = ref({
    id: '',
    nickname: '',
    username: '',
    avatar: '',
    phone: '',
    password: '******', // 密码通常不会通过接口返回，保持隐藏
  });
  const handleSearch = () => {
    console.log('搜索关键词:', searchKeyword.value)
  }
  
  const handlePublish = () => {
    console.log('跳转到发布页面')
  }

  // 滚动处理
  const handleScroll = (e: Event) => {
    const container = e.target as HTMLElement
    const { scrollTop, scrollHeight, clientHeight } = container
    if (scrollHeight - (scrollTop + clientHeight) < 50) {
      loadMore()
    }
  }
  
  // 加载更多数据
  const loadMore = async () => {
  if (loading.value || noMore.value) return;

  loading.value = true;
  await new Promise(resolve => setTimeout(resolve, 800));

  const newData = generateMockData(pageSize);
  products.value = [...products.value, ...newData];

  if (newData.length < pageSize) {
    noMore.value = true;
  }
  if (page >= 5) noMore.value = true
  page++;
  loading.value = false;
};

const generateMockData = (count: number): ProductInter[] => {
  const types = ['买', '卖', '租', '借'];
  return Array.from({ length: count }, (_, i) => ({
    id: page * 1000 + i,
    title: `商品 ${page}_${i + 1}`,
    price: Math.floor(Math.random() * 500) + 100,
    unit: ['天', '月', '次'][i % 3],
    description: '这是一个示例商品描述，用于展示商品的基本信息',
    image: `https://img0.baidu.com/it/u=522614871,2801739268&fm=253&fmt=auto&app=120&f=JPEG?w=866&h=500`,
    Ptype: types[i % 4],
  }));
};

  const handleProductClick = (product: ProductInter) => {
    const route1 = router.resolve({
      path:'/ProductDetail',
      query:{
        id: product.id,
        title: product.title,
        price: product.price,
        unit: product.unit,
        description: product.description,
        image: product.image,
        Ptype:product.Ptype
      }
    });
  window.open(route1.href, '_blank'); // 新标签页打开
  }

  // 检查登录状态
  const checkLoginStatus = () => {
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
      if (!token) {
      // alert('用户未登录，请先登录！');
      // return;
      }
      const response = await axios.get('http://47.122.116.174:8080/api/user/current', {
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
          password: '******', // 密码不从接口返回
        };
        console.log('用户信息:', user.value);
      } else {
        toast(response.data.msg);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      //alert('获取用户信息失败，请稍后重试！');
    }
  };
  // 初始化检查
  onMounted(() => {
    checkLoginStatus()
    // 监听storage变化（用于其他页面登录后的状态同步）
    loadMore();
    window.addEventListener('storage', checkLoginStatus)
    if (localStorage.getItem('isLoggedIn') === 'true') {
      fetchUserInfo();
    }
  })

  // 移除监听器
  onUnmounted(() => {
   window.removeEventListener('storage', checkLoginStatus)
  })

  interface Category {
    id: number
    name: string
    emoji: string
  }

  const categories = ref<Category[]>([
    { id: 1, name: '买', emoji: '📚' },
    { id: 2, name: '卖', emoji: '📱' },
    { id: 3, name: '租', emoji: '👗' },
    { id: 4, name: '借', emoji: '🏠' },
  ])

  const handleCategoryClick = (category: Category) => {
    console.log('点击分类:', category.name);
  // 根据分类名称跳转到对应的路由
  const routeMap: Record<string, string> = {
    '买': '/buy',
    '卖': '/show',
    '租': '/lend',
    '借': '/borrow',
  };

  const targetRoute = routeMap[category.name];
  if (targetRoute) {
    router.push(targetRoute);
  } else {
    console.error('未找到对应的路由:', category.name);
  }
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
    max-width: 600px;
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
    right: 0px;
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
    height: 80vh; /* 设置固定高度 */
    overflow-y: auto; /* 启用垂直滚动 */
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

</style>