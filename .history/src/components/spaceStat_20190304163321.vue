<template>
   <div>
     <v-layout class="layout" style="flex-wrap: wrap;align-items:center;margin: 10px 0;">
       <textField ref="classId" label="按班级ID查询" placeholder="请输入班级ID" which="classId" @searchClass = "searchClass" :setModel.sync="classId"> </textField> 
        <v-spacer></v-spacer>
       <timeFrame @change="times = $event" class="timeBox" :startHide="true"></timeFrame>
    </v-layout>
    <v-progress-linear :active="loading" :indeterminate="loading" height="4"></v-progress-linear>
    <chart :option="option" id="chart"></chart>
    <dataTable :which="'spaceStat'" :desserts="desserts" :loading="loading" @clickjump="jumpToUserClass"></dataTable>
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
      num: 1,
      times: [],
      option: {},
      classId: ''
    }
  },
  watch: {
    times () {
      this.getNewList()
    }
  },
  methods: {
    getNewData () {
      this.$refs.classId.modelNumber = ''
      this.getNewList()
    },
    getNewList (classOrNo) {
      this.loading = true
      let dataObj = {time: this.times[1].split('-').join('')}
      classOrNo && (dataObj.class_id = this.classId)
      axios(this.HOSTCSM, 'getspacesummary', dataObj, cb => {
        this.loading = false
        if (cb.code !== 0) {
          this.$emit('update:setVsnackbar', [true, cb.msg ? cb.msg : '请求失败，请重试', 'error'])
          return false
        }
        if (!cb.data.length && classOrNo) {
          this.$emit('update:setVsnackbar', [true, '没有数据，请确认正确的班级ID', 'error'])
        }
        this.desserts = handleStatis(cb.data)
        let chartData = handleChartData(cb.data, 'sp')
        this.option = cb.data.length > 0 ? handleLine(chartData) : ''
      }, 'nodata')
    },
    searchClass (classOrTeach) {
      if (!this[classOrTeach]) {
        this.$emit('update:setVsnackbar', [true, '班级ID不能为空', 'error'])
        return false
      } else if (isNaN(this[classOrTeach] * 1)) {
        this.$emit('update:setVsnackbar', [true, '请输入正确的班级ID', 'error'])
        return false
      }
      this.getNewList(classOrTeach)
    },
    // 跳转到班级
    jumpToUserClass (userclassid) {
      let userclassIndex = this.$router.options.routes.findIndex(value => { return value.name === '班级管理' })
      this.$parent.$parent.clickRouterName({name: '查询班级'}, [userclassIndex, 0], userclassid)
    }
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


