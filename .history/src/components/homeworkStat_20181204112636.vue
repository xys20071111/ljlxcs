<template>
   <div>
     <v-layout class="layout" style="flex-wrap: wrap;align-items:center">
       <v-flex>
          <v-btn v-for="(button, index) in buttons" :key="button" :color="buttonIndex === index? 'success':'grey lighten-3'" @click="changeEle(index)">
           {{button}}
          </v-btn>
       </v-flex>
       <textField  label="按班级ID查询" placeholder="请输入班级ID" which="classId" @searchClass = "searchClass"  :setModel.sync="classId" v-if="this.buttonIndex"> </textField>
       <textField  label="按老师ID查询" placeholder="请输入老师ID" which="teacherId" @searchClass = "searchClass"  :setModel.sync="teacherId" v-if="this.buttonIndex"> </textField>
      <timeFrame @change="times = $event" class="timeBox"></timeFrame>
    </v-layout>
    <v-progress-linear :active="loading" :indeterminate="loading" height="4"></v-progress-linear>
    <chart :option="option" id="chart"></chart>
    <dataTable :headers="headers" :desserts="desserts" :loading="loading"></dataTable>
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
      buttons: ['作业统计数据', '发布作业阅读率'],
      buttonIndex: 0,
      headers: [],
      headersBox: [],
      headersTitle: [
        {'pubtime': '发布时间', 'hwcounts': '作业数', 'avgreadrate': '平均阅读率', 'maxreadrate': '最高阅读率', 'avgsubmitrate': '平均提交率', 'maxsubmitrate': '最高提交率'},
        {'hw_id': '作业ID', 'cnt_cls': '班级数量', 'owner': '发布者ID', 'read_rate': '阅读率', 'submit_rate': '提交率', 'title': '标题'}
      ],
      times: [],
      option: '',
      classId: '',
      teacherId: ''
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
      this.headers = this.headersBox[this.buttonIndex]
      let dataObj = {begin: this.times[0], end: this.times[1]}
      classOrNo === 'classId' && (dataObj.cls_id = this.classId)
      classOrNo === 'teacherId' && (dataObj.owner = this.teacherId)
      if (this.buttonIndex === 1) {
        axios(this.HOSTCSM, 'gethw_s', dataObj, cb => {
          this.loading = false
          if (cb.code !== 0) {
            this.$emit('update:setVsnackbar', [true, cb.msg ? cb.msg : '请求失败，请重试', 'error'])
            return false
          }
          this.desserts = handleStatis(cb.data)
          let chartData = handleChartData(cb.data, 'hws')
          this.option = chartData ? handleLine(chartData, 'hws') : ''
        })
        return false
      }
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
      if (index === this.buttonIndex) { return false }
      this.buttonIndex = index
      this.getNewData()
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
    for (let items of this.headersTitle) {
      let headersTitle = []
      for (let [key, value] of Object.entries(items)) {
        let headersTitleOne = {}
        headersTitleOne.text = value
        headersTitleOne.value = key
        headersTitleOne.align = 'center'
        headersTitleOne.sortable = true
        headersTitle.push(headersTitleOne)
      }
      this.headersBox.push(headersTitle)
    }
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


