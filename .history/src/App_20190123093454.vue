<template>
  <v-app>
    <v-content>
      <router-view/>
        <v-snackbar
          v-model="snackbar[0]"
          :timeout="5000"
          top
          right
          multi-line
          :color="snackbar[2]"
        >
          {{snackbar[1]}}
          <v-btn
            flat
            @click="snackbar.splice(0 , 1 , false)"
          >
            <v-icon>close</v-icon>
          </v-btn>
      </v-snackbar>
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
      snackbar: [true, '页面超时，请重新登录', 'success']
    }
  },
  methods: {
    clickApp () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        console.log(123456)
        // this.$router.replace({ 'path': '/login' })
      }, 5000)
    }
  },
  mounted () {
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