<template>
<div>
  <v-layout column wrap>
    <!-- 搜索框 -->
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
    <!-- 动态列表 -->
    <v-flex>
      <dataTable :desserts="desserts" which="classSpace0" :loading="loading" @getNew="getNew" :clickWhich="clickWhich"
        :news="news" :setNew.sync="news" @clickList="clickListTableItem">
      </dataTable> 
    </v-flex>
    <!-- 动态详情 -->
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
    <!-- 关闭按钮 -->
    <v-list class="pa-0">
      <v-list-tile>
        <v-icon @click.stop="drawer=!drawer">close</v-icon>
      </v-list-tile>
    </v-list>
    <!-- 发布者信息和时间 -->
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
    <!-- 图片和详情 -->
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
              <!-- 图片列表 -->
              <v-list dense>
                <v-container grid-list-sm fluid>
                  <v-layout row wrap>
                    <v-flex
                      v-for="(item, key) in items.uri"
                      :key="key"
                      xs3 sm3 md2 xl2 lg2
                      d-flex
                    >
                      <v-card flat tile class="d-flex">
                        <Dialog which="imageLook" media="media" v-if="item[0] === 1" :imageArr="['', noImage, 400, item[1][1]]"></Dialog>
                        <Dialog which="videoLook" media="media" v-if="item[0] === 2" :imageArr="['视频', noVideo, 400, item[1][1], item[1][0]]"></Dialog>
                        <Dialog which="recordLook" media="media" v-if="item[0] === 3" :imageArr="['录音', noRecord, 400, noRecord, item[1][0]]"></Dialog>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
                <!-- 空间动态详情表格 -->
                <v-layout row wrap>
                  <Card  xl12 lg12 xs12 sm12 md12 d-flex  which="spaceClass" :data="[items]" v-if="items" @jumpToChildClass="jumpToChildClass">
                  </Card>
                </v-layout>
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
export default {
  name: 'UserManage',
  components: {Card, Dialog, dataTable},
  data () {
    return {
      drawer: false,
      cWhich: -1,
      desserts: [],
      loading: false,
      logining: false,
      items: {},
      noImage: require('../../static/images/icon-pic-none.png'),
      noVideo: require('../../static/images/icon-video.png'),
      noRecord: require('../../static/images/icon-record.png'),
      search: '',
      searchTrue: '',
      timeout: null,
      news: 'news',
      haveOrNo: true
    }
  },
  computed: {
    clickWhich () {
      return [this.drawer, this.cWhich]
    }
  },
  methods: {
    clickListTableItem (props, clickWhich) {
      this.drawer = !this.drawer
      this.cWhich = clickWhich
      this.items = {props}
      this.getclassinfo(props.class_id)
    },
    // 点击刷新按钮
    getNewData () {
      this.getspacelist()
    },
    // 获取空间动态列表
    getspacelist (oldOrNo) {
      if (!this.searchTrue || isNaN(this.searchTrue * 1)) {
        return false
      }
      this.loading = true
      !oldOrNo && (this.news = 'news') && (this.haveOrNo = true) && (this.logining = true)
      let dataId = oldOrNo ? this.desserts[this.desserts.length - 1].cs_id : 0
      let dataObj = '_id=' + dataId + '&class_id=' + this.searchTrue
      axios('csm.ashx?method=spacedetail&' + dataObj, '', {}, cb => {
        this.logining = false
        this.loading = false
        if (cb.code === 0) {
          if (!cb.data && !oldOrNo) {
            this.$emit('update:setVsnackbar', [true, '没有数据，请确认班级ID', 'error'])
          }
          cb.data = cb.data || []
          cb.data.map((val, ind) => {
            let thisUri = JSON.parse(val.uri)
            let allImages = []
            for (let i = 0; i < thisUri.length; i++) {
              thisUri[i].uri.map(function (value) {
                let valueArr = ['https://wxosscdn.ljlx.com/pm/' + value, ('https://wxosscdn.ljlx.com/pm/' + value).replace(/.webm|.mp4|.jpg|.png/g, '.jpg')]
                allImages.push([thisUri[i].type, valueArr])
              })
            }
            val.uri = allImages
          })
          this.desserts = oldOrNo ? this.desserts.concat(cb.data) : cb.data
          cb.data.length === 20 && !oldOrNo && this.getspacelist(true)
          cb.data.length < 20 && (this.haveOrNo = false)
        } else {
          this.$emit('update:setVsnackbar', [true, cb.msg || '请求失败，请重试', 'error'])
        }
      }, 'nodata', 'get')
    },
     // 点击搜索按钮的时候
    sendSearchSpace () {
      if (!this.search || isNaN(this.search * 1)) {
        this.$emit('update:setVsnackbar', [true, !this.search ? '输入框内容为不能为空！' : '请输入正确的班级ID', 'error'])
        return false
      }
      this.searchTrue = this.search
      this.getspacelist()
    },
    // 跳转到用户和班级详情
    jumpToChildClass (childid, which, whichEle) {
      if (childid) {
        clearTimeout(this.timeout)
        this.timeout = window.setTimeout(() => {
          console.log(this.$parent.$parent.clickRouterName)
          let classUserIndex = this.$router.options.routes.findIndex(value => { return value.name === (whichEle === 'class_id' ? '班级管理' : '用户管理') })
          this.$parent.$parent.clickRouterName({name: whichEle === 'class_id' ? '查询班级' : '查询用户'}, [classUserIndex, 0], childid)
        }, 200)
      } else {
        clearTimeout(this.timeout)
      }
    },
    // 点击下一页上一页的时候的操作
    getNew (pagination) {
      if (this.haveOrNo && pagination.page * 20 + 20 > this.desserts.length) {
        this.getspacelist(true)
      }
    }
  },
  activated () {
    this.$route.params.news === 'news' && this.getNewData()
    this.$route.params.news = ''
  }
}
</script>
