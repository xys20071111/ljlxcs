<template>
    <div class="top-bar">
        <div class="top-main">
            <h1 class="top-logo">
                <span class="top-cir">
                    <i class="fa fa-rocket top-logo-icon"></i>
                    <span class="top-loading-run" :class="{'turn-animate':loading}" v-if="loading"></span>
                </span>
                {{ msg }}
            </h1>
            <div class="top-alllink">
                <a href="javascript:;" v-for="(item,idx) in menu" :key="idx" :title="item.name" class="top-link" :class="curItemId===(''+item.id)?'on':''" @click="xActiveItem(item,2)">
                    <i class="fa" :class="item.image"></i>
                    <span>{{item.name}}</span>
                </a>
                <!--<a href="javascript:;" title="我的团队" class="top-link" :class="curItemId==='myteam'?'on':''" @click="xActiveItem(item,3)">-->
                    <!--<i class="fa fa-users"></i>-->
                    <!--<span>我的团队</span>-->
                <!--</a>-->
            </div>
        </div>
        <div>
            <div class="top-user" v-bind:class="{ 'top-person-hover': isHover }" @mouseenter="enterHead" @mouseleave="leaveHead">
                <div class="username">{{userinfo?userinfo.name:''}}</div>
                <img  v-bind:src="userinfo.faceimage?'/api/store/faces/'+userinfo.faceimage:userinfo.gender===1?'/static/images/nv.jpg':'/static/images/nan.jpg'" class="headpic" />
                <div class="top-person-info-card">
                    <div class="top-person-info">
                        <!--<a href="javascript:;" class="top-person-bighead"><img v-bind:src="userinfo.faceimage?'http://cs.lejiaolexue.cn/api/store/faces/'+userinfo.faceimage:userinfo.gender===1?'/static/images/nv.jpg':'/static/images/nan.jpg'" /></a>-->
                        <div class="info-user-pic">
                            <el-upload
                                    class="avatar-uploader"
                                    :action="url"
                                    :headers="postHeader"
                                    :show-file-list="false"
                                    :on-success="upSuccess"
                                    :before-upload="bfUpload"
                                    accept="image/gif, image/jpeg,image/png">
                                <img v-if="!!userinfo.faceimage" :src="headPic" class="avatar">
                                <img v-else :src="userinfo.gender===1?'/static/images/nv.jpg':'/static/images/nan.jpg'" />
                            </el-upload>
                        </div>
                        <div class="top-person-name">
                            <h4 class="top-person-name-detail">{{ userinfo?userinfo.name:'' }}</h4>
                            <p class="top-person-other">
                                <span>账号：{{ userinfo?userinfo.loginname:'' }}</span>
                            </p>
                        </div>
                    </div>
                    <div class="top-exit-area">
                        <div>
                            <el-button @click="toPhone" v-show="isPhone"><i class="fa fa-mobile phone-v"></i>手机版</el-button>
                        </div>
                        <el-button type="danger" @click="logout">退出系统</el-button>
                    </div>
                </div>
            </div>
            <div class="top-foumn">
                <a href="/items/forum" class="top-bbs" target="_blank" title="答疑、解惑、吐槽"><i class="fa fa-bullhorn mr5"></i>论坛</a>
            </div>
        </div>
    </div>
</template> 

