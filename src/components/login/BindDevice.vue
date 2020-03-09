<template>
    <div class="login-form">
        <div class="login-main">
            <div class="login-form-center" id="login">
                <div class="active-tip"><i class="el-icon-info"></i>输入验证码绑定当前设备</div>
                <el-form :model="form" :rules="rules" ref="form" label-width="80px" @submit.native.prevent>
                    <el-form-item label="验证码" prop="authcode">
                        <el-row>
                            <el-col :span="14">
                                <!--<el-input v-model.number="form.authcode" auto-complete="off" @keyup.native.enter="submit('form')"> </el-input>-->
                                <el-input v-model="form.authcode" autocomplete='off' @keyup.native.enter="submit('form')" clearable> </el-input>
                            </el-col>
                            <el-col :span="10">
                                <el-button @click="getAuthCode" class="pop-btn-code" :disabled="isAuthCode">{{ authCodeText }}</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-button type="warning" class="btn-login" @click="submit('form')" :loading="logining">绑 定</el-button>
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
        name: "bind-device",
        props:['xpage','formdata','loginsuccess'],
        data(){
            let checkEmpty = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error(rule.message));
                }else{
                    callback();
                }
            };
            return {
                form:{
                    authcode:'',
                },
                rules:{
                    authcode:[{ validator: checkEmpty, trigger: 'change',message:'请输入验证码'}],
                },

                isAuthCode:false,
                authCodeText:'获取验证码',
                logining:false
            }
        },
        methods:{
            //执行激活
            submit(formName){
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        this.logining = true;
                        let p = Object.assign({},this.formdata);
                        p.authcode = this.form.authcode;
                        let msg = await this.$myGet(config.auth + '/login',p);
                        this.logining = false;
                        if(msg.result === 0){
                            //登录成功
                            this.loginsuccess(msg.data);
                        }else if(msg.result === 1004){
                            //激活账号
                            this.xpage('active',this.formdata);
                        }else if(msg.result === 1003){
                            //绑定设备
                            this.xpage('active',this.formdata);
                        }else{
                            this.$error(msg.msg);
                        }
                    } else {
                        return false;
                    }
                });
            },
            //获取验证码
            getAuthCode(){
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
                let msg = await this.$get(config.auth + '/sendsmscodebyloginname',{loginname:this.formdata.loginname});
                if(msg.result === 0){
                    this.$message({
                        type:'success',
                        message:'验证码已发送'
                    });
                }
            },
        }
    }
</script>

<style scoped lang="less">
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
    .active-tip{
        padding:0 0 20px 28px;
        i{margin-right:3px;color:#E6A23C;}
    }
    .pop-btn-code{width:100%;}
    .bottom-ctrl{
        text-align:center;
    }
</style>
