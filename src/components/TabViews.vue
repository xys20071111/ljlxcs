<template>
    <div class="wrap">
        <div class="content-wrap tab-parent" id="tabwrap" v-if="tabs.length!==0">
            <el-tabs v-model="curTab" type="border-card" closable @tab-remove="removeTab" @tab-click="tabClick">
                <el-tab-pane
                    v-for="(item,idx) in tabs"
                    :key="item.key"
                    :label="''+item.name"
                    :name="item.id"
                >
                    <span slot="label" class="tab-one"><i class="tab-loading" :class="{'tab-loading-show':item.showLoading}"></i><i class="fa fa-refresh tab-refresh" @click="refresh(item.id)" title="刷新页面"></i>{{item.name}}</span>
                    <iframe-page :url="item.uri" :image="item.image" :name="item.name" :id="item.id" />
                </el-tab-pane>
            </el-tabs>
        </div>
        <welcome v-if="tabs.length===0" />
        <span style="display:none">{{tabName}}</span>
    </div>
</template>

<script>
import Welcome from './Welcome';
import IframePage from './Iframe';
export default {
    name: 'tabviews',
    components:{
        Welcome,
        IframePage
    },
    data () { 
        return {
            curTab:this.$store.state.system.activeNodeName,
            hasCloseAllBtn:false
        }
    },
    computed:{
        tabs(){
            return this.$store.state.system.openedViewNodes;
        },
        tabName(){
            this.curTab = this.$store.state.system.activeNodeName;
            setTimeout(()=>{
                this.showCloseAllBtn();
            },50);
            return this.curTab;
        }
    },

    watch:{
        curTab:function(val,old){
            if(val!=='' && val !== old){
                this.$store.commit('pushHighLigthTab',val);
            }
        }
    },
    methods:{
        refresh(iframeid){
            let $tab = $('#tab-'+iframeid);
            let $ifr = $('#'+iframeid);
            $tab.get(0).children[0].children[0].style.display = 'inline-block';
            let url = $ifr.attr('src');
            if(url.indexOf('http')===-1){
                $ifr.get(0).contentWindow.location.reload(true);
            }else{
                $ifr.attr('src','');
                setTimeout(()=>{
                    $ifr.attr('src',url);
                },50);
            }


            //$ifr.get(0).contentWindow.location.reload(true);
            //console.log('reload' in $ifr.get(0));
            //$ifr.attr('src',$ifr.attr('src')+'?v=3');
            
            if ($ifr.get(0).attachEvent) {
                $ifr.get(0).attachEvent("onload", function() {
                    $tab.get(0).children[0].children[0].style.display = 'none';
                });
            } else {
                $ifr.get(0).onload = function() {
                    $tab.get(0).children[0].children[0].style.display = 'none';
                };
            }

        },
        tabClick(item){
            //console.log(item);
            this.$store.commit('activeTab',item.name);
        },
        removeTab(name){
            this.$store.commit('closeTabView',name);
        }, 
        //显示‘关闭所有’按钮
        showCloseAllBtn(){
            let tabs = this.$store.state.system.openedViewNodes;
            let $tabsWrap = $('.el-tabs__header');
            if(tabs.length > 0){
                if(!this.hasCloseAllBtn){
                    $tabsWrap.children('div').last().css('margin-right','30px');
                    var $btn = $('<a href="javascript:;" class="btn-close-all" id="btncloseall" title="关闭所有"><i class="fa fa-close"></i></a>');
                    $btn.prependTo($tabsWrap);
                    $btn.unbind().click(()=>{
                        Lxcs.$confirm('确定关闭所有标签吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(async () => {
                            this.$store.commit('closeAllTabView');
                            this.showCloseAllBtn();
                        }).catch(() => {});
                    });
                    this.hasCloseAllBtn = true;
                }
            }else{
                $tabsWrap.children('div').last().css('margin-left','0');
                $("#btncloseall").remove();
                this.hasCloseAllBtn = false;
            }
        },

    }
}
</script>

<style scoped lang="less">
    .wrap{
        position:absolute;
        left:0;top:0;right:0;bottom:0;
        overflow:hidden;
    }
    .content-wrap{
        position:absolute;
        left:0px;top:0px;right:0px;bottom:0px;
        &>div{
            position: absolute;
            left:0;top:0;right:0;bottom:0;
        }
    }
    .el-tabs__nav-wrap{
        background:#eee;
    }
    .tab-loading{
        display:none;
        width:16px;
        height:16px;
        background:url(/static/images/loading_tree.gif) center center no-repeat;
        vertical-align: -3px;
        margin-right:2px;
    }
    .tab-loading-show{
        display:inline-block;
    }
    .tab-refresh{
        visibility: visible;
        display:inline-block;
        padding:3px 3px;
        border-radius:2px;
        margin-right:3px;
        color:#bbb;
    }
    .tab-refresh:hover{
        background:#eee;
        color:#333;
    }
    .tab-one:hover .tab-refresh{
        visibility: visible;

    }

    .el-tabs__header .el-tabs__item{padding-left:0;}
</style>
