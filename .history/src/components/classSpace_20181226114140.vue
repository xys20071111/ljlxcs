<template>
<div>
  <v-layout column wrap>
    <v-flex>
      <v-toolbar color="grey darken-1" dark>
        <v-flex style="flex:0 0 auto;font-size:16px">班级ID：</v-flex>
        <v-divider
          class="mx-3"
          inset
          vertical
        ></v-divider>
        <v-text-field
          v-model="search"
          append-icon="search"
          :label="'请输入班级ID'"
          :loading="logining"
          single-line
          hide-details
          clearable
          @click:append="sendSearchSpace()"
          @keyup.enter="sendSearchSpace()"
        >
        </v-text-field>
      </v-toolbar>
    </v-flex>
    <v-flex>
      <dataTable :desserts="desserts" :totalDesserts="totalDesserts" which="classSpace0" 
        :loading="loading" @getNew="getNew" :news="news" :setNew.sync="news" :setDrawer.sync="drawer" :setItem.sync="items">
      </dataTable> 
    </v-flex>

    <v-navigation-drawer
      v-model="drawer"
      temporary
      right
      floating
      clipped
      app
      fixed
      light
      :width="1000"
    >
    <v-list class="pa-0">
      <v-list-tile>
        <v-icon @click.stop="drawer=!drawer">close</v-icon>
      </v-list-tile>
    </v-list>
    <v-list class="pa-1">
      <v-divider></v-divider>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>obj_id：{{items.obj_id}}</v-list-tile-title>
        </v-list-tile-content>
        <v-spacer></v-spacer>
        <v-icon v-if="items.status!==0" color="green">gps_fixed</v-icon>
        <v-icon v-else color="red">gps_off</v-icon>
      </v-list-tile>
      <v-divider></v-divider>
      <v-list-tile avatar>
        <v-list-tile-content>
          <v-list-tile-title><h3>基础信息</h3></v-list-tile-title>
          <v-list-tile-sub-title>
            <span>发布者ID：{{items.author}}</span>
            <v-divider class="mx-3" inset vertical></v-divider>
            <span>发布时间：{{items.in_time}}</span>
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
        
    </v-list>
    <v-list class="pt-0" dense>
      <v-divider></v-divider>
      <v-container fluid grid-list-md>
          <v-layout column wrap>
            <v-flex d-flex >
              <v-card tile flat>
                <v-list dense>
                  {{items.cont}}
                </v-list>
                <v-divider></v-divider>
                <v-list dense>
                  <!-- {{items.attachment}} -->
                  <v-layout>
                    <v-flex>
                      <v-container grid-list-sm fluid>
                        <v-layout row wrap>
                          <v-flex
                            v-for="item in items.uri"
                            :key="item[0]"
                            xs3 sm3 md2 xl2 lg2
                            d-flex
                          >
                            <v-card flat tile class="d-flex">
                              <Dialog which="imageLook" v-if="item[0] === 1">
                                <v-img slot="slotButton"
                                  :src="item[1][1]"
                                  :lazy-src="noImage"
                                  aspect-ratio="1"
                                  class="grey lighten-2"
                                >
                                  <v-layout
                                    slot="placeholder"
                                    fill-height
                                    align-center
                                    justify-center
                                    ma-0
                                  >
                                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                  </v-layout>
                                </v-img>
                              </Dialog>
                              <Dialog which="videoLook" v-if="item[0] === 2">
                                <v-img slot="slotButton"
                                  :src="item[1][1]"
                                  :lazy-src="noVideo"
                                  aspect-ratio="1"
                                  class=" lighten-2"
                                >
                                  <v-layout
                                    slot="placeholder"
                                    fill-height
                                    align-center
                                    justify-center
                                    ma-0
                                  >
                                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                  </v-layout>
                                  <v-flex style="color:green">视频</v-flex>
                                </v-img>
                              </Dialog>
                              <Dialog which="recordLook" v-if="item[0] === 3">
                                <v-img  slot="slotButton"
                                  :src="noRecord"
                                  :lazy-src="noRecord"
                                  aspect-ratio="1"
                                  class="lighten-2"
                                >
                                  <v-layout
                                    slot="placeholder"
                                    fill-height
                                    align-center
                                    justify-center
                                    ma-0
                                  >
                                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                  </v-layout>
                                  <v-flex style="color:green">录音</v-flex>
                                </v-img>
                              </Dialog>

                            </v-card>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-flex>
                  </v-layout>
                  <!-- {{items.attachment}} -->
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>
      </v-container>
    </v-list>
    </v-navigation-drawer>

    
  </v-layout>
