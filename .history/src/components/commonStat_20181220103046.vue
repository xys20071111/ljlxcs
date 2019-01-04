<template>
   <div>
     <v-layout class="layout" style="flex-wrap: wrap;align-items:center;margin: 10px 0;">
       <v-flex>
          <v-btn v-for="(button, index) in buttons" :key="button" :color="buttonIndex === index? 'success':'grey lighten-3'" @click="changeEle(index)">
           {{button}}
          </v-btn>
       </v-flex>
    </v-layout>
    <chart :option="option" id="chart"></chart>
    <dataTable :type="'commonStat' + buttonIndex" :desserts="desserts" :loading="loading"></dataTable>
  </div>
</template>

<script>
import {axios, handleAlldata, handleStatis, handleChartData} from '../utils/handledata.js'
import {handleLine} from '../utils/hanlechart.js'
import dataTable from './actionComp/dataTable'
import chart from './actionComp/chart'
export default {
  components: {chart, dataTable},
  data () {
    return {
      desserts: [],
      dessertsBox: [],
      loading: true,
      buttons: ['日活跃量', '月活跃量', '日注册量'],
      buttonIndex: 0,
      headers: [],
      headersBox: [],
      headersTitle: [
        {'pubtime': '时间', 'all': '全部', 'parent': '家长', 'teacher': '老师'},
        {'pubtime': '时间', 'all': '全部', 'parent': '家长', 'teacher': '老师'},
        {'pubtime': '时间', 'trueLogin': '手机注册量', 'allLogin': '总注册量', 'perc': '手机认证比'}
      ],
      option: '',
      optionBox: []
    }
  },
  methods: {
    getNewData (classOrNo) {
      this.loading = true
      axios(this.HOSTCSM, 'getuser_s', {}, cb => {
        console.log(cb)
        this.loading = false
        if (cb.code !== 0) {
          this.$emit('update:setVsnackbar', [true, cb.msg ? cb.msg : '请求失败，请重试', 'error'])
          return false
        }
        let cbData = handleAlldata(cb.data)
        this.dessertsBox = [handleStatis(cbData[0]), handleStatis(cbData[1]), handleStatis(cbData[2])]
        let chartDataBox = [handleChartData(cbData[0].reverse(), 'com0'), handleChartData(cbData[1].reverse(), 'com1'), handleChartData(cbData[2].reverse(), 'com2')]
        this.optionBox = [chartDataBox[0] ? handleLine(chartDataBox[0]) : '',
          chartDataBox[1] ? handleLine(chartDataBox[1]) : '',
          chartDataBox[2] ? handleLine(chartDataBox[2]) : ''
        ]
        this.changeEle()
      })
    },
    changeEle (index) {
      if (index === this.buttonIndex) { return false }
      index = index === undefined ? this.buttonIndex : index
      this.buttonIndex = index
      this.headers = this.headersBox[index]
      this.desserts = this.dessertsBox[index]
      this.option = this.optionBox[index]
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
    this.getNewData()
  },
  activated () {
    this.$route.params.news && this.getNewData()
    this.$route.params.news = ''
  }
}
</script>

<style scoped>
</style>


