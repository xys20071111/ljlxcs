<template>
    <ul class="node-list">
        <li class="node-one-wrap" :style="{'margin-bottom':levelNum===0?'20px':0}" v-for="(item,key) in nodelist" :key="key">
            <a href="javascript:;" :class="{'node-one':levelNum!==0,'node-part':levelNum===0,'node-on':item.ison}" :data-id="item.id" @click="nodeClick(item,key)">
                <span class="icon-expand"
                      :style="tabLeft"
                      :class="{'expand-show':!item.hasChild}"
                      @click.stop="toggleExpand(item)"
                >
                    <i v-if="!item.loading" class="fa" :class="{'fa-angle-right':!item.isopen,'fa-angle-down':item.isopen}"></i>
                    <i v-if="item.loading" class="el-icon-loading"></i>
                </span>
                <span class="icon-folder">
                    <i class="fa" :class="item.image" v-if="item.children && item.children.length>0 && item.image"></i>
                    <i class="fa" :class="{'fa-folder':!item.isopen,'fa-folder-open':item.isopen}" v-if="item.children && item.children.length>0 && !item.image"></i>
                    <i class="fa fa-file-text-o" v-if="(!item.children || item.children.length <= 0) && !item.image"></i>
                    <i class="fa" :class="item.image" v-if="(!item.children || item.children.length <= 0) && item.image !==''"></i>
                </span>
                <span>{{ item.name }}</span>
            </a>
            <tree
                v-if="item.children && item.children.length>0 && item.isopen"
                :pleft="tabLeft.left"
                :nodelist="item.children"
                :level="levelNum"
            />
        </li>
    </ul>
</template>

<script>
    import lodash from 'lodash';
    import Tree from './TeamTree';
    export default {
        name: "tree",
        components:{
            Tree,
        },
        props:['nodelist','level','clicknode','expand'],
        computed:{
            levelNum(){
                if(this.level == undefined) return 0;
                else return this.level + 1;
            },
            tabLeft(){
                return {
                    marginLeft:this.levelNum * 20 + this.paddingLeft + 'px',
                }
            }
        },
        data(){
            return {
                nodeData:[],
                paddingLeft:20,
            }
        },
        methods:{
            nodeClick(item,i){
                //有子结点则执行展开收缩操作，否则就是打开新页面
                if(item.children && item.children.length>0 && !item.isUrl){
                    this.$store.commit('xNodeExpand',item.id);
                }else{
                    this.$store.commit('openNewView',item);
                    this.$store.commit('activeTab',item.id);
                }
            },
            toggleExpand(item){
                //第一次展开是加载，把图标改成加载状态，加载完成后把图标恢复成正常状态
                if(!item.loaded){
                    this.$store.commit('xMenuNodeToBeLoading',{menu:'groupTree',teamid:item.id,loadingStatus:true});
                    this.$store.dispatch('getChildGroup',{self:this,params:{teamid:item.id.replace(/group/,'')},cb:()=>{
                        this.$store.commit('xMenuNodeToBeLoading',{menu:'groupTree',teamid:item.id,loadingStatus:false});
                        this.$store.commit('xNodeExpand',item.id);
                    }});
                }else{
                    this.$store.commit('xNodeExpand',item.id);
                }
            },
            rightMenu(nodeItem){
                this.rightNode = nodeItem;
            },
            //小窗口打开
            openWin(){
                layer.open({
                    type: 2 //此处以iframe举例
                    ,title: this.rightNode.name
                    ,area: ['893px', '600px']
                    ,shade: 0
                    ,maxmin: true
                    ,content: this.rightNode.uri
                    ,zIndex: layer.zIndex //重点1
                    ,success: function(layero){
                        layer.setTop(layero); //重点2
                    }
                });
            },
            //收藏
            doLove(){
                console.log(this.rightNode);
            },
            //右键的文件夹展开和收起
            folderActive(){
                this.$store.commit('xNodeExpand',this.rightNode.id);
            }
        }

    }
</script>

<style scoped>
    .node-list{
        overflow:hidden;
        transition: all .2s;
        list-style: none;
        padding:0;
        margin:0;
    }
    .node-one-wrap{
        padding:0;
    }
    .node-one{
        display:block;
        height:40px;
        line-height:40px;
        text-decoration: none;
        color:#666;
        white-space: nowrap;
        font-size:14px;
    }
    .node-part{
        display:block;
        height:40px;
        line-height:40px;
        text-decoration: none;
        color:#666;
        white-space: nowrap;
        font-size:16px;
    }
    a.node-one:hover,a.node-part:hover{
        background:#f5f5f5;
    }
    .node-on,a.node-one.node-on:hover{
        background:#eee;
    }
    .icon-expand{
        display: inline-block;
        color:#999;
        font-size:16px;
        width:15px;
        height:30px;
    }
    .icon-folder{
        display: inline-block;
        color:#555;
        font-size:16px;
        width:20px;
        height:30px;
    }
    .expand-show{
        visibility: hidden;
    }
    .rt{
        margin-right:3px;
    }
</style>
