<template>
<div>
  <v-layout column wrap>
    <!-- 切换按钮 + 输入框 -->
    <v-flex>
      <v-toolbar color="grey darken-1" dark>
        <v-menu :nudge-width="100">
          <v-toolbar-title slot="activator">
            <span>{{dropdown}}</span>
            <v-icon dark>arrow_drop_down</v-icon>
          </v-toolbar-title>
          <v-list>
            <v-list-tile
              v-for="(item, index) in dropdown_font"
              :key="item"
              @click="clickListDropdownFont(item, index)"
            >
            <v-list-tile-title v-text="item"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>

        <v-divider
          class="mx-3"
          inset
          vertical
        ></v-divider>

        <v-text-field
          v-model="search"
          append-icon="search"
          :label="'请输入' + dropdown"
          :loading="logining"
          single-line
          hide-details
          clearable
          @click:append="sendSearchUser"
          @keyup.enter="sendSearchUser"
        >
        </v-text-field>
      </v-toolbar>
    </v-flex>
    <!-- 家长等四个按钮 -->
    <v-flex>
      <v-container fluid grid-list-xl>
      <v-layout row wrap>
        <v-btn v-for="(item, index) in whichMan" :key="index" :color="role === index ? 'success' : 'primary'" depressed @click="cutButton(index)">
          {{item}}
        </v-btn>
        <v-divider
          class="mx-3"
          inset
          vertical
        ></v-divider>
        <v-flex><span class="grey--text">人数：</span>{{ totalDesserts }} 人</v-flex>
      </v-layout>
      </v-container>
    </v-flex>

    <!-- 人员列表 -->
    <v-flex>
      <dataTable1 which="userManage0" :desserts="desserts" :pagination.sync="pagination" :totalDesserts="totalDesserts"
        :loading="loading" @getclasslist="getUserList" @clickList="clickListTableItem" :news="news" :clickWhich="clickWhich" :setNew.sync="news">
      </dataTable1> 
    </v-flex>

    <!-- 详情抽屉 -->
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

      <!-- 抽屉关闭按钮 -->
      <v-list class="pa-0">
        <v-list-tile>
          <v-icon @click.stop="drawer=!drawer">close</v-icon>
        </v-list-tile>
      </v-list>

      <!-- 用户基础信息 -->
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <Dialog image="true" :imageArr="[40,310,310,formatAvatar(items.avatar)]"
              :disabledOrNo="!items.avatar">
            </Dialog>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{items.uname || '未知'}}--({{ formatUserRole(items.user_role) }})</v-list-tile-title>
          </v-list-tile-content>
          <v-spacer></v-spacer>
          <v-icon v-if="items.status===200" color="green">gps_fixed</v-icon>
          <v-icon v-else color="red">gps_off</v-icon>
        </v-list-tile>
      </v-list>

      <!-- 用户关系容器 -->
      <v-list class="pt-0" dense>
        <v-container fluid grid-list-md>
          <v-layout row wrap>

            <!-- 用户信息 -->
            <Card :data="[items]" which="userinfo"></Card>

            <!-- 操作用户按钮容器 -->
            <v-flex sm12 d-flex >
              <v-card tile flat>
                <v-list dense>
                  <Dialog color="info" butCont="编辑用户信息" :setMan="setMan" which="setMan" @setMan="setEleFun"></Dialog>
                  <Dialog color="info" butCont="冻结用户" alert="true" :unbindWho="setMan" which="freezeMan" @freezeMan="setEleFun"></Dialog>
                  <!-- <v-btn color="error">删除用户</v-btn> -->
                  <Dialog v-if="(!items.ex || !items.ex.childlist || items.ex.childlist.length < 3) && items.user_role > 1" color="info"
                    :setMan="setMan" butCont="添加孩子" which="addChild" @addChild="setEleFun">
                  </Dialog>
                  <Dialog color="info" v-if="items.user_role !== 2" butCont="添加班级" which="addClass" @addClass="setEleFun"></Dialog>
                  <Dialog color="info" v-if="items.user_role === 1" :setMan="setMan" butCont="添加家长" which="addParent" @addParent="setEleFun"></Dialog>
                </v-list>
              </v-card>
            </v-flex>
            
            <!-- 孩子信息 -->
            <Card which="child" :data="items.ex && items.ex.childlist || []" v-if="items.user_role > 1" @jumpToUserClass="jumpToUserClass">
              <v-flex md12 slot="buttonSlot" slot-scope="{props}">
                <v-list-tile>
                  <Dialog color="info" butCont="解绑孩子" alert="true" :unbindWho="props.item" which="unbindchild" @unbindchild="setEleFun"></Dialog>
                </v-list-tile>
              </v-flex>
            </Card>
            
            <!-- 班级信息 -->
            <Card which="class" :data="items.ex && items.ex.teahcer && items.ex.teahcer.ClsList || []" v-if="items.user_role === 3" @jumpToUserClass="jumpToUserClass">
              <v-flex md12 slot="buttonSlot" slot-scope="{props}" style="width:100%">
                <v-list-tile>
                  <Dialog color="info" :butCont="quitOrNo(props.item) ? '不能退出班级' : '退出班级'" :disabledOrNo="quitOrNo(props.item)" alert="true" :unbindWho="props.item" which="unbindClass" @unbindClass="setEleFun"></Dialog>
                </v-list-tile>
              </v-flex>
            </Card>

            <!-- 家长信息 -->
            <Card which="parent" :data="items.ex && items.ex.stu && items.ex.stu.Parents || []" v-if="items.user_role === 1" @jumpToUserClass="jumpToUserClass">
              <v-flex md12 slot="buttonSlot" slot-scope="{props}">
                <v-list-tile>
                  <Dialog color="info" butCont="解除绑定" alert="true" :unbindWho="props.item" which="unbindParent" @unbindParent="setEleFun"></Dialog>
                </v-list-tile>
              </v-flex>
            </Card>

            <!-- 孩子班级信息 -->
            <Card which="stuclass" :data="items.ex && items.ex.stu && items.ex.stu.ClsList || []" v-if="items.user_role === 1" @jumpToUserClass="jumpToUserClass">
              <v-flex md12 slot="buttonSlot" slot-scope="{props}">
                <v-list-tile>
                  <Dialog color="info" butCont="退出班级" alert="true" :unbindWho="props.item" which="unbindClass" @unbindClass="setEleFun"></Dialog>
                </v-list-tile>
              </v-flex>
            </Card>

          </v-layout>
        </v-container>
      </v-list>
    </v-navigation-drawer>
  </v-layout>


