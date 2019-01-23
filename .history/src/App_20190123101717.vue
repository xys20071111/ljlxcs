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
      fixed: false,
      snackbar: [false, '', 'success']
    }
  },
  methods: {
    clickApp () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.$router.replace({ 'name': 'login' })
        this.$children.$children[0]
      }, 5000)
    }
  },
  mounted () {
    console.log(this.$children[0].$children[0].$children[0])
    window.onmousedown = () => {
      this.$route.path !== '/login' && this.clickApp()
    }
    window.oncontextmenu = () => {
      this.$route.path !== '/login' && this.clickApp()
    }
    window.onscroll = () => {
      this.$route.path !== '/login' && this.clickApp()
    }
    window.onkeydown = () => {
      this.$route.path !== '/login' && this.clickApp()
    }
    window.onresize = () => {
      this.$route.path !== '/login' && this.clickApp()
    }
  }
}
</script>