<template>
    <ul class="node-list">
        <!--<v-contextmenu ref="contextmenu">-->
            <!--&lt;!&ndash;<v-contextmenu-item @click="openWin" v-if="(!rightNode || !rightNode.children) || (rightNode && rightNode.children && rightNode.children.length===0)"><i class="fa fa-window-maximize rt"></i>小窗口打开</v-contextmenu-item>&ndash;&gt;-->
            <!--<v-contextmenu-item @click="doLove"><i class="fa fa-heart rt"></i>收藏</v-contextmenu-item>-->
            <!--<v-contextmenu-item @click="folderActive" v-if="rightNode && rightNode.children && rightNode.children.length>0"><i class="fa rt" :class="{'fa-folder':rightNode.isopen,'fa-folder-open':!rightNode.isopen}"></i>{{rightNode.isopen?'收起':'展开'}}</v-contextmenu-item>-->
        <!--</v-contextmenu>-->
        <li class="node-one-wrap" :style="{'margin-bottom':levelNum===0?'20px':0}" v-for="(item,key) in nodelist" :key="key">
            <a href="javascript:;" :class="{'node-one':levelNum!==0,'node-part':levelNum===0,'node-on':item.id === curNodeId}" :data-id="item.id"  @contextmenu="rightMenu" @click="nodeClick(item,key)">
                <span class="icon-expand"
                    :style="tabLeft"
                    :class="{'expand-show':!item.children || item.children.length<=0}"
                      @click.stop="toggleExpand(item)"
                    
                >
                    <i class="fa" :class="{'fa-angle-right':!item.isopen,'fa-angle-down':item.isopen}"></i>
                </span>
                <span class="icon-folder">
                    <i class="fa" :class="item.image" v-if="item.children && item.children.length>0 && item.image"></i>
                    <i class="fa" :class="{'fa-folder':!item.isopen,'fa-folder-open':item.isopen}" v-if="item.children && item.children.length>0 && !item.image"></i>
                    <i class="fa fa-file-text-o" v-if="(!item.children || item.children.length <= 0) && !item.image"></i>
                    <i class="fa" :class="item.image" v-if="(!item.children || item.children.length <= 0) && item.image !==''"></i>
                </span>
                <span>{{ item.name }}</span>
                <span @click.stop="favorate(item)" class="node-heart" title="收藏" v-if="!item.favorate && item.uri!=='#'"><i class="fa fa-star"></i></span>
                <span @click.stop="unfavorate(item)" class="node-heart-cancel" title="取消收藏" v-if="item.favorate && item.uri!=='#'"><i class="fa fa-star-o"></i></span>
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
import Tree from './Node';
import config from '../../config';
export default{
    name:'tree',
    components:{
        Tree
    },
    props:['nodelist','level','clicknode','expand'],
    computed:{
        levelNum(){
            if(this.level == undefined) return 0;
            else return this.level + 1;
        },
        tabLeft(){
            // let pl = this.pleft?this.pleft:0;
            // let l = pl-0+20;
            // console.log(l);
            // let cssLeft = l + 'px';
            // return {
            //     marginLeft:cssLeft,
            //     left:l
            // }
            return {
                marginLeft:this.levelNum * 20 + this.paddingLeft + 'px',
            }
        },
        curNodeId(){
            return this.$store.state.system.activeNodeName;
        }
    },
    data(){
        return {
            nodeData:[],
            showChilds:true,
            paddingLeft:20,


            rightNode:null
        }
    },
    methods:{
        nodeClick(item,i){
            //有子结点则执行展开收缩操作，否则就是打开新页面
            console.log('menutest',item);
            if(item.children && item.children.length>0 && !item.isUrl){
                if(item.uri !== '#'){
                    this.$store.commit('openNewView',item);
                }else{
                    console.log('menutest1',item);
                    this.$store.commit('xNodeExpand',item.idName);
                }
            }else{
                this.$store.commit('openNewView',item);
                this.$store.commit('activeTab',item.id);
            }
        },
        toggleExpand(item){
            this.$store.commit('xNodeExpand',item.idName);
        },
        rightMenu(nodeItem){
            console.log($(nodeItem.target).parentsUntil('a'));
            //console.log($(nodeItem.target).parentsUntil('a').data('id'));
            //this.rightNode = nodeItem;
        },
        //小窗口打开
        // openWin(){
        //     layer.open({
			// 	type: 2 //此处以iframe举例
			// 	,title: this.rightNode.name
			// 	,area: ['893px', '600px']
			// 	,shade: 0
			// 	,maxmin: true
			// 	,content: this.rightNode.uri
			// 	,zIndex: layer.zIndex //重点1
			// 	,success: function(layero){
			// 		layer.setTop(layero); //重点2
			// 	}
			// });
        // },
        //收藏
        doLove(){
            console.log(this.rightNode);
        },
        //右键的文件夹展开和收起 
        folderActive(){
            this.$store.commit('xNodeExpand',this.rightNode.id);
        },

        //收藏
        async favorate(item){
            let msg = await this.$get(config.access + '/collectmenu',{menu:item.id,collect:1});
            if(msg.result === 0){
                this.$message({
                    type:'success',
                    message:'收藏成功'
                });
                this.$store.dispatch('getMenu',{self:this});
            }

        },
        //取消收藏
        async unfavorate(item){
            let msg = await this.$get(config.access + '/collectmenu',{menu:item.id,collect:0});
            if(msg.result === 0){
                this.$message({
                    type:'success',
                    message:'取消收藏成功'
                });
                this.$store.dispatch('getMenu',{self:this});
            }
        }
    },

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
.node-heart,.node-heart-cancel{
    margin-left:10px;
    font-size:18px;
    vertical-align: -2px;
    visibility: hidden;
    color:#ddd;
}
.node-heart:hover{
    color:#F2A827;
}
.node-heart-cancel:hover{
    color:#999;
}
a.node-one:hover .node-heart,a.node-part:hover .node-heart,a.node-one:hover .node-heart-cancel,a.node-part:hover .node-heart-cancel{
    visibility:visible;
}
</style>
