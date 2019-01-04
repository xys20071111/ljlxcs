<template>
  <v-data-table
    disable-initial-sort
    :headers="headers"
    :items="desserts"
    :pagination.sync="pagination"
    :total-items="totalDesserts"
    :loading="loading"
    no-data-text="很抱歉，目前没有数据 :("
    rows-per-page-text="条/页"
    :rows-per-page-items="pageItems"
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <tr @click.stop="$emit('clickList', props.item)" >
        <td :class="'text-xs-' + (item.textclass || item.align)" v-for="(item, index) in headers" :key="index"
      :style="item.nowrap && {'white-space':'nowrap'}">
          <v-avatar :size="25" v-if="item.value === 'logo_url' || item.value === 'avatar'">
            <v-img :src="formatAvatar(props.item[item.value])" />
          </v-avatar>
          <span v-if="item.value === 'logo_url'">{{getStrClass(props.item.class_name)[0]}}</span>
          <span v-if="props.item.def_name && props.item.class_name&&item.value === 'logo_url'" style="color:#ccc">——</span>
          <span v-if="item.value === 'logo_url'">{{props.item.def_name}}</span>
          <span v-if="item.value === 'logo_url'">({{ props.item.class_id }})</span>

          <span v-if="item.value === 'avatar'">{{props.item.uname}} ({{ props.item.user_id }})</span> 
          <v-avatar tile :size="14" v-if="props.item.gender && item.value === 'avatar'">
            <v-img :src="['', gender1, gender2][props.item.gender]" /> 
          </v-avatar>
          <span v-if="item.value === 'user_role'"> {{ formatUserRole(props.item.user_role) }} </span>
          <span  v-if="item.value === 'country'">{{ getCountry(props.item.country, props.item.province, props.item.city)}}</span>



          <span v-else-if="item.value === 'stage'">{{ formatStageGrade(props.item.stage, props.item.grade)[2] }}</span>
          <span v-else-if="item.value === 'cert'">{{ props.item.cert === 200 ? '实名认证' : '未认证' }}</span>
          <span v-else-if="item.value === 'status'" :class="['subheading',props.item.status===200?'green--text':'red--text']" style="white-space:nowrap">
            <v-icon v-if="props.item.status===200" color="green" size="18">gps_fixed</v-icon>
            <v-icon v-else color="red" size="18">gps_off</v-icon>
            {{ formatClsStatus(props.item.status) }}
          </span>
          <span v-else-if="item.value === 'last_time'">
            创建时间:{{ props.item.in_time }}<br>
            最近更改时间:{{ props.item.last_time }}
          </span>
          <!-- <span v-else>{{ props.item[item.value] }}</span> -->
        </td>
      </tr>
    </template>
    <template slot="pageText" slot-scope="props">
      第 {{ props.pageStart }} - {{ props.pageStop }} 条，总共 {{ props.itemsLength }} 条
    </template>
  </v-data-table>
</template>

<script>
import { getCountry, getStrTime, getStrFixed, formatUserRole, getStrClass, formatStageGrade, formatClsStatus, formatAvatar } from '../../api/dist.js'
export default {
  components: {},
  props: ['which', 'desserts', 'loading', 'totalDesserts', 'news'],
  watch: {
    desserts () {
      if (this.news === 'news') {
        this.pageItems = this.getPageItems()
        this.pagination.rowsPerPage = this.pageItems[0]
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
          ['cnt_stu', '学生数', 'center', true], ['born_year', '届(年)', 'left', false, true], ['stage', '学段-年级', 'left', true],
          ['cert', '认证状态', 'center', true], ['status', '状态', 'left', false, true], ['last_time', '时间', 'left', true]
        ],
        userManage0: [['avatar', '基础信息', 'left', false, true], ['p_id', '推广员ID', 'left', true], ['origin', '来源ID', 'left', true],
          ['mobile', '手机号', 'center', true], ['user_role', '身份', 'left', false, true], ['status', '状态', 'left', true],
          ['country', '地区', 'center', true], ['last_time', '时间', 'left', true]
        ]
      },
      getCountry,
      getStrTime,
      getStrFixed,
      getStrClass,
      formatStageGrade,
      formatClsStatus,
      formatUserRole,
      formatAvatar,
      gender1: require('@/assets/gender1.png'),
      gender2: require('@/assets/gender2.png'),
      pagination: {},
      pageItems: [10]
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
      return pageBox
    }
  }
}
</script>
<style scoped>
</style>