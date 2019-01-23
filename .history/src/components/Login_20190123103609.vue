<template>
  <div class="wrap" id="loginroom">
    <v-snackbar
      v-model="snackbar[0]"
      :timeout="5000"
      top
      right
      multi-line
      :color="snackbar[2]"
    >
      {{snackbar[1]}}
      <v-btn
        flat
        @click="snackbar.splice(0 , 1 , false)"
      >
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-content>
        <v-container fluid fill-height justify-center>
          <v-layout align-center justify-center column reverse style="just-content:center;padding:15px;flex:0 0 auto;background:#fff">
              <div v-if="!scCode" style="margin-top:10px;font-size:16px">请用微信小程序扫描以上二维码</div>
              <div id="qrcode"></div>
              <v-content v-show="scCode" class="sc">
                  <v-layout align-center justify-center column reverse fill-height >
                    二维码已失效，请点击刷新，重新生成
                    <v-btn color="primary" large fab dark :loading="loading"  :disabled="loading" @click.native="loader = 'loading'" @click.native.prevent="userPowerQrcode"><v-icon>refresh</v-icon></v-btn>
                  </v-layout>
              </v-content>
          </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { setCookie } from '@/utils/cookie'
import Fingerprint from 'fingerprintjs'
import MenuUtils from '@/utils/MenuUtils'
import QRCode from 'qrcodejs2'
import API from '../api/API.js'
import config from '../config.js'
const api = new API()
const fingerprint = new Fingerprint().get()
const appData = require('./data.json').menus
var routers = []

export default {
  name: 'Login',
  created () {
    document.title = config.siteName
  },
  data () {
    return {
      loader: null,
      loading: false,
      scCode: false,
      snackbar: []
    }
  },
  mounted () {
    this.$route.query && (this.snackbar = [true, '页面超时，请重新登录', 'success'])
    this.qrcode = new QRCode('qrcode', {
      width: 250, // 设置宽高
      height: 250
    })
    this.userPowerQrcode()
    let i = Math.floor(Math.random() * ((config.bgs.length - 1) - 0)) + 0
    document.getElementById('loginroom').style.backgroundImage = 'url(static/images/bgs/' + config.bgs[i] + ')'
    window.sessionStorage.removeItem('user')
    window.sessionStorage.removeItem('buttons')
    window.sessionStorage.removeItem('actives')
  },
  methods: {
    // 取二维码数据
    userPowerQrcode () {
      let params = {
        'api': this.HOSTUserPower,
        'param': {
          'method': 'qrcode',
          'data': JSON.stringify({
            'dev_id': fingerprint
          })
        }
      }
      api
        .post(params)
        .then(res => {
          clearTimeout(this.timeout)
          clearTimeout(this.timeoutqr)
          this.scCode = false
          let msg = res.data.data
          let outtime = (msg.time - Math.round(new Date() / 1000)) * 1000
          let data = JSON.stringify({ 'qrcode': msg.qrcode, 'dev_id': fingerprint })
          this.qrcode.clear()
          this.qrcode.makeCode('https://wxhome.ljlx.com/launch?intent=login&data=' + data)
          this.qrcodeSw(outtime)
          this.timeout = setInterval(() => {
            this.checkLogin(msg.qrcode)
          }, 4000)
        })
        .catch(err => {
          console.log(err)
        })
    },
    qrcodeSw (outtime) {
      clearTimeout(this.timeoutqr)
      this.timeoutqr = setInterval(() => {
        clearTimeout(this.timeout)
        this.scCode = true
      }, outtime)
    },
    // 轮询问是否登录成功
    checkLogin (qrcode) {
      let params = {
        'api': this.HOSTUserPower,
        'param': {
          'method': 'check_login',
          'data': JSON.stringify({
            'qrcode': qrcode,
            'dev_id': fingerprint
          })
        }
      }
      api
        .post(params)
        .then(res => {
          let msg = res.data
          if (msg.code === 0) {
            clearTimeout(this.timeout)
            clearTimeout(this.timeoutqr)
            setCookie('wsc2', msg.data.access_token, '1') // cookie过期时间为1天
            localStorage.setItem('refresh_token', msg.data.refresh_token)
            this.mylogintest()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    login (data) {
      window.sessionStorage.setItem('user', JSON.stringify(data))
      MenuUtils(routers, data)
    },
    mylogintest () {
      this.login(appData)
      this.$router.addRoutes(routers)
      this.$router.push({ path: '/main' })
    },
    setSnaker: () => {

    }
  },
  watch: {
    loader () {
      const l = this.loader
      this[l] = !this[l]
      setTimeout(() => (this[l] = false), 3000)
      this.loader = null
    }
  },
  props: {
    source: String
  },
  beforeDestroy () {
    clearTimeout(this.timeout)
    clearTimeout(this.timeoutqr)
  }
}
</script>

<style scoped>
  .wrap{
    width: 100%;
    height: 100%;
    display:flex;
    justify-content: center;
    align-items: center;
    background-size: cover;
    -moz-user-select: none; /* Firefox */
    overflow: hidden;
  }
  .sc{
    position: absolute;
    background-color: #ffffff;
    filter:alpha(Opacity=90);-moz-opacity:0.9;opacity: 0.9;
    width: 255px;
    height: 255px;
  }
  .theme--light .application{
    background: transparent;
  }
  .application--wrap{
    min-height: 0;
    background: #ffffff;
  }
</style>
