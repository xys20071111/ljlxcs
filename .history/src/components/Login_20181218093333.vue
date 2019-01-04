<template>
  <div class="wrap" id="loginroom">
    <v-app>
        <v-content>
           <v-container fluid fill-height>
              <v-flex align-center justify-center column reverse>
                  <div v-if="!scCode" >请用微信小程序扫描以上二维码</div>
                  <div id="qrcode"></div>
                  <!-- <v-btn @click.native="btnTest">测试</v-btn> -->
                  <v-content v-if="scCode" class="sc">
                      <v-layout align-center justify-center column reverse fill-height>
                        二维码已失效，请点击刷新，重新生成
                        <v-btn color="primary" large fab dark :loading="loading"  :disabled="loading" @click.native="loader = 'loading'" @click.native.prevent="userPowerQrcode"><v-icon>refresh</v-icon></v-btn>
                      </v-layout>
                  </v-content>
              </v-flex>
          </v-container>
        </v-content>
    </v-app>
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
      scCode: false
    }
  },
  mounted () {
    this.qrcode = new QRCode('qrcode', {
      width: 250, // 设置宽高
      height: 250
    })
    this.userPowerQrcode()
    let i = Math.floor(Math.random() * ((config.bgs.length - 1) - 0)) + 0
    document.getElementById('loginroom').style.backgroundImage = 'url(static/images/bgs/' + config.bgs[i] + ')'
    window.sessionStorage.removeItem('user')
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
          }, 5000)
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
    position:absolute;
    left:0;top:0;right:0;bottom:0;
    display:flex;
    justify-content: center;
    align-items: center;
    background-size: cover;
    -moz-user-select: none; /* Firefox */
    overflow: hidden;
  }
  .sc{
    position:absolute;
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
