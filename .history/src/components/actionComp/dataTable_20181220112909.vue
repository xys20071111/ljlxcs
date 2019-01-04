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
      <td :class="'text-xs-' + (item.textclass || item.align)" v-for="(item, index) in headers" :key="index">
        {{ item.value === 'city' ? getCountry(props.item.country, props.item.province, props.item.city) : props.item[item.value] }}</td>
    </template>
    <template slot="pageText" slot-scope="props">
      第 {{ props.pageStart }} - {{ props.pageStop }} 条，总共 {{ props.itemsLength }} 条
    </template>
  </v-data-table>
</template>

<script>
import { getCountry } from '../../api/dist.js'
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
        commonStat0: [['pubtime', '时间', 'left', true], ['all', '全部', 'left', true], ['parent', '家长', 'left', true], ['teacher', '老师', 'right', true]],
        commonStat1: [['pubtime', '时间', 'left', true], ['all', '全部', 'left', true], ['parent', '家长', 'left', true], ['teacher', '老师', 'right', true]],
        commonStat2: [['pubtime', '时间', 'left', true], ['trueLogin', '手机注册量', 'center', true], ['allLogin', '总注册量', 'center', true], ['perc', '手机认证比', 'right', true]],
        homeworkStat0: [['pubtime', '发布时间', 'left', true], ['hwcounts', '作业数', 'center', true], ['avgreadrate', '平均阅读率', 'center', true],
          ['maxreadrate', '最高阅读率', 'center', true], ['avgsubmitrate', '平均提交率', 'center', true], ['maxsubmitrate', '最高提交率', 'right', true]
        ],
        homeworkStat1: [['hw_id', '作业ID', 'left', true], ['cnt_cls', '班级数量', 'center', true], ['owner', '发布者ID', 'center', true],
          ['read_rate', '阅读率', 'center', true], ['submit_rate', '提交率', 'center', true], ['title', '标题', 'right', true]
        ],
        informStat0: [['pubtime', '发布时间', 'left', true], ['msgcounts', '通知数', 'center', true], ['avgreadrate', '平均阅读率', 'center', true], ['maxreadrate', '最高阅读率', 'right', true]],
        informStat1: [['m_id', '通知ID', 'left', true], ['cnt_cls', '班级数量', 'center', true], ['cnt_stu', '学生数量', 'center', true], ['owner', '发布者ID', 'center', true],
          ['read_rate', '阅读率', 'center', true], ['title', '标题', 'right', true]
        ],
        spaceStat: [['class_id', '班级ID', 'left', true], ['class_name', '班级名称', 'center', false], ['amount', '发布数量', 'center', true], ['city', '发布位置', 'right', true]],
        allIntegral0: [['user_id', '用户ID', 'left', true], ['amount', '余额', 'left', true], ['in_amount', '总收入', 'center', true],
          ['out_amount', '总支出', 'center', true], ['currecy_id', '货币类型', 'right', true]
        ],
        allIntegral1: [['user_id', '用户ID', 'center', true], ['amount', '变更金额', 'center', true], ['amount_status', '收入/支出', 'center', true], ['app_id', 'appID', 'center', true], ['atom', '订单号', 'center', true],
          ['before_amount', '变更前余额', 'center', true], ['current_amount', '余额', 'center', true], ['in_time', '变更时间', 'center', true], ['currecy_id', '货币类型', 'center', true], ['detail_id', 'detailId', 'center', true],
          ['op_user_id', 'opUserId', 'center', true], ['sub_id', 'subId', 'center', true], ['remark', '备注', 'center', true], ['ip', 'IP', 'center', true]
        ],
        reconIntergral0: [['f_humans', '发放人数', 'center', true], ['f_times', '发放人次', 'center', true], ['f_amounts', '发放金额', 'center', true], ['x_humans', '消费人数', 'center', true],
          ['x_times', '消费人次', 'center', true], ['x_amounts', '消费金额', 'center', true], ['y_humans', '人数（余额）', 'center', true], ['y_amounts', '金额（余额）', 'center', true]
        ],
        reconIntergral1: [['pubtime', '日期', 'center', true], ['f_humans', '发放人数', 'center', true], ['f_times', '发放人次', 'center', true], ['f_amounts', '发放金额', 'center', true],
          ['x_humans', '消费人数', 'center', true], ['x_times', '消费人次', 'center', true], ['x_amounts', '消费金额', 'center', true]
        ],
        reconIntergral2: [['user_id', '用户ID', 'center', true], ['amount', '变更金额', 'center', true], ['amount_status', '收入/支出', 'center', true], ['app_id', 'appID', 'center', true], ['atom', '订单号', 'center', true],
          ['before_amount', '变更前余额', 'center', true], ['current_amount', '余额', 'center', true], ['in_time', '变更时间', 'center', true], ['currecy_id', '货币类型', 'center', true], ['detail_id', 'detailId', 'center', true],
          ['op_user_id', 'opUserId', 'center', true], ['sub_id', 'subId', 'center', true], ['remark', '备注', 'center', true], ['ip', 'IP', 'center', true]
        ]

      },
      getCountry,
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
        headersTitleOne.textclass = items[4]
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
    }
  }
}
</script>
<style scoped>
</style>