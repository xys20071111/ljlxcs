<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
       <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img :src="userinfo.avatar">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{userinfo.uname}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list>
        <v-divider></v-divider>
        <v-list-group
          v-for="(item, index) in nodes"
          v-model="item.active"
          v-if="!item.hidden"
          :key="item.name"
          :prepend-icon="item.iconCls"
          no-action
        >
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile
            v-for="(subItem, subIndex) in item.children"
            :key="subItem.name"
            :color="actives[buttonsShow]&&index === actives[buttonsShow][0]&&subIndex === actives[buttonsShow][1]?'blue':''"
            @click="clickRouterName(subItem, [index, subIndex])"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ subItem.name }}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon>{{ subItem.action }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-snackbar
      v-model="show"
      :timeout="5000"
      top
      right
      multi-line
    >
      {{snackbar}}
      <v-btn
        flat
        @click="show = false"
      >
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-toolbar
      app
      :clipped-left="clipped"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
     
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-btn icon slot="activator">
          <v-icon>settings_power</v-icon>
        </v-btn>
        <v-card>
          <v-card-title class="headline">退出?</v-card-title>
          <v-card-text>您确定退出吗？退出之后只能通过微信小程序扫码重新登录方可进入.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" flat @click.native="dialog = false">取消</v-btn>
            <v-btn color="green darken-1" flat @click.native="clickexit">确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
    </v-toolbar>

    <v-breadcrumbs :items="$route.matched">
      <v-icon slot="divider">chevron_right</v-icon>
      <template slot="item" slot-scope="props">
       {{ props.item.name.toUpperCase() }}
      </template>
    </v-breadcrumbs>

    <div class="tabBox" v-if="buttonsShow > -1 && buttons.length">
      <v-tabs
        v-model="buttonsShow" 
        color="grey lighten-3" 
        height="40" 
        hide-slider 
        show-arrows 
        class="align-center allButton"
      >
        <v-tab 
          v-for="(item,index) in buttons" :key="index" 
          :class="buttonsShow === index?'blue--text buttonPick':''" 
          @click="clickWhich(index)"
        >
          <v-icon class="mx-1 iconLeft" @click.stop="buttonNew(index)">cached</v-icon>
          {{ item }}
          <v-icon class="mx-1 iconLeft" @click.stop="buttonRemove(index)">clear</v-icon>
        </v-tab>
        <v-spacer></v-spacer>
      </v-tabs>
      <v-dialog v-model="dialogs" persistent max-width="290">
        <v-btn icon slot="activator" small class="iconRight">
          <v-icon class="iconRight">clear</v-icon>
        </v-btn>
        <v-card>
          <v-card-title class="headline">提示</v-card-title>
          <v-card-text>确认关闭所有标签吗？</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" flat @click.native="dialogs = false">取消</v-btn>
            <v-btn color="green darken-1" flat @click.native="removeAll">确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <router-view  ref="child" />
        
  </v-app>
</template>

<script>
import API from '../api/API.js'
import { formatAvatar } from '../api/dist.js'
const api = new API()
export default {
  name: 'Home',
  data () {
    return {
      formatAvatar,
      userinfo: {},
      breadcrumbs: [],
      nodes: this.$router.options.routes,
      clipped: false,
      drawer: true,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: '后台管理',
      dialog: false,
      show: false,
      snackbar: '',
      dialogs: false,
      buttons: [],
      actives: [],
      buttonsShow: -1
    }
  },
  watch: {
    buttonsShow (e) {
      if (e === -1 || e === undefined) { return false }
      console.log(this.actives)
      this.nodes = this.nodes.map((value, index) => {
        value.active = index === this.actives[e][0]
        return value
      })
    }
  },
  mounted () {
    this.breadcrumbs = this.$route.matched
    this.getaccount()
    let clickAll = window.sessionStorage.getItem('buttons')
    let activeAll = window.sessionStorage.getItem('actives')
    this.buttons = clickAll ? JSON.parse(clickAll) : []
    this.actives = activeAll ? JSON.parse(activeAll) : []
    this.buttonsShow = this.buttons.indexOf(this.$route.name)
    if (this.buttonsShow === -1) {
      this.removeAll()
      return false
    }
  },
  created () {
    // setCookie('wsc1', 'C880A53B6380113AD13E3A6512E72659AE327017FgNRzeRORGan4g3tY8xY70m3AQGmN8luCgnNtjOGNZifems%2b7NMykRwBCiS9f2kHK%2f44M3s%3d;', '1')
    let isLoadNodes = sessionStorage.getItem('isLoadNodes')
    if (!isLoadNodes) {
      let data = JSON.parse(window.sessionStorage.getItem('user'))
      this.nodes.push(...data)
      sessionStorage.setItem('isLoadNodes', 'true')
    }
  },
  methods: {
    getaccount () {
      let params = {
        api: this.HOSTCSM,
        param: {
          method: 'getaccount'
        }
      }
      api
        .post(params)
        .then(res => {
          let msg = res.data
          if (msg.code === 0) {
            this.userinfo = msg.data
            this.userinfo.avatar = formatAvatar(this.userinfo.avatar)
            localStorage.setItem('userinfo', encodeURIComponent(JSON.stringify(msg.data)))
          } else {
            this.show = true
            this.snackbar = msg.msg
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    clickexit () {
      this.$router.push({ 'path': '/login' })
    },
    // 点击侧边栏增加要素的时候
    clickRouterName (item, activePosi) {
      this.$router.replace({'name': item.name})
      let haveOrNo = this.buttons.includes(item.name)
      !haveOrNo && this.buttons.push(item.name)
      !haveOrNo && this.actives.push(activePosi)
      !haveOrNo && window.sessionStorage.setItem('buttons', JSON.stringify(this.buttons))
      !haveOrNo && window.sessionStorage.setItem('actives', JSON.stringify(this.actives))
      this.buttonsShow = this.buttons.indexOf(item.name)
    },
    // 点击全部删除的时候所执行的操作
    removeAll () {
      this.buttons = []
      this.actives = []
      window.sessionStorage.setItem('buttons', '')
      window.sessionStorage.setItem('actives', '')
      this.buttonsShow = -1
      this.dialogs = false
      this.dialog = false
      this.$router.replace({ 'path': '/' })
    },
    // 点击刷新按钮的时候所执行的操作
    buttonNew (index) {
      if (this.buttonsShow === index) {
        this.$refs.child.getNewData()
        return false
      }
      this.$router.replace({'name': this.buttons[index]})
      this.buttonsShow = index
    },
    // 删除某一个的时候所执行的操作
    buttonRemove (index) {
      let thisOrNo = index === this.buttonsShow
      this.buttons.splice(index, 1)
      this.actives.splice(index, 1)
      this.buttonsShow = thisOrNo ? 0 : this.buttons.indexOf(this.$route.name)
      window.sessionStorage.setItem('buttons', this.buttons.length ? JSON.stringify(this.buttons) : '')
      window.sessionStorage.setItem('actives', this.actives.length ? JSON.stringify(this.actives) : '')
      thisOrNo && this.$router.replace({ 'name': this.buttons[0] })
      !this.buttons.length && this.$router.replace({ 'path': '/' })
      !this.buttons.length && (this.buttonsShow = -1)
    },
    // 点击某一个tab的时候所执行的操作
    clickWhich (index) {
      this.$router.replace({'name': this.buttons[index]})
    }
  }
}
</script>