<script>
import config from '../config.js';
import lodash from 'lodash';
import cookie from 'vue-cookie';
export default {
    name: 'iframepage',
    data () {
        return {
            msg:config.siteName,
            activeMenuName:''+this.$store.state.system.curItemNodeId,
            // restaurants: [
            //     { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号",id:100 },
            //     { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
            //     { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
            // ],
            // soPath: '',
            // showSo:false,
            // showIpt:false
            isHover:false
        }
    },
    computed:{
        userinfo(){
            let u = this.$store.state.system.userinfo;
            return u?u:{}
        },
        menu(){
            var tree = this.$store.state.system.menuTree;
            return tree;
        },
        showTeamAdminMenu(){
            return this.$store.state.system.groupTree.length>0;
        },
        loading(){
            return this.$store.state.system.logoLoading;
        },
        //所有终极结点集合
        restaurants(){
            let all = lodash.cloneDeep(this.$store.state.system.allEndNodes);
            all.forEach(item=>{
                item.address = item.fullName;
                item.value = item.name;
            });
            return all;
        },
        //历史结点集合
        nodeHistory(){
            let all = lodash.cloneDeep(this.$store.state.system.viewHistory);
            all.forEach(item=>{
                item.address = item.fullName;
                item.value = item.name;
            });
            return all;
        },

        curItemId(){
            return ''+this.$store.state.system.curItemNodeId;
        },

        postHeader(){
            //let tk = JSON.parse(sessionStorage.getItem('token'));
            let tk = this.$getToken();
            return {
                Authorization:tk
            }
        },
        url(){
            return '/api/account/uploadfaceimage?userid='+this.userinfo.userid;
        },
        headPic(){
            return !!this.userinfo.faceimage?'/api/store/faces/' + this.userinfo.faceimage:'';
        },

        isPhone(){
            return this.$isMobile.any();
        }
    },
    methods:{
        
        toPhone(){
            window.location.href="/m";
        },
        
        enterHead:function(){
            this.isHover = true;
        },
        leaveHead:function(){
            this.isHover = false;
        },

        //上传成功回调
        upSuccess(response, file, fileList){
            // this.getPicWH(file.raw,(width,height)=>{
            //     this.adObj.fileList.push({
            //         name:response.Context.substr(response.Context.lastIndexOf('/')).replace('/',''),
            //         url:'http://file-im.oss-cn-beijing.aliyuncs.com/' + response.Context,
            //         key:width + '*' + height
            //     });
            // });

            let uinfo = Object.assign({},this.userinfo);
            uinfo.faceimage =  response.data;
            this.$store.commit('xUserInfo',uinfo);
        },
        //获取图片宽高
        getPicWH(file,cb){
            //获取图片宽高
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                //加载图片获取图片真实宽度和高度
                var image = new Image();
                image.onload=function(){
                    let width = image.width;
                    let height = image.height;
                    cb(width,height);
                };
                image.src= data;
            };
            reader.readAsDataURL(file);
        },
        //检测图片宽高,返回promise
        chkPic(file){
            let that = this;
            return new Promise((resolve,reject)=>{
                //获取图片宽高
                this.getPicWH(file,(width,height)=>{
                    if(width === height){
                        resolve(true);
                    }else{
                        that.$message.error('要求宽高一致');
                        reject(false);
                    }
                });
            });
        },

        //图片上传之前的回调
        async bfUpload(file){
            return await this.chkPic(file);
        },


        //切换大导航菜单 type 1 我的收藏 2 业务菜单 3 团队管理 4 系统管理
        xActiveItem(nodeItem,type){
            //this.$store.commit('xCurItemType',2);
            //this.activeMenuName = ''+nodeItem.id;
            this.$store.commit('xPathOnStatus',nodeItem.id);
        },
        async userControl(command){
            switch(command){
                case 'quit':
                    //localStorage.removeItem('token');
                    this.$store.commit('xClear');
                    let msg = await this.$get(config.auth + '/logout');
                    cookie.delete('token');
                    if(msg.result === 0){
                        this.$message({
                            type:'success',
                            message:'退出成功'
                        });
                    }
                    this.$router.push({path:'/login'});
            }
        },
        async logout(){
            this.$store.commit('xClear');
            let msg = await this.$get(config.auth + '/logout');
            //cookie.delete('token');
            this.$delToken();
            if(msg.result === 0){
                this.$message({
                    type:'success',
                    message:'退出成功'
                });
            }
            this.$router.push({path:'/login'});
        },
        //快捷搜索
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        //点击搜索下拉选项
        handleSelect(item) {
            this.$store.commit('openNewView',item);
            this.soPath = '';
        },
        handleIconClick(ev) {
            console.log(ev);
        },
        //点击历史选项
        clickHistory(nodeid){
            this.$store.commit('openNewView',{id:nodeid});
        },
        //显示搜索框
        toShowSo(){
            this.showSo = true;
            setTimeout(()=>{
                this.showIpt=true
                this.$refs['soipt'].focus();
            },10);
        },
        //隐藏搜索框
        soBlur(){
            this.showIpt = false;
            setTimeout(()=>{
                this.showSo=false
            },200);
        },
    },
    mounted(){
        //调取‘我的收藏’菜单
        //this.$store.dispatch('getMyFavorate');
    }
}
</script>

