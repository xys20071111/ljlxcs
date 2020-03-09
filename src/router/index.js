import Vue from 'vue';
import Index from '@/components/Index';
import TabViews from '@/components/TabViews';
import NotFound from '@/components/NotFound';
import Login from '@/components/login/Login';

 const router = {
     //mode: 'history',
	routes: [
		{
			path: '/',
			// name: '首页',
			component: Index,
			children:[
				{
					path:'',
					name:'多标签页',
					component:TabViews
				}
			]
		},
		{
			path: '/login',
			name: '登录',
			component: Login
		},
        {
            path: '/login/:tourl',
            name: '登录回跳',
            component: Login
        },
        {
            path:'/nopage',
            name:'页面未找到',
            component:NotFound
        },
		{
			path:'*',
			name:'页面未找到',
			component:NotFound
		}
	]
};




export default router;
