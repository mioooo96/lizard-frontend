<template>
  <div class="transaction-container" @scroll="handleScroll">
    <div class="transaction-list">
      <div v-for="(record, index) in records" :key="index" class="transaction-item" @click="handleTransactionClick(record)">
        <img :src="record.image" class="product-image" alt="商品图片">
        <div class="info-container">
          <h3>{{ record.productName }}</h3>
          <div class="meta-info">
            <span class="type-badge" :class="recordTypeClass(record.type)">{{ record.type }}</span>
            <span class="status-badge" :class="statusColorClass(record.status)">{{ record.status }}</span>
            <time class="time">{{ formatTime(record.time) }}</time>
          </div>
        </div>
      </div>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-if="noMore" class="no-more">没有更多数据了</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {type TransactionRecord,type TransactionType,type TransactionStatus} from '@/types'
import {useRouter} from 'vue-router'
// 响应式数据
const records = ref<TransactionRecord[]>([])
const loading = ref(false)
const noMore = ref(false)
let page = 1
const pageSize = 10
const router = useRouter()

// 生成模拟数据
const generateMockData = (count: number): TransactionRecord[] => {
  const types: TransactionType[] = ['买卖', '租借']
  const statuses: TransactionStatus[] = ['可交易', '待交易', '交易成功', '交易失败']
  
  return Array.from({ length: count }, (_, i) => ({
    type: types[i % 2],
    status: statuses[i % 4],
    image: 'https://picx.zhimg.com/v2-e7dd8094bcac3702785d157792651690_r.jpg?source=2c26e567', // 需要准备实际图片路径
    productName: `商品 ${page}_${i + 1}`,
    time: Date.now() - i * 3600000 // 模拟时间递减
  }))
}

// 加载更多数据
const loadMore = async () => {
  if (loading.value || noMore.value) return
  
  loading.value = true
  // 模拟异步请求
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const newData = generateMockData(pageSize)
  records.value = [...records.value, ...newData]
  
  // 模拟数据总数限制（实际应来自接口）
  if (page >= 3) noMore.value = true
  
  page++
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

// 格式化时间
const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 样式类处理
const recordTypeClass = (type: TransactionType) => ({
  'type-sell': type === '买卖',
  'type-rent': type === '租借'
})

const statusColorClass = (status: TransactionStatus) => ({
  'status-available': status === '可交易',
  'status-pending': status === '待交易',
  'status-success': status === '交易成功',
  'status-failed': status === '交易失败'
})

// 生命周期
onMounted(() => {
  loadMore()
})

const handleTransactionClick = (record: TransactionRecord) => {
    const route1 = router.resolve({
      path:'/transactionDetail',
      query:{
        type: record.type,
        status: record.status,
        image: record.image,
        productName: record.productName,
        time: record.time
      }
    });
  window.open(route1.href, '_blank'); // 新标签页打开
  }
</script>

<style scoped>
.transaction-container {
  height: 80vh;
  overflow-y: auto;
  padding: 20px;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.product-image {
  width: 80px;
  height: 80px;
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

.type-badge, .status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.type-sell { background: #e6f4ff; color: #1677ff; }
.type-rent { background: #fffbe6; color: #faad14; }

.status-available { background: #f6ffed; color: #52c41a; }
.status-pending { background: #fff1f0; color: #ff4d4f; }
.status-success { background: #f6ffed; color: #52c41a; }
.status-failed { background: #fff1f0; color: #ff4d4f; }

.time {
  color: #666;
  font-size: 12px;
}

.loading, .no-more {
  text-align: center;
  padding: 20px;
  color: #999;
}
</style>