</div>
</template>
<script>
import Dialog from './actionComp/dialog'
import Card from './actionComp/card'
import dataTable1 from './actionComp/dataTable1'
import {axios} from '../utils/handledata.js'
import { formatUserRole, formatAvatar } from '../api/dist.js'
export default {
  name: 'UserManage',
  components: {Dialog, Card, dataTable1},
  data () {
    return {
      formatUserRole,
      formatAvatar,
      drawer: false,
      cWhich: -1,
      totalDesserts: 0,
      desserts: [],
      loading: true,
      logining: false,
      pagination: {},
      items: {},
      dropdown_font: ['用户ID', '手机号', '推广员ID'],
      whichMan: ['ALL', '老师', '家长', '学生'],
      search: '',
      dropdown: '用户ID',
      cIndex: 0,
      role: 0,
      unbindclilditem: {},
      setMan: [],
      gender1: require('@/assets/gender1.png'),
      gender2: require('@/assets/gender2.png'),
      news: 'news'
    }
  },
  computed: {
    clickWhich () {
      return [this.drawer, this.cWhich]
    }
  },
  methods: {
    // 用户详情
    clickListTableItem (props, clickWhich) {
      this.drawer = !this.drawer
      this.cWhich = clickWhich
      this.items = props
      this.getuser({'uid': props.user_id}, 1)
    },
    // 处理是否可以退出班级
    quitOrNo (item) {
      let quit = false
      if (this.items && this.items.ex && this.items.ex.teahcer && this.items.ex.teahcer.cls_owner) {
        quit = this.items.ex.teahcer.cls_owner.find(value => { return value.cls_id === item.class_id }).isOwner
      }
      return quit
    },
    // 刷新
    getNewData () {
      this.cIndex = 0
      this.dropdown = '用户ID'
      this.search = ''
      this.getUserList()
    },
    // 切换按钮
    cutButton (index) {
      this.role = index
      this.getUserList()
    },
    // 获取用户列表
    getUserList (props) {
      !props && (this.news = 'news')
      this.loading = true
      let dataObj = {'role': !this.role ? 0 : 4 - this.role, 'num': this.pagination.page, 'size': props ? this.pagination.rowsPerPage : 20}
      axios(this.HOSTCSM, 'getuserlist', dataObj, cb => {
        this.loading = false
        if (cb.code === 0) {
          this.desserts = cb.data.list
          this.totalDesserts = cb.data.sumcount
          return false
        }
        this.$emit('update:setVsnackbar', [true, cb.msg || '请求失败，请重试', 'error'])
      })
    },
    // 获取某一个用户的详情
    getuser (paramdata, dev) {
      console.log(paramdata, dev)
      dev === 0 && (this.logining = true) && (this.loading = true)
      axios(this.HOSTCSM, 'getuser', paramdata, cb => {
        this.logining = false
        this.loading = false
        if (cb.code === 0) {
          if (!cb.data) {
            this.$emit('update:setVsnackbar', [true, '没有数据，请确认' + this.dropdown_font[this.cIndex], 'error'])
            this.items = {}
            return false
          }
          if (dev === 0) {
            this.desserts = [cb.data]
            this.totalDesserts = this.desserts.length
            this.news = 'news'
          }
          this.setMan = [cb.data.uname, cb.data.gender, cb.data.user_role, cb.data.user_id]
          this.items = cb.data
          this.items.ex = cb.ex
          if (dev === 2) {
            this.desserts.forEach(element => {
              element.user_id === this.items.user_id && (Object.assign(element, this.items))
            })
          }
          return false
        }
        this.$emit('update:setVsnackbar', [true, cb.msg || '请求失败，请重试', 'error'])
      })
    },
    // 切换搜索方式（手机号，id，p_id）
    clickListDropdownFont (item, index) {
      this.dropdown = item
      this.cIndex = index
      this.search = null
    },
    // 点击搜索按钮的时候
    sendSearchUser () {
      let paramsdata = {}
      let uploadArr = ['uid', 'mobile', 'pid']
      if (!this.search || isNaN(this.search * 1) || (!/^1[34578]\d{9}$/.test(this.search) && this.cIndex === 1)) {
        this.$emit('update:setVsnackbar', [true, !this.search ? '输入框内容不能为空！' : '请输入正确的' + this.dropdown, 'error'])
        return false
      }
      paramsdata[uploadArr[this.cIndex]] = this.search
      this.getuser(paramsdata, 0)
    },
    // 退出班级 加入班级 设置用户信息 冻结用户 添加孩子 解绑孩子
    setEleFun (props, whichEle) {
      console.log(props, whichEle)
      let whichMethod = {addClass: 'joinclass', unbindClass: 'quitclass', setMan: 'updateuser', freezeMan: 'frozenuser', addChild: 'bindchild', addParent: 'bindchild', unbindchild: 'unbindchild', unbindParent: 'unbindchild'}
      let whichData = {}
      whichEle === 'addClass' && (whichData = {'uid': this.items.user_id, 'classid': props})
      whichEle === 'unbindClass' && (whichData = {'uid': this.items.user_id, 'classid': props.class_id})
      whichEle === 'setMan' && (whichData = {'uid': props[3], 'nickname': props[0], 'gender': props[1], 'role': props[2]})
      whichEle === 'freezeMan' && (whichData = {'uid': props[3]})
      whichEle === 'addChild' && (whichData = {'uid': this.items.user_id, 'childid': props[0] * 1, 'ParentType': props[1] * 1})
      whichEle === 'addParent' && (whichData = {'uid': props[0] * 1, 'childid': this.items.user_id, 'ParentType': props[1] * 1})
      whichEle === 'unbindchild' && (whichData = {'uid': this.items.user_id, 'childid': props.user_id})
      whichEle === 'unbindParent' && (whichData = {'uid': props.user_id, 'childid': this.items.user_id})
      if (whichEle === 'addClass' && (!props || isNaN(props * 1))) {
        this.$emit('update:setVsnackbar', [true, '请输入正确的班级ID', 'error'])
        return false
      }
      if (whichEle === 'setMan' && (!props[0] || !props[1])) {
        this.$emit('update:setVsnackbar', [true, !props[0] ? '请输入昵称' : '请选择性别', 'error'])
        return false
      }
      if ((whichEle === 'addChild' || whichEle === 'addParent') && (!props[0] || isNaN(props[0] * 1) || props[0] * 1 === this.setMan[3])) {
        this.$emit('update:setVsnackbar', [true, `请输入正确${whichEle === 'addChild' ? '孩子' : '家长'}的ID`, 'error'])
        return false
      }
      axios(this.HOSTCSM, whichMethod[whichEle], whichData, cb => {
        if (cb.code === 0) {
          this.$emit('update:setVsnackbar', [true, cb.msg || '成功', 'success'])
          this.getuser({'uid': this.items.user_id}, whichEle === 'setMan' ? 2 : 1)
        } else {
          this.$emit('update:setVsnackbar', [true, cb.msg || '请求失败，请重试', 'error'])
        }
      })
    },
    // 跳转到用户和班级详情
    jumpToUserClass (userclassid, which) {
      if (which === 'class' || which === 'stuclass') {
        console.log(this.$parent.$parent.clickRouterName)
        let userclassIndex = this.$router.options.routes.findIndex(value => { return value.name === '班级管理' })
        this.$parent.$parent.clickRouterName({name: '查询班级'}, [userclassIndex, 0], userclassid)
      } else {
        this.dropdown = '用户ID'
        this.search = userclassid
        this.cWhich = 0
        this.cIndex = 0
        this.sendSearchUser()
      }
    }
  },
  mounted () {
  },
  activated () {
    this.$route.params.news === 'news' && this.getNewData()
    if (this.$route.params.news && this.$route.params.news !== 'news') {
      this.search = this.$route.params.news
      this.dropdown = '用户ID'
      this.cIndex = 0
      this.sendSearchUser()
      this.drawer = true
      this.cWhich = 0
    }
    this.$route.params.news = ''
  }
}
</script>
