<template>
  <v-data-table
    disable-initial-sort
    :headers="headers"
    :items="desserts"
    :pagination.sync="pagination"
    :total-items="totalDesserts"
    :loading="loading"
    :hide-actions="which === 'classManage1'"
    no-data-text="很抱歉，目前没有数据 :("
    rows-per-page-text="条/页"
    :rows-per-page-items="pageItems"
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <tr @click.stop="which === 'classManage1' ? $emit('jumpToMan', props.item.user_id) : $emit('clickList', props.item)" >
        <td :class="'text-xs-' + (item.textclass || item.align)" v-for="(item, index) in headers" :key="index"
      :style="item.nowrap && {'white-space':'nowrap'}">
          <span v-if="item.value === 'logo_url'">
            <v-avatar :size="25">
              <v-img :src="formatAvatar(props.item.logo_url)" />
            </v-avatar>
            {{getStrClass(props.item.class_name)[0]}}
            <span v-if="props.item.def_name && props.item.class_name" style="color:#ccc">——</span>
            {{props.item.def_name}}
            ({{ props.item.class_id }})
          </span>

          <span v-else-if="item.value === 'avatar'">
            <v-avatar :size="25">
              <v-img :src="formatAvatar(props.item.avatar)" />
            </v-avatar>
            {{props.item.uname || '未知'}} ({{ props.item.user_id }}) 
            <v-avatar tile :size="14" v-if="props.item.gender">
              <v-img :src="['', gender1, gender2][props.item.gender]" />
            </v-avatar>
          </span>

          <span v-else-if="item.value === 'avatarjump'">
            <v-avatar :size="25">
              <v-img :src="formatAvatar(props.item.avatar)" />
            </v-avatar>
            {{getStrMan(props.item.uname, props.item.nick)}}
            (<span @dblclick="$emit('jumpToMan')">{{ props.item.user_id }}</span>)
            <v-avatar tile :size="14" v-if="props.item.gender">
              <v-img :src="['', gender1, gender2][props.item.gender]" /> 
            </v-avatar>
          </span>
          <span v-else-if="item.value === 'edu_role'">
            {{ formatEduRole(props.item.edu_role, props.item.is_owner, props.item.is_stu) }}
          </span>

          <span v-else-if="item.value === 'status'" :class="['subheading',props.item.status===200?'green--text':'red--text']"
            style="white-space:nowrap">
            <v-icon v-if="props.item.status===200" color="green" size="18">gps_fixed</v-icon>
            <v-icon v-else color="red" size="18">gps_off</v-icon>
            {{ formatStatus(props.item.status, which === 'userManage0') }}
          </span>
          <span v-else-if="item.value === 'last_time'">
            创建时间:{{ props.item.in_time }}<br>
            最近更改时间:{{ props.item.last_time }}
          </span>
          <slot v-else-if="item.value === 'removeMan'" :removeMan="props.item" name="removeMan"></slot>
          <span v-else-if="item.value === 'prof_tag'"> {{ props.item.prof_tag ? '已关注' : '未关注' }} </span>
          <span v-else-if="item.value === 'user_role'"> {{ formatUserRole(props.item.user_role) }} </span>
          <span v-else-if="item.value === 'country'">{{ getCountry(props.item.country, props.item.province, props.item.city)}}</span>
          <span v-else-if="item.value === 'stage'">{{ formatStageGrade(props.item.stage, props.item.grade)[2] }}</span>
          <span v-else-if="item.value === 'cert'">{{ props.item.cert === 200 ? '实名认证' : '未认证' }}</span>
          <span v-else-if="item.value === 'faved'">{{ props.item.faved ? '已收藏' : '未收藏' }}</span>
          <span v-else-if="item.value === 'thumbed'">{{ props.item.faved ? '已点赞' : '未点赞' }}</span>
          <span v-else-if="item.value === 'cont'">
            {{ props.item.cont}}
            <span v-if="props.item.uri.length>0"><v-icon color="blue lighten-2">attach_file</v-icon>({{props.item.uri.length}})</span>
          </span>
          <span v-else>{{ props.item[item.value] }}</span>
        </td>
      </tr>
    </template>
    <template slot="pageText" slot-scope="props">
      第 {{ props.pageStart }} - {{ props.pageStop }} 条，总共 {{ props.itemsLength }} 条
    </template>
  </v-data-table>
