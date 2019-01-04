<template>
  <div>
    <v-layout class="layout" style="flex-wrap: wrap;align-items:center">
      <textField label="用户id" placeholder="请输入用户ID" which="user_id" @searchClass = "searchClass" :setModel.sync="user_id" ></textField>
      <v-spacer></v-spacer>
    </v-layout>
    <v-flex class="allinteTitle blue lighten-3 white--text lighten-5--text" d-flex mt-3>资产摘要</v-flex>
    <dataTable :which="'allIntegral0'" :desserts="dessert" :loading="load"></dataTable>
    <v-layout class="layout" style="flex-wrap: wrap;align-items:center" mt-3>
      <v-radio-group v-model="state" hide-details row style="margin: 10px 10px 10px 20px;flex: 0 0 auto;">
        <v-radio
          v-for="(value, key) in ['全部', '收入', '支出']"
          :key="value"
          :label="value"
          :value="key"
          color="#2196f3"
        ></v-radio>
      </v-radio-group>
      <v-spacer></v-spacer>
      <timeFrame @change="times = $event" class="timeBox"></timeFrame>
    </v-layout>
    <v-flex class="allinteTitle blue lighten-3 white--text lighten-5--text" d-flex mt-3>资产明细</v-flex>
    <dataTable :which="'allIntegral1'" :desserts="desserts" :loading="loading" :news="news" :setNew.sync="news" @getNew="getNew"></dataTable>
    <v-layout>
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
            {{items.props.class_name && (items.props.class_name.slice(-1) === '班' ? items.props.class_name : items.props.class_name + '班')}}
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
              <v-data-table
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
import {axios, handleStatis, handleChartData} from '../utils/handledata.js'
import {handleLine} from '../utils/hanlechart.js'
// import { } from '../api/dist.js'
import timeFrame from './actionComp/timeFrame'
import textField from './actionComp/textField'
import dataTable from './actionComp/dataTable'
import chart from './actionComp/chart'
export default {
  components: {timeFrame, textField, dataTable, chart},
  props: {},
  data () {
    return {
      desserts: [],
      dessert: [],
      saveData: [],
      state: 0,
      times: [],
      loading: false,
      load: false,
      user_id: '',
      news: 'news',
      option: '',
      drawer: false
    }
  },
  watch: {
    times () {
      if (this.user_id && !isNaN(this.user_id * 1)) {
        this.getNewData('noall')
      }
    },
    state () {
      if (this.user_id && !isNaN(this.user_id * 1)) {
        this.getNewData('noall')
      }
    }
  },
  methods: {
    getNewData (newPage) {
      if (!this.user_id || isNaN(this.user_id * 1)) {
        return false
      }
      this.loading = true
      if (!newPage) {
        this.load = true
        let dataObj = {user_id: this.user_id}
        axios(this.HOSTCSM, 'asset', dataObj, cb => {
          this.load = false
          if (cb.code !== 0) {
            this.$emit('update:setVsnackbar', [true, cb.msg ? cb.msg : '请求失败，请重试', 'error'])
            return false
          }
          this.dessert = handleStatis(cb.data ? [cb.data] : [])
        }, 'nodata')
      }
      newPage = newPage === 'noall' ? '' : newPage
      !newPage && (this.news = 'news')
      let page = newPage ? (newPage.page === 1 ? 1 : newPage.page + 1) : 1
      let size = newPage ? (newPage.page === 1 ? newPage.rowsPerPage * 2 : newPage.rowsPerPage) : 20
      size = newPage && newPage.rowsPerPage === -1 ? this.desserts.length : size
      let dataObj = {
        tm1: this.times[0],
        tm2: this.times[1] + ' 23:59:59',
        user_id: this.user_id,
        status: this.state,
        page: page,
        size: size
      }
      axios(this.HOSTCSM, 'assetdetail', dataObj, cb => {
        this.loading = false
        if (cb.code !== 0) {
          this.$emit('update:setVsnackbar', [true, cb.msg ? cb.msg : '请求失败，请重试', 'error'])
          return false
        }
        this.saveData = page === 1 ? (cb.data ? cb.data : []) : this.saveData.concat(cb.data)
        let desserts = handleStatis(this.saveData)
        let newAllInteg = this.saveData.concat().reverse().map((value, index) => {
          value['amount_status' + value.amount_status] = value.amount
          value['amount_status' + (3 - value.amount_status)] = 0
          value.amounts = value.amount
          return value
        })
        let chartData = handleChartData(newAllInteg, 'allI' + this.state)
        this.option = chartData ? handleLine(chartData, 'hws') : ''
        for (let i = desserts.length; i < cb.ex; i++) {
          desserts.push('')
        }
        this.desserts = desserts
      }, 'nodata')
    },
    getNew (newPage) {
      console.log(newPage)
      let thisDessert = this.desserts.filter((value, index) => { return value })
      if (newPage.rowsPerPage === -1 && thisDessert.length < this.desserts.length) {
        this.getNewData(newPage)
      } else if (thisDessert.length < this.desserts.length && (newPage.page + 1) * newPage.rowsPerPage > thisDessert.length) {
        this.getNewData(newPage)
      }
    },
    searchClass (classOrTeach) {
      if (this[classOrTeach] && !isNaN(this[classOrTeach] * 1)) {
        this.getNewData()
      } else {
        this.$emit('update:setVsnackbar', [true, '请输入正确的用户ID', 'error'])
      }
    }
  },
  created () {},
  mounted () {
  },
  activated () {
    this.$route.params.news && this.getNewData()
    this.$route.params.news = ''
  }
}
</script>
<style scoped>
  .timeBox{
    margin: 0 20px;
  }
  .allinteTitle{
    justify-content: center;
    align-items: center;
    height: 50px;
    font-size: 16px;
  }
</style>