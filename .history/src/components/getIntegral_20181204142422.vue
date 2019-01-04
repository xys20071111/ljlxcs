<template>
  <div>
    <v-layout class="layout" style="flex-wrap: wrap;align-items:center">
      <textField label="用户id" placeholder="请输入用户ID" which="user_id" @searchClass = "searchClass" :setModel.sync="user_id" ></textField>
    </v-layout>
    <dataTable :headers="headers" :desserts="desserts" :loading="loading"></dataTable>
  </div>
</template>

<script>
import textField from './actionComp/textField'
import dataTable from './actionComp/dataTable'
import {axios, handleStatis} from '../utils/handledata.js'
export default {
  components: { textField, dataTable },
  props: {},
  data () {
    return {
      desserts: [],
      user_id: '',
      loading: false,
      headers: [],
      headersBox: [],
      headersTitle: [
        {'amount': '余额', 'currecy_id': '货币类型', 'in_amount': '总收入', 'out_amount': '总支出', 'user_id': '用户ID'}
      ],
      snackbar: true
    }
  },
  methods: {
    getNewData (classOrNo) {
      if ((!this.user_id || isNaN(this.user_id * 1)) && classOrNo) {
        this.$emit('update:setVsnackbar', [true, '请输入正确的用户ID', 'error'])
        return false
      } else if ((!this.user_id || isNaN(this.user_id * 1)) && !classOrNo) {
        return false
      }
      this.loading = true
      let dataObj = {user_id: this.user_id}
      axios(this.HOSTCSM, 'asset', dataObj, cb => {
        this.loading = false
        if (cb.code !== 0) {
          this.$emit('update:setVsnackbar', [true, cb.msg ? cb.msg : '请求失败，请重试', 'error'])
          return false
        }
        this.desserts = handleStatis([cb.data])
      }, 'nodata')
    },
    searchClass (classOrTeach) {
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
    this.headers = this.headersBox[0]
  }
}
</script>
<style scoped>
</style>