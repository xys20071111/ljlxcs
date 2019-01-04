import Vue from 'vue'
import VueRouter from 'vue-router'
import { delCookieAll } from '@/utils/cookie'
import MenuUtils from '@/utils/MenuUtils'
// import HelloWorld from '@/components/HelloWorld'
// import Test1 from '@/components/Test1'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/login',
      name: 'login',
      leaf: true,
      hidden: true,
      component: resolve => require(['@/components/Login'], resolve)
    },
    {
      path: '/nofound',
      name: 'nofound',
      leaf: true,
      hidden: true,
      component: resolve => require(['@/components/Nofound'], resolve)
    },
    {
      path: '/',
      name: '主页',
      leaf: false,
      hidden: true,
      component: resolve => require(['@/components/Home'], resolve),
      children: [
        {
          path: 'main',
          name: '欢迎页',
          leaf: true,
          hidden: true,
          component: resolve => require(['@/components/HelloWorld'], resolve)
        }
      ]
    }
    // {
    //   path: '/home',
    //   name: 'home',
    //   leaf: false,
    //   hidden: true,
    //   component: resolve => require(['@/components/Home'], resolve),
    //   children: [
    //     {
    //       path: '',
    //       name: 'main',
    //       leaf: true,
    //       hidden: true,
    //       alias: 'main',
    //       component: HelloWorld
    //     },
    //     {
    //       path: 'test1',
    //       name: 'test1',
    //       leaf: true,
    //       hidden: true,
    //       component: Test1
    //     },
    //     {
    //       path: 'test2',
    //       name: 'test2',
    //       leaf: true,
    //       hidden: true,
    //       component: Test1
    //     }
    //   ]
    // }
  ]
})

let data = window.sessionStorage.getItem('user') ? JSON.parse(window.sessionStorage.getItem('user')) : null

if (data) {
  let routes = []
  MenuUtils(routes, data)
  router.addRoutes(routes)
  window.sessionStorage.removeItem('isLoadNodes')
}

router.beforeEach((route, redirect, next) => {
  let data = JSON.parse(window.sessionStorage.getItem('user'))
  if (data && route.path === '/login') {
    window.sessionStorage.removeItem('user')
    window.sessionStorage.removeItem('isLoadNodes')
    window.location.href = '/'
    delCookieAll()
    return false
  }
  console.log(data)
  if (!data && route.path !== '/login') {
    next({ path: '/login' })
  } else {
    if (route.path) {
      next()
    } else {
      next({ path: '/nofound' })
    }
  }
})

export default router
