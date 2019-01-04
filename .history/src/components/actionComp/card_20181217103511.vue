<template>
  <v-flex sm12 d-flex >
    <v-card tile>
      <v-toolbar flat color="white">
        <v-toolbar-title>{{allTitle[which]}}</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-data-iterator
      :items="data"
      hide-actions
      loading
      no-data-text="{{allTitleErr[which]}}"
      >
        <template slot="item" slot-scope="props">
          <v-list dense>
            <v-layout row wrap>
              <v-flex v-for="(item, index) in allKey[which]" :key="index">
                <v-list-tile v-for="(value, key) in item" :key="key">
                  <v-list-tile-content class="grey--text">{{value.chn}}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-if="value.eng === 'gender'">{{ formatGender(props.item.gender) }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value.eng === 'user_role'">{{ formatUserRole(props.item.user_role) }}</v-list-tile-content>
                  <v-list-tile-avatar class="align-end" v-else-if="value.eng === 'avatar'"><img :src="props.item.avatar"></v-list-tile-avatar>
                  <v-list-tile-content class="align-end" v-else-if="value.eng === 'country'">
                    {{getCountry(props.item.country, props.item.province, props.item.city)}}
                  </v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else>{{ props.item[value.eng] }}</v-list-tile-content>
                </v-list-tile>
              </v-flex>
              <slot name="buttonSlot" :props="props"></slot>
            </v-layout>
          </v-list>
        </template>
      </v-data-iterator>
    </v-card>
  </v-flex>
</template>

<script>
  import { formatGender, formatUserRole, formatStatus, formatAvatar, formatClassMode } from '@/api/dist.js'
  export default {
    data () {
      return {
        allTitle: {userinfo: '用户信息', child: '孩子信息', class: '班级信息'},
        allTitleErr: {userinfo: '尚无用户信息', child: '用户尚无孩子', class: '用户尚未创建班级'},
        allKey: {
          userinfo: [
            [{eng: 'user_id', chn: '用户ID:'}, {eng: 'uname', chn: '昵称:'}, {eng: 'realname', chn: '真实姓名:'}, {eng: 'mobile', chn: '手机号:'}],
            [{eng: 'gender', chn: '性别:'}, {eng: 'user_role', chn: '身份:'}, {eng: 'p_id', chn: '推广员ID:'}, {eng: 'origin', chn: '来源ID:'}],
            [{eng: 'country', chn: '地区:'}, {eng: 'in_time', chn: 'in_time:'}, {eng: 'last_time', chn: 'last_time:'}, {eng: 'intro', chn: '简介:'}]
          ],
          child: [
            [{eng: 'avatar', chn: '头像:'}, {eng: 'user_id', chn: 'ID:'}, {eng: 'uname', chn: '昵称:'}, {eng: 'realname', chn: '真实姓名:'}],
            [{eng: 'gender', chn: '性别:'}, {eng: 'country', chn: '地区:'}, {eng: 'last_time', chn: 'last_time:'}]
          ],
          class: [
            [{eng: 'logo_url', chn: '班级头像:'}, {eng: 'class_id', chn: '班级ID:'}, {eng: 'def_name', chn: '系统班级名称:'}, {eng: 'class_name', chn: '自定义班级名称:'}, {eng: 'class_mode', chn: '班级性质:'}],
            [{eng: 'cnt_teacher', chn: '教师人数:'}, {eng: 'cnt_stu', chn: '学生人数:'}, {eng: 'cnt_parent', chn: '家长人数:'}, {eng: 'born_year', chn: '届(年):'}, {eng: 'stage', chn: '学制:'}]
          ]
        },
        formatGender,
        formatUserRole

      }
    },
    components: {},
    props: ['which', 'data'],
    watch: {

    },
    computed: {

    },
    methods: {
      getCountry (country, province, city) {
        let area = '*'
        country = country && (province || city) ? country + '-' : country
        province = province && city ? province + '-' : province
        area = country || province || city ? country + province + city : area
        return area
      }

    },
    created () {
      console.log(this.data)
    },
    mounted () {

    }
  }
</script>
<style scoped>

</style>