<!-- src/views/Show.vue -->
<template>
    <div class="container">
      <!-- 复用与Home相同的导航栏 -->
      <nav class="nav-bar">
        <!-- 完全复制Home.vue的导航栏代码 -->
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
          <router-link to="/login" class="login-btn">登录/注册</router-link>
        </div>
      </nav>
  
      <!-- 仅展示类型为"卖"的商品 -->
      <div class="product-section">
        <h2 class="section-title">出售商品</h2>
        <div class="product-list">
          <div 
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
            @click="handleProductClick(product)"
          >
            <!-- 类型标签 -->
            <div class="type-tag" :class="'type-' + product.Ptype">
              {{ product.Ptype }}
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
  
  <script setup lang="ts">
  import { computed,ref,reactive } from 'vue'
  import {type ProductInter,type Products} from '@/types'
  const searchKeyword = ref('')
  // 假设从API获取数据，这里使用静态数据演示
  const products = reactive<Products>([
    // 数据结构需与Home.vue一致
    {
      id: 3,
      title: '二手数码相机',
      price: 1500,
      unit: '台',
      description: '佳能EOS 200D',
      image: 'https://img0.baidu.com/it/u=2751675099,3859055809&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=800',
      Ptype: '卖'
    },
    {
      id: 3,
      title: '西安电子科技大学',
      price: 150000000,
      unit: '所',
      description: '一所大专',
      image: 'https://pic.rmb.bdstatic.com/bjh/240424/news/c5b8f069d4bfff04db4661e8543fe24b7669.jpeg',
      Ptype: '卖'
    },
    // 更多"卖"类型商品...
  ])
  
  // 计算属性过滤商品
  const filteredProducts = computed(() => {
    return products.filter(item => item.Ptype === '卖')
  })

  const handleSearch = () => {
    console.log('搜索关键词:', searchKeyword.value)
  }
  
  const handlePublish = () => {
    console.log('跳转到发布页面')
  }
  
  const handleProductClick = (product: ProductInter) => {
    console.log('查看商品详情:', product.title)
  }
  </script>
  
  <!-- 复用Home.vue的样式 -->
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
  </style>