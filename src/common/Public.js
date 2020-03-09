import axios from 'axios';
import lodash from 'lodash';
import moment from 'moment';
import config from '../config';
const CancelToken = axios.CancelToken;
import cookie from 'vue-cookie';
import showDialog from './popbox';

let loadIndex = null;
let fetchs = {
    flag:0
};
const loadingObj = {};
//生成唯一标识符
const getUuid = () => {
    let d = new Date().getTime();
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
    //return uuid;
};

const isMobile = {
    Android: function() {return navigator.userAgent.match(/Android/i) ? true : false;},
    BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i) ? true : false;},
    iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;},
    Windows: function() {return navigator.userAgent.match(/IEMobile/i) ? true : false;},
    Phone: function() {return navigator.userAgent.match(/Mobile/i) ? true : false;},
    any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.Windows() || isMobile.Phone()||isMobile.iOS());}
};


const hasMenu = (tree,id) => {
    for(let i=0; i<tree.length; i++){
        if(!tree[i].children || tree[i].children.length===0){
            if(tree[i].id === id){
                return true;
            }
        }else{
            if(hasMenu(tree[i].children,id)){
                return true;
            }
        }
    }
    return false;
};

export default {
    install(Vue,options){
        Vue.prototype.lodash = lodash;
        Vue.prototype.jQuery = jQuery;
        Vue.prototype.moment = moment;
        Vue.prototype.axios = axios;
        Vue.prototype.cookie = cookie;
        //全屏loading
        Vue.prototype.$showLoading = function(){
            loadIndex = layer.load();
            //this.$loading();
        };
        //close loading
        Vue.prototype.$closeLoading = function(){
            layer.close(loadIndex);
        };
        //dialog
        Vue.prototype.$showDialog = showDialog;
        //selfcode 当返回值代码（result）不为0时，一般视为请求成功，但结果不是预期，系统弹出服务器返回的错误提示。如果请求时传入selfcode则表示交给自己来处理返回的错误
        Vue.prototype.$ajax = async function(type,url,params,selferr){
            let f = fetchs.flag ++;
            let option = {
                method: type,
                url: url,
                cancelToken: new CancelToken(function (cancel) {
                    fetchs['cancel'+f] = cancel;
                })
            };
            let token = sessionStorage.getItem('token');
            //let token = cookie.get('token');
            if(token){
                option.headers = {Accept:'application/json',Authorization:JSON.parse(token).token};
            }
            let p=params?params:{};
            if(type === 'get'){
                option.params = p;
            }else{
                option.data = p;
            }
            let showLogoLoading = Symbol();
            try{
                loadingObj[showLogoLoading] = 'show';
                //this.$store.commit('xLogoLoading',true);
                let msg = await axios(option);
                delete(fetchs['cancel' + f]);
                if(msg.data.result !== 0){
                    if(!selferr){
                        this.$error(msg.data.msg);
                    }
                    //未登录,清空本地token
                    if(msg.data.result === 1008){
                        sessionStorage.removeItem('token');
                        //cookie.delete('token');
                        this.$router.replace({path:'/login'});
                    }
                }
                return msg;
            }catch(error){
                this.$store.commit('xLogoLoading',false);
                delete(fetchs['cancel' + f]);
                this.$closeLoading();
                if('response' in error){
                    console.error(error.response);
                }
                let err = {data:{result:-1,msg:'网络错误',data:{}}};
                this.$error(err.data.msg);
                return err;
            }finally{
                delete loadingObj[showLogoLoading];
                if(Object.keys(loadingObj).length===0){
                    this.$store.commit('xLogoLoading',false);
                }
            }
        };
        //get
        Vue.prototype.$get = async function(url,params){
            let msg = await this.$ajax('get',url,params);
            if('data' in msg){
                if(msg.data == null){
                    msg.data = {};
                }
            }else{
                msg.data = {};
            }
            return msg.data;
        };
        //post
        Vue.prototype.$post = async function(url,params){
            let msg = await this.$ajax('post',url,params);
            return msg.data;
        };
        //get
        Vue.prototype.$myGet = async function(url,params){
            let msg = await this.$ajax('get',url,params,true);
            return msg.data;
        };
        //post
        Vue.prototype.$myPost = async function(url,params){
            let msg = await this.$ajax('post',url,params,true);
            return msg.data;
        };
        Vue.prototype.$error = function(msg){
            this.$message.error(msg?msg:'操作失败');
        };
        //中断所有请求
        Vue.prototype.$cancelAjax = function(){
            this.$closeLoading();
            for(let x in fetchs){
                if(x !== 'flag' && fetchs.hasOwnProperty(x)){
                    fetchs[x]();
                }
            }
        };

        //内页中可调此方法打开新标签页 传入链接地址和网页名称
        Vue.prototype.$openWin = function({url,name,menuid}){
            console.log(this.$store.state.system.menuTree);
            let uuid = getUuid();
            //有menuid传进来，要检查菜单树内是否有此id的菜单，没有，则视为无权限访问
            if(menuid !== undefined && !hasMenu(this.$store.state.system.menuTree,menuid)){
                this.$store.commit('openNewView',{
                    id:uuid,
                    uri:'/#/nopage',
                    name:name?name:'新标签',
                    isFormInner:false //页面内部发起的新页面操作
                });
                return;
            }

            this.$store.commit('openNewView',{
                id:uuid,
                uri:url,
                name:name?name:'新标签',
                isFormInner:false //页面内部发起的新页面操作
            });
        };
        Vue.prototype.$getUuid = function(){
            return getUuid();
        };
        //f5刷新当前标签
        Vue.prototype.$f5 = function(){
            let ifrid = this.$store.state.system.activeNodeName;
            const iframe = window.document.getElementById(''+ifrid);
            if(iframe){
                let $tab = $('#tab-'+ifrid);
                let $ifr = $('#'+ifrid);
                if($tab && $ifr){
                    $tab.get(0).children[0].children[0].style.display = 'inline-block';
                    $ifr.get(0).contentWindow.location.reload(true);
                    if ($ifr.get(0).attachEvent) {
                        $ifr.get(0).attachEvent("onload", function() {
                            $tab.get(0).children[0].children[0].style.display = 'none';
                        });
                    } else {
                        $ifr.get(0).onload = function() {
                            $tab.get(0).children[0].children[0].style.display = 'none';
                        };
                    }
                }
            }
        };

        //验证手机号
        Vue.prototype.$chkPhone = function(phone){
            //let preg=/^(13[0-9]|15[012356789]|16[0-9]|17[0-9]|18[0-9]|19[0-9]|14[57])[0-9]{8}$/;
            let preg = /^1\d{10}$/;
            return preg.test(phone);
        };
        //时间戳转换成本地时间
        Vue.prototype.$toLocalTime = function(num){
            return moment.unix(num).format('YYYY-MM-DD HH:mm:ss');
        };
        //获取token
        Vue.prototype.$getToken = function(){
            let token1 = sessionStorage.getItem('token');
            let token2 = localStorage.getItem('token');
            let token3 = cookie.get('token');
            let token = '';
            if(token1){
                token = token1;
            }else if(token2){
                token = token2;
            }else{
                token = token3;
            }
            return JSON.parse(token).token;
        };
        //清除token
        Vue.prototype.$delToken = function(){
            sessionStorage.removeItem('token');
            localStorage.removeItem('token');
            cookie.delete('token');
        };

        Vue.prototype.$isMobile = isMobile;

        Vue.prototype.$isWeiXin = function(){
            let ua = window.navigator.userAgent.toLowerCase();
            return ua.match(/MicroMessenger/i) == 'micromessenger';
        };

        //获取地区数组的有效areaid
        Vue.prototype.$getAreaidFromAreaPath = function(areaIdPath){
            if(areaIdPath.length===0) return 0;
            if(areaIdPath.length===1) return areaIdPath[0];
            if(areaIdPath.length > 1){
                if(areaIdPath[areaIdPath.length-1] === 0){
                    return areaIdPath[areaIdPath.length-2];
                }else{
                    return areaIdPath[areaIdPath.length-1];
                }
            }
        };

        //post下载文件
        Vue.prototype.$postDownload = function(url,p,filename,fn){
            let that = this;
            let param = [];
            for(let x in p){
                param.push(x + '=' + p[x]);
            }
            const xhr = new XMLHttpRequest();
            this.$showLoading();
            xhr.open('POST', url, true);
            let tk = sessionStorage.getItem('token');
            let token = JSON.parse(tk).token;// 也可以使用POST方式，根据接口
            xhr.setRequestHeader("Authorization",token);
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.responseType = "blob";    // 返回类型blob
            // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
            xhr.onload = function () {
              that.$closeLoading();
                // 请求完成
                if (this.status === 200) {
                    // 返回200
                    let blob = this.response;
                    let reader = new FileReader();
                    reader.readAsDataURL(blob);    // 转换为base64，可以直接放入a表href
                    reader.onload = function (e) {
                        // 转换完成，创建一个a标签用于下载
                        let a = document.createElement('a');
                        a.download = filename + '.xls';
                        a.href = e.target.result;
                        $("body").append(a);    // 修复firefox中无法触发click
                        a.click();
                        $(a).remove();
                    }
                }

                if(typeof(fn)==='function'){
                    fn();
                }
            };
            // 发送ajax请求
            xhr.send(param.join('&'));
        };
        Vue.prototype.$getDownload = function(url,p,filename,fn){
            let param = [];
            for(let x in p){
                param.push(x + '=' + p[x]);
            }
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url+'?'+param.join('&'), true);
            let tk = sessionStorage.getItem('token');
            let token = JSON.parse(tk).token;// 也可以使用POST方式，根据接口
            xhr.setRequestHeader("Authorization",token);
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.responseType = "blob";    // 返回类型blob
            // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
            xhr.onload = function () {
                // 请求完成
                if (this.status === 200) {
                    // 返回200
                    let blob = this.response;
                    let reader = new FileReader();
                    reader.readAsDataURL(blob);    // 转换为base64，可以直接放入a表href
                    reader.onload = function (e) {
                        // 转换完成，创建一个a标签用于下载
                        let a = document.createElement('a');
                        a.download = filename + '.xls';
                        a.href = e.target.result;
                        $("body").append(a);    // 修复firefox中无法触发click
                        a.click();
                        $(a).remove();
                    }
                }
                if(typeof(fn)==='function'){
                    fn();
                }
            };
            // 发送ajax请求
            xhr.send();
            //xhr.send(JSON.stringify(p));
            //xhr.send(p);
        }
    }
}
