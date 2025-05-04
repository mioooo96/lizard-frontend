<template>
  <div class="transaction-container" @scroll="handleScroll">
    <div class="transaction-list">
      <div v-for="(record, index) in records" :key="index" class="transaction-item" @click="handleTransactionClick(record)">
        <img :src="record.imageUrl" class="product-image" alt="商品图片">
        <div class="info-container">
          <h3>{{ record.title }}</h3>
          <div class="meta-info">
            <span class="type-badge" :class="recordTypeClass(record.type)">{{ transactionType[record.type] }}</span>
            <span class="status-badge" :class="statusColorClass(record.status)">{{ transactionStatus[record.status] }}</span>
            <time class="time">{{ record.createTime }}</time>
          </div>
        </div>
        <button
          class="delete-btn"
          @click.stop="deleteTransaction(record.id)"
        >
          删除
        </button>
      </div>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-if="noMore" class="no-more">没有更多数据了</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {type TransactionRecord,type Transactions} from '@/types'
import {useRouter} from 'vue-router'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
// 响应式数据
const records = ref<Transactions>([])
const loading = ref(false)
const noMore = ref(false)
let page = 1
const pageSize = 10
const total = ref(0) // 总记录数
const router = useRouter()
const transactionType = ['买卖', '买卖', '租借', '租借'] // 交易类型
const transactionStatus = ['等待帖主确认', '等待对方再确认', '交易成功','交易失败'] // 交易状态

// 加载更多数据
const loadMore = async () => {
  if (loading.value || noMore.value) return
  loading.value = true
  const token = localStorage.getItem('token') 
  if (!token) {
    console.error('请先登录')
    return
  }
  try {
    // 调用 GET 型 API 获取交易订单信息
    const response = await axios.get('/api/trade/list', {
      params: {
        pageNum: page,
        pageSize: pageSize,
      },
      headers: {
        Authorization: token,
      },
    })

    if (response.data.code === 1) {
      console.log('获取交易记录:', response.data)
      const { records: newRecords, total: totalRecords } = response.data.data
      records.value = [...records.value, ...newRecords]
      total.value = totalRecords

      // 判断是否还有更多数据
      if (records.value.length >= totalRecords) {
        noMore.value = true
      }

      page++
    } else {
      console.error('获取交易记录失败:', response.data.msg)
    }
  } catch (error) {
    console.error('请求失败:', error)
  } finally {
    loading.value = false
  }
}

const deleteTransaction = async (transactionId: number) => {
  const record = records.value.find(record => record.id === transactionId);
  if (!record || (record.status !== 2 && record.status !== 3)) {
    toast.error('只有交易成功或交易失败的记录可以删除！');
    return;
  }
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error('用户未登录，请先登录！');
    router.push('/login');
    return;
  }

  try {
    const response = await axios.delete(`/api/trade/${transactionId}`, {
      headers: {
        Authorization: token,
      },
    });

    if (response.data.code === 1) {
      toast.success('交易记录已删除！');
      // 从 records 中移除已删除的记录
      records.value = records.value.filter(record => record.id !== transactionId);
    } else {
      toast.error(response.data.msg || '删除交易记录失败！');
    }
  } catch (error) {
    console.error('删除交易记录失败:', error);
    toast.error('删除交易记录失败，请稍后重试！');
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
const recordTypeClass = (type: number) => ({
  'type-sell': type === 0 || type === 1,
  'type-rent': type === 2 || type === 3
})

const statusColorClass = (status: number) => ({
  'status-available': status === 0,
  'status-pending': status === 1,
  'status-success': status === 2,
  'status-failed': status === 3
})

// 生命周期
onMounted(() => {
  loadMore()
})

const handleTransactionClick = (record: TransactionRecord) => {
    const route1 = router.resolve({
      path:'/transactionDetail',
      query:{
        payerId: record.payerId,
        payeeId: record.payeeId,
        postId: record.postId
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

.delete-btn {
  background: #ff4d4f; /* 红色背景表示删除 */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  padding: 6px 10px;
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.3s ease;
  align-self: center; /* 垂直居中 */
}

.delete-btn:hover {
  background: #e53935; /* 更深的红色 */
}

.delete-btn:active {
  background: #c62828; /* 点击时更深的红色 */
}
</style>