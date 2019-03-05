<template>
   <div>
     <v-layout class="layout" style="flex-wrap: wrap;align-items:center;margin: 10px 0;">
       <v-flex>
          <v-btn v-for="(button, index) in buttons" :key="button" :color="buttonIndex === index? 'success':'grey lighten-3'" @click="changeEle(index)">
           {{button}}
          </v-btn>
       </v-flex>
      <timeFrame @change="times = $event" v-show="buttonIndex === 0" class="timeBox"></timeFrame>
      <timeFrame @change="times = $event" v-show="buttonIndex === 1" month="true" class="timeBox"></timeFrame>
    </v-layout>
    <v-progress-linear :active="loading" :indeterminate="loading" height="4"></v-progress-linear>
    <chart :option="option" id="chart"></chart>
    <dataTable :which="'homeworkStat' + 0" :desserts="desserts" :loading="loading"></dataTable>
  </div>
</template>

<script>
import {axios, handleStatis, handleChartData} from '../utils/handledata.js'
import {handleLine} from '../utils/hanlechart.js'
import timeFrame from './actionComp/timeFrame'
import dataTable from './actionComp/dataTable'
import textField from './actionComp/textField'
import chart from './actionComp/chart'
export default {
  components: {timeFrame, chart, dataTable, textField},
  data () {
    return {
      desserts: [],
      loading: true,
      buttons: ['按日查询', '按月查询'],
      buttonIndex: 0,
      times: [],
      option: ''
    }
  },
  watch: {
    times () {
      this.getNewList()
    }
  },
  methods: {
    getNewData () {
      this.getNewList()
    },
    getNewList (classOrNo) {
      this.loading = true
      let dataObj = {begin: this.times[0], end: this.times[1]}
      axios(this.HOSTCSM, 'gethwtj', dataObj, cb => {
        this.loading = false
        if (cb.code !== 0) {
          this.$emit('update:setVsnackbar', [true, cb.msg ? cb.msg : '请求失败，请重试', 'error'])
          return false
        }
        this.desserts = handleStatis(cb.data)
        cb.data.reverse()
        let chartData = handleChartData(cb.data, 'hw')
        this.option = chartData ? handleLine(chartData, 'hw') : ''
      })
    },
    changeEle (index) {
      this.buttonIndex = index
      this.getNewList()
    }
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
</style>