</div>
</template>
<script>
import Card from './actionComp/card'
import Dialog from './actionComp/dialog'
import dataTable from './actionComp/dataTable'
import {axios} from '../utils/handledata.js'
import { formatAvatar, formatEduRole, getStrClass } from '../api/dist.js'
export default {
  name: 'UserManage',
  components: {Card, Dialog, dataTable},
  data () {
    return {
      formatAvatar,
      formatEduRole,
      getStrClass,
      drawer: null,
      totalDesserts: 0,
      desserts: [],
      loading: false,
      loadingItem: true,
      pagination: {},
      totalItem: 0,
      logining: false,
      items: {},
      gender1: require('@/assets/gender1.png'),
      gender2: require('@/assets/gender2.png'),
      noImage: require('../../static/images/icon-pic-none.png'),
      noVideo: require('../../static/images/icon-video.png'),
      noRecord: require('../../static/images/icon-record.png'),
      search: '',
      news: 'news',
      haveOrNo: true
    }
  },
  created () { },
  methods: {
    getNewData () {
      this.getspacelist()
    },
    clickListTableItem (props) {
      this.drawer = !this.drawer
      this.items = {props}
      this.getclassinfo(props.class_id)
    },
    // getspacelist&data={num:1,size:10}
    getspacelist (oldOrNo) {
      if (!this.search || isNaN(this.search * 1)) {
        return false
      }
      this.loading = true
      !oldOrNo && (this.news = 'news') && (this.haveOrNo = true)
      let dataId = oldOrNo ? this.desserts[this.desserts.length - 1].cs_id : 0
      let dataObj = '_id=' + dataId + '&class_id=' + this.search
      axios('csm.ashx?method=spacedetail&' + dataObj, '', {}, cb => {
        this.logining = false
        if (cb.code === 0) {
          this.loading = false
          if (!cb.data && !oldOrNo) {
            this.$emit('update:setVsnackbar', [true, '没有数据，请确认班级ID', 'error'])
            return false
          }
          (cb.data || []).map((val, ind) => {
            let thisUri = JSON.parse(val.uri)
            let allImages = []
            for (let i = 0; i < thisUri.length; i++) {
              thisUri[i].uri.map(function (value) {
                console.log(value)
                let valueArr = ['https://wxosscdn.ljlx.com/pm/' + value, ('https://wxosscdn.ljlx.com/pm/' + value).replace(/.webm|.mp4|.jpg|.png/g, '.jpg')]
                allImages.push([thisUri[i].type, valueArr])
              })
            }
            val.uri = allImages
          })
          this.desserts = oldOrNo ? this.desserts.concat(cb.data) : cb.data
          cb.data.length === 20 && !oldOrNo && this.getspacelist(true)
          cb.data.length < 20 && (this.haveOrNo = false)
          console.log(this.desserts)
        } else {
          this.$emit('update:setVsnackbar', [true, cb.msg, 'error'])
        }
      }, 'nodata', 'get')
    },
     // 点击搜索按钮的时候
    sendSearchSpace () {
      if (!this.search || isNaN(this.search * 1)) {
        this.$emit('update:setVsnackbar', [true, !this.search ? '输入框内容为不能为空！' : '请输入正确的班级ID', 'error'])
        return false
      }
      this.getspacelist()
    },
    getclassinfo (classid, which) {
      which && (this.logining = true) && (this.loading = true)
      !which && (this.loadingItem = true)
      axios(this.HOSTCSM, 'getclassinfo', {'classid': classid}, cb => {
        this.loadingItem = false
        this.logining = false
        this.loading = false
        if (cb.code === 0) {
          if (!cb.data.cinfo) {
            this.$emit('update:setVsnackbar', [true, '没有数据，请确认班级ID', 'error'])
            return false
          }
          if (which) {
            this.desserts = [cb.data.cinfo]
            this.totalDesserts = 1
            this.news = 'news'
          }
          cb.data.memeber.sort((a, b) => {
            return b.edu_role - a.edu_role
          })
          this.items = cb.data
          this.items.props = cb.data.cinfo
          this.totalItem = cb.data.memeber.length
        } else {
          this.$emit('update:setVsnackbar', [true, cb.msg || '请求失败，请重试', 'error'])
        }
      })
    },
    // 退出班级，添加成员，注销班级
    setclass (props, whichEle) {
      console.log(props, whichEle)
      let whichMethod = {quitclass: 'quitclass', addMember: 'joinclass', cancelClass: 'cancelcls'}
      let whichData = {}
      whichEle === 'quitclass' && (whichData = {'uid': props.user_id, 'classid': this.items.props.class_id})
      whichEle === 'addMember' && (whichData = {'uid': props, 'classid': this.items.props.class_id})
      whichEle === 'cancelClass' && (whichData = {'cls': [this.items.props.class_id]})
      if (whichEle === 'addMember' && (!props || isNaN(props * 1))) {
        this.$emit('update:setVsnackbar', [true, '请输入正确的用户ID', 'error'])
        return false
      }
      console.log(whichData)
      axios(this.HOSTCSM, whichMethod[whichEle], whichData, cb => {
        if (cb.code === 0) {
          this.$emit('update:setVsnackbar', [true, cb.msg, 'success'])
          if (whichEle === 'cancelClass') {
            this.items = null
            this.drawer = false
            this.search = ''
            this.getspacelist()
            return false
          }
          this.getclassinfo(this.items.props.class_id)
        } else {
          this.$emit('update:setVsnackbar', [true, cb.msg, 'error'])
        }
      })
    },
    // 跳转到用户
    jumpToMan (childid) {
      if (childid) {
        clearTimeout(this.timeout)
        this.timeout = window.setTimeout(() => {
          let userIndex = this.$router.options.routes.findIndex(value => { return value.name === '用户管理' })
          this.$parent.$parent.clickRouterName({name: '查询用户'}, [userIndex, 0], childid)
        }, 200)
      } else {
        console.log(12346)
        clearTimeout(this.timeout)
      }
    },
    getNew (pagination) {
      console.log(pagination.page, this.haveOrNo)
      if (this.haveOrNo && pagination.page * 20 + 20 > this.desserts.length) {
        this.getspacelist(true)
      }
    }
  },
  mounted () {
  },
  activated () {
    this.$route.params.news === 'news' && this.getNewData()
    if (this.$route.params.news && this.$route.params.news !== 'news') {
      this.search = this.$route.params.news
      this.sendSearchClass()
      this.drawer = true
    }
    this.$route.params.news = ''
  }
}
</script>
