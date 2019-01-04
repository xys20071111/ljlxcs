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
                  <v-list-tile-content class="grey--text">{{value[1]}}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-if="value[0] === 'gender'">{{ formatGender(props.item.gender) }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'user_role'">{{ formatUserRole(props.item.user_role) }}</v-list-tile-content>
                  <v-list-tile-avatar class="align-end" v-else-if="value[0] === 'avatar' || value[0] === 'logo_url'"><img :src="formatAvatar(props.item.avatar || props.item.logo_url)"></v-list-tile-avatar>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'class_name'">{{ getStrClass(props.item.class_name)[0]}}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'class_mode'">{{ formatClassMode(props.item.class_mode) }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[1] === '允许老师加入:'">{{ props.item.tag_open & 1 ? '允许' : '不允许' }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[1] === '允许学生加入:'">{{ props.item.tag_open & 2 ? '允许' : '不允许' }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'stage'">{{ formatStageGrade(props.item.stage, props.item.grade)[0] }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'grade'">{{ formatStageGrade(props.item.stage, props.item.grade)[1] }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'graduated'">{{ props.item.graduated ? '已毕业' : '正常班' }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'cert'">{{ props.item.cert === 200 ? '实名认证' : '未认证' }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'status'">{{ formatStatus(props.item.status, true) }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'clsstatus'">{{ formatStatus(props.item.status) }}</v-list-tile-content>
                  
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'amount_status'">{{ ['收入', '支出'][props.item.amount_status * 1 - 1] }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'currecy_id'">{{ ['积分', '人民币'][props.item.currecy_id * 1 - 1] }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'prof_tag'">{{ props.item.prof_tag ? '已关注' : '未关注' }}</v-list-tile-content>
                  
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'faved'">{{ props.item.faved ? '已收藏' : '未收藏' }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'thumbed'">{{ props.item.thumbed ? '已点赞' : '未点赞' }}</v-list-tile-content>
                  
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'uriImage' || value[0] === 'uriVideo' || value[0] === 'uriRecord'">
                    {{ props.item.uri && props.item.uri.filter(val => {return val[0] === ['', 'uriImage', 'uriVideo', 'uriRecord'].indexOf(value[0])}).length }}
                  </v-list-tile-content>
                  
                  <v-list-tile-content @click="$emit('jumpToChildClass', props.item.user_id, which)" class="align-end" v-else-if="value[0] === 'user_id' && (which==='child' || which==='parent')">
                    <span @dblclick="$emit('jumpToChildClass')">{{ props.item.user_id }}</span>
                  </v-list-tile-content>
                  <v-list-tile-content @click="$emit('jumpToChildClass', props.item.class_id, which)" class="align-end" v-else-if="value[0] === 'class_id' && (which==='class' || which === 'stuclass')">
                    <span @dblclick="$emit('jumpToChildClass')">{{ props.item.class_id }}</span>
                  </v-list-tile-content>
                  
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'country'">
                    {{getCountry(props.item.country, props.item.province, props.item.city)}}
                  </v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else>{{ props.item[value[0]] }}</v-list-tile-content>
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
  import { formatGender, formatUserRole, formatAvatar, formatClassMode, getCountry,
  formatStageGrade, formatStatus, getStrClass } from '@/api/dist.js'
  export default {
    data () {
      return {
        allTitle: {
          userinfo: '用户信息',
          child: '孩子信息',
          class: '班级信息',
          parent: '家长信息',
          stuclass: '所在班级信息',
          onlyClass: '班级信息',
          orderGods: '订单信息',
          spaceClass: '空间动态信息'
        },
        allTitleErr: {
          userinfo: '尚无用户信息',
          child: '用户尚无孩子',
          class: '用户尚未加入班级',
          parent: '用户尚没有家长',
          stuclass: '用户尚未存在班级内',
          spaceClass: '该空间动态尚无信息'
        },

        allKey: {
          userinfo: [
            [['user_id', '用户ID:'], ['uname', '昵称:'], ['realname', '真实姓名:'], ['mobile', '手机号:'], ['status', '状态:']],
            [['gender', '性别:'], ['user_role', '身份:'], ['p_id', '推广员ID:'], ['origin', '来源ID:'], ['prof_tag', '关注公众号:']],
            [['country', '地区:'], ['in_time', '创建时间:'], ['last_time', '最近更改时间:'], ['intro', '个人签名:']]
          ],
          child: [
            [['avatar', '头像:'], ['user_id', 'ID:'], ['uname', '昵称:'], ['realname', '真实姓名:'], ['mobile', '手机号:'], ['status', '状态:']],
            [['p_id', '推广员ID:'], ['gender', '性别:'], ['country', '地区:'], ['intro', '个人签名:'], ['last_time', '最近更改时间:']]
          ],
          class: [
            [['logo_url', '班级头像:'], ['class_id', '班级ID:'], ['def_name', '系统班级名称:'], ['class_name', '自定义班级名称:'], ['stage', '学段:'], ['grade', '年级:']],
            [['class_mode', '班级性质:'], ['cnt_teacher', '教师人数:'], ['cnt_stu', '学生人数:'], ['cnt_parent', '家长人数:'], ['born_year', '届(年):'], ['last_time', '最近更改时间:']]
          ],
          parent: [
            [['avatar', '头像:'], ['user_id', '用户ID:'], ['uname', '昵称:'], ['realname', '真实姓名:'], ['gender', '性别:']],
            [['mobile', '手机号:'], ['country', '地区:'], ['p_id', '推广员ID:'], ['in_time', '创建时间:'], ['last_time', '最近更改时间:']]
          ],
          stuclass: [
            [['logo_url', '班级头像:'], ['class_id', '班级ID:'], ['def_name', '系统班级名称:'], ['class_name', '自定义班级名称:'], ['stage', '学段:'], ['grade', '年级:']],
            [['class_mode', '班级性质:'], ['cnt_teacher', '教师人数:'], ['cnt_stu', '学生人数:'], ['cnt_parent', '家长人数:'], ['born_year', '届(年):'], ['last_time', '最近更改时间:']]
          ],
          onlyClass: [
            [['class_id', '班级ID:'], ['def_name', '系统班级名称:'], ['class_name', '自定义班级名称:'], ['cnt_teacher', '教师人数:'], ['cnt_stu', '学生人数:'],
              ['cnt_parent', '家长人数:'], ['born_year', '届(年):'], ['stage', '学段:'], ['grade', '年级:'], ['cert', '认证状态:']
            ],
            [['class_mode', '班级性质:'], ['clsstatus', '状态:'], ['tag_open', '允许老师加入:'], ['tag_open', '允许学生加入:'], ['graduated', '是否毕业:'],
              ['school_id', '学校ID:'], ['seq_id', '班级号:'], ['last_upt_user', '最近更新人:'], ['in_time', '创建时间:'], ['last_time', '最近更改时间:']
            ]
          ],
          orderGods: [
            [['atom', '订单号:'], ['amount', '变更金额:'], ['amount_status', '收支情况:'], ['before_amount', '变更前金额:'], ['user_id', '用户ID:'], ['currecy_id', '货币类型:'],
              ['current_amount', '余额:'], ['detail_id', 'detail_id:']
            ],
            [['op_user_id', 'op_user_id:'], ['sub_id', 'sub_id:'], ['app_id', 'app_id:'], ['in_time', 'in_time:'],
              ['task_time', '变更时间:'], ['remark', '备注:'], ['ip', 'ip:']
            ]
          ],
          spaceClass: [
            [['obj_id', '动态ID:'], ['author', '发布者ID:'], ['class_id', '班级ID:'], ['cs_id', '分享ID:'], ['school_id', '学校ID:'], ['cnt_comment', '评论数:'],
              ['cnt_good', '点赞数:'], ['cont', '文字内容:']
            ],
            [['uriImage', '图片个数:'], ['uriVideo', '视频个数:'], ['uriRecord', '录音个数:'], ['faved', '是否收藏:'], ['thumbed', '是否点赞:'],
              ['in_time', '发布时间:'], ['ip', 'ip:']
            ]
          ]
        },
        formatGender,
        formatUserRole,
        formatAvatar,
        formatClassMode,
        getCountry,
        formatStageGrade,
        formatStatus,
        getStrClass

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