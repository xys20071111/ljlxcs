<template>
  <div class="wrapper">
    123456
    
  </div>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    components: {

    },
    props: {

    },
    watch: {

    },
    computed: {

    },
    methods: {
      getNewData () { }

    },
    created () {

    },
    mounted () {

    },
    activated () {
      this.$route.params.news && this.getNewData()
      this.$route.params.news = ''
    }
  }
</script>
<style scoped>

</style>