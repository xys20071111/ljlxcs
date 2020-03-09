<template>
    <div class="wrap">
        <!--<div class="tipsay">-->
            <!--biz、dealer、cs系统目前已经三合一，请使用自己的手机号登录，如果账号不存在，功能缺失或找不到，请钉钉联系张燕。<br><br>-->
            <!--新后台的手机版会在一到两周后上线 (不需要下载客户端    ,使用手机浏览器即可访问)-->
        <!--</div>-->
        
        <div class="warning" :class="{'warning-height':showWarn}">
            <span>
                <i class="fa fa-warning"></i>
                请使用Chrome浏览器，否则可能出现未知错误！
            </span>
            <a href="javascript:;" class="close-warning" title="关闭" @click="showWarn=false"><i class="fa fa-close"></i></a>
        </div>
        
        <!--登录表单-->
        <div class="cs-form-area">
            <div class="login-banner">
                <h1 class="login-title">
                    <i class="fa fa-rocket"></i>
                    {{pageTitle[pageType]}}
                </h1>
            </div>
            <div class="cs-form-box">
                <div class="login-form-area">
                    <login-form v-show="pageType==='login'" :xpage="xPage" :loginsuccess="loginok" />
                    <reset-password v-if="pageType==='resetpwd'" :phone="loginForm.loginname" :xpage="xPage" />
                    <active-account v-if="pageType==='active'" :xpage="xPage" :formdata="loginForm" :loginsuccess="loginok"  />
                    <bind-device v-if="pageType==='bind'" :xpage="xPage" :formdata="loginForm" :loginsuccess="loginok"  />
                </div>
                <div class="cs-qrcode">
                    <img src="/static/images/qr.png" class="cs-qrimg" />
                    <div class="cs-qrsay">
                        <div class="login-tip">使用手机微信扫描左侧二维码登录</div>
                        <div class="cs-qrinfo"> 目前手机版只适配了常用页面，如需操作所有功能，可以切换到电脑版界面，切换方法参考教程。</div>
                    </div>
                </div>
                <div class="phone-version" v-if="isPhone">
                    <el-button @click="toPhone"><i class="fa fa-mobile phone-v"></i>手机版</el-button>
                </div>
            </div>
            
        </div>
        
        <!--帮助中心-->
        <a href="/static/help/dazhao/help.html" target="_blank" class="help-btn" title="使用技巧" v-if="!isPhone">
            <i class="fa fa-question-circle-o"></i>
        </a>
    </div>
</template>

<script>
import LoginForm from './LoginForm';
import ResetPassword from './ResetPassword';
import ActiveAccount from './ActiveAccount';
import BindDevice from './BindDevice';
import axios from 'axios';
import config from '../../config';
import cookie from 'vue-cookie';
export default {
    name: 'login',
    components:{
        LoginForm,
        ResetPassword,
        ActiveAccount,
        BindDevice
    },
    data () {
        return {
            pageType:'login',
            pageTitle: {
                "login":"乐学管理登录",
                "resetpwd":"重置密码",
                "active":"激活账号",
                "bind":"绑定设备"
            },
            loginForm:{},
            showWarn:false
        }
    },
    computed:{
        isPhone(){
            return this.$isMobile.any();
        }
    },
    methods:{
        toPhone(){
            window.location.href="/m";
        },
        //切换表单类型
        xPage(type,data){
            if(data){
                this.loginForm = data;
            }
            this.pageType = type;  
        },
        //登录成功
        loginok(data){
            //获取登录用户信息
            //this.$store.dispatch('getUserInfo');
            //存储token,并设置存储时间
            let now = new Date().getTime();
            let tokenObj = {
                token:data.usertoken,
                userid:data.userid,
                time:now
            };
            sessionStorage.setItem('token',JSON.stringify(tokenObj));
            localStorage.setItem('token',JSON.stringify(tokenObj));
            cookie.set('token',JSON.stringify(tokenObj));
            localStorage.removeItem('pagetabs');

            let bbs = this.$route.query.from;
            if(bbs!=1){
                this.$router.replace({path:'/'});
            }else{
                window.location.href="/items/forum/";
            }
        },
        
        showTip(n){
            if(n>=0){
                this.$notify({
                    title: help.tip.data[n].title,
                    message: help.tip.data[n].content,
                    duration: 50000
                });
                setTimeout(()=>{
                    this.showTip(n-1);
                },500)
            }
        }
    },
    created(){
        let isFromPhone = this.$route.query.isfromphone;
        if(this.$isMobile.any() && !isFromPhone){
            window.location.href='/m';
        }
        
        //如果已登录，则跳转至首页
        let token = sessionStorage.getItem('token');
        //let token = cookie.get('token');
        //let token = this.$getToken();
        let that = this;
        if(token){
            axios({
                method: 'get',
                url: config.auth + '/checkusertoken?usertoken='+JSON.parse(token).token,
            }).then(msg=>{
                if(msg && 'result' in msg.data && msg.data.result === 0){
                    that.$router.replace({path:'/'});
                }
            });
        }
        const userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        if (userAgent.indexOf("Chrome") <= -1) {
            setTimeout(()=>{
                this.showWarn = true;
            },1000);
        }
        
        
        // if(!this.isPhone){
        //     let _this = this;
        //     jQuery.getScript('/static/help.js?v='+new Date().getTime(),function(){
        //         _this.showTip(help.tip.showNum);
        //     });
        // }
    }
}
</script>
<style scoped lang="less">
.wrap{
    display:flex;
    justify-content: center;
    align-items: center;
    position: absolute;left:0;top:0;right:0;bottom:0;
    background:url(/static/images/bgs/b.jpg?v=2) center center no-repeat;background-size: cover;-moz-user-select: none;
}
.cs-form-area{
    width:430px;
    height:auto;
    /*padding-bottom:30px;*/
    position:absolute;
    left:50%;
    top:50%;
    -webkit-transform: translate(-50% -50%);
    transform: translate(-50%,-60%);
    box-shadow: 0 0 50px rgba(0,0,0,.5);
    transition: all .3s;
    border-radius:15px;
    overflow:hidden;
}


