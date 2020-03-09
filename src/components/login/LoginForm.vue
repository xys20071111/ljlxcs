<template>
    <div class="login-form">
        <div class="login-main">
            <div class="login-form-center" id="login">
                <el-form :model="form" :rules="rules" ref="form" label-width="60px" autocomplete="off" @submit.native.prevent>
                    <el-form-item label="账号" prop="loginname">
                            <el-autocomplete
                                ref="accountname"
                                class="login-phone"
                                v-model="form.loginname"
                                :fetch-suggestions="querySearch"
                                placeholder=""
                                :trigger-on-focus="false"
                                @select="phoneSelect"
                                clearable
                                auto-complete="off"
                            >
                            </el-autocomplete>
                    </el-form-item>
                    <input type="text" style="display:none;" />
                    <el-form-item label="密码" prop="password" v-if="loginType===0">
                        <el-input :type="pwdipttype" v-model="form.password" autocomplete='off' @keyup.native.enter="submit('form')" @focus="replacePwdType" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="authcode" v-if="loginType===1">
                        <el-row>
                            <el-col :span="14">
                                <el-input v-model.number="form.authcode" autocomplete="off" @keyup.native.enter="submit('form')"></el-input>
                            </el-col>
                            <el-col :span="10">
                                <el-button @click="getAuthCode" class="pop-btn-code" :disabled="isAuthCode">{{ authCodeText }}</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-button type="warning" class="btn-login" @click="submit('form')" :loading="logining">登 录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="bottom-ctrl">
            <el-button type="text" @click="xLoginType">{{loginType===0?'验证码登录':'密码登录'}}</el-button>
            <el-button type="text" @click="xpage('resetpwd',form)">重置密码<i class="fa fa-arrow-circle-right" style="margin-left:3px;"></i></el-button>
        </div>
    </div>
</template>

<script>
let preg=/^1\d{10}$/;
import config from '../../config.js';
const isMobile = {
    Android: function() {return navigator.userAgent.match(/Android/i) ? true : false;},
    BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i) ? true : false;},
    iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;},
    iPad:function() {return navigator.userAgent.match(/iPad/i) ? true : false;},
    iPhone:function() {return navigator.userAgent.match(/iPhone/i) ? true : false;},
    Windows: function() {return navigator.userAgent.match(/IEMobile/i) ? true : false;},
    Phone: function() {return navigator.userAgent.match(/Mobile/i) ? true : false;},
    any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.Windows() || isMobile.Phone()||isMobile.iOS());}
};
const getDeviceType = function(){
    if(!isMobile.any()) return 2;
    if(isMobile.iPhone()) return 6;
    if(isMobile.iPad()) return 7;
    if(isMobile.Android()) return 4;
    if(isMobile.Windows()) return 3;
    return 2;
};
export default {
    name: 'loginform',
    props:['xpage','loginsuccess'],
    data () {
        let checkAccount = (rule, value, callback) => {
            if (!preg.test(value)) {
                this.form.password = '';
                this.pwdipttype = 'text';
                return callback(new Error('请输入正确的手机号码！'));
            }else{
                callback();
            }
        };
        let checkPassword = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入密码！'));
            }else{
                callback();
            }
        };
        let checkEmpty = (rule, value, callback) => {
            if (!value) {
                return callback(new Error(rule.message));
            }else{
                callback();
            }
        };
        return {
            form:{
                loginname:'',
                password:'',
                authcode:''
            },
            rules:{
                loginname:[{ validator: checkAccount, trigger: 'blur' }],
                password:[{ validator: checkPassword, trigger: 'blur' }],
                authcode:[{ validator: checkEmpty, trigger: 'blur',message:'请输入验证码'}]
            },
            isAuthCode:false,
            authCodeText:'获取验证码',

            loginType:0, //0 密码登录 1 验证码登录
            logining:false,//正在登录

            pwdipttype:'text', //密码框的类型，密码框获得焦点时切换为password，防止chrome记住密码而引起一些输入框的冲突
        }
    },
    computed:{
        //登录过的手机号码，供提示
        logPhones(){
            let logs = this.$store.state.system.loginPhones;
            return logs.map(item=>{
                return {value:item};
            });
        }
    },
    methods:{
        replacePwdType(){
            this.pwdipttype = 'password';
        },
        querySearch(queryString, cb) {
            let restaurants = this.logPhones;
            let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
            return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        phoneSelect(item) {
            this.$refs['form'].validateField('loginname');
        },
        //获取验证码
        getAuthCode(){
            let self = this;
            this.isAuthCode = true;
            let t = 60;
            this.authCodeText = t+'s';
            let timer = setInterval(()=>{
                t--;
                this.authCodeText = t+'s';
                if(t === 0){
                    clearInterval(timer);
                    this.authCodeText = '获取验证码';
                    this.isAuthCode = false;
                }
            },1000);
            
            //请求开始、、、、、、、、、
            this.getPhoneAuthCode();
        },
        //获取手机验证码
        async getPhoneAuthCode(){
            //请求
            //请求
            let msg = await this.$get(config.auth + '/sendsmscodebyloginname',{loginname:this.form.loginname});
            if(msg.result === 0){
                this.$message({
                    type:'success',
                    message:'验证码已发送'
                });
            }
        },
        //执行登录
        submit(formName){
            //this.$router.push({path:'/'});
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    this.logining = true;
                    let p = Object.assign({},this.form);
                    p.deviceid = config.deviceid;
                    p.devicetype = getDeviceType();
                    if(this.loginType !== 1){
                        delete p.authcode;
                    }
                    //let msg = await this.$myPost('http://127.0.0.1:3000/login',p);
                    let msg = await this.$myGet(config.auth + '/login',p);
                    this.logining = false;
                    if(msg.result === 0){
                        //登录成功
                        this.loginsuccess(msg.data);
                    }else if(msg.result === 1004){
                        //激活账号
                        this.xpage('active',p);
                    }else if(msg.result === 1003){
                        //绑定设备
                        this.xpage('bind',p);
                    }else{
                        this.$message.error(msg.msg?msg.msg:'请求错误！');
                    }
                    this.savePhoneToLocal()
                } else {
                    return false;
                }
            });
        },
        //0 密码登录 1 验证码登录
        xLoginType(){
            this.loginType = this.loginType === 0?1:0;
        },
        savePhoneToLocal(){
            //本号码存入本地记录
            let ary = [...this.$store.state.system.loginPhones];
            let index = -1;
            for(let i=0;i<ary.length;i++){
                if(ary[i] === this.form.loginname){
                    index = i;
                    break;
                }
            }
            if(index !== -1){
                ary.splice(index,1);
            }
            ary.unshift(this.form.loginname);
            this.$store.commit('xLoginPhones',ary);
            localStorage.setItem('logphones',JSON.stringify({phones:ary}));
        }
    },
    created(){
        //读取本地登录记录
        let logs = localStorage.getItem('logphones');
        if(logs){
            let data = JSON.parse(logs);
            this.$store.commit('xLoginPhones',data.phones);
            //最近登录的账号放入输入框
            this.form.loginname = data.phones.length>0?data.phones[0]:'';
        }
    }
}
</script>
<style scoped lang="less">
    .login-form{

    }
    .login-main{
        margin:0 70px 0 30px;
        text-align: left;
        padding-top:40px;
    }
    .login-phone{width:100%;}

    .btn-login{
        display: block;
        width:100%;
    }
    .pop-btn-code{width:100%;}
    .login-form-center{

    }
    .bottom-ctrl{
        text-align:center;
    }
</style>
