<template>
  <div>
     <v-layout class="layout" style="flex-wrap: wrap;align-items:center;margin: 10px 0;">
       <v-flex>
          <v-btn v-for="(button, index) in buttons" :key="button" :color="buttonIndex === index? 'success':'grey lighten-3'" @click="changeEle(index)">
           {{button}}
          </v-btn>
       </v-flex>
    </v-layout>
    <v-menu
      v-model="showMenu"
      absolute
      offset-y
    >
    <v-text-field
        slot="activator"
        label="开始时间"
        style = "width:124px"
        readonly
        hide-details
      ></v-text-field>
      <v-list>
        <v-list-tile
          v-for="(item, index) in items"
          :key="index"
        >
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    
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
        items: ['按日查询', '按月查询'],
        buttonIndex: 0,
        times: [],
        option: '',
        showMenu: true
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