<style scoped lang="less">
    .top-bar{position: absolute;left:0;top:0;right:0;height:50px;
        background:#222;
        //background:url(/static/images/bgs/bgw.jpg?v=1) no-repeat;
        background-size: cover;
        z-index:3;
        display:flex;
        justify-content: space-between;
        flex-wrap:nowrap;
    }
    .top-main{
        display:flex;
        flex-wrap:nowrap;
        height:100%;
        flex:1;
    }
    .top-logo{
        box-sizing: border-box;
        width:165px;
        font-size:22px;
        line-height:50px;
        color:#fff;
        padding:0;
        padding-left:20px;
        margin:0;
    }
    .top-cir{
        position: relative;
        display:inline-block;
        border:1px solid rgba(255,255,255,.2);
        //border:1px solid rgba(188,1,14,1);
        width:30px;
        height:30px;
        border-radius: 50%;
        text-align: center;
        line-height: 30px;
        margin-right:10px;
    }
    .top-loading-run{
        position: absolute;
        left:0;
        top:0;
        width:100%;
        height:100%;
    }
    .top-loading-run::after{
        position: absolute;
        content:' ';
        width:3px;
        height:3px;
        border-radius: 50%;
        background:#0AAAE6;
        left:50%;
        top:0;
        margin-top:-2px;
    }
    .top-logo-icon{
        color:#0AAAE6;
    }
    .top-alllink{
        display: flex;
        overflow: hidden;
        flex:1;
        margin-left:20px;
        height:100%;
    }
    .top-link{
        height:100%;
        padding:0 20px 0 10px;
        line-height:50px;
        color:#fff;
        font-size:16px;
        text-decoration: none;
        color:rgba(255,255,255,.6);
        transition:all .2s;
    }
    .top-link:hover{
        color:rgba(255,255,255,1)
    }
    .top-link.on{
        position: relative;
        color:rgba(255,255,255,1);
        background:rgba(255,255,255,.1);
    }
    .top-link.on::after{
        position: absolute;
        content: ' ';
        width:100%;
        height:2px;
        /* background:#0AAAE6; */
        left:0;bottom:0;
    }
    .top-link i{
        margin-right:3px;
    }

    .top-user{
        float:right;
        height:100%;
        padding-top: 5px;
    }
    .to-user-wrap{
        height:100%;
        margin-right:10px;
    }
    .top-user-head{
        display:block;
        width:40px;
        height:40px;
        margin-top:5px;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
    }
    .top-user-head img{
        width:40px;
        height:40px;
    }
    .top-so-btn{
        float:left;
        color:rgba(255,255,255,.6);
        height:30px;
        line-height:30px;
        font-size:14px;
        margin-right:10px;
        margin-top:10px;
        background:rgba(255,255,255,.1);
        border-radius: 5px;
        padding:0 10px 0 10px;
    }
    .top-so-btn:hover{
        background:rgba(255,255,255,.3);
    }
    .top-so-btn span{
        display:inline-block;
        padding-right:50px;
        font-size:14px;
    }
    .top-so{float:left;margin:9px 10px 0 0;width:100px;
        opacity: 0;
        transition: all .3s;
    }
    .top-so-show{
        opacity: 1;
        width:300px;
    }
    .my-autocomplete {
        li {
            line-height: normal;
            padding: 7px;
            .name {
                text-overflow: ellipsis;
                overflow: hidden;
                i{margin-right:3px;}
            }
            .addr {
                font-size: 12px;
                color: #b4b4b4;
            }
            .highlighted .addr {
                color: #ddd;
            }
        }
    }
    .top-open-history{
        float:left;
        margin:0 50px 0 0;
    }
    .top-history-btn{
        display:inline-block;
        width:30px;
        height:30px;
        background:rgba(255,255,255,.1);
        border-radius:5px;
        color:rgba(255,255,255,.6);
        text-align:center;
        line-height:30px;
        font-size:18px;
        margin-top:10px;
        cursor: pointer;
    }
    .top-history-btn:hover{
        background:rgba(255,255,255,.3);
    }
    .top-history-name {
        text-overflow: ellipsis;
        overflow: hidden;
        i{margin-right:3px;}
    }
    .top-history-addr {
        font-size: 12px;
        color: #b4b4b4;
    }
    .el-dropdown-menu{
        max-height: 300px;
        overflow: hidden;
        overflow-y: auto;
    }
    .username{
        display:inline-block;
        margin-right:10px;
        color:#fff;
        vertical-align: 13px;
    }

    /*转圈动画*/
