<template>
  <div>
     <v-layout class="layout" style="flex-wrap: wrap;align-items:center;margin: 10px 0;">
       <v-flex>
          <v-btn v-for="(button, index) in buttons" :key="button" :color="buttonIndex === index? 'success':'grey lighten-3'" @click="changeEle(index)">
           {{button}}
          </v-btn>
       </v-flex>
      <v-menu min-width="120" offset-y>
        <v-btn slot="activator" :style="{width:'120px'}">
          <span :style="{marginRight:'10px'}">{{items[itemIndex]}}</span>
          <v-icon dark>arrow_drop_down</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile
            v-for="(item, index) in items"
            :key="item"
            @click="clickListDropdown(item, index)"
          >
          <v-list-tile-title v-text="item" :style="{textAlign: 'center'}"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
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
        items: ['本周', '本月', '全部'],
        buttonIndex: 0,
        itemIndex: 0,
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
      clickListDropdown (index) {
        console.log(index)
      }

    },
    created () {

    },
    mounted () {

    }
  }
</script>
<style scoped>

</style>