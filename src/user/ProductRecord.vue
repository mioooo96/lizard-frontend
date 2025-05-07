<template>
  <div class="product-container" @scroll="handleScroll">
    <div class="product-list">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="product-item" 
        @click="handleProductClick(product)"
      >
        <img :src="product.imageUrl" class="product-image" alt="商品图片">
        <div class="info-container">
          <h3>{{ product.title }}</h3>
          <div class="meta-info">
            <span class="type-badge" :class="'type-' + protype[product.type]">
              {{ protype[product.type] }}
            </span>
            <span v-if="product.type === 0 || product.type === 1" class="price">{{ product.price }}元</span>
            <span v-if="product.type === 2 || product.type === 3" class="price">{{ product.price }}元/天</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="loading" class="no-more">加载中...</div>
    <div v-if="noMore" class="no-more">没有更多数据了</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted,onBeforeMount } from 'vue'
import type { ProductInter, Products } from '@/types'
import {useRouter} from 'vue-router'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// 响应式数据
const products = ref<Products>([])
const loading = ref(false)
const noMore = ref(false)
let page = 1
const pageSize = 8
let productTimestamp = Date.now()
const router = useRouter()
const protype = ['买', '卖', '租', '借']

const loadMore = async () => {
  if (loading.value || noMore.value) return;

  loading.value = true;

  try {
    const token = localStorage.getItem('token');
    if(!token){
      toast.error('请先登录');
      router.push('/login');
    }
    // 发送请求获取数据
    const response = await axios.get('/api/post/list', {
      params: {
        pageNum: page,
        pageSize: 8,
        userId: localStorage.getItem('userID'), // 从本地存储获取用户 ID
      },
      headers:{
        Authorization: token,
      }
    });
    console.log(localStorage.getItem('userID'))
    console.log('获取数据:', response.data);
    if (response.data.code === 1) {
      const { records, total } = response.data.data;

      // 将新数据追加到 products 中
      products.value = [...products.value, ...records];

      // 判断是否还有更多数据
      if (products.value.length >= total) {
        noMore.value = true;
      }

      page++; // 增加页码
    } else {
      toast.error(`加载失败：${response.data.msg}`);
    }
  } catch (error) {
    console.error('加载失败:', error);
    toast.error('加载失败，请稍后重试！');
  } finally {
    loading.value = false;
  }
};

// 滚动处理
const handleScroll = (e: Event) => {
  const container = e.target as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = container
  if (scrollHeight - (scrollTop + clientHeight) < 50) {
    loadMore()
  }
}

onBeforeMount(() => {
  loadMore()
})

const handleProductClick = (product: ProductInter) => {
    const route1 = router.resolve({
      path:'/ProductDetail',
      query:{
        id: product.id
      }
    });
  window.open(route1.href, '_blank'); // 新标签页打开
  }
</script>

<style scoped>
.product-container {
  height: 80vh;
  overflow-y: auto;
  padding: 20px;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.product-item:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 87px;
  height: 87px;
  border-radius: 6px;
  margin-right: 20px;
  object-fit: cover;
}

.info-container {
  flex: 1;
}

.meta-info {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.type-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
  font-weight: bold;
}

.type-买 { background: #f39c12; }
.type-卖 { background: #e74c3c; }
.type-租 { background: #3498db; }
.type-借 { background: #2ecc71; }

.price {
  color: #e4393c;
  font-weight: bold;
  font-size: 1.2em;
}

.loading, .no-more {
  text-align: center;
  padding: 20px;
  color: #999;
  grid-column: 1 / -1;
}
</style>