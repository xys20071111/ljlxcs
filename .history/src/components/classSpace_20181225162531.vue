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
      <v-container fluid grid-list-xl>
      <v-layout row wrap>
        <v-flex><span class="grey--text">空间动态数：</span>{{ totalDesserts }} 班</v-flex>
      </v-layout>
      </v-container>
    </v-flex>
    <v-flex>
      <dataTable1 :desserts="desserts" :pagination.sync="pagination" :totalDesserts="totalDesserts" which="classSpace0" 
        :loading="loading" @getclasslist="getspacelist" @clickList="clickListTableItem" :news="news" :setNew.sync="news">
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
      <v-list-tile avatar>
        <v-list-tile-avatar>
          <Dialog image="true" :imageArr="[40,290,290,items && items.props && formatAvatar(items.props.logo_url)]" 
            :disabledOrNo="!items || !items.props || !items.props.logo_url">
          </Dialog>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-if="items && items.props">
            {{getStrClass(items.props.class_name)[0]}}
            <span v-if="items.props.def_name && items.props.class_name" style="color:#ccc">——</span>
            {{items.props.def_name}}
          </v-list-tile-title>
        </v-list-tile-content>
        <v-spacer></v-spacer>
          <v-icon v-if="items && items.props && items.props.status===200" color="green">gps_fixed</v-icon>
          <v-icon v-else color="red">gps_off</v-icon>
      </v-list-tile>
    </v-list>

    <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
             <!-- 班级信息 -->
            <Card  xl12 lg12 xs12 sm12 md12 d-flex  which="onlyClass" :data="[items.props]" v-if="items && items.props">
            </Card>
            <v-flex sm12 d-flex >
              <v-card tile flat>
                <v-list dense>
                  <Dialog color="info" butCont="注销班级" :unbindWho="items && items.props || {}"  which="cancelClass" @cancelClass="setclass"></Dialog>
                </v-list>
              </v-card>
            </v-flex>

            <v-flex xl12 lg12 xs12 sm12 md12 d-flex >
              <v-card tile  >
              <v-toolbar flat color="white" style="align-items:center">
                <v-toolbar-title>成员列表 {{totalItem}} 人</v-toolbar-title>
                <v-spacer></v-spacer>
                <Dialog style="flex:0 0 auto;margin:0" color="green darken-1" butCont="+ 添加成员" alert="true" which="addMember" @addMember="setclass"></Dialog>
              </v-toolbar>
              <v-divider></v-divider>
              <dataTable1 :desserts="items && items.memeber?items.memeber:[]" which="classManage1" 
                :loading="loadingItem" @jumpToMan="jumpToMan" @setclass="setclass">
                <Dialog color="info" slot="removeMan" slot-scope="{removeMan}" 
                  :butCont="formatEduRole(removeMan.edu_role, removeMan.is_owner, removeMan.is_stu) === '创建者' ? '不能移除' : '移除'"
                  :disabledOrNo = "formatEduRole(removeMan.edu_role, removeMan.is_owner, removeMan.is_stu) === '创建者'" 
                  alert="true" :unbindWho="removeMan" which="quitclass" @quitclass="setclass">
                  {{removeMan}}
                </Dialog>
              </dataTable1>
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
import dataTable1 from './actionComp/dataTable1'
import {axios} from '../utils/handledata.js'
import { formatAvatar, formatEduRole, getStrClass } from '../api/dist.js'
export default {
  name: 'UserManage',
  components: {Card, Dialog, dataTable1},
  data () {
    return {
      formatAvatar,
      formatEduRole,
      getStrClass,
      drawer: null,
      totalDesserts: 0,
      desserts: [],
      loading: true,
      loadingItem: true,
      pagination: {},
      totalItem: 0,
      logining: false,
      items: null,
      gender1: require('@/assets/gender1.png'),
      gender2: require('@/assets/gender2.png'),
      search: '',
      news: 'news'
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
      !oldOrNo && (this.news = 'news')
      let dataId = oldOrNo ? this.desserts[this.desserts.length - 1].cs_id : 0
      let dataObj = '_id=' + dataId + '&class_id=' + this.search
      axios('csm.ashx?method=spacedetail&' + dataObj, '', {}, cb => {
        this.logining = false
        if (cb.code === 0) {
          console.log(cb.data)
          this.loading = false
          cb.data.map((val, ind) => {
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
          this.desserts = cb.data
          console.log(this.pagination.page)
          this.totalDesserts = (this.pagination.page + (this.desserts.length === 20 ? 1 : 0)) * 20
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
          this.$emit('update:setVsnackbar', [true, cb.msg, 'error'])
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
    scroll () {
      console.log(123456)
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