.login-banner{
    height:100px;
    //background:#2FA1F3;
    background:#EA7601;
    //background:rgba(0,0,0,.6);
    color:#fff;
    line-height:100px;
}
.cs-form-box{
    background:rgba(255,255,255,.9);
    padding-bottom:30px;
}

.login-title{
    margin:0;
    font-weight: normal;
    padding-left:20px;
    font-size:25px;
    text-align:left;
    &>i{
        font-size:40px;
        vertical-align: middle;
        margin-right:10px;
    }
}


    .tipsay{
        position:fixed;
        left:20px;
        top:50%;
        transform: translateY(-50%);
        width:320px;
        background:rgba(255,255,255,.8);
        line-height:2em;
        padding:20px;
        margin-top:-20px;

    }
    
    
    .phone-version{
        position:absolute;
        left:0;right:0;bottom:-80px;
        height:50px;
        text-align:center;
    }
    .phone-v{
        font-size:18px;
        margin-right:5px;
        vertical-align: -2px;
    }
    
    
    .cs-qrcode{
        margin:30px 46px 0;
        
    }
    .cs-qrimg{
        float:left;
        width:140px;
        height:140px;
    }
    .cs-qrsay{
        margin-left:160px;
    }
    .login-tip{
        font-size:17px;
        font-weight:bold;
    }
    .cs-qrinfo{
        text-indent: 2em;
        line-height:1.7em;
        font-size:14px;
        color:#777;
        margin-top:5px;
    }
    
    .help-btn{
        text-decoration: none;
        position:fixed;
        right:-200px;
        bottom:50px;
        display:flex;
        justify-content: center;
        align-items: center;
        width:80px;
        height:80px;
        background:rgba(0,0,0,.5);
        border-radius:50%;
        color:#fff;
        font-size:60px;
        transition: all .2s;
        animation:move-in .5s 2s forwards;
    }
    a.help-btn:hover{
        background:rgba(123,213,28,.5)
    }
    @keyframes move-in {
        0%{
            right:-200px;
        }
        100%{
            right:50px;
        }
    }
    
    .help-tips{
        position: fixed;
        right:20px;
        bottom:180px;
        width:400px;
        height:300px;
        background:red;
        
    }
    
    
    .warning{
        display:flex;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        left:0;top:-50px;right:0;
        height:50px;
        background:#F8F969;
        padding:0 30px;
        color:#f00;
        font-size:18px;
        transition: all .2s;
    }
    .warning-height{
        top:0;
    }
    .close-warning{
        color:#999;
    }
</style>
