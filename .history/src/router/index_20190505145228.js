import Vue from 'vue'
import VueRouter from 'vue-router'
import { delCookieAll } from '@/utils/cookie'
import MenuUtils from '@/utils/MenuUtils'

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
      path: '/csallIntegral',
      name: 'csallIntegral',
      leaf: true,
      hidden: true,
      component: resolve => require(['@/components/allIntegral'], resolve)
    },
    {
      path: '/csreconIntergral',
      name: 'csreconIntergral',
      leaf: true,
      hidden: true,
      component: resolve => require(['@/components/reconIntergral'], resolve)
    }
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
  if (route.path === '/csallIntegral' || route.path === '/csreconIntergral') {
    next()
    return false
  }
  if (data && route.path === '/login') {
    window.sessionStorage.removeItem('user')
    window.sessionStorage.removeItem('isLoadNodes')
    window.location.href = '/'
    delCookieAll()
    return false
  }
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
