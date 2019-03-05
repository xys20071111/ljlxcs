<template>
  <div>
     <v-layout class="layout" style="flex-wrap: wrap;align-items:center;margin: 10px 0;">
       <v-flex>
          <v-btn v-for="(button, index) in buttons" :key="button" :color="buttonIndex === index? 'success':'grey lighten-3'" @click="changeEle(index)">
           {{button}}
          </v-btn>
       </v-flex>
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
    props: {

    },
    watch: {

    },
    computed: {

    },
    methods: {

    },
    created () {

    },
    mounted () {

    }
  }
</script>
<style scoped>

</style>