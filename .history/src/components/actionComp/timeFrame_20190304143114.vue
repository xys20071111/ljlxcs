<template>
  <div class="wrapper">
    <v-menu
      :close-on-content-click="false"
      v-model="menu"
      :nudge-right="40"
      lazy
      transition="scale-transition"
      offset-y 
      max-width="88%"
      v-if="!startHide"
    >
      <v-text-field
        slot="activator"
        v-model="vDate"
        label="开始时间"
        style = "width:124px"
        readonly
        hide-details
      ></v-text-field>
      <v-date-picker 
        v-model="date"
        @input="timeinput"
        :allowed-dates = "noAllow"
        locale="zh-cn"
        :type="month ? 'month' : 'date'"
      >
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="oneDayAgo(7)">一周前</v-btn>
        <v-btn flat color="primary" @click="oneDayAgo(30)">一月前</v-btn>
        <v-btn flat color="primary" @click="oneDayAgo()">取消</v-btn>
      </v-date-picker>
    </v-menu>
    <span class="timeOver" v-if="!startHide" style="margin-right: 2px">至</span>
    <v-menu
      :close-on-content-click="false"
      v-model="menus"
      :nudge-right="40"
      lazy
      transition="scale-transition"
      offset-y 
      max-width="88%"
    >
      <v-text-field
        slot="activator"
        v-model="vDate"
        :label="startHide?'查询时间':'结束时间'"
        style = "width:124px"
        readonly
        hide-details
      ></v-text-field>
      <v-date-picker 
        v-model="dates"
        @input="timeinput"
        locale="zh-cn"
        v-bind="!startHide ? {'allowed-dates':noAllows}:{}"
        :type="month ? 'month' : 'date'"
      >
        <v-spacer></v-spacer>
        <v-btn small flat color="primary" v-if="!startHide" @click="oneDayAgo(7)">一周前</v-btn>
        <v-btn small flat color="primary" v-if="!startHide" @click="oneDayAgo(30)">一月前</v-btn>
        <v-btn small flat color="primary" @click="oneDayAgo()">取消</v-btn>
      </v-date-picker>
    </v-menu>
   </div>
</template>

<script>
export default {
  components: {},
  props: ['start', 'startHide', 'month'],
  data () {
    return {
      menu: false,
      menus: false,
      dates: new Date().toISOString().substr(0, this.month ? 7 : 10),
      date: ''
    }
  },
  computed: {
    vDates () {
      return this.dates.replace('-', '年').replace('-', '月') + (this.month ? '月' : '日')
    },
    vDate () {
      return this.date.replace('-', '年').replace('-', '月') + (this.month ? '月' : '日')
    }
  },
  watch: {
  },
  methods: {
    noAllow (e) {
      let thisTime = e.split('-')
      let lastTime = this.dates.split('-')
      let lastDate = new Date(lastTime[0] * 1, lastTime[1] * 1 - 1, lastTime[2] * 1).getTime()
      let nowDate = new Date(thisTime[0] * 1, thisTime[1] * 1 - 1, thisTime[2] * 1).getTime()
      if (nowDate < lastDate || nowDate === lastDate) {
        return true
      }
    },
    noAllows (e) {
      let thisTime = e.split('-')
      let lastTime = this.date.split('-')
      let lastDate = new Date(lastTime[0] * 1, lastTime[1] * 1 - 1, lastTime[2] * 1).getTime()
      let nowDate = new Date(thisTime[0] * 1, thisTime[1] * 1 - 1, thisTime[2] * 1).getTime()
      if (nowDate > lastDate || nowDate === lastDate) {
        return true
      }
    },
    oneDayAgo (dayNumber) {
      this.menu = false
      this.menus = false
      if (!dayNumber) {
        return false
      }
      this.date = new Date(new Date().getTime() - 86400000 * dayNumber).toISOString().substr(0, 10)
      this.dates = new Date().toISOString().substr(0, 10)
      this.$emit('change', [this.date, this.dates])
    },
    timeinput () {
      this.menu = false
      this.menus = false
      console.log(this.date, this.dates)
      this.$emit('change', [this.date, this.dates])
    }
  },
  created () {
    let startDay = this.start ? this.start : 30
    this.date = new Date(new Date().getTime() - 86400000 * startDay).toISOString().substr(0, 10)
  },
  mounted () {
    this.$emit('change', [this.date, this.dates])
  }
}
</script>
<style scoped>
.timeOver{
  display: inline-block;
  width: 20px;
  text-align: center;
}
</style>