</template>

<script>
import { getCountry, formatUserRole, getStrClass, getStrMan, formatStageGrade,
  formatStatus, formatAvatar, formatEduRole } from '../../api/dist.js'
export default {
  components: {},
  props: ['which', 'desserts', 'loading', 'totalDesserts', 'news'],
  watch: {
    desserts () {
      if (this.news === 'news') {
        this.pageItems = this.getPageItems()
        this.pagination.rowsPerPage = this.pageItems[0]
        this.pagination.page = 1
        this.news === 'news' && this.$emit('update:setNew', 'new')
      }
    },
    pagination (newData) {
      this.$emit('update:pagination', this.pagination)
      console.log(newData)
      this.desserts.length !== 1 && this.$emit('getclasslist', true)
    }
  },
  data () {
    return {
      headersBox: {
        classManage0: [['logo_url', '基础信息', 'left', false, true], ['cnt_teacher', '老师数', 'left', true], ['cnt_parent', '家长数', 'left', true],
          ['cnt_stu', '学生数', 'left', true], ['born_year', '届(年)', 'left', true], ['stage', '学段-年级', 'left', false],
          ['cert', '认证状态', 'left', false], ['status', '状态', 'left', false, true], ['last_time', '时间', 'right', false]
        ],
        classManage1: [['avatarjump', '基础信息', 'left', false, true], ['edu_role', '班内身份', 'left', false],
          ['m_id', '成员ID', 'left', true], ['create_user', '创建者ID', 'center', true], ['last_upt_user', '最近修改者ID', 'left', true],
          ['remark', '备注', 'left', false], ['removeMan', '', 'center', false]
        ],
        userManage0: [['avatar', '基础信息', 'left', false, true], ['p_id', '推广员ID', 'left', true], ['origin', '来源ID', 'left', true],
          ['mobile', '手机号', 'left', true], ['user_role', '身份', 'left', false, true], ['status', '状态', 'left', false],
          ['prof_tag', '关注公众号', 'center', false], ['country', '地区', 'left', false], ['last_time', '时间', 'right', false]
        ],
        classSpace0: [['author', '发布者ID', 'left', true, true], ['class_id', '班级ID', 'left', true, true], ['cs_id', '分享ID', 'left', true, true],
          ['obj_id', 'objID', 'left', true, true], ['school_id', '学校ID', 'left', true, true], ['cnt_comment', '评论数', 'left', true], ['cnt_good', '点赞数', 'left', true],
          ['faved', '是否收藏', 'left', false], ['thumbed', '是否点赞', 'left', false], ['cont', '内容', 'center', false], ['in_time', '发布时间', 'left', false],
          ['ip', 'IP', 'right', false]
        ]
      },
      getCountry,
      getStrClass,
      getStrMan,
      formatStageGrade,
      formatUserRole,
      formatAvatar,
      formatEduRole,
      formatStatus,
      gender1: require('@/assets/gender1.png'),
      gender2: require('@/assets/gender2.png'),
      pagination: {},
      pageItems: [3]
    }
  },
  computed: {
    headers () {
      let headersTitle = []
      for (let items of this.headersBox[this.which]) {
        let headersTitleOne = {}
        headersTitleOne.value = items[0]
        headersTitleOne.text = items[1]
        headersTitleOne.align = items[2]
        headersTitleOne.sortable = items[3]
        headersTitleOne.nowrap = items[4]
        headersTitleOne.textclass = items[5]
        headersTitle.push(headersTitleOne)
      }
      return headersTitle
    }

  },
  methods: {
    getPageItems (news) {
      let pageBox = []
      pageBox.push(this.totalDesserts > 19 ? 20 : this.totalDesserts)
      this.totalDesserts > 29 && pageBox.push(30)
      this.totalDesserts > 49 && pageBox.push(50)
      this.totalDesserts > 99 && pageBox.push(100)
      this.totalDesserts < 100 && this.totalDesserts > 20 && pageBox.push({'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1})
      this.which === 'classManage1' && (pageBox.push = [{'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1}])
      return pageBox
    }
  }
}
</script>
<style scoped>
</style>