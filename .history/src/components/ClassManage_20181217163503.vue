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
        <v-flex><span class="grey--text">班级数：</span>{{ totalDesserts }} 班</v-flex>
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
              <v-img :src="props.item.logo_url" />
            </v-avatar>
            (class_id: {{ props.item.class_id }}) 
          </td>
          <td class="text-xs-right">{{ props.item.class_name }}({{ props.item.def_name }})</td>
          <td class="text-xs-right">{{ props.item.cnt_teacher }}</td>
          <td class="text-xs-right">{{ props.item.cnt_parent }}</td>
          <td class="text-xs-right">{{ props.item.cnt_stu }}</td>
          <td class="text-xs-right">{{ props.item.born_year }}</td>
          <td class="text-xs-right hidden-sm-and-down">
            in_time:{{ props.item.in_time }}<br>
            last_time:{{ props.item.last_time }}
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
          <img :src="items && items.props.logo_url ? items.props.logo_url:''">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{items && items.props.class_name ? items.props.class_name+"--":''}}({{ items && items.props.def_name?items.props.def_name:'' }})</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
             <!-- 班级信息 -->
            <Card  xl12 lg12 xs12 sm12 md12 d-flex  which="onlyClass" :data="[items.props]" v-if="items">
            </Card>

            <v-flex xl12 lg12 xs12 sm12 md12 d-flex >
              <v-card tile  >
              <v-toolbar flat color="white">
                <v-toolbar-title>成员列表 {{totalItem}} 人</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  flat="flat"
                  @click="dialog = false"
                >
                  + 加入班级
                </v-btn>
              </v-toolbar>
              <v-divider></v-divider>
              <v-data-table
                :headers="headersItem"
                :items="items?items.memeber:[]"
                :total-items="totalItem"
                hide-actions
                :loading="loadingItem"
                class="elevation-1"
              >
                <template slot="items" slot-scope="props">
                  <td>
                    <v-avatar :size="25">
                      <v-img :src="formatAvatar(props.item.avatar)" />
                    </v-avatar>
                    (user_id: {{ props.item.user_id }}) 
                  </td>
                  <td>{{ props.item.uname }}</td>
                  <td>
                    <span v-if="props.item.edu_role!==0">{{ formatEduRole(props.item.edu_role) }}</span>
                    <span v-if="props.item.is_owner!==0">{{ formatIsOwner(props.item.is_owner)}}</span>
                    <span v-if="props.item.is_stu!==0">{{ formatIsStu(props.item.is_stu)}}</span>
                  </td>
                  <td>{{ formatGender(props.item.gender) }}</td>
                  <td class="text-xs-right">
                    <Dialog color="info" butCont="移除" alert="true" :unbindWho="props.item" which="quitclass" @quitclass="quitclass"></Dialog>
                  </td>
                </template>
              </v-data-table>
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
import API from '../api/API.js'
import Card from './actionComp/card'
import Dialog from './actionComp/dialog'
import { formatGender, formatUserRole, formatStatus, formatAvatar, formatEduRole, formatIsOwner, formatIsStu, formatClassMode } from '../api/dist.js'
const api = new API()

export default {
  name: 'UserManage',
  components: {Card, Dialog},
  data () {
    return {
      formatGender,
      formatUserRole,
      formatStatus,
      formatAvatar,
      formatEduRole,
      formatIsOwner,
      formatIsStu,
      formatClassMode,
      drawer: null,
      totalDesserts: 0,
      desserts: [],
      loading: true,
      loadingItem: true,
      pagination: {},
      headers: [
        { text: '头像', value: 'logo_url', align: 'left', sortable: false },
        { text: '班级名', value: 'class_name', align: 'right' },
        { text: '老师数', value: 'cnt_teacher', align: 'right' },
        { text: '家长数', value: 'cnt_parent', align: 'right' },
        { text: '学生数', value: 'cnt_stu', align: 'right' },
        { text: '届(年)', value: 'born_year', align: 'right' },
        { text: '时间', value: 'last_time', align: 'right', class: 'hidden-sm-and-down' }
      ],
      headersItem: [
        { text: '头像', value: 'avatar', align: 'left', sortable: false },
        { text: '昵称', value: 'uname', align: 'left', sortable: false },
        { text: '班内身份', value: 'edu_role', align: 'left', sortable: false },
        { text: '性别', value: 'gender', align: 'left', sortable: false },
        { text: '', value: '', align: 'right', sortable: false }
      ],
      totalItem: 0,
      logining: false,
      items: null,
      dialog: false,
      quiteclassitem: {},
      search: '',
      logining: false
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
    getclasslist (page, rowsPerPage) {
      this.loading = true
      let params = {
        api: this.HOSTCSM,
        param: {
          method: 'getclasslist',
          data: JSON.stringify({'num': this.pagination.page, 'size': this.pagination.rowsPerPage})
        }
      }
      api
        .post(params)
        .then(res => {
          this.logining = false
          let msg = res.data
          if (msg.code === 0) {
            this.loading = false
            for (let val of msg.data.list) {
              val.logo_url = formatAvatar(val.logo_url)
            }
            this.desserts = msg.data.list
            this.totalDesserts = msg.data.sumcount
          } else {
            this.$emit('update:setVsnackbar', [true, msg.msg, 'error'])
          }
        })
        .catch(err => {
          console.log(err)
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
      this.loadingItem = true
      let params = {
        api: this.HOSTCSM,
        param: {
          method: 'getclassinfo',
          data: JSON.stringify({'classid': classid})
        }
      }
      api
        .post(params)
        .then(res => {
          this.loadingItem = false
          let msg = res.data
          if (msg.code === 0) {
            msg.data.memeber.sort((a, b) => {
              return b.edu_role - a.edu_role
            })
            this.items = {
              ...this.items,
              'memeber': msg.data.memeber
            }
            if (which) {
              console.log(msg.data.cinfo)
              this.desserts = [msg.data.cinfo]
              this.totalDesserts = 1
            }
            this.totalItem = msg.data.memeber.length
          } else {
            this.$emit('update:setVsnackbar', [true, msg.msg, 'error'])
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    clickQuitClassItem (props) {
      this.dialog = true
      this.quiteclassitem = props
    },
    quitclass (props) {
      this.dialog = false
      let params = {
        api: this.HOSTCSM,
        param: {
          method: 'quitclass',
          data: JSON.stringify({'uid': props.user_id, 'classid': props.class_id})
        }
      }
      api
        .post(params)
        .then(res => {
        //  console.log(res)
          let msg = res.data
          if (msg.code === 0) {
            this.$emit('update:setVsnackbar', [true, msg.msg, 'success'])
            this.getclassinfo(props.class_id)
          } else {
            this.$emit('update:setVsnackbar', [true, msg.msg, 'error'])
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  watch: {
    pagination: {
      handler () {
        this.getclasslist()
      },
      deep: false
    }
  },
  mounted () {
  },
  activated () {
    this.$route.params.news && this.getNewData()
    this.$route.params.news = ''
  }
}
</script>
