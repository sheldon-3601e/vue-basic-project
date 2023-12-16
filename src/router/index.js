import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/layout'
import Search from '@/views/search'
import SearchList from '@/views/search/list'
import ProDetail from '@/views/prodetail'
import Login from '@/views/login'
import Pay from '@/views/pay'
import MyOrder from '@/views/myorder'

import Home from '@/views/layout/home'
import Category from '@/views/layout/category'
import Cart from '@/views/layout/cart'
import User from '@/views/layout/user'

import store from '@/store'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 配置一级路由
    {
      path: '/login', component: Login
    },
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      // 配置二级路由
      children: [
        { path: '/home', component: Home },
        { path: '/category', component: Category },
        { path: '/user', component: User },
        { path: '/cart', component: Cart }
      ]
    },
    {
      path: '/search', component: Search
    },
    {
      path: '/searchlist', component: SearchList
    },
    {
      path: '/prodetail/:id', component: ProDetail
    },
    {
      path: '/pay', component: Pay
    },
    {
      path: '/myorder', component: MyOrder
    }
  ]
})

// 全局前置导航守卫
// 所有的路由在真正被访问之前，都会经过全局前置守卫
// 只有全局前守卫放行，才能跳转

// 定义一个数组，存储所有需要登陆权证的页面
const authUrls = ['/pay', '/myorder']

/**
 * @param to 到哪里去
 * @param from 从哪里来，包含完整的路由对象（路径，参数）
 * @param next() 是否放行，包含完整的路由对象（路径，参数）
 * (1) next() 表示放行
 * (2) next(路径) 进行拦截，跳转到next里的路径
 *  */
router.beforeEach((to, from, next) => {
  // 查看to.path是否在authUrls中
  if (!authUrls.includes(to.path)) {
    // 非权限的页面，直接放行
    next()
    return
  }

  // 权限页面，需要判断token
  const token = store.getters.token
  // console.log(token)
  if (token) {
    next()
  } else {
    next('login')
  }
})

export default router
