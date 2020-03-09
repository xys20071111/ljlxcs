// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue'
import App from './App'
import Router from 'vue-router'
//import contentmenu from 'v-contextmenu'
//import 'v-contextmenu/dist/index.css'
import paths from './router'
import store from './store/index';
import ElementUI from 'element-ui';
import cookie from 'vue-cookie';
import 'element-ui/lib/theme-chalk/index.css';
import Public from './common/Public';
import config from './config';
//import {$ajax,$get,$post,$test} from './common/Func';

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(Router)
Vue.use(Public);
//Vue.use(contentmenu);
let router = new Router(paths);

//访问任一页面前要检测是否已登录和登录token的有效性
router.beforeEach((to,from,next)=>{
  if(to.path === '/login'){
    return next();
  }
  let tokenObj = sessionStorage.getItem('token');

  //let tokenObj = cookie.get('token');
  if(tokenObj){
    let tobj = JSON.parse(tokenObj);
    let now = new Date().getTime();
    //检验token是否过期，5天有效期
    if(now - tobj.time < 432000000 && now - tobj.time >= 0){
      tobj.time = now;
      //localStorage.setItem('token',JSON.stringify(tobj)); //更新
      sessionStorage.setItem('token',JSON.stringify(tobj)); //更新
      //cookie.set('token',JSON.stringify(tobj));
      //个人信息相关
      let userinfo = router.app.$store.state.system.userinfo;
      if(!userinfo){
        router.app.$store.dispatch('getUserInfo',{self:router.app});
      }
      // let sysPath = router.app.$store.state.system.menuTree;
      // if(sysPath.length === 0){
      //     router.app.$store.dispatch('getMenu',{self:router.app}); //获取菜单
      // }
      return next();
    }else{
      return next({path:'/login'});
    }
  }else{
    return next({path:'/login'});
  }
});

window.Lxcs = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});

$(window).keydown(e=>{
  if (e.keyCode === 116) {//F5刷新
    e.preventDefault();
    Lxcs.$f5();
  }
});
