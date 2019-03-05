<template>
   <div>
     <v-layout class="layout" style="flex-wrap: wrap;align-items:center">
       <v-flex>
          <v-btn v-for="(button, index) in buttons" :key="button" :color="buttonIndex === index? 'success':'grey lighten-3'" @click="changeEle(index)">
           {{button}}
          </v-btn>
       </v-flex>
       <v-radio-group v-model="state" hide-details row style="margin: 10px 10px 10px 20px;flex: 0 0 auto;">
         货币类型：
        <v-radio
          v-for="(value, key) in ['积分', '人民币']"
          :key="value"
          :label="value"
          :value="key + 1"
          color="#2196f3"
          @change="radioChange(key + 1)"
        ></v-radio>
      </v-radio-group>
      <v-layout style="margin: 10px 10px 10px 20px;flex: 0 1 auto;">
        <div style="align-items: center;display:flex;flex: 0 0 auto;font-size:16px">应用类型：</div>
        <v-radio-group v-model="states" hide-details row style="margin: 10px 0px;padding:0;flex: 0 1 auto;">
          <v-radio
            v-for="(value, key) in ['全部', '系统调整', '积分抽奖(送人民币)', '系统奖励', '积分抽奖(送积分)']"
            :key="value"
            :label="value"
            :value="key"
            color="#2196f3"
            @change="radioChanges(key)"
          ></v-radio>
        </v-radio-group>
      </v-layout>
     
      <timeFrame @change="times = $event" class="timeBox" :startHide="true" :month="true" v-show="buttonIndex !== 0"></timeFrame>
    </v-layout>
    <v-progress-linear :active="loading" :indeterminate="loading" height="4"></v-progress-linear>
    <chart :option="option" id="chart" v-if="buttonIndex!== 0"></chart>
    <dataTable :which="'reconIntergral' + buttonIndex" :desserts="desserts" :loading="loading" v-show="buttonIndex !== 2"></dataTable>
    <dataTable :which="'reconIntergral' + buttonIndex" :desserts="desserts" :loading="loading" :news="news" :clickWhich="clickWhich"
      :setNew.sync="news" @getNew="getNew" @clickList="clickListTableItem" @clickjump = "jumpToUserClass" v-show="buttonIndex === 2">
    </dataTable>

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
        <v-list-tile avatar>
          <v-list-tile-content>
            订单号: {{items.atom}}
          </v-list-tile-content>
          <v-spacer></v-spacer>
          <v-icon color="green">gps_fixed</v-icon>
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense>
          <v-divider></v-divider>
          <v-container fluid grid-list-md>
            <v-layout row wrap>
              <Card  xl12 lg12 xs12 sm12 md12 d-flex  which="orderGods" :data="[items]" v-if="items" @jumpToUserClass="jumpToUserClass">
              </Card>
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
import timeFrame from './actionComp/timeFrame'
import dataTable from './actionComp/dataTable'
import textField from './actionComp/textField'
import chart from './actionComp/chart'
import Card from './actionComp/card'
export default {
  components: {timeFrame, chart, dataTable, textField, Card},
  data () {
    return {
      desserts: [],
      saveData: [],
      loading: true,
      buttons: ['资产总览', '（每日）资产总览', '资产明细'],
      buttonIndex: 0,
      times: [],
      option: '',
      itemsCode: ['0', '1001', '1002', '1003', '1004'],
      state: 1,
      states: 0,
      news: 'news',
      drawer: false,
      cWhich: -1,
      items: {}
    }
  },
  computed: {
    clickWhich () {
      return [this.drawer, this.cWhich]
    }
  },
  watch: {
    times () {
      this.getNewList()
    }
  },
  methods: {
    clickListTableItem (props, clickWhich) {
      this.drawer = !this.drawer
      this.cWhich = clickWhich
      this.items = props
    },
    getNewData () {
      this.getNewList()
    },
    getNewList (newPage) {
      this.loading = true
      let detailMonth = '&yyyyMM=' + this.times[1].replace('-', '')
      if (this.buttonIndex === 2) {
        !newPage && (this.news = 'news')
        let page = newPage ? (newPage.page === 1 ? 1 : newPage.page + 1) : 1
        let size = newPage ? (newPage.page === 1 ? newPage.rowsPerPage * 2 : newPage.rowsPerPage) : 20
        size = newPage && newPage.rowsPerPage === -1 ? this.desserts.length : size
        axios('/asset/log?currecyID=' + this.state + '&appID=' + this.itemsCode[this.states] + detailMonth + '&page=' + page + '&size=' + size, '', {}, cb => {
          this.loading = false
          if (cb.code !== 0) {
            this.$emit('update:setVsnackbar', [true, cb.msg ? cb.msg : '请求失败，请重试', 'error'])
            return false
          }
          this.saveData = page === 1 ? (cb.v1 ? cb.v1 : []) : this.saveData.concat(cb.v1)
          console.log(this.saveData)
          let desserts = handleStatis(this.saveData)
          let newAllInteg = this.saveData.concat().reverse().map((value, index) => {
            value['amount_status' + value.amount_status] = value.amount
            value['amount_status' + (3 - value.amount_status)] = 0
            value.amounts = value.amount
            return value
          })
          let chartData = handleChartData(newAllInteg, 'allI' + 4, this.state * 1 - 1)
          this.option = chartData ? handleLine(chartData, 'hws') : ''
          for (let i = desserts.length; i < cb.v2; i++) {
            desserts.push('')
          }
          this.desserts = desserts
        }, 'nodata', 'get')
        return false
      } else if (this.buttonIndex === 1) {
        axios('/asset/daily?currecyID=' + this.state + '&appID=' + this.itemsCode[this.states] + detailMonth, '', {}, cb => {
          this.loading = false
          console.log(cb)
          if (cb.code !== 0) {
            this.$emit('update:setVsnackbar', [true, cb.msg ? cb.msg : '请求失败，请重试', 'error'])
            return false
          }
          if (cb.v1) {
            for (let vone of cb.v1) {
              for (let [key, value] of Object.entries(vone)) {
                vone[key] = value === -1 ? '--' : value
                key === 'dd' && (vone.pubtime = value)
              }
            }
          }
          let chartData = handleChartData(cb.v1 ? cb.v1 : [], 'allI' + 3, this.state * 1 - 1)
          this.option = chartData ? handleLine(chartData, 'hws') : ''
          this.desserts = handleStatis(cb.v1 ? cb.v1.reverse() : [])
        }, 'nodate', 'get')
        return false
      }
      axios('/asset/overview?currecyID=' + this.state + '&appID=' + this.itemsCode[this.states], '', {}, cb => {
        this.loading = false
        console.log(cb)
        if (cb.code !== 0) {
          this.$emit('update:setVsnackbar', [true, cb.msg ? cb.msg : '请求失败，请重试', 'error'])
          return false
        }
        if (cb.v1) {
          for (let [key, value] of Object.entries(cb.v1)) {
            cb.v1[key] = value === -1 ? '--' : value
          }
        }
        this.desserts = handleStatis(cb.v1 ? [cb.v1] : [])
      }, 'nodate', 'get')
    },
    getNew (newPage) {
      let thisDessert = this.desserts.filter((value, index) => { return value })
      if (newPage.rowsPerPage === -1 && thisDessert.length < this.desserts.length) {
        this.getNewList(newPage)
      } else if (thisDessert.length < this.desserts.length && (newPage.page + 1) * newPage.rowsPerPage > thisDessert.length) {
        this.getNewList(newPage)
      }
    },
    changeEle (index) {
      if (index !== this.buttonIndex && index !== 2) {
        this.desserts = []
      }
      this.buttonIndex = index
      this.getNewList()
    },
    radioChange (index) {
      this.state = index
      this.getNewList()
    },
    radioChanges (index) {
      this.states = index
      this.getNewList()
    },
    // 跳转到用户
    jumpToUserClass (userclassid) {
      console.log(userclassid)
      let userclassIndex = this.$router.options.routes.findIndex(value => { return value.name === '用户管理' })
      this.$parent.$parent.clickRouterName({name: '查询用户'}, [userclassIndex, 0], userclassid)
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

<style scoped>
  .layout{
    margin: 10px 0;
  }
  .timeBox{
    margin: 0 20px;
  }
</style>


