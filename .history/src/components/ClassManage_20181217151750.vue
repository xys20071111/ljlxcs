<template>
<div>
  <v-layout column wrap>
    <v-flex>
      <v-toolbar color="grey darken-1" dark>
        <v-menu>
            班级ID：
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
            <v-flex xl12 lg12 xs12 sm12 md12 d-flex >
              <v-card tile >
                <v-toolbar flat color="white">
                  <v-toolbar-title>班级信息</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-list dense>
                  <v-layout row wrap>
                  <v-flex >
                    <v-list-tile>
                      <v-list-tile-content class="grey--text">班级ID：</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ items && items.props.class_id }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content class="grey--text">老师数：</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ items && items.props.cnt_teacher }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content class="grey--text">家长数：</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ items && items.props.cnt_parent }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content class="grey--text">学生数：</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ items && items.props.cnt_stu }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content class="grey--text">届(年)：</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ items && items.props.born_year }}</v-list-tile-content>
                    </v-list-tile>
                  </v-flex>
                  <v-flex>
                    <v-list-tile>
                      <v-list-tile-content class="grey--text">班级性质：</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ items && formatClassMode(items.props.class_mode) }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content class="grey--text">允许加入：</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ items && items.props.tag_open }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content class="grey--text">in_time：</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ items && items.props.in_time }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content class="grey--text">last_time：</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ items && items.props.last_time }}</v-list-tile-content>
                    </v-list-tile>
                  </v-flex>
                  </v-layout>
                </v-list>
              </v-card>
            </v-flex>

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
                  <td class="text-xs-right"><v-btn color="info" @click.stop="clickQuitClassItem(props.item)" flat small>移除</v-btn></td>
                </template>
              </v-data-table>
              </v-card>
            </v-flex>

          </v-layout>
        </v-container>
    </v-list>

    </v-navigation-drawer>
  </v-layout>

  <v-dialog
    v-model="dialog"
    max-width="290"
    >
      <v-card>
        <v-card-title class="headline">确定将用户移除班级?</v-card-title>
        <v-card-text>
          成员姓名：{{quiteclassitem.uname}}({{quiteclassitem.user_id}})
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            flat="flat"
            @click="dialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="green darken-1"
            flat="flat"
            @click.stop="quitclass(quiteclassitem)"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</div>
</template>
<script>
import API from '../api/API.js'
import { formatGender, formatUserRole, formatStatus, formatAvatar, formatEduRole, formatIsOwner, formatIsStu, formatClassMode } from '../api/dist.js'
const api = new API()

export default {
  name: 'UserManage',
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
      dropdown_font: ['手机号', '用户ID', '推广员ID'],
      search: '',
      dropdown: '手机号',
      cIndex: 0,
      logining: false
    }
  },
  created () { },
  methods: {
    getNewData () {
      this.getDataFromApi()
        .then(data => {
          this.desserts = data.items
          this.totalDesserts = data.total
        })
    },
    clickListTableItem (props) {
      this.drawer = !this.drawer
      this.items = {props}
      this.getclassinfo(props.class_id)
    },
    // getclasslist&data={num:1,size:10}
    getclasslist (page, rowsPerPage) {
      let params = {
        api: this.HOSTCSM,
        param: {
          method: 'getclasslist',
          data: JSON.stringify({'num': page, 'size': rowsPerPage})
        }
      }
      return new Promise((resolve, reject) => {
        api
          .post(params)
          .then(res => {
            this.logining = false
            let msg = res.data
            if (msg.code === 0) {
              for (let val of msg.data.list) {
                val.logo_url = formatAvatar(val.logo_url)
              }
              let temp = msg.data.list
              let sumcount = msg.data.sumcount
              resolve({temp, sumcount})
            } else {
              this.$emit('update:setVsnackbar', [true, msg.msg, 'error'])
            }
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    getDataFromApi () {
      this.loading = true
      // let that=this
      return new Promise((resolve, reject) => {
        // const { sortBy, descending, page, rowsPerPage } = this.pagination
        const { page, rowsPerPage } = this.pagination
        this.getclasslist(page, rowsPerPage)
          .then(res => {
            let items = res.temp
            const total = res.sumcount
            setTimeout(() => {
              this.loading = false
              resolve({
                items,
                total
              })
            }, 500)
          })
      })
    },
     // 点击搜索按钮的时候
    sendSearchUser () {
      let paramsdata = {}
      let uploadArr = ['mobile', 'uid', 'pid']
      if (!this.search || isNaN(this.search * 1) || (!/^1[34578]\d{9}$/.test(this.search) && this.cIndex === 0)) {
        this.$emit('update:setVsnackbar', [true, !this.search ? '输入框内容为不能为空！' : '请输入争取的' + this.dropdown, 'error'])
        return false
      }
      paramsdata[uploadArr[this.cIndex]] = this.search
      this.getuser(paramsdata, 0)
    },
    getclassinfo (classid) {
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
      // console.log(props)
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
        this.getDataFromApi()
          .then(data => {
            this.desserts = data.items
            this.totalDesserts = data.total
          })
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
