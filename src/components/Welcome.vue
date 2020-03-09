<template>
	<div class="wrap">
		<div class="logoarea">
<!--			<i class="fa fa-rocket"></i>-->
            <div class="spring"></div>
		</div>

		<!--<div class="fastwrap">-->
			<!--<h1 class="fast-item-title">我的收藏</h1>-->
			<!--<div class="cl fast-links">-->
				<!--<a v-for="(item,idx) in fastUrls" :key="idx" href="javascript:;" @click="jumpto(item)" class="links">{{ item.name }}</a>-->
			<!--</div>-->
		<!--</div>-->
	</div>
</template>

<script>
import config from '../config.js';
import lodash from 'lodash';
export default {
	name: 'welcome',
	components:{
		//DateAreaTest
		//AreaInput
	},
	data(){
		return {
			//tree:[],
			list:[],
			result:[],
		}
	},
	computed:{
		fastUrls(){
			return [];
		},
	},
	methods:{
		jumpto(item){
			//this.$router.push({ path: item.url });
		},

		
	},
	created(){
		document.title = config.siteName;
	}
}
</script>


<style scoped lang="less">
     .wrap{
        position:absolute;
        left:0;top:0;right:0;bottom:0;
		overflow: hidden;
		overflow-y: auto;
	}
     .spring{
         position:absolute;
         width:300px;
         height:300px;
         background:url(/static/images/mouse.png) no-repeat;
         background-size: cover;
     }
	.logoarea{
		display:flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		//line-height:200px;
		font-size:100px;
		color:#0AAAE6;
	}
	.fastwrap{
		padding:50px;
	}
	.fast-item-title{
		font-weight: normal;
		border-bottom:1px solid #eee;
		padding:10px 0;
		color:#999;
	}
	.fast-links{
		padding:10px 0;
	}
	.links{
		display:inline-block;
		margin:10px 10px 0 0;
		border:1px solid #ccc;
		padding:10px;
		font-size:14px;
		color:#888;
		text-decoration: none;
		border-radius:5px;
	}
	a.links:hover{
		color:#333;
		border-color:#999;
	}
	.fast-tip{
		font-size:12px;
		color:#eee;
		margin-left:20px;
	}
</style>
