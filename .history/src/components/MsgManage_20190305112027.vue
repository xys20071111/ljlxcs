<template>
<div>
  <v-layout column wrap>
    <v-flex>
      <v-container fluid grid-list-xl>
      <v-layout row wrap>
        <v-flex><span class="grey--text">条数：</span>{{ totalDesserts }} 条</v-flex>
      </v-layout>
      </v-container>
    </v-flex>
    <v-flex>
      <dataTable1 :desserts="desserts" :pagination.sync="pagination" :totalDesserts="totalDesserts" which="msgManage0" 
        :loading="loading" @getclasslist="getmsglist" @clickList="clickListTableItem" :news="news"
      :clickWhich="clickWhich" :setNew.sync="news" @clickjump = "jumpToUserClass">
      </dataTable1>
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
          <v-list-tile-title>通知ID：{{items.m_id}}</v-list-tile-title>
        </v-list-tile-content>
        <v-spacer></v-spacer>
        <v-icon v-if="items.status===0" color="green">gps_fixed</v-icon>
        <v-icon v-else color="red">gps_off</v-icon>
      </v-list-tile>
      <v-divider></v-divider>
      <v-list-tile avatar>
        <v-list-tile-content>
          <v-list-tile-title><h3>{{items.title}}</h3></v-list-tile-title>
          <v-list-tile-sub-title>
            <span>作者：{{items.owner}}</span>
            <v-divider class="mx-3" inset vertical></v-divider>
            <span>发布时间：{{items.pub_time}}</span>
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
                {{items.content}}
              </v-list>
              <v-divider></v-divider>
              <v-list dense>
                <v-container grid-list-sm fluid>
                  <v-layout row wrap>
                    <v-flex
                      v-for="item in items.attachment"
                      :key="item.uid"
                      xs3 sm3 md2 xl2 lg2
                      d-flex
                    >
                      <v-card flat tile class="d-flex">
                        <Dialog which="imageLook" media="media" v-if="item.sort==='simg'||item.sort==='cimg'||item.sort==='vimg'"
                          :imageArr="['', noImage, 400, item.url]"></Dialog>
                        <Dialog which="videoLook" media="media" v-if="item.sort==='video'||item.sort==='svideo'"
                          :imageArr="['视频', noVideo, 400, item.url.replace(/.webm|.mp4|.png/g, '.jpg'), item.url]"></Dialog>
                        <Dialog which="recordLook" media="media" v-if="item.sort==='record'"
                        :imageArr="['录音', noRecord, 400, noRecord, item.url]"></Dialog>
                      </v-card> 
                    </v-flex>
                  </v-layout>
                </v-container>
                <!-- 通知详情表格 -->
                <v-layout row wrap  mb-2>
                  <Card xl12 lg12 xs12 sm12 md12 d-flex  which="msgManage" :data="[items]" v-if="items" @jumpToUserClass="jumpToUserClass">
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
import dataTable1 from './actionComp/dataTable1'
import Dialog from './actionComp/dialog'
import Card from './actionComp/card'
import {axios} from '../utils/handledata.js'
export default {
  name: 'MsgManage',
  components: { dataTable1, Dialog, Card },
  data () {
    return {
      drawer: false,
      cWhich: -1,
      totalDesserts: 0,
      desserts: [],
      loading: false,
      noImage: require('../../static/images/icon-pic-none.png'),
      noVideo: require('../../static/images/icon-video.png'),
      noRecord: require('../../static/images/icon-record.png'),
      pagination: {},
      items: [],
      search: '',
      news: 'news'
    }
  },
  computed: {
    clickWhich () {
      return [this.drawer, this.cWhich]
    }
  },
  methods: {
    getNewData () {
      this.getmsglist()
    },
    clickListTableItem (props, clickWhich) {
      this.drawer = !this.drawer
      this.cWhich = clickWhich
      this.items = props
    },
    getmsglist (oldOrNo) {
      this.loading = true
      !oldOrNo && (this.news = 'news')
      let dataObj = {'num': this.pagination.page, 'size': this.pagination.rowsPerPage === 1 ? 20 : this.pagination.rowsPerPage}
      axios(this.HOSTCSM, 'getmsglist', dataObj, cb => {
        this.loading = false
        if (cb.code === 0) {
          let temp = cb.data.list
          let sumcount = cb.data.sumcount
          for (let val of temp) {
            val.attachment = val.attachment ? JSON.parse(val.attachment) : []
          }
          this.desserts = temp
          this.totalDesserts = sumcount
        } else {
          this.$emit('update:setVsnackbar', [true, cb.msg || '请求失败，请重试', 'error'])
        }
      })
    },
    // 跳转到用户和班级详情
    jumpToUserClass (userclassid) {
      let userclassIndex = this.$router.options.routes.findIndex(value => { return value.name === '用户管理' })
      this.$parent.$parent.clickRouterName({name: '查询用户'}, [userclassIndex, 0], userclassid)
    }
  },
  activated () {
    this.$route.params.news && this.getNewData()
    this.$route.params.news = ''
  }
}
</script>
