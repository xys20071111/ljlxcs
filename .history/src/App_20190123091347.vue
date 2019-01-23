<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  // watch: {
  //   $route (to, from) {
  //     console.log(to, from)
  //   }
  // },
  data () {
    return {
      fixed: false
    }
  },
  methods: {
    clickApp () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        console.log(this.$route)
        this.$router.replace({ 'path': '/login' })
      }, 5000)
    }
  },
  mounted () {
    window.onmousedown = () => {
      this.clickApp()
    }
    window.oncontextmenu = () => {
      this.clickApp()
    }
    window.onscroll = () => {
      this.clickApp()
    }
    window.onkeydown = () => {
      this.clickApp()
    }
    window.onresize = () => {
      this.clickApp()
    }
    this.clickApp()
  }
}
</script>