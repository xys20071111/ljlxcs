<template>
   <div>
     <v-layout class="layout" style="flex-wrap: wrap;align-items:center;margin: 10px 0;">
       <v-flex>
          <v-btn v-for="(button, index) in buttons" :key="button" :color="buttonIndex === index? 'success':'grey lighten-3'" @click="changeEle(index)">
           {{button}}
          </v-btn>
       </v-flex>
       <textField ref="classId" label="按班级ID查询" placeholder="请输入班级ID" which="classId" @searchClass = "searchClass"  :setModel.sync="classId" v-if="this.buttonIndex"> </textField>
       <textField ref="teachId" label="按老师ID查询" placeholder="请输入老师ID" which="teacherId" @searchClass = "searchClass"  :setModel.sync="teacherId" v-if="this.buttonIndex"> </textField>
      <timeFrame @change="times = $event" class="timeBox"></timeFrame>
    </v-layout>
    <v-progress-linear :active="loading" :indeterminate="loading" height="4"></v-progress-linear>
    <chart :option="option" id="chart"></chart>
    <dataTable :which="'homeworkStat' + buttonIndex" :desserts="desserts" :loading="loading"></dataTable>
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
      times: [],
      option: '',
      classId: '',
      teacherId: ''
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
      this.$refs.teachId.modelNumber = ''
      this.getNewList()
    },
    getNewList (classOrNo) {
      this.loading = true
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
      // if (index === this.buttonIndex) { return false }
      this.buttonIndex = index
      this.getNewList()
    },
    searchClass (classOrTeach) {
      if (!this[classOrTeach]) {
        this.$emit('update:setVsnackbar', [true, (classOrTeach === 'classId' ? '班级ID' : '老师ID') + '不能为空', 'error'])
        return false
      } else if (isNaN(this[classOrTeach] * 1)) {
        this.$emit('update:setVsnackbar', [true, '请输入正确的' + (classOrTeach === 'classId' ? '班级ID' : '老师ID'), 'error'])
        return false
      }
      this.getNewList(classOrTeach)
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
  .timeBox{
    margin: 0 20px;
  }
</style>


