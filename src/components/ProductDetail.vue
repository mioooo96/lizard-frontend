<template>
  <div class="container">
    <div class="simple-merchant-bar">
      <!-- 商家信息栏-->
      <div class="merchant-basic">
        <img class="merchant-avatar" :src="posterInfo.avatar" alt="商家头像">
        <span class="merchant-id">{{ posterInfo.id }}</span>
      </div>
      <button class="contact-button" @click="contactSeller">
        <!---- 电话图标... -->
        联系商家
      </button>
    </div>

    <div class="product-container">
      <div class="img-container">
        <div class="type-tag" :class="'type-' + protype[postDetail.type]">
          {{ protype[postDetail.type] }}
        </div>

        <!-- 商品图片区域 -->
        <div class="product-img">
          <div class="magnifier-container" @click="toggleZoom">
            <img ref="productImage" :src="currentImage" alt="商品图片" class="main-image">
          </div>
        </div>
      </div>
      <!-- 缩略图列表 -->
      <div class="thumbnail-wrapper">
        <button class="arrow-btn left" @click="switchImage((images.length+currentImageIndex - 1)%images.length)">
          &lt;
        </button>
        <div class="thumbnail-list">
          <div v-for="(img, index) in images" :key="index" class="thumbnail-item"
            :class="{ active: currentImageIndex === index }" @click="switchImage(index)">
            <img :src="img" :alt="'商品图' + (index + 1)" class="thumbnail-img">
          </div>
        </div>
        <button class="arrow-btn right" @click="switchImage((images.length+currentImageIndex + 1)%images.length)">
          &gt;
        </button>
      </div>
      <!-- 商品详细信息区域 -->
      <div class="detail">
        <div class="price1">
          ￥{{ postDetail.price }}
        </div>
        <div class="title">
          {{ postDetail.title }}
        </div>
        <div class="description">
          {{ postDetail.content }}
        </div>
        <div class="hint-text">
          喜欢的朋友点"请求交易"
        </div>
        <button class="request-btn" @click="handleRequest">
          <!-- 购物车图标 -->
          {{ showinfo }}
        </button>
      </div>
    </div>

    <!-- 全屏放大容器 -->
    <div class="zoom-overlay" v-show="isZoomed" @click.self="toggleZoom" @wheel.prevent="handleZoom">
      <div class="zoomed-image-container" :style="zoomedImageStyle" @mousedown="startDrag" @mousemove="handleDrag"
        @mouseup="endDrag" @mouseleave="endDrag">
        <img :src="currentImage" alt="放大后的商品图片" class="zoomed-image">
      </div>

      <div class="zoom-controls">
        <button @click.stop="resetZoom" class="control-btn">重置</button>
        <button @click.stop="toggleZoom" class="control-btn">关闭 (ESC)</button>
        <span class="zoom-percent">{{ Math.round(zoomLevel * 100) }}%</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import axios from 'axios'
import 'vue3-toastify/dist/index.css'

const route = useRoute()
const router = useRouter()
const id = route.query
const isLoggedIn = ref(false)
const customerID = ref(Number(localStorage.getItem("userID")))
const showinfo = ref('')
const tradestatus = ref(-1)
const protype = ['买', '卖', '租', '借']


