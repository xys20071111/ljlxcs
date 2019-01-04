<template>
   <div>
     <v-layout class="layout" style="flex-wrap: wrap;align-items:center;margin: 10px 0;">
       <v-btn v-for="(button, index) in buttons" :key="button" :color="buttonIndex === index? 'success':'grey lighten-3'" @click="changeEle(index)">
          {{button}}
        </v-btn>
       <v-spacer></v-spacer>
       <textField  label="按班级ID查询" placeholder="请输入班级ID" which="classId" @searchClass = "searchClass" :setModel.sync="classId" v-if="this.buttonIndex"> </textField>
       <textField  label="按老师ID查询" placeholder="请输入老师ID" which="teacherId" @searchClass = "searchClass" :setModel.sync="teacherId" v-if="this.buttonIndex"> </textField>
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
      buttons: ['通知统计数据', '发布通知阅读率'],
      buttonIndex: 0,
      headers: [],
      headersBox: [],
      headersTitle: [
        {'pubtime': '发布时间', 'msgcounts': '通知数', 'avgreadrate': '平均阅读率', 'maxreadrate': '最高阅读率'},
        {'m_id': '通知ID', 'cnt_cls': '班级数量', 'cnt_stu': '学生数量', 'owner': '发布者ID', 'read_rate': '阅读率', 'title': '标题'}
      ],
      times: [],
      option: {},
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
        axios(this.HOSTCSM, 'getmsg_s', dataObj, cb => {
          this.loading = false
          if (cb.code !== 0) {
            this.$emit('update:setVsnackbar', [true, cb.msg ? cb.msg : '请求失败，请重试', 'error'])
            return false
          }
          this.desserts = handleStatis(cb.data)
          let chartData = handleChartData(cb.data, 'msgs')
          this.option = chartData ? handleLine(chartData) : ''
        })
        return false
      }
      axios(this.HOSTCSM, 'getmsgtj', {begin: this.times[0], end: this.times[1]}, cb => {
        this.loading = false
        if (cb.code !== 0) {
          this.$emit('update:setVsnackbar', [true, cb.msg ? cb.msg : '请求失败，请重试', 'error'])
          return false
        }
        this.desserts = handleStatis(cb.data)
        cb.data.reverse()
        let chartData = handleChartData(cb.data, 'msg')
        this.option = chartData ? handleLine(chartData) : ''
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

<style>
  .layout{
    margin: 10px 0;
  }
  .timeBox{
    margin: 0 20px;
  }
  

</style>


