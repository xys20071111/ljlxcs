import Vue from 'vue';
import Vuex from 'vuex';
import System from './System.js';


// 告诉 vue “使用” vuex
Vue.use(Vuex);

// 整合初始状态和变更函数，我们就得到了我们所需的 store
// 至此，这个 store 就可以连接到我们的应用中
export default new Vuex.Store({
  // state,
  // mutations
  modules: {
    system:System
  }
})
