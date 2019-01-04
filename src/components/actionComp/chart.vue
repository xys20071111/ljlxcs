<template>
    <v-flex :id="id"  ref="chart" class="chart">
    </v-flex>
</template>

<script>
import highcharts from 'highcharts'
export default {
  props: ['option', 'id'],
  data () {
    return {}
  },
  watch: {
    option (curVal, oldVal) {
      console.log(curVal)
      curVal && highcharts.chart(this.id, curVal)
      !curVal && (this.$refs.chart.innerHTML = '很抱歉，目前没有数据 :(')
    }
  }
}
</script>
<style scoped>
.chart{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>