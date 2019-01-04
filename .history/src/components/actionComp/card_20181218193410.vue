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
      :no-data-text="allTitleErr[which]"
      >
        <template slot="item" slot-scope="props">
          <v-list dense>
            <v-layout row wrap mb-2>
              <v-flex v-for="(item, index) in allKey[which]" :key="index">
                <v-list-tile v-for="(value, key) in item" :key="key">
                  <v-list-tile-content class="grey--text">{{value.chn}}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-if="value.eng === 'gender'">{{ formatGender(props.item.gender) }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value.eng === 'user_role'">{{ formatUserRole(props.item.user_role) }}</v-list-tile-content>
                  <v-list-tile-avatar class="align-end" v-else-if="value.eng === 'avatar' || value.eng === 'logo_url'"><img :src="formatAvatar(props.item.avatar || props.item.logo_url)"></v-list-tile-avatar>
                  <v-list-tile-content class="align-end" v-else-if="value.eng === 'class_name'">{{ props.item.class_name && (props.item.class_name.slice(-1) === '班' ? props.item.class_name : props.item.class_name + '班')}}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value.eng === 'class_mode'">{{ formatClassMode(props.item.class_mode) }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value.chn === '允许老师加入:'">{{ props.item.tag_open & 1 ? '允许' : '不允许' }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value.chn === '允许学生加入:'">{{ props.item.tag_open & 2 ? '允许' : '不允许' }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value.eng === 'stage'">{{ formatStageGrade(props.item.stage, props.item.grade)[0] }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value.eng === 'grade'">{{ formatStageGrade(props.item.stage, props.item.grade)[1] }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value.eng === 'graduated'">{{ props.item.graduated ? '已毕业' : '正常班' }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value.eng === 'cert'">{{ props.item.cert === 200 ? '实名认证' : '未认证' }}</v-list-tile-content>
                  <v-list-tile-content @click="$emit('jumpToChildClass', props.item.user_id, which)" class="align-end" v-else-if="value.eng === 'user_id' && (which==='child' || which==='parent')">
                    <span @dblclick="$emit('jumpToChildClass')">{{ props.item.user_id }}</span>
                  </v-list-tile-content>
                  <v-list-tile-content @click="$emit('jumpToChildClass', props.item.class_id, which)" class="align-end" v-else-if="value.eng === 'class_id' && (which==='class' || which === 'stuclass')">
                    <span @dblclick="$emit('jumpToChildClass')">{{ props.item.class_id }}</span>
                  </v-list-tile-content>
                  
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
  import { formatGender, formatUserRole, formatAvatar, formatClassMode, getCountry, formatStageGrade } from '@/api/dist.js'
  export default {
    data () {
      return {
        allTitle: {userinfo: '用户信息', child: '孩子信息', class: '班级信息', parent: '家长信息', stuclass: '所在班级信息', onlyClass: '班级信息'},
        allTitleErr: {userinfo: '尚无用户信息', child: '用户尚无孩子', class: '用户尚未创建班级', parent: '用户尚没有家长', stuclass: '用户尚未存在班级内'},
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
          ],
          parent: [
            [{eng: 'avatar', chn: '头像:'}, {eng: 'user_id', chn: '用户ID:'}, {eng: 'uname', chn: '昵称:'}, {eng: 'realname', chn: '真实姓名:'}, {eng: 'gender', chn: '性别:'}],
            [{eng: 'mobile', chn: '手机号:'}, {eng: 'country', chn: '地区:'}, {eng: 'p_id', chn: '推广员ID:'}, {eng: 'in_time', chn: 'in_time:'}, {eng: 'last_time', chn: 'last_time:'}]
          ],
          stuclass: [
            [{eng: 'logo_url', chn: '班级头像:'}, {eng: 'class_id', chn: '班级ID:'}, {eng: 'def_name', chn: '系统班级名称:'}, {eng: 'class_name', chn: '自定义班级名称:'}, {eng: 'class_mode', chn: '班级性质:'}],
            [{eng: 'cnt_teacher', chn: '教师人数:'}, {eng: 'cnt_stu', chn: '学生人数:'}, {eng: 'cnt_parent', chn: '家长人数:'}, {eng: 'born_year', chn: '届(年):'}, {eng: 'stage', chn: '学制:'}]
          ],
          onlyClass: [
            [{eng: 'class_id', chn: '班级ID:'}, {eng: 'cnt_teacher', chn: '教师人数:'}, {eng: 'cnt_stu', chn: '学生人数:'}, {eng: 'cnt_parent', chn: '家长人数:'}, {eng: 'born_year', chn: '届(年):'}, {eng: 'stage', chn: '学段:'}, {eng: 'cert', chn: '认证状态:'}, {eng: 'last_upt_user', chn: '最近更新人:'}],
            [{eng: 'class_mode', chn: '班级性质:'}, {eng: 'tag_open', chn: '允许老师加入:'}, {eng: 'tag_open', chn: '允许学生加入:'}, {eng: 'in_time', chn: 'in_time:'}, {eng: 'last_time', chn: 'last_time:'}, {eng: 'grade', chn: '年级:'}, {eng: 'graduated', chn: '是否毕业:'}]
          ]
        },
        formatGender,
        formatUserRole,
        formatAvatar,
        formatClassMode,
        getCountry,
        formatStageGrade

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
      console.log(this.data)
    },
    mounted () {

    }
  }
</script>
<style scoped>

</style>