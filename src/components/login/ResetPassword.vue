<template>
    <div class="login-form">
        <div class="login-main">
            <div class="login-form-center" id="login">
                <el-form :model="form" :rules="rules" ref="form" label-width="80px">
                    <el-form-item label="账号" prop="loginname">
                        <el-input type="text" v-model="form.loginname" auto-complete="off" clearable></el-input>
                    </el-form-item>
                    <input type="text" style="display:none;" />
                    <el-form-item label="密码" prop="password">
                        <el-input :type="pwdipttype" v-model="form.password" auto-complete="off" clearable @focus="replacePwdType"></el-input>
                    </el-form-item>
                    <input type="text" style="display:none;" />
                    <el-form-item label="确认密码" prop="repassword">
                        <el-input type="password" v-model="form.repassword" auto-complete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="authcode">
                        <el-row>
                            <el-col :span="14">
                                <el-input v-model.number="form.authcode" auto-complete="off"></el-input>
                            </el-col>
                            <el-col :span="10">
                                <el-button @click="getAuthCode" class="pop-btn-code" :disabled="isAuthCode">{{ authCodeText }}</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-button type="warning" class="btn-login" @click="submit('form')" :loading="logining">确 定</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="bottom-ctrl">
            <el-button type="text" @click="xpage('login')"><i class="fa fa-arrow-circle-left" style="margin-right:3px;"></i>返回登录</el-button>
        </div>
    </div>
</template>

<script>
import config from '../../config';
export default {
    name: 'loginform',
    props:['phone','xpage'],
    data () {
        let checkAccount = (rule, value, callback) => {
            let preg=/^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
            if (!preg.test(value)) {
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
        let checkRePassword = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请确认密码！'));
            }else if(value != this.form.password){
                return callback(new Error('两次密码不匹配！'));
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
                repassword:'',
                authcode:''
            },
            rules:{
                loginname:[{ validator: checkAccount, trigger: 'blur'}],
                password:[{ validator: checkPassword, trigger: 'blur' }],
                repassword:[{ validator: checkRePassword, trigger: 'blur' }],
                authcode:[{ validator: checkEmpty, trigger: 'blur',message:'请输入验证码'}]
            },
            isAuthCode:false,
            authCodeText:'获取验证码',
            pwdipttype:'text',
            logining:false
        }
    },

    methods:{
        replacePwdType(){
            this.pwdipttype = 'password';
        },
        //重置密码时获取验证码
        getAuthCode(){
            let preg=/^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
            if(!preg.test(this.form.loginname)){
                this.$message({
                    type:'warning',
                    message:'请输入正确的手机号'
                });
                return;
            }

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
            let msg = await this.$get(config.auth + '/sendsmscodebyloginname',{loginname:this.form.loginname});
            if(msg.result === 0){
                this.$message({
                    type:'success',
                    message:'验证码已发送'
                });
            }
        },
        //执行修改
        submit(formName){
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    this.logining = true;
                    let p = Object.assign({},this.form);
                    delete p.repassword;
                    //let msg = await this.$myPost('http://127.0.0.1:3000/login',p);
                    let msg = await this.$get(config.auth + '/changepassword',p);
                    this.logining = false;
                    if(msg.result === 0){
                        //密码修改成功，重新登录
                        this.$message({
                            type:'success',
                            message:'密码修改成功，请重新登录'
                        });
                        this.xpage('login');
                    }
                } else {
                    return false;
                }
            });
        }
    },
    created(){
        this.form.loginname = this.phone;
    }
}
</script>
<style scoped>
    .login-form{
        
    }
    .login-main{
        margin:0 70px 0 30px;
        text-align: left;
        padding-top:40px;
    }
    .ipt-one-box{
        width:100%;
        height:30px;
        border:1px solid #BBB;
        transition: all .2s;
        border-radius:3px;
        overflow: hidden;
        background:rgba(255,255,255,.8);
        margin-bottom:15px;
    }
    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px white inset;
    }
    input:focus{
        outline: none;
    }
    .btn-login{
        display: block;
        width:100%;
    }
    .pop-btn-code{width:100%;}
    .bottom-ctrl{
        text-align:center;
    }
</style>
