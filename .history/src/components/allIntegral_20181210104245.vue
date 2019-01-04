<template>
  <div>
    <v-layout class="layout" style="flex-wrap: wrap;align-items:center">
      <textField label="用户id" placeholder="请输入用户ID" which="user_id" @searchClass = "searchClass" :setModel.sync="user_id" ></textField>
      <v-spacer></v-spacer>
    </v-layout>
    <v-flex class="allinteTitle blue lighten-3 white--text lighten-5--text" d-flex mt-3>资产摘要</v-flex>
    <dataTable :headers="header" :desserts="dessert" :loading="load"></dataTable>
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
    <dataTable :headers="headers" :desserts="desserts" :loading="loading" :news="news" :setNew.sync="news" @getNew="getNew"></dataTable>
  </div>
</template>

<script>
import {axios, handleStatis, handleChartData} from '../utils/handledata.js'
import {handleLine} from '../utils/hanlechart.js'
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
      headers: [],
      header: [],
      headersBox: [],
      headersTitle: [{
        'user_id': '用户ID',
        'amount': '变更金额',
        'amount_status': '收入/支出',
        'app_id': 'appId',
        'atom': '订单号',
        'before_amount': '变更前余额',
        'current_amount': '余额',
        'in_time': '变更时间',
        'task_time': '变更时间',
        'currecy_id': '货币类型',
        'detail_id': 'detailId',
        'op_user_id': 'opUserId',
        'sub_id': 'subId',
        'remark': '备注',
        'ip': 'IP'
      },
      {'amount': '余额', 'currecy_id': '货币类型', 'in_amount': '总收入', 'out_amount': '总支出', 'user_id': '用户ID'}
      ],
      news: 'news',
      option: ''
    }
  },
  watch: {
    times () {
      if (!this.user_id || isNaN(this.user_id * 1)) {
        return false
      }
      this.user_id && this.getNewData('now')
    },
    state () {
      if (!this.user_id || isNaN(this.user_id * 1)) {
        return false
      }
      this.user_id && this.getNewData('now')
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
      newPage = newPage === 'now' ? '' : newPage
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
    for (let items of this.headersTitle) {
      let headersTitle = []
      for (let [key, value] of Object.entries(items)) {
        let headersTitleOne = {}
        headersTitleOne.text = value
        headersTitleOne.value = key
        headersTitleOne.align = 'center'
        headersTitleOne.sortable = false
        headersTitle.push(headersTitleOne)
      }
      this.headersBox.push(headersTitle)
    }
    this.headers = this.headersBox[0]
    this.header = this.headersBox[1]
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