@-webkit-keyframes turn{
  0%{-webkit-transform:rotate(0deg);transform:rotate(0deg);}
  50%{-webkit-transform:rotate(260deg);transform:rotate(180deg);}
  100%{-webkit-transform:rotate(360deg);transform:rotate(360deg);}
}
@-moz-keyframes turn{
    0%{-moz-transform:rotate(0deg);transform:rotate(0deg);}
    50%{-moz-transform:rotate(260deg);transform:rotate(180deg);}
    100%{-moz-transform:rotate(360deg);transform:rotate(360deg);}
}
@-ms-keyframes turn{
    0%{-ms-transform:rotate(0deg);transform:rotate(0deg);}
    50%{-ms-transform:rotate(260deg);transform:rotate(180deg);}
    100%{-ms-transform:rotate(360deg);transform:rotate(360deg);}
}
@keyframes turn{
    0%{transform:rotate(0deg);}
    50%{transform:rotate(260deg);}
    100%{transform:rotate(360deg);}
}
.turn-animate{
    -webkit-animation:turn 1s linear infinite;
       -moz-animation:turn 1s linear infinite;
        -ms-animation:turn 1s linear infinite;
            animation:turn 1s linear infinite;
}


    @media screen and (max-width : 1145px){
        .top-link{padding:0 10px;}
        .top-link i{display:none;}
    }
    @media screen and (max-width : 900px){
        .top-link{padding:0 5px;}
        .top-link span{font-size:14px;}
    }
    @media screen and (max-width : 600px){
        .top-link i{display:none;}
        .top-link i{display:inline-block;}
        .top-link span{display:none;}
    }



    .headpic{
        width:34px;
        height:34px;
        border-radius:50%;
        margin:2px 20px 0 0;
        border:1px solid rgba(255,255,255,.1);
        cursor:pointer;
    }
    .top-person-info-card{
        display:none;
        position:absolute;
        top:38px;
        right:10px;
        width:300px;
        padding:20px 20px 0;
        background:#fff;
        border:1px solid #ccc;
        box-shadow:0 5px 10px rgba(0,0,0,.2);
    }
    .top-person-hover{
        &>.headpic{
            border:1px solid rgba(255,255,255,.5);
        }
        &>.top-person-info-card{
            display:block;
        }
    }
    .top-exit-area{
        display:flex;
        justify-content: space-between;
        padding:10px 0;
        border-top:1px dashed #ccc;
        //text-align:right;
    }
    .top-person-info{
        display:flex;
        padding-bottom:20px;
        align-items: center;
    }
    .top-person-bighead{
        vertical-align:top;
        &>img{
            display:inline-block;
            width:80px;
            height:80px;
            border-radius:50%;
            border:1px solid #ccc;
        }
    }

    .top-person-name{
        display:inline-block;
        width:200px;
        padding-left:10px;
    }
    .top-person-name-detail{
        font-weight:normal;
        font-size:20px;
        margin:0;
    }
    .top-person-other{
        font-size:14px;
        &>span{
            display:inline-block;
            padding-right:10px;
            color:#888;
        }
    }

    .info-user-pic{
        display:inline-block;
        width:80px;
        height:80px;
        overflow:hidden;
        border-radius:50%;
    }
    .info-user-pic img{
        width:80px;
        height:80px;
    }

    .phone-v{
        font-size:18px;
        margin-right:5px;
        vertical-align: -2px;
    }
    .top-foumn{
        float:right;
        display: flex;
        justify-content: center;
        align-items: center;
        height:50px;
        margin-right:20px;
        
    }
    .top-bbs{
        display:inline-block;
        background:rgba(5,128,255,.8);
        color:#fff;
        border-radius:10px;
        padding:5px 15px;
        text-decoration: none;
        font-size:14px;
        transition: all .2s;
        margin-top:-3px;
    }
    a.top-bbs:hover{
        background:rgba(10,240,42,.8);
    }
</style>
