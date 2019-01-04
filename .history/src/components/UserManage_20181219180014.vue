<template>
<div>
  <v-layout column wrap>
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
    <v-flex>
      <v-container fluid grid-list-xl>
      <v-layout row wrap>
        <v-btn v-for="(item, index) in ['ALL', '老师', '家长', '学生']" :key="index" :color="role === index ? 'success' : 'primary'" depressed @click="getUserList(index)">
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
    <v-flex>
      <v-data-table
        disable-initial-sort
        :headers="headers"
        :items="desserts"
        :pagination.sync="pagination"
        :total-items="totalDesserts"
        :loading="loading"
        no-data-text="很抱歉，目前没有数据 :("
        rows-per-page-text="条/页"
        :rows-per-page-items="[20,50,80,100]"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <tr @click.stop="clickListTableItem(props.item)">
          <td style="white-space:nowrap">
            <v-avatar :size="25">
              <v-img :src="formatAvatar(props.item.avatar)" /> 
            </v-avatar>
            {{props.item.uname}} ({{ props.item.user_id }}) 
            <v-avatar tile :size="14" v-if="props.item.gender">
              <v-img :src="['', gender1, gender2][props.item.gender]" /> 
            </v-avatar>
          </td>
          <td class="text-xs-right">{{ props.item.p_id }}</td>
          <td class="text-xs-right">{{ props.item.origin }}</td>
          <td class="text-xs-right">{{ props.item.mobile }}</td>
          <td class="text-xs-right">{{ formatUserRole(props.item.user_role) }}</td>
          <td class="text-xs-right" :class="['subheading',props.item.status===200?'green--text':'red--text']" style="white-space:nowrap">
            <v-icon v-if="props.item.status===200" color="green" size="18">gps_fixed</v-icon>
            <v-icon v-else color="red" size="18">gps_off</v-icon>
            {{ formatStatus(props.item.status) }}
          </td>
          <td class="text-xs-right">{{ getCountry(props.item.country, props.item.province, props.item.city)}} </td>
          <td class="text-xs-right hidden-sm-and-down" style="white-space:nowrap">
            创建时间:{{ props.item.in_time }}<br>
            最近更改时间:{{ props.item.last_time }}
          </td>
          </tr>
        </template>
        <template slot="pageText" slot-scope="props">
          第 {{ props.pageStart }} - {{ props.pageStop }} 条，总共 {{ props.itemsLength }} 条
        </template>
        
      </v-data-table>
      
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
            <img :src="formatAvatar(items.avatar)">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{items.uname || '未知'}}--({{ formatUserRole(items.user_role) }})</v-list-tile-title>
          </v-list-tile-content>
          <v-spacer></v-spacer>
          <v-icon v-if="items.status===200" color="green">gps_fixed</v-icon>
          <v-icon v-else color="red">gps_off</v-icon>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <!-- 用户信息 -->
            <Card :data="[items]" which="userinfo">
              <v-flex xs11 offset-xs1>
                {{items.intro}}
              </v-flex>
            </Card>


            <v-flex sm12 d-flex >
              <v-card tile flat>
                <v-list dense>
                  <Dialog color="info" butCont="编辑用户信息" :setMan="setMan" which="setMan" @setMan="setEleFun"></Dialog>
                  <Dialog color="info" butCont="冻结用户" alert="true" :unbindWho="setMan" which="freezeMan" @freezeMan="setEleFun"></Dialog>
                  <v-btn color="error">删除用户</v-btn>
                  <Dialog v-if="(!items.ex || !items.ex.childlist || items.ex.childlist.length < 3) && items.user_role > 1" color="info"
                    :setMan="setMan" butCont="添加孩子" which="addChild" @addChild="setEleFun">
                  </Dialog>
                  <Dialog color="info" v-if="items.user_role !== 2" butCont="添加班级" which="addClass" @addClass="setEleFun"></Dialog>
                  <Dialog color="info" v-if="items.user_role === 1" :setMan="setMan" butCont="添加家长" which="addParent" @addParent="setEleFun"></Dialog>
                </v-list>
              </v-card>
            </v-flex>
            
            <!-- 孩子信息 -->
            <Card which="child" :data="items.ex && items.ex.childlist || []" v-if="items.user_role > 1" @jumpToChildClass="jumpToChildClass">
              <v-flex md12 slot="buttonSlot" slot-scope="{props}">
                <v-list-tile>
                  <Dialog color="info" butCont="解绑孩子" alert="true" :unbindWho="props.item" which="unbindchild" @unbindchild="setEleFun"></Dialog>
                </v-list-tile>
              </v-flex>
            </Card>
            
            <!-- 班级信息 -->
            <Card which="class" :data="items.ex && items.ex.teahcer && items.ex.teahcer.ClsList || []" v-if="items.user_role === 3" @jumpToChildClass="jumpToChildClass">
              <v-flex md12 slot="buttonSlot" slot-scope="{props}" style="width:100%">
                <v-list-tile>
                  <Dialog color="info" :butCont="quitOrNo(props.item) ? '不能退出班级' : '退出班级'" :quitOrNo="quitOrNo(props.item)" alert="true" :unbindWho="props.item" which="unbindClass" @unbindClass="setEleFun"></Dialog>
                </v-list-tile>
              </v-flex>
            </Card>

            <!-- 家长信息 -->

            <Card which="parent" :data="items.ex && items.ex.stu && items.ex.stu.Parents || []" v-if="items.user_role === 1" @jumpToChildClass="jumpToChildClass">
              <v-flex md12 slot="buttonSlot" slot-scope="{props}">
                <v-list-tile>
                  <Dialog color="info" butCont="解除绑定" alert="true" :unbindWho="props.item" which="unbindParent" @unbindParent="setEleFun"></Dialog>
                </v-list-tile>
              </v-flex>
            </Card>
            <!-- 孩子班级信息 -->

            <Card which="stuclass" :data="items.ex && items.ex.stu && items.ex.stu.ClsList || []" v-if="items.user_role === 1" @jumpToChildClass="jumpToChildClass">
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
import {axios} from '../utils/handledata.js'
import { formatGender, formatUserRole, formatStatus, formatAvatar, formatClassMode, getCountry } from '../api/dist.js'
export default {
  name: 'UserManage',
  components: {Dialog, Card},
  data () {
    return {
      formatGender,
      formatUserRole,
      formatStatus,
      formatAvatar,
      formatClassMode,
      drawer: null,
      totalDesserts: 0,
      desserts: [],
      loading: true,
      logining: false,
      pagination: {},
      headers: [
        { text: '基础信息', value: 'avatar', align: 'left', sortable: false },
        { text: '推广员ID', value: 'p_id', align: 'right' },
        { text: '来源ID', value: 'origin', align: 'right' },
        { text: '手机号', value: 'mobile', align: 'right' },
        { text: '身份', value: 'user_role', align: 'right' },
        { text: '状态', value: 'status', align: 'right' },
        { text: '地区', value: 'country', align: 'right', sortable: false },
        { text: '时间', value: 'last_time', align: 'right', class: 'hidden-sm-and-down' }
      ],
      items: {},
      dropdown_font: ['用户ID', '手机号', '推广员ID'],
      search: '',
      dropdown: '用户ID',
      cIndex: 0,
      role: 0,
      unbindclilditem: {},
      setMan: [],
      timeout: null,
      gender1: require('@/assets/gender1.png'),
      gender2: require('@/assets/gender2.png'),
      getCountry
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    // 用户详情
    clickListTableItem (props) {
      this.drawer = !this.drawer
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
      this.getUserList(this.role)
    },
    // 获取用户列表
    getUserList (props) {
      if (this.role !== props) {
        this.pagination.page = 1
      }
      this.role = props
      this.loading = true
      let dataObj = {'role': !props ? 0 : 4 - props, 'num': this.pagination.page, 'size': this.pagination.rowsPerPage}
      axios(this.HOSTCSM, 'getuserlist', dataObj, cb => {
        this.loading = false
        if (cb.code === 0) {
          this.desserts = cb.data.list
          this.totalDesserts = cb.data.sumcount
          return false
        }
        this.$emit('update:setVsnackbar', [true, cb.msg, 'error'])
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
        this.$emit('update:setVsnackbar', [true, cb.msg, 'error'])
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
          this.$emit('update:setVsnackbar', [true, cb.msg, 'success'])
          this.getuser({'uid': this.items.user_id}, whichEle === 'setMan' ? 2 : 1)
        } else {
          this.$emit('update:setVsnackbar', [true, cb.msg, 'error'])
        }
      })
    },
    // 跳转到孩子详情
    jumpToChildClass (childid, which) {
      if (childid) {
        clearTimeout(this.timeout)
        this.timeout = window.setTimeout(() => {
          if (which === 'class' || which === 'stuclass') {
            console.log(this.$parent.$parent.clickRouterName)
            this.$parent.$parent.clickRouterName({name: '查询班级'}, [7, 0], childid)
          } else {
            this.dropdown = '用户ID'
            this.search = childid
            this.cIndex = 0
            this.sendSearchUser()
          }
        }, 200)
      } else {
        clearTimeout(this.timeout)
      }
    }
  },
  watch: {
    search () {
      return this.search
    },
    pagination: {
      handler () {
        this.desserts.length !== 1 && this.getUserList(this.role)
      },
      deep: false
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
    }
    this.$route.params.news = ''
  }
}
</script>
