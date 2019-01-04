<template>
  <v-flex sm12 d-flex >
    <v-card tile>
      <v-toolbar flat color="white">
        <v-toolbar-title>用户信息</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list dense>
        <v-layout row wrap>
          <v-flex v-for="(item, index) in allTitle[which]" :key="index">
            <v-list-tile v-for="(value, key) in item" :key="key">
              <v-list-tile-content class="grey--text">{{value.chn}}</v-list-tile-content>
              <v-list-tile-content class="align-end" v-if="value.eng === 'gender'">{{ formatGender(data.gender) }}</v-list-tile-content>
              <v-list-tile-content class="align-end" v-else-if="value.eng === 'user_role'">{{ formatUserRole(data.user_role) }}</v-list-tile-content>
              <v-list-tile-content class="align-end" v-else-if="value.eng === 'country'">
                {{getCountry(data.country, data.province, data.city)}}
              </v-list-tile-content>
              <v-list-tile-content class="align-end" v-else>{{ data[value.eng] }}</v-list-tile-content>
            </v-list-tile>
          </v-flex>
          <slot></slot>

        </v-layout>
      </v-list>
    </v-card>
  </v-flex>
</template>

<script>
  export default {
    data () {
      return {
        allTitle: {
          userinfo: [
            [{eng: 'user_id', chn: '用户ID：'}, {eng: 'uname', chn: '昵称：'}, {eng: 'realname', chn: '真实姓名：'}, {eng: 'mobile', chn: '手机号：'}],
            [{eng: 'gender', chn: '性别：'}, {eng: 'user_role', chn: '身份：'}, {eng: 'p_id', chn: '推广员ID：'}, {eng: 'origin', chn: '来源ID：'}],
            [{eng: 'country', chn: '地区：'}, {eng: 'in_time', chn: 'in_time：'}, {eng: 'last_time', chn: 'last_time：'}, {eng: 'intro', chn: '简介：'}]
          ]
        }

      }
    },
    components: {},
    props: ['which', 'data'],
    watch: {

    },
    computed: {

    },
    methods: {

    },
    created () {

    },
    mounted () {

    }
  }
</script>
<style scoped>

</style>