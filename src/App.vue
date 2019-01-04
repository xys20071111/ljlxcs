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
      // 获取当前时间戳
      // let nowTime = new Date().getTime()
      // 有操作后的5s后触发
      this.timeout = setTimeout(() => {
        console.log('1111')
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
  }
}
</script>