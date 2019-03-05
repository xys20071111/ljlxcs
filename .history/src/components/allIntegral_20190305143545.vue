<template>
  <div>
    <v-layout class="layout" style="flex-wrap: wrap;align-items:center">
      <textField label="用户id" placeholder="请输入用户ID" which="user_id" ref="userID" @searchClass = "searchClass" :setModel.sync="user_id" ></textField>
      <v-spacer></v-spacer>
    </v-layout>
    <v-flex class="allinteTitle blue lighten-3 white--text lighten-5--text" d-flex mt-3>资产摘要</v-flex>
    <dataTable which="allIntegral0" :desserts="dessert" :loading="load" @clickjump="jumpToUserClass"></dataTable>
    <v-layout class="layout" style="flex-wrap: wrap;align-items:center" mt-3>
      <v-radio-group v-model="state" hide-details row style="margin: 10px 10px 10px 20px;flex: 0 0 auto;">
        <v-radio
          v-for="(value, key) in ['全部', '收入', '支出']"
          :key="value"
          :label="value"
          :value="key"
          color="#2196f3"
        ></v-radio>
      </v-radio-group>
      <v-spacer></v-spacer>
      <timeFrame @change="times = $event" class="timeBox"></timeFrame>
    </v-layout>
    <v-flex class="allinteTitle blue lighten-3 white--text lighten-5--text" d-flex mt-3>资产明细</v-flex>
    <dataTable1 which="allIntegral1" :desserts="desserts" :loading="loading" :news="news" :clickWhich="clickWhich"
      :setNew.sync="news"  @clickList="clickListTableItem" :totalDesserts="totalDesserts" @clickjump="jumpToUserClass"
        @getclasslist="getAllDetail" :pagination.sync="pagination">
    </dataTable1>
    <v-layout>
      <v-navigation-drawer
        v-model="drawer"
        temporary
        right
        floating
        clipped
        app
        fixed
        light
        :width="1000"
      >
      <v-list class="pa-0">
        <v-list-tile>
          <v-icon @click.stop="drawer=!drawer">close</v-icon>
        </v-list-tile>
      </v-list>
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-content>
            订单号: {{items.atom}}
          </v-list-tile-content>
          <v-spacer></v-spacer>
          <v-icon color="green">gps_fixed</v-icon>
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense>
          <v-container fluid grid-list-md>
            <v-layout row wrap>
              <Card  xl12 lg12 xs12 sm12 md12 d-flex  which="orderGods" :data="[items]" v-if="items"  @jumpToUserClass="jumpToUserClass">
              </Card>
            </v-layout>
          </v-container>
      </v-list>
      </v-navigation-drawer>
    </v-layout>
  </div>
</template>

<script>
import {axios, handleStatis} from '../utils/handledata.js'
import timeFrame from './actionComp/timeFrame'
import textField from './actionComp/textField'
import dataTable from './actionComp/dataTable'
import dataTable1 from './actionComp/dataTable1'
import chart from './actionComp/chart'
import Card from './actionComp/card'
export default {
  components: {timeFrame, textField, dataTable, dataTable1, chart, Card},
  props: {},
  data () {
    return {
      desserts: [],
      dessert: [],
      saveData: [],
      state: 0,
      times: [],
      loading: false,
      load: false,
      user_id: '',
      searchTrue: '',
      pagination: {},
      news: 'news',
      option: '',
      drawer: false,
      cWhich: -1,
      items: {},
      totalDesserts: 0
    }
  },
  computed: {
    clickWhich () {
      return [this.drawer, this.cWhich]
    }
  },
  watch: {
    times () {
      if (this.searchTrue && !isNaN(this.searchTrue * 1)) {
        this.getAllDetail()
      }
    },
    state () {
      if (this.searchTrue && !isNaN(this.searchTrue * 1)) {
        this.getAllDetail()
      }
    }
  },
  methods: {
    clickListTableItem (props, clickWhich) {
      [this.drawer, this.cWhich, this.items] = [true, clickWhich, props]
    },
    // 获取资产摘要
    getAsset () {
      this.load = true
      let dataObj = {user_id: this.searchTrue}
      axios(this.HOSTCSM, 'asset', dataObj, cb => {
        this.load = false
        if (cb.code !== 0) {
          this.$emit('update:setVsnackbar', [true, cb.msg || '请求失败，请重试', 'error'])
          return false
        }
        this.dessert = handleStatis(cb.data ? [cb.data] : [])
      }, 'nodata')
    },
    // 获取资产详情
    getAllDetail (newPage) {
      this.loading = true
      !newPage && (this.news = 'news')
      let rowsPerPage = this.pagination.rowsPerPage
      let dataObj = {
        tm1: this.times[0],
        tm2: this.times[1] + ' 23:59:59',
        user_id: this.searchTrue,
        status: this.state,
        page: this.pagination.page,
        size: (rowsPerPage === 1 || rowsPerPage === 0) ? 20 : rowsPerPage === -1 ? 100 : this.pagination.rowsPerPage
      }
      axios(this.HOSTCSM, 'assetdetail', dataObj, cb => {
        this.loading = false
        if (cb.code !== 0) {
          this.$emit('update:setVsnackbar', [true, cb.msg || '请求失败，请重试', 'error'])
          return false
        }
        this.totalDesserts = cb.ex
        let desserts = handleStatis(cb.data || [])
        this.desserts = desserts
      }, 'nodata')
    },
    getNewData (newPage) {
      this.$refs.userID.modelNumber = ''
      if (!this.searchTrue || isNaN(this.searchTrue * 1)) {
        return false
      }
      this.getAsset()
      this.getAllDetail()
    },
    searchClass (classOrTeach) {
      if (this[classOrTeach] && !isNaN(this[classOrTeach] * 1)) {
        this.searchTrue = this.user_id
        this.getAsset()
        this.getAllDetail()
      } else {
        this.$emit('update:setVsnackbar', [true, '请输入正确的用户ID', 'error'])
      }
    },
    // 跳转到用户
    jumpToUserClass (userclassid) {
      let userclassIndex = this.$router.options.routes.findIndex(value => { return value.name === '用户管理' })
      this.$parent.$parent.clickRouterName({name: '查询用户'}, [userclassIndex, 0], userclassid)
    }
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
  .allinteTitle{
    justify-content: center;
    align-items: center;
    height: 50px;
    font-size: 16px;
  }
</style>