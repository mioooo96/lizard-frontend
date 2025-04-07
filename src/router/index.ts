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
    path: '/user',
    name: 'User',
    component:User
  }
  // 添加更多路由...
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router