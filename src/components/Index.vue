<template>
	<div class="body">
		<top-bar />
		<div class="side" :class="{'outscreen':sideFloat,'showonce':showSideOnce,'side-ani':sideAni}" :style="sWidth" @mouseleave="hideSide">
			<div class="side-wrap">
				<div class="side-menu">
					<tree
						:pleft="0"
						:nodelist="menuTree"
						:showlist="true"
					/>
				</div>
			</div>
			<div class="side-ctrl-bar">
                <el-checkbox v-model="sideFloat">自动收起</el-checkbox>
            </div>
            <a href="javascript:;" class="show-side-btn" v-show="sideFloat"></a>
			<div class="side-hand" id="sideHand"></div>
		</div>
		<div class="main" :style="bLeft">
			<div class="main-body">
				<router-view />
			</div>
			<div class="main-erize-cover" id="erizeCover"></div>
		</div>

	</div>
</template>

<script>
import TopBar from './TopBar';
import Tree from './side/Node';
import TeamTree from './side/TeamTree';
import FavorateList from './side/FavorateList';
import lodash from 'lodash';
import cookie from 'vue-cookie';
import config from '../config';
export default {
	name: 'index',
	components:{
		Tree,
        TeamTree,
        FavorateList,
		TopBar
	},
	data () {
		return {
			sideWidth:260,
			startPosition:0,
            startSideWidth:260,
            $hand:null,
            sideFloat:false,
            sideAni:true,
		}
	},
	computed:{
	    curItemType(){
	        return this.$store.state.system.curItemType;
        },
		menuTree(){
            let curItemNodeId = this.$store.state.system.curItemNodeId;
			let menuTree = this.$store.state.system.menuTree;
			let subTree = lodash.find(menuTree,{id:curItemNodeId});
			if(subTree && subTree.children){
				return subTree.children;
			}else{
				return [];
			}
		},
		sWidth(){
			return 'width:' + this.sideWidth + 'px';
		},
		bLeft(){
            let num = !this.sideFloat?this.sideWidth:0;
			return 'left:' + num + 'px';
		},
        showSideOnce(){
	        return this.$store.state.system.showSideOnce;
        }
	},
	methods:{
	    //
        urlOpenTab(){
            //本地存储的tab标签对象缓存，拿出来显示
            let tabs = localStorage.getItem('pagetabs');
            if(tabs){
                let tabsObj = JSON.parse(tabs);
                this.$store.commit('initView',tabsObj);
                this.$store.commit('xPathOnStatus',tabsObj.curItemNodeId);
            }
            //从地址栏里传进来的tab显示
            let path = this.$route.fullPath;
            let pathReg = /^\/\?/;
            if(pathReg.test(path)){
                let pageVal = path.replace(pathReg,'');
                let pary = pageVal.split('&');
                let nodeObj = {};
                pary.forEach(item=>{
                    let one = item.split(('='));
                    nodeObj[one[0]] = one[0] !== 'id'?decodeURI(one[1]).replace(/%2F/g,'\/'):one[1];
                });
                this.$store.commit('openNewView',nodeObj);

            }
        },

		//拖动改变side宽度事件绑定
        bindResizeSide(){
            this.$hand = $("#sideHand");
            this.$hand.mousedown(e=>{
				let $cover = $("#erizeCover");
				$cover.show();
				this.sideAni = false;
                this.startPosition = e.pageX;
				this.startSideWidth = this.sideWidth;
                $('body').attr('unselectable', 'on').bind('selectstart', function () { return false; }); //禁止文字被选中
                $('body').bind({
                    'mousemove.mv':this.bindMove,
                    'mouseup.mv':e=>{
						$cover.hide();
                        $('body').attr('unselectable', 'off').unbind('selectstart');
                        $('body').unbind('mousemove.mv');
                        $('body').unbind('mouseup.mv');
                        this.sideAni = true;
                    }
                });
            });
        },
        bindMove(e){
            let newWidth = this.startSideWidth + (e.pageX - this.startPosition);
            if(newWidth<200 || newWidth>500){
                return false;
            }else{
                this.sideWidth = newWidth;
            }
		},

        //隐藏左侧菜单
        hideSide(){
		    this.$store.commit('xShowSideOnce');
        },

        //f5刷新标签页而不是整体刷新
        bindF5(){
            $(document).keydown(e=>{
                e.preventDefault();
                if (e.keyCode === 116) {//F5刷新
                    let ifrid = this.$store.state.system.activeNodeName;
                    if(ifrid){
                        try{
                            let $tab = $('#tab-'+ifrid);
                            let $ifr = $('#'+ifrid);
                            if($tab && $ifr){
                                $tab.get(0).children[0].children[0].style.display = 'inline-block';
                                $ifr.get(0).contentWindow.location.reload(true);
                            }
                        }catch (e){
                            alert(e);
                        }
                    }
                }
            });
        }
	},

    created() {
        this.urlOpenTab();
    },
	mounted(){
	    //this.bindF5();
		this.bindResizeSide();
		this.$showLoading();
		this.$closeLoading();
	},
    beforeDestroy(){
	    this.$delToken();
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
	@top-height:50px;
	@side-width:260px;
	.body{position: absolute;left:0;top:0;right:0;bottom:0;overflow: hidden;text-align: left;}
	.side{position: absolute;left:0;top:@top-height;bottom:0;width:@side-width;border-right:1px solid #DDD;background:#FAFAFA;z-index:6}
    .side-ani{transition:all .2s;}
    .outscreen{transform: translateX(-100%)}
    .show-side-btn{display:flex;justify-content:center;align-items:center;position: absolute;
        top:0;bottom:0;right:-10px;width:10px;background:transparent;text-decoration: none;
    }
    .outscreen:hover,.showonce{transform: translateX(0)}
    .outscreen:hover .show-side-btn{display:none;}
	.side::after{position: absolute;content:' ';width:4px;height:15px;background:url(/static/images/resize.png) no-repeat;right:0;top:50%;margin-top:-8px;}
	.side-wrap{position: absolute; left:0;top:0;right:0;bottom:31px;overflow-y: auto}
	.side-menu{margin-top:20px;}
	.side-menu>.node-list>li{margin-bottom:50px;}
    .side-ctrl-bar{display:flex;justify-content:center;align-items:center;position: absolute;left:0;bottom:0;right:0;height:30px;background:#EAEAEA;border-top:1px solid #DDD;}

	.main{position: absolute;left:@side-width;top:@top-height;right:0;bottom:0;overflow:hidden;}
	.main-body{position: absolute;left:0;top:0;right:0;bottom:0;}
	.side-hand{position: absolute;top:0;bottom:0;right:-3px;width:8px;background:transparent;cursor:e-resize;}
	.main-erize-cover{position: absolute;top:0;left:0;right:0;bottom:0;background: transparent;display:none;}
</style>