// 放大功能逻辑
const isZoomed = ref(false)
const zoomLevel = ref(1)
const currentPos = reactive({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStartPos = reactive({ x: 0, y: 0 })

// 帖子详情数据
const postDetail = reactive({
  id: 0,
  userId: 0,
  username: '',
  title: '',
  content: '',
  type: 0,
  status: 0,
  price: 0,
  createTime: '',
  imageUrls: [] as string[],
});

// 发帖人详情
const posterInfo = reactive({
  id: 0,
  username: '',
  nickname: '',
  avatar: '',
  phone: '',
});


//缩略图
const images = ref<string[]>([])

const currentImageIndex = ref(0);
const currentImage = computed(() => images.value[currentImageIndex.value]);
//const currentImageIndex = ref(0)
//const currentImage = computed(() => images.value[currentImageIndex.value])

// 获取帖子详情的函数
const fetchPostDetail = async () => {
  const postId = route.query.id; // 从路由参数中获取帖子 ID
  console.log('帖子 ID:', postId);
  if (!postId) {
    toast.error('帖子 ID 不存在！');
    return;
  }
  const token = localStorage.getItem('token');
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!token) {
    toast.error('用户未登录，请先登录！');
    router.push('/login');
  }
  if (!isLoggedIn) {
    toast.error('用户未登录，请先登录！');
    router.push('/login');
  }
  try {
    const response = await axios.get('/api/post/'+postId, { 
      headers: {
        Authorization: token, // 在请求头中添加 token
      },
     });
    console.log('获取帖子详情:', response.data);
    if (response.data.code === 1) {
      // 将返回的数据绑定到 postDetail
      Object.assign(postDetail, response.data.data);
      images.value = [...postDetail.imageUrls];
      console.log('帖子详情:', postDetail);
      if (postDetail.userId) {
        if(postDetail.userId == customerID.value){
          showinfo.value = '撤销帖子'
        }else{  
          showinfo.value = '请求交易'
        }
        await fetchPosterInfo(postDetail.userId);
        await fetchTradeInfo(postDetail.userId);
      }
    } else {
      toast.error(`获取帖子详情失败：${response.data.msg}`);
    }
  } catch (error) {
    console.error('获取帖子详情失败:', error);
    toast.error('获取帖子详情失败，请稍后重试！');
  }
};
// 获取发帖人信息
const fetchPosterInfo = async (userId: number) => {
  try {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!token) {
      toast.error('用户未登录，请先登录！');
      router.push('/login');
    }
    if (!isLoggedIn) {
      toast.error('用户未登录，请先登录！');
      router.push('/login');
    }
    const response = await axios.get('/api/user/'+postDetail.userId, {
      headers: {
        Authorization: token, // 在请求头中添加 token
      },
    });

    if (response.data.code === 1) {
      // 将返回的数据绑定到 posterInfo
      Object.assign(posterInfo, response.data.data);
      console.log('发帖人信息:', posterInfo);
    } else {
      toast.error(`获取发帖人信息失败：${response.data.msg}`);
    }
  } catch (error) {
    console.error('获取发帖人信息失败:', error);
    toast.error('获取发帖人信息失败，请稍后重试！');
  }
};
//查询交易记录
const fetchTradeInfo = async (userId: number) => {
  try {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!token) {
      toast.error('用户未登录，请先登录！');
      router.push('/login');
    }
    if (!isLoggedIn) {
      toast.error('用户未登录，请先登录！');
      router.push('/login');
    }
    const response = await axios.get('/api/trade',{
      params: {
        payerId: customerID.value,
        payeeId: userId,
        postId: postDetail.id
    }, 
      headers: {
        Authorization: token, // 在请求头中添加 token
      },
    });

    if (response.data.code === 1) {
      // 将返回的数据绑定到 posterInfo
      if(response.data.data == null){
        tradestatus.value = -1
      }else{
        tradestatus.value = response.data.data.status
      }
    } else {
      //toast.error(`获取发帖人信息失败：${response.data.msg}`);
      tradestatus.value = -1
    }
  } catch (error) {
    console.error('获取交易信息失败:', error);
    toast.error('获取交易信息失败，请稍后重试！');
  }
};

// 计算属性
const zoomedImageStyle = computed(() => ({
  transform: `translate(${currentPos.x}px, ${currentPos.y}px) scale(${zoomLevel.value})`,
  cursor: isDragging.value ? 'grabbing' : zoomLevel.value > 1 ? 'grab' : 'default'
}))

// 缩放处理
const handleZoom = (e: WheelEvent) => {
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  const newZoom = zoomLevel.value * delta
  zoomLevel.value = Math.min(Math.max(newZoom, 1), 5)
}

// 拖拽处理
const startDrag = (e: MouseEvent) => {
  if (zoomLevel.value <= 1) return
  isDragging.value = true
  dragStartPos.x = e.clientX - currentPos.x
  dragStartPos.y = e.clientY - currentPos.y
}

const handleDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  currentPos.x = e.clientX - dragStartPos.x
  currentPos.y = e.clientY - dragStartPos.y

  // 限制移动范围
  const maxMovement = 200 * (zoomLevel.value - 1)
  currentPos.x = Math.max(-maxMovement, Math.min(maxMovement, currentPos.x))
  currentPos.y = Math.max(-maxMovement, Math.min(maxMovement, currentPos.y))
}

const endDrag = () => {
  isDragging.value = false
}

// 重置缩放
const resetZoom = () => {
  zoomLevel.value = 1
  currentPos.x = 0
  currentPos.y = 0
}

// 切换放大状态
const toggleZoom = () => {
  isZoomed.value = !isZoomed.value
  if (!isZoomed.value) resetZoom()
}

// 键盘事件处理
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') toggleZoom()
}

// 登录检查
const checkLoginStatus = () => {
  isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
}

const handleRequest = async () => {
  if (!isLoggedIn.value) {
    toast("请登录！3秒后跳转到登录页面...", { autoClose: 3000 })
    setTimeout(() => {
      router.replace("/login")
    }, 3000)
  } else if(posterInfo.id != customerID.value && tradestatus.value == -1){ {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post('/api/trade/create',
        {
          payerId: customerID.value,
          payeeId: posterInfo.id,
          postId: postDetail.id
        }, {
        headers: {
          Authorization: token, // 在请求头中添加 Authorization
        },
      }
      )
      //交易记录ID
      console.log(response.data.data);

      if (response.data.code === 1) {
        toast("请求成功，等待卖方确认。", { autoClose: 2000 })
        tradestatus.value = 0
        console.log(response.data.msg)
      } else {
        console.log(response.data.msg)
        toast(response.data.msg, { autoClose: 3000 })
      }
    } catch (error) {
      console.error('请求失败:', error)
      toast('请求失败，请稍后重试！')
    }
  }
}else if(posterInfo.id == customerID.value){
    try {
      console.log('撤销帖子:', postDetail.id)
      const token = localStorage.getItem("token")
      const response = await axios.delete('/api/post/'+postDetail.id, {
        headers: {
          Authorization: token, // 在请求头中添加 Authorization
        },
      }
      )

      if (response.data.code === 1) {
        toast("帖子删除成功，即将跳转至主页！", { autoClose: 2000 })
        setTimeout(() => {
          router.replace("/")
        }, 2000)
        console.log(response.data.msg)
      } else {
        console.log(response.data.msg)
        toast(response.data.msg, { autoClose: 3000 })
      }
    } catch (error) {
      console.error('请求失败:', error)
      toast('请求失败，请稍后重试！')
    }
  }
  else if(posterInfo.id != customerID.value && tradestatus.value != -1){
    toast("交易已建立，请在个人中心处查看交易记录详情！", { autoClose: 2000 })
  }
}

const checkTokenValidity = () => {
    const token = localStorage.getItem('token');
    const tokenExpiration = Number(localStorage.getItem('tokenExpiration'));

    if (!token || Date.now() > tokenExpiration) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      localStorage.setItem('isLoggedIn', 'false');
      toast.error('登录已过期，请重新登录！');
      router.push('/login');
    }
};

