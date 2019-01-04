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
    :rows-per-page-items="[20,50,80,100]"
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <tr @click.stop="clickListTableItem(props.item)" >
        <td :class="'text-xs-' + (item.textclass || item.align)" v-for="(item, index) in headers" :key="index"
      :style="item.nowrap && {'white-space':'nowrap'}">
          <v-avatar :size="25" v-if="item.value === 'logo_url'">
            <v-img :src="formatAvatar(props.item.logo_url)" />
          </v-avatar>
          <span v-if="item.value === 'logo_url'">{{getStrClass(props.item.class_name)[0]}}</span>
          <span v-if="props.item.def_name && props.item.class_name&&item.value === 'logo_url'" style="color:#ccc">——</span>
          <span v-if="item.value === 'logo_url'"></span>{{props.item.def_name}}
          <span v-if="item.value === 'logo_url'">({{ props.item.class_id }})</span>
          <span v-else-if="item.value === 'stage'">({{ formatStageGrade(props.item.stage, props.item.grade)[2] }})</span>
          <span v-else-if="item.value === 'cert'">({{ props.item.cert === 200 ? '实名认证' : '未认证' }})</span>
          <span v-else-if="item.value === 'status'" :class="['subheading',props.item.status===200?'green--text':'red--text']" style="white-space:nowrap">
            <v-icon v-if="props.item.status===200" color="green" size="18">gps_fixed</v-icon>
            <v-icon v-else color="red" size="18">gps_off</v-icon>
            {{ formatClsStatus(props.item.status) }}
          </span>
          <span v-else-if="item.value === 'last_time'">
            创建时间:{{ props.item.in_time }}<br>
            最近更改时间:{{ props.item.last_time }}
          </span>
        </td>
      </tr>
    </template>
    <template slot="pageText" slot-scope="props">
      第 {{ props.pageStart }} - {{ props.pageStop }} 条，总共 {{ props.itemsLength }} 条
    </template>
  </v-data-table>
</template>

<script>
import { getCountry, getStrTime, getStrFixed, getStrClass, formatStageGrade, formatClsStatus } from '../../api/dist.js'
export default {
  components: {},
  props: ['which', 'desserts', 'loading', 'totalDesserts', 'news'],
  watch: {
    desserts () {
      if (!this.news || this.news === 'news') {
        this.pageItems = this.getPageItems()
        this.pagination.page = 1
        this.pagination.rowsPerPage = this.pageItems[0]
        this.news === 'news' && this.$emit('update:setNew', 'new')
      }
    },
    pagination (newData) {
      console.log(this.desserts)
      this.desserts.length !== 1 && this.$emit('getclasslist')
    }
  },
  data () {
    return {
      headersBox: {
        classManage0: [['logo_url', '基础信息', 'left', false, true], ['cnt_teacher', '老师数', 'left', true], ['cnt_parent', '家长数', 'left', true],
          ['cnt_stu', '学生数', 'center', true], ['born_year', '届(年)', 'left', false, true], ['stage', '学段-年级', 'left', true],
          ['cert', '认证状态', 'center', true], ['status', '状态', 'left', false, true], ['last_time', '时间', 'left', true]
        ]
      },
      getCountry,
      getStrTime,
      getStrFixed,
      getStrClass,
      formatStageGrade,
      formatClsStatus,
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
      pageBox.push(this.desserts.length > 9 ? 10 : this.desserts.length)
      this.desserts.length > 19 && pageBox.push(20)
      this.desserts.length > 29 && pageBox.push(30)
      this.desserts.length > 49 && pageBox.push(50)
      this.desserts.length < 50 && pageBox.push({'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1})
      return pageBox
    },
    clickDetail (items) {
      console.log(items)
      this.$emit('update:setItem', items)
      this.$emit('update:setDrawer', true)
    }
  }
}
</script>
<style scoped>
</style>