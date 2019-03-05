<template>
  <div>
     <v-layout class="layout" style="flex-wrap: wrap;align-items:center;margin: 10px 0;">
       <v-flex>
          <v-btn v-for="(button, index) in buttons" :key="button" :color="buttonIndex === index? 'success':'grey lighten-3'" @click="changeEle(index)">
           {{button}}
          </v-btn>
       </v-flex>
    </v-layout>
    <v-menu :nudge-width="100">
      <v-toolbar-title slot="activator">
        <v-btn>123</v-btn>
        <v-icon dark>arrow_drop_down</v-icon>
      </v-toolbar-title>
      <v-list>
        <v-list-tile
          v-for="(item, index) in items"
          :key="item"
          @click="clickListDropdownFont(item, index)"
        >
        <v-list-tile-title v-text="item"></v-list-tile-title>
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