// 生命周期
onMounted(() => {
  checkTokenValidity();
  fetchPostDetail();
  checkLoginStatus()
  document.title = `商品详情 - ${route.query.title || '未命名'}`
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

const contactSeller = () => {
  toast('联系商家电话:'+posterInfo.phone, { autoClose: 5000 })
}
//切换图片
const switchImage = (index: number) => {
  if (index < 0) index = 0
  if (index >= images.value.length) index = images.value.length - 1
  currentImageIndex.value = index

  // 滚动到可见区域
  const container = document.querySelector('.thumbnail-list') as HTMLElement
  const thumb = document.querySelectorAll('.thumbnail-item')[index] as HTMLElement
  if (container && thumb) {
    container.scrollTo({
      left: thumb.offsetLeft - container.offsetWidth / 2 + thumb.offsetWidth / 2,
      behavior: 'smooth'
    })
  }
  resetZoom()
}
</script>

<style scoped>
/* 基础样式保持原样 */
.container {
  background-color: #f5f7fa;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.product-container {
  margin: 20px;
  width: 90%;
  max-width: 1000px;
  background-color: white;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  overflow: hidden;
  justify-content: center;
  align-items: center;
}

.product-container:hover {
  transform: translateY(-5px);
}

.img-container {
  position: relative;
  width: 99%;
  margin-top: 10px;
  border: 1px solid gray;
  border-radius: 10px;
  height: auto;
  /* 移除固定高度 */
  padding-bottom: 20px;
}

.type-tag {
  position: relative;
  top: 10px;
  left: 10px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  font-weight: bold;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.type-tag.type-买 {
  background: #f39c12;
}

.type-tag.type-卖 {
  background: #e74c3c;
}

.type-tag.type-租 {
  background: #3498db;
}

.type-tag.type-借 {
  background: #2ecc71;
}

.product-img {
  position: relative;
  cursor: zoom-in;
  align-content: center;
  width: 100%;
}

.main-image {
  margin-top: 30px;
  width: 100%;
  height: auto;
  max-height: 480px;
  object-fit: contain;
  border-radius: 8px;
  transition: transform 0.2s;
}

.main-image:hover {
  transform: scale(1.02);
}

/* 全屏放大样式 */
.zoom-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.zoomed-image-container {
  max-width: 90vw;
  max-height: 90vh;
  transition: transform 0.1s ease-out;
}

.zoomed-image {
  display: block;
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  transform-origin: center center;
}

/* 控制栏样式 */
.zoom-controls {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  border-radius: 25px;
  backdrop-filter: blur(5px);
}

.control-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.zoom-percent {
  color: white;
  font-size: 14px;
  min-width: 60px;
  text-align: center;
}

.detail {
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  margin-left: 30px;
  width: 90%;
}

.price1 {
  color: #ff4757;
  font-size: 40px;
  font-weight: 550;
  margin-bottom: 15px;
}

.title {
  font-size: 28px;
  color: #2f3542;
  margin-bottom: 20px;
  font-weight: 500;
  line-height: 1.3;
}

.description {
  font-size: 16px;
  color: #57606f;
  line-height: 1.6;
  margin-bottom: 25px;
  flex-grow: 1;
  text-indent: 2em;
}

.hint-text {
  color: #747d8c;
  font-size: 14px;
  margin-bottom: 15px;
}

.request-btn {
  height: 50px;
  width: 200px;
  border-radius: 25px;
  background: #ff6b81;
  color: white;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.request-btn:hover {
  background: #ff4757;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 107, 129, 0.3);
}

.request-btn:active {
  transform: translateY(0);
}

.cart-icon {
  fill: currentColor;
}

.simple-merchant-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.merchant-basic {
  display: flex;
  align-items: center;
  gap: 10px;
}

.merchant-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #f5f5f5;
}

.merchant-id {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.contact-button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background: #fff;
  color: #ff6b81;
  border: 1px solid #ff6b81;
  border-radius: 15px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 20px;
}

.contact-button:hover {
  background: #ff6b81;
  color: #fff;
}

.contact-button svg {
  margin-right: 3px;
}

/* 新增缩略图样式 */
.thumbnail-list {
  display: flex;
  gap: 12px;
  padding: 15px 0;
  overflow-x: auto;
  margin-top: 20px;
}

.thumbnail-item {
  scroll-snap-align: start;
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.thumbnail-item.active {
  border-color: #ff6b81;
  box-shadow: 0 0 0 2px rgba(255, 107, 129, 0.3);
}

.thumbnail-item:hover {
  transform: translateY(-3px);
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  padding: 0 40px;
}

.thumbnail-container {
  flex: 1;
  overflow: hidden;
}

.thumbnail-list {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  scroll-behavior: smooth;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;  /* IE 和 Edge */
  scrollbar-width: none;  /* Firefox */
}

/* 隐藏滚动条 */
.thumbnail-list::-webkit-scrollbar {
  display: none;
}

/* 箭头按钮样式 */
.arrow-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  color: #666;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.arrow-btn:hover:not(:disabled) {
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  color: #ff6b81;
}

.arrow-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.left {
  margin-right: 10px;
}

.right {
  margin-left: 10px;
}
</style>
