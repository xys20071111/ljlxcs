<template>
  <div>
    <v-progress-linear :active="loading" :indeterminate="loading" height="4"></v-progress-linear>
    <v-layout class="layout" style="flex-wrap: wrap;align-items:center">
      <v-radio-group v-model="state" hide-details row style="margin: 10px 10px 10px 20px;flex: 0 0 auto;">
        <v-radio
          v-for="(value, key) in ['收入', '支出']"
          :key="value"
          :label="value"
          :value="key + 1"
          color="#2196f3"
        ></v-radio>
      </v-radio-group>
      <textField label="用户id" placeholder="请输入用户ID" which="user_id" buttonHide="true" :setModel.sync="user_id" ></textField>
      <textField label="金额" placeholder="请输入金额" which="amount" buttonHide="true" :setModel.sync="amount" ></textField>
      <textField label="备注信息" placeholder="请输入备注信息" which="remark" buttonHide="true" :setModel.sync="remark" number="true"></textField>
      <v-spacer></v-spacer>
      <v-btn :style="{'margin-left':'10px'}" color="info" @click="search()">
        设置
      </v-btn>
    </v-layout>
  </div>
</template>

<script>
import textField from './actionComp/textField'
import {axios} from '../utils/handledata.js'
export default {
  components: { textField },
  props: {},
  data () {
    return {
      user_id: '',
      amount: '',
      remark: '',
      state: 1,
      loading: false
    }
  },
  methods: {
    search () {
      if (!this.user_id || !this.amount || !this.remark) {
        this.$emit('update:setVsnackbar', [true, '请将设置要素填写完整', 'error'])
        return false
      } else if (isNaN(this.user_id * 1)) {
        this.$emit('update:setVsnackbar', [true, '请输入正确的用户ID', 'error'])
        return false
      } else if (isNaN(this.amount * 1)) {
        this.$emit('update:setVsnackbar', [true, '请输入正确的金额', 'error'])
        return false
      }
      this.loading = true
      let dataObj = {user_id: this.user_id, amount: this.amount * 1, remark: this.remark, state: this.state}
      axios(this.HOSTCSM, 'recharge', dataObj, cb => {
        this.loading = false
        if (cb.code === 200) {
          this.$emit('update:setVsnackbar', [true, '设置成功', 'success'])
        } else {
          this.$emit('update:setVsnackbar', [true, cb.msg ? cb.msg : '请求失败，请重试', 'error'])
          return false
        }
      }, 'nodata')
    },
    getNewData () {
    }
  },
  activated () {
    this.$route.params.news && this.getNewData()
    this.$route.params.news = ''
  }
}
</script>
<style scoped>
</style>