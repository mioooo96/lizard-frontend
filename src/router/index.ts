import { createRouter, createWebHistory } from 'vue-router'
import About from '@/footer/About.vue'
import Terms from '@/footer/Terms.vue'
import Contact from '@/footer/Contact.vue'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Show from '@/components/Show.vue'
import Buy from '@/components/Buy.vue'
import Borrow from '@/components/Borrow.vue'
import Lend from '@/components/Lend.vue'
import User from '@/components/User.vue'
import Register from '@/components/Register.vue'
import ProductDetail from '@/components/ProductDetail.vue'
import TransactionDetail from '@/components/TransactionDetail.vue'
import CreatePost from '@/components/CreatePost.vue'
import PersonalInfo from '@/user/PersonalInfo.vue'
import ProductRecord from '@/user/ProductRecord.vue'
import TransactionRecord from '@/user/TransactionRecord.vue'
import ChangeInfo from '@/user/ChangeInfo.vue'
import ChangePassword from '@/user/ChangePassword.vue'
import DeleteAccount from '@/user/DeleteAccount.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home// 确保路径正确
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/show',
    name: 'Show',
    component: Show
  },
  {
    path: '/buy',
    name: 'Buy',
    component: Buy
  },{
    path: '/borrow',
    name: 'Borrow',
    component: Borrow
  },
  {
    path: '/lend',
    name: 'Lend',
    component: Lend
  },
  {
    path: '/createPost',
    name: 'CreatePost',
    component: CreatePost
  },
  {
    path: '/user',
    name: 'User',
    component:User,
    children:[
      {
        path:'changeInfo',
        name:'changeInfo',
        component:ChangeInfo
      },
      {
        path:'personalInfo',
        name:'personalInfo',
        component:PersonalInfo
      },
      {
        path:'productRecord',
        name:'productRecord',
        component:ProductRecord
      },
      {
        path:'transactionRecord',
        name:'transactionRecord',
        component:TransactionRecord
      }
    ]
  },
  {
    path:'/productDetail',
    name:'ProductDetail',
    component:ProductDetail
  },
  {
    path:'/transactionDetail',
    name:'TransactionDetail',
    component:TransactionDetail
  },
  {
    path:'/register',
    name:'Register',
    component:Register
  },{
    path:'/changePassword',
    name:'ChangePassword',
    component:ChangePassword
  },{
    path:'/deleteAccount',
    name:'DeleteAccount',
    component:DeleteAccount
  }
  // 添加更多路由...
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
