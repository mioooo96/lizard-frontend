<template>
    <div class="container">
      <!-- 导航栏 -->
      <nav class="nav-bar">
        <div class="logo">
          <h1>西易平台</h1>
        </div>
        <div class="nav-items">
          <router-link to="/">首页</router-link>
          <router-link to="/second-hand">二手交易</router-link>
          <router-link to="/rental">物品租借</router-link>
          <button class="publish-btn" @click="handlePublish">发布物品</button>
          <router-link to="/login" class="login-btn">登录/注册</router-link>
        </div>
      </nav>
  
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
      <div class="product-section">
        <h2 class="section-title">最新商品</h2>
        <div class="product-list">
          <div 
            v-for="product in products"
            :key="product.id"
            class="product-card"
            @click="handleProductClick(product)"
          >
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
  
<script lang="ts" setup name="pingtai">
  import { ref } from 'vue'
  
  interface Category {
    id: number
    name: string
    emoji: string
  }
  
  interface Product {
    id: number
    title: string
    price: number
    unit: string
    description: string
    image: string
    Ptype: string
  }
  
  const searchKeyword = ref('')
  const categories = ref<Category[]>([
    { id: 1, name: '买', emoji: '📚' },
    { id: 2, name: '卖', emoji: '📱' },
    { id: 3, name: '租', emoji: '👗' },
    { id: 4, name: '借', emoji: '🏠' },
  ])
  
  const products = ref<Product[]>([
    {
      id: 1,
      title: '九成新智能手机',
      price: 1200,
      unit: '',
      description: '华为Mate40，保护完好，功能正常',
      image: 'https://picx.zhimg.com/v2-e7dd8094bcac3702785d157792651690_r.jpg?source=2c26e567',
      Ptype: "卖"
    },
    // 更多测试数据...
    {
      id: 2,
      title: '星铁二手号',
      price: 12,
      unit: '天',
      description: '满命账号',
      image: 'https://picx.zhimg.com/v2-e7dd8094bcac3702785d157792651690_r.jpg?source=2c26e567',
      Ptype: "租"
    },
    // 更多测试数据...
    {
      id: 2,
      title: '星铁二手号',
      price: 12,
      unit: '天',
      description: '满命账号',
      image: 'https://dummyimage.com/300x200/eee/999',
      Ptype: "租"
    },
    // 更多测试数据...
    {
      id: 2,
      title: '星铁二手号',
      price: 12,
      unit: '天',
      description: '满命账号',
      image: 'https://dummyimage.com/300x200/eee/999',
      Ptype: "租"
    },
    // 更多测试数据...
    {
      id: 2,
      title: '星铁二手号',
      price: 12,
      unit: '天',
      description: '满命账号',
      image: 'https://dummyimage.com/300x200/eee/999',
      Ptype: "租"
    },
    // 更多测试数据...
    {
      id: 2,
      title: '星铁二手号',
      price: 12,
      unit: '天',
      description: '满命账号',
      image: 'https://dummyimage.com/300x200/eee/999',
      Ptype: "租"
    }
  ])
  
  const handleSearch = () => {
    console.log('搜索关键词:', searchKeyword.value)
  }
  
  const handlePublish = () => {
    console.log('跳转到发布页面')
  }
  
  const handleCategoryClick = (category: Category) => {
    console.log('选择分类:', category.name)
  }
  
  const handleProductClick = (product: Product) => {
    console.log('查看商品详情:', product.title)
  }
</script>
  
<style scoped>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    font-family: 'Arial', sans-serif;
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
    margin: 40px 0;
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
    padding-right: 50px;
  }
  
  .search-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
  }
  
  .search-icon {
    width: 24px;
    height: 24px;
    fill: #666;
  }
  
  .category-list {
    display: flex;
    justify-content: center;
    gap: 40px;
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
  
  .product-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
    z-index: 2; /* 确保显示在图片上方 */
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
</style>