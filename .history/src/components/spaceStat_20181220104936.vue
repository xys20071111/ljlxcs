<template>
   <div>
     <v-layout class="layout" style="flex-wrap: wrap;align-items:center;margin: 10px 0;">
       <textField  label="按班级ID查询" placeholder="请输入班级ID" which="classId" @searchClass = "searchClass" :setModel.sync="classId"> </textField> 
        <v-spacer></v-spacer>
       <timeFrame @change="times = $event" class="timeBox" :startHide="true"></timeFrame>
    </v-layout>
    <v-progress-linear :active="loading" :indeterminate="loading" height="4"></v-progress-linear>
    <chart :option="option" id="chart"></chart>
    <dataTable :which="'spaceStat'" :desserts="desserts" :loading="loading"></dataTable>
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
      totalDesserts: 0,
      desserts: [],
      loading: true,
      pagination: {},
      buttonIndex: 0,
      headers: [
        {text: '班级ID', value: 'class_id', align: 'center', sortable: true},
        {text: '班级名称', value: 'class_name', align: 'center', sortable: false},
        {text: '发布数量', value: 'amount', align: 'center', sortable: true},
        {text: '发布位置', value: 'city', align: 'center', sortable: true}
      ],
      num: 1,
      times: [],
      option: {},
      classId: ''
    }
  },
  watch: {
    times () {
      this.getNewData()
    }
  },
  methods: {
    getNewData (classOrNo) {
      this.loading = true
      let dataObj = {time: this.times[1].split('-').join('')}
      classOrNo && (dataObj.class_id = this.classId)
      axios(this.HOSTCSM, 'getspacesummary', dataObj, cb => {
        this.loading = false
        if (cb.code !== 0) {
          this.$emit('update:setVsnackbar', [true, cb.msg ? cb.msg : '请求失败，请重试', 'error'])
          return false
        }
        this.desserts = handleStatis(cb.data)
        let chartData = handleChartData(cb.data, 'sp')
        this.option = cb.data.length > 0 ? handleLine(chartData) : ''
      }, 'nodata')
    },
    searchClass (classOrTeach) {
      if (!this[classOrTeach]) {
        this.getNewData()
        return false
      }
      this.getNewData(classOrTeach)
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

<style>
  .timeBox{
    margin: 0 20px;
  }
</style>


