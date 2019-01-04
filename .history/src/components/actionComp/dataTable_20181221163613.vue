<template>
  <v-data-table
    disable-initial-sort
    :headers="headers"
    :items="desserts"
    :pagination.sync="pagination"
    :loading="loading"
    no-data-text="很抱歉，目前没有数据 :("
    rows-per-page-text="条/页"
    :rows-per-page-items="pageItems"
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <tr @click="['allIntegral1', 'reconIntergral2'].indexOf(which) !== -1 ? clickDetail(props.item):''">
        <td :class="'text-xs-' + (item.textclass || item.align)" v-for="(item, index) in headers" :key="index"
        :style="item.nowrap && {'white-space':'nowrap'}">
          <span v-if="item.value === 'city'">{{ getCountry(props.item.country, props.item.province, props.item.city) }}</span>
          <span v-else-if="item.value === 'pubtime'">{{ getStrTime(props.item.pubtime) }}</span>
          <span v-else-if="item.value === 'class_name'">{{ getStrClass(props.item.class_name)[0] }}</span>
          <span v-else-if="item.value === 'amount_status'">{{['收入', '支出'][props.item.amount_status * 1 - 1]}}</span>
          <span v-else-if="item.value === 'currecy_id'">{{['积分', '人民币'][props.item.currecy_id * 1 - 1]}}</span>
          <span v-else-if="fixedBox.indexOf(item.value) !== -1">
            {{getStrFixed(props.item[item.value])}}
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
import { getCountry, getStrTime, getStrFixed, getStrClass } from '../../api/dist.js'
export default {
  components: {},
  props: ['which', 'desserts', 'loading', 'news'],
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
      if (this.news) {
        this.news === 'new' && this.$emit('getNew', newData)
      }
    }
  },
  data () {
    return {
      headersBox: {
        commonStat0: [['pubtime', '时间', 'left', true, true], ['all', '全部', 'left', true], ['parent', '家长', 'left', true], ['teacher', '老师', 'center', true]],
        commonStat1: [['pubtime', '时间', 'left', true, true], ['all', '全部', 'left', true], ['parent', '家长', 'left', true], ['teacher', '老师', 'center', true]],
        commonStat2: [['pubtime', '时间', 'left', true, true], ['trueLogin', '手机注册量', 'center', true], ['allLogin', '总注册量', 'center', true], ['perc', '手机认证比', 'right', true]],
        homeworkStat0: [['pubtime', '发布时间', 'left', true, true], ['hwcounts', '作业数', 'center', true], ['avgreadrate', '平均阅读率', 'center', true],
          ['maxreadrate', '最高阅读率', 'center', true], ['avgsubmitrate', '平均提交率', 'center', true], ['maxsubmitrate', '最高提交率', 'center', true]
        ],
        homeworkStat1: [['hw_id', '作业ID', 'left', true, true], ['cnt_cls', '班级数量', 'center', true], ['owner', '发布者ID', 'center', true],
          ['read_rate', '阅读率', 'center', true], ['submit_rate', '提交率', 'center', true], ['title', '标题', 'right', false]
        ],
        informStat0: [['pubtime', '发布时间', 'left', true, true], ['msgcounts', '通知数', 'center', true], ['avgreadrate', '平均阅读率', 'center', true], ['maxreadrate', '最高阅读率', 'right', true]],
        informStat1: [['m_id', '通知ID', 'left', true, true], ['cnt_cls', '班级数量', 'center', true], ['cnt_stu', '学生数量', 'center', true], ['owner', '发布者ID', 'center', true],
          ['read_rate', '阅读率', 'center', true], ['title', '标题', 'right', false]
        ],
        spaceStat: [['class_id', '班级ID', 'left', true, true], ['class_name', '班级名称', 'center', false], ['amount', '发布数量', 'center', true], ['city', '发布位置', 'right', false]],
        allIntegral0: [['user_id', '用户ID', 'left', true], ['amount', '余额', 'left', true], ['in_amount', '总收入', 'center', true],
          ['out_amount', '总支出', 'center', true], ['currecy_id', '货币类型', 'right', false]
        ],
        allIntegral1: [['atom', '订单号', 'left', false, true], ['user_id', '用户ID', 'left', false, true], ['before_amount', '变更前余额', 'center', false],
          ['current_amount', '余额', 'center', false], ['currecy_id', '货币类型', 'center', false], ['in_time', '变更时间', 'center', false],
          ['remark', '备注', 'center', false], ['ip', 'ip', 'right', false]
        ],
        reconIntergral0: [['f_humans', '发放人数', 'left', true], ['f_times', '发放人次', 'center', true], ['f_amounts', '发放金额', 'center', true], ['x_humans', '消费人数', 'center', true],
          ['x_times', '消费人次', 'center', true], ['x_amounts', '消费金额', 'center', true], ['y_humans', '人数（余额）', 'center', true], ['y_amounts', '金额（余额）', 'right', true]
        ],
        reconIntergral1: [['pubtime', '日期', 'left', true, true], ['f_humans', '发放人数', 'center', true], ['f_times', '发放人次', 'center', true], ['f_amounts', '发放金额', 'center', true],
          ['x_humans', '消费人数', 'center', true], ['x_times', '消费人次', 'center', true], ['x_amounts', '消费金额', 'right', true]
        ],
        reconIntergral2: [['atom', '订单号', 'left', false, true], ['user_id', '用户ID', 'left', false, true], ['before_amount', '变更前余额', 'center', false],
          ['current_amount', '余额', 'center', false], ['currecy_id', '货币类型', 'center', false], ['in_time', '变更时间', 'center', false],
          ['remark', '备注', 'center', false], ['ip', 'ip', 'right', false]
        ]
      },
      fixedBox: ['read_rate', 'submit_rate', 'avgreadrate', 'avgsubmitrate', 'maxreadrate', 'maxsubmitrate', 'perc'],
      getCountry,
      getStrTime,
      getStrFixed,
      getStrClass,
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
      this.desserts.length > 99 && pageBox.push(100)
      this.desserts.length < 100 && this.desserts.length > 10 && pageBox.push({'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1})
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