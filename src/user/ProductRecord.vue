<template>
  <div class="product-container" @scroll="handleScroll">
    <div class="product-list">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="product-card"
        @click="handleProductClick(product)"
      >
        <!-- 类型标签 -->
        <div class="type-tag" :class="'type-' + product.Ptype">
          {{ product.Ptype }}
        </div>
        <!-- 商品图片 -->
        <div class="product-image-wrapper">
          <img :src="product.image" class="product-image" alt="商品图片">
        </div>
        <!-- 描述信息 -->
        <div class="product-info">
          <h3>{{ product.title }}</h3>
          <div class="meta-info">
            <p class="price">{{ product.price }}元/{{ product.unit }}</p>
          </div>
          <p class="description">{{ product.description }}</p>
        </div>
      </div>

      <div v-if="loading" class="loading">加载中...</div>
      <div v-if="noMore" class="no-more">没有更多数据了</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ProductInter, Products } from '@/types'
import {useRouter} from 'vue-router'

// 响应式数据
const products = ref<Products>([])
const loading = ref(false)
const noMore = ref(false)
let page = 1
const pageSize = 8
let productTimestamp = Date.now()
const router = useRouter()

// 生成模拟数据（符合ProductInter接口）
const generateMockData = (count: number): Products => {
  const types = ['买', '卖', '租', '借']
  
  return Array.from({ length: count }, (_, i) => ({
    id: page * 1000 + i,
    title: `商品 ${page}_${i + 1}`,
    price: Math.floor(Math.random() * 500) + 100,
    unit: ['天', '月', '次'][i % 3],
    description: '这是一个示例商品描述，用于展示商品的基本信息',
    image: `https://img1.baidu.com/it/u=1964365371,1566431102&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500`,
    Ptype: types[i % 4]
  }))
}

// 加载更多数据
const loadMore = async () => {
  if (loading.value || noMore.value) return
  
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const newData = generateMockData(pageSize)
  products.value = [...products.value, ...newData]
  
  //if (page >= 5) noMore.value = true
  page++
  productTimestamp -= 3600000 // 模拟时间递减
  loading.value = false
}

// 滚动处理
const handleScroll = (e: Event) => {
  const container = e.target as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = container
  if (scrollHeight - (scrollTop + clientHeight) < 50) {
    loadMore()
  }
}

onMounted(() => {
  loadMore()
})

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
</script>

<style scoped>
/* 保持与主页完全一致的样式 */
.product-container {
  height: 80vh;
  overflow-y: auto;
  padding: 20px;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}

.product-card {
  position: relative;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
  cursor: pointer;
  background: white;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.product-image-wrapper {
  height: 200px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-image:hover {
  transform: scale(1.05);
}

.product-info {
  padding: 15px;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.price {
  color: #e4393c;
  font-weight: bold;
  font-size: 1.2em;
}

.post-time {
  color: #666;
  font-size: 0.9em;
}

.description {
  color: #666;
  font-size: 0.95em;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  
  /* 与主页完全一致的类型颜色 */
  &.type-买 { background: #f39c12; }
  &.type-卖 { background: #e74c3c; }
  &.type-租 { background: #3498db; }
  &.type-借 { background: #2ecc71; }
}

.loading, .no-more {
  text-align: center;
  padding: 20px;
  color: #999;
  grid-column: 1 / -1;
}
</style>