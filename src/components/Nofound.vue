<template>
  <v-app>
    Nofound
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      show: false
    }
  },
  methods: {
    getNewData () {
      console.log(123465)
    }
  },
  mounted () {
  },
  activated () {
    this.$route.params.news && this.getNewData()
    this.$route.params.news = ''
  }
}
</script>

