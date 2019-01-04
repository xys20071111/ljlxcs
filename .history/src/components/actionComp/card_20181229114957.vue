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
              <v-flex v-for="(item, index) in allKey[which]" :key="index"
                @touchstart="startTime = $event.timeStamp" @touchend="endTime = $event.timeStamp" 
                @mousedown="startTime = $event.timeStamp" @mouseup="endTime = $event.timeStamp"
              >
                <v-list-tile v-for="(value, key) in item" :key="key" class="listTile"
                  @click="endTime - startTime < 500 && clickOneCard(props.item, value[0])"
                  @dblclick="endTime - startTime < 500 && clickOneCard('', value[0])"
                >
                  <v-list-tile-content class="grey--text" style="white-space:nowrap;overflow:visible;margin-right:10px">{{value[1]}}</v-list-tile-content>
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

                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'recv_range'">{{ ['班级', '学校'][props.item.recv_range - 1] }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'msgStatus'">{{ props.item.status === 0 ? '正常' : '异常' }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'cnt_class'">{{ props.item.summary&&props.item.summary.cnt_class }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'cnt_read'">{{ props.item.summary&&props.item.summary.cnt_read + '/'+ props.item.summary.cnt_stu }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'cnt_comment'">{{ props.item.summary&&props.item.summary.cnt_comment }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'tag_comment'">{{ ['关闭', '仅作者可见', '全员可见'][props.item.tag_comment] }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'hw_type'">{{ ['普通白板作业', '微课', '多媒体'][props.item.hw_type - 1] }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'submit_type'">{{ ['文字','文档','音频','图片','视频','多媒体'][props.item.submit_type] }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'see_stuanswer' || value[0] === 'see_answer'">{{ props.item[value[0]] ? '已查看' : '未查看' }}</v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'tag_behf'">
                    {{ ['状态禁用', '可以看正确答案;不能看别人作品', '不能看正确答案，可以看其他同学作业、作品', '可以看正确答案，可以看别人的作品'][props.item.tag_behf] }}
                  </v-list-tile-content>
                  
                
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'msgImage' || value[0] === 'msgVideo' || value[0] === 'msgRecord'">
                    {{ props.item.attachment && props.item.attachment.filter(val => {
                      return {'msgImage': ['simg', 'cimg', 'vimg'], 'msgVideo': ['video', 'svideo'], 'msgRecord': ['record']}[value[0]].includes(val.sort)}).length
                    }}
                  </v-list-tile-content>


                  <v-list-tile-content @click="endTime - startTime < 500 && $emit('jumpToUserClass', props.item[value[0]], which, value[0])" class="align-end"
                    v-else-if="value[0] === 'user_id' && (which==='child' || which==='parent' || which==='orderGods') || value[0] === 'author' || value[0] === 'owner'">
                    <span @dblclick="endTime - startTime < 500 && $emit('jumpToUserClass')">{{ props.item[value[0]] }}</span>
                  </v-list-tile-content>
                  <v-list-tile-content @click="endTime - startTime < 500 && $emit('jumpToUserClass', props.item.class_id, which, value[0])" class="align-end"
                    v-else-if="value[0] === 'class_id' && (which==='class' || which === 'stuclass'|| which==='spaceClass')"
                  >
                    <span @dblclick="endTime - startTime < 500 && $emit('jumpToUserClass')">{{ props.item.class_id }}</span>
                  </v-list-tile-content>
                  
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'country'">
                    {{getCountry(props.item.country, props.item.province, props.item.city)}}
                  </v-list-tile-content>
                  <v-list-tile-content class="align-end" v-else-if="value[0] === 'msgCountry'">
                    {{getCountry(props.item.county, props.item.province, props.item.city)}}
                  </v-list-tile-content>

                  <v-list-tile-content class="align-end" style="word-break:break-all" v-else>{{ props.item[value[0]] }}</v-list-tile-content>
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
          spaceClass: '班级空间动态信息',
          msgManage: '通知详情',
          hwManage: '作业详情'
        },
        allTitleErr: {
          userinfo: '尚无用户信息',
          child: '用户尚无孩子',
          class: '用户尚未加入班级',
          parent: '用户尚没有家长',
          stuclass: '用户尚未存在班级内',
          spaceClass: '该班级空间动态尚无信息',
          msgManage: '该通知尚无详情',
          hwManage: '该通知尚无详情'
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
            [['atom', '订单号:'], ['user_id', '用户ID:'], ['amount', '变更金额:'], ['amount_status', '收支情况:'], ['before_amount', '变更前金额:'], ['currecy_id', '货币类型:'],
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
          ],
          msgManage: [
            [['m_id', '通知ID:'], ['owner', '作者ID:'], ['content', '内容:'], ['cnt_class', '发布班级数:'], ['cnt_read', '班级阅读数:'], ['cnt_comment', '评论数:'],
              ['title', '标题:'], ['pub_time', '发布时间:'], ['msgCountry', '发布地区:'], ['recv_range', '通知范围:']
            ],
            [['row_id', '数据ID:'], ['msgImage', '图片个数:'], ['msgVideo', '视频个数:'], ['msgRecord', '录音个数:'], ['faved', '是否收藏:'], ['thumbed', '是否点赞:'],
              ['msgStatus', '状态:'], ['to', '指定群组发作业ID:'], ['tag_comment', '开放状态']
            ]
          ],
          hwManage: [
            [['hw_id', '作业ID:'], ['hw_type', '作业类型:'], ['owner', '作者ID:'], ['content', '内容:'], ['cnt_class', '发布班级数:'],
              ['cnt_read', '班级阅读数:'], ['cnt_comment', '评论数:'], ['title', '标题:'], ['pub_time', '发布时间:'], ['start_time', '作业开始时间:'],
              ['end_time', '作者截止时间:'], ['recv_range', '作业范围:']
            ],
            [['msgCountry', '发布地区:'], ['submit_type', '作业要求的类型:'], ['see_answer', '查看作业:'], ['see_stuanswer', '查看学生作业:'],
              ['course', '相关的科目ID:'], ['msgImage', '图片个数:'], ['msgVideo', '视频个数:'], ['msgRecord', '录音个数:'],
              ['to', '指定群组发作业ID:'], ['tag_comment', '开放状态'], ['tag_behf', '行为标识']
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
        getStrClass,
        startTime: null,
        endTime: null
      }
    },
    props: ['which', 'data'],
    methods: {
      clickOneCard (item, itemValue) {
        if (itemValue === 'user_id' && (this.which === 'child' || this.which === 'parent' || this.which === 'orderGods') || itemValue === 'author' || itemValue === 'owner') {
          item && this.$emit('jumpToUserClass', item[itemValue], this.which, itemValue)
          !item && this.$emit('jumpToUserClass')
        } else if (itemValue === 'class_id' && (this.which === 'class' || this.which === 'stuclass' || this.which === 'spaceClass')) {
          item && this.$emit('jumpToUserClass', item.class_id, this.which, itemValue)
          !item && this.$emit('jumpToUserClass')
        }
      }
    }
  }
</script>
<style>
.listTile>.v-list__tile{
  min-height: 40px;
  height: auto !important;
}

</style>