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
          @click:append="sendSearchClass"
          @keyup.enter="sendSearchClass"
        >
        </v-text-field>
      </v-toolbar>
    </v-flex>
    <v-flex>
      <v-container fluid grid-list-xl>
      <v-layout row wrap>
        <v-btn color="success" depressed @click="getclasslist()">ALL</v-btn>
        <v-divider
          class="mx-3"
          inset
          vertical
        ></v-divider>
        <v-flex><span class="grey--text">班级数：</span>{{ totalDesserts }} 班</v-flex>
      </v-layout>
      </v-container>
    </v-flex>
    <v-flex>
      <dataTable1 :desserts="desserts" :pagination.sync="pagination" :totalDesserts="totalDesserts" which="classManage0" 
        :loading="loading" @getclasslist="getclasslist" @clickList="clickListTableItem" :news="news" :setNew.sync="news">
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
            :disabledOrNo="formatAvatar(items && items.props && items.props.logo_url).indexOf('uLogoNone.jpg') !== -1">
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
                <template slot="removeMan" :slot-scope="{removeMan}">
                  {{removeMan}}
                </template>
                <!-- <Dialog color="info" slot="removeMan" slot-scope="{{removeMan}}" 
                  :butCont="formatEduRole(removeMan.edu_role, removeMan.is_owner, removeMan.is_stu) === '创建者' ? '不能移除' : '移除'"
                  :disabledOrNo = "formatEduRole(removeMan.edu_role, removeMan.is_owner, removeMan.is_stu) === '创建者'" 
                  alert="true" :unbindWho="props.item" which="quitclass" @quitclass="setclass">
                </Dialog> -->
              </dataTable1> 

              <!-- <v-data-table
                :headers="headersItem"
                :items="items && items.memeber?items.memeber:[]"
                :total-items="totalItem"
                hide-actions
                :loading="loadingItem"
                class="elevation-1"
              >
                <template slot="items" slot-scope="props">
                  <td @click="jumpToMan(props.item.user_id)" style="white-space:nowrap">
                    <v-avatar :size="25">
                      <v-img :src="formatAvatar(props.item.avatar)" />
                    </v-avatar>
                    {{props.item.uname || '未知'}}
                    {{props.item.nick && props.item.nick !== props.item.uname && '--' + props.item.nick || ''}}
                    (<span @dblclick="jumpToMan()">{{ props.item.user_id }}</span>) 
                    <v-avatar tile :size="14" v-if="props.item.gender">
                      <v-img :src="['', gender1, gender2][props.item.gender]" /> 
                    </v-avatar>
                  </td>
                  <td>{{ formatEduRole(props.item.edu_role, props.item.is_owner, props.item.is_stu) }}</td>
                  <td>{{props.item.m_id}}</td>
                  <td>{{props.item.create_user}}</td>
                  <td>{{props.item.last_upt_user}}</td>
                  <td>{{props.item.remark}}</td>
                  <td class="text-xs-right">
                    <Dialog color="info" :butCont="formatEduRole(props.item.edu_role, props.item.is_owner, props.item.is_stu) === '创建者' ? '不能移除' : '移除'"
                      :disabledOrNo = "formatEduRole(props.item.edu_role, props.item.is_owner, props.item.is_stu) === '创建者'" 
                      alert="true" :unbindWho="props.item" which="quitclass" @quitclass="setclass">
                    </Dialog>
                  </td>
                </template>
              </v-data-table> -->
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
      headersItem: [
        { text: '基础信息', value: 'avatar', align: 'left', sortable: false },
        { text: '班内身份', value: 'edu_role', align: 'left', sortable: false },
        { text: '成员ID', value: 'm_id', align: 'left', sortable: false },
        { text: '创建者ID', value: 'create_user', align: 'left', sortable: false },
        { text: '最近修改者ID', value: 'last_upt_user', align: 'left', sortable: false },
        { text: '备注', value: 'remark', align: 'left', sortable: false },
        { text: '', value: '', align: 'right', sortable: false }
      ],
      totalItem: 0,
      logining: false,
      items: null,
      gender1: require('@/assets/gender1.png'),
      gender2: require('@/assets/gender2.png'),
      quiteclassitem: {},
      search: '',
      news: 'news'
    }
  },
  created () { },
  methods: {
    getNewData () {
      this.getclasslist()
    },
    clickListTableItem (props) {
      this.drawer = !this.drawer
      this.items = {props}
      this.getclassinfo(props.class_id)
    },
    // getclasslist&data={num:1,size:10}
    getclasslist (oldOrNo) {
      this.loading = true
      !oldOrNo && (this.news = 'news')
      let dataObj = {'num': this.pagination.page, 'size': this.pagination.rowsPerPage === 1 ? 20 : this.pagination.rowsPerPage}
      axios(this.HOSTCSM, 'getclasslist', dataObj, cb => {
        this.logining = false
        if (cb.code === 0) {
          this.loading = false
          this.desserts = cb.data.list
          this.totalDesserts = cb.data.sumcount
        } else {
          this.$emit('update:setVsnackbar', [true, cb.msg, 'error'])
        }
      })
    },
     // 点击搜索按钮的时候
    sendSearchClass () {
      if (!this.search || isNaN(this.search * 1)) {
        this.$emit('update:setVsnackbar', [true, !this.search ? '输入框内容为不能为空！' : '请输入正确的' + this.dropdown, 'error'])
        return false
      }
      this.getclassinfo(this.search, 1)
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
            this.getclasslist()
            return false
          }
          this.getclassinfo(this.items.props.class_id)
        } else {
          this.$emit('update:setVsnackbar', [true, cb.msg, 'error'])
        }
      })
    },
    jumpToMan (childid) {
      if (childid) {
        clearTimeout(this.timeout)
        this.timeout = window.setTimeout(() => {
          this.$parent.$parent.clickRouterName({name: '查询用户'}, [6, 0], childid)
        }, 200)
      } else {
        console.log(12346)
        clearTimeout(this.timeout)
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
