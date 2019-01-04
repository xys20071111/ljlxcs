<template>
<div>
  <v-layout column wrap>
    <v-flex>
      <v-toolbar color="grey darken-1" dark>
        <v-menu :nudge-width="100">
          <v-toolbar-title slot="activator">
            <span>{{dropdown}}</span>
            <v-icon dark>arrow_drop_down</v-icon>
          </v-toolbar-title>

          <v-list>
            <v-list-tile
              v-for="(item, index) in dropdown_font"
              :key="item"
              @click="clickListDropdownFont(item, index)"
            >
            <v-list-tile-title v-text="item"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>

        <v-divider
          class="mx-3"
          inset
          vertical
        ></v-divider>

        <v-text-field
          v-model="search"
          append-icon="search"
          :label="'请输入' + dropdown"
          :loading="logining"
          single-line
          hide-details
          clearable
          @click:append="sendSearchUser"
          @keyup.enter="sendSearchUser"
        >
        </v-text-field>
      </v-toolbar>
    </v-flex>
    <v-flex>
      <v-container fluid grid-list-xl>
      <v-layout row wrap>
        <v-btn :color="role === 0 ? 'success' : 'primary'" depressed @click="clickUserListRole(0)">ALL</v-btn>
        <v-btn :color="role === 3 ? 'success' : 'primary'" depressed @click="clickUserListRole(3)">老师</v-btn>
        <v-btn :color="role === 2 ? 'success' : 'primary'" depressed @click="clickUserListRole(2)">家长</v-btn>
        <v-btn :color="role === 1 ? 'success' : 'primary'" depressed @click="clickUserListRole(1)">学生</v-btn>
        <v-divider
          class="mx-3"
          inset
          vertical
        ></v-divider>
        <v-flex><span class="grey--text">人数：</span>{{ totalDesserts }} 人</v-flex>
      </v-layout>
      </v-container>
    </v-flex>
    <v-flex>
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
          <tr @click.stop="clickListTableItem(props.item)">
          <td style="white-space:nowrap">
            <v-avatar :size="25">
              <v-img :src="props.item.avatar" />
            </v-avatar>
            (user_id: {{ props.item.user_id }}) 
          </td>
          <td class="text-xs-right">{{ props.item.uname }}</td>
          <td class="text-xs-right">{{ props.item.p_id }}</td>
          <td class="text-xs-right">{{ props.item.origin }}</td>
          <td class="text-xs-right">{{ props.item.mobile }}</td>
          <td class="text-xs-right">{{ formatUserRole(props.item.user_role) }}</td>
          <td class="text-xs-right" :class="['subheading',props.item.status===200?'green--text':'red--text']" style="white-space:nowrap">
            <v-icon v-if="props.item.status===200" color="green" size="18">gps_fixed</v-icon>
            <v-icon v-else color="red" size="18">gps_off</v-icon>
            {{ formatStatus(props.item.status) }}
          </td>
          <td class="text-xs-right hidden-sm-and-down">
            in_time:{{ props.item.in_time }}<br>
            last_time:{{ props.item.last_time }}
          </td>
          </tr>
        </template>
        <template slot="pageText" slot-scope="props">
          第 {{ props.pageStart }} - {{ props.pageStop }} 条，总共 {{ props.itemsLength }} 条
        </template>
        
      </v-data-table>
      
    </v-flex>

    <v-navigation-drawer
      v-model="drawer"
      temporary
      right
      floating
      clipped
      app
      fixed
      light
      :width="1000"
    >
      <v-list class="pa-0">
        <v-list-tile>
          <v-icon @click.stop="drawer=!drawer">close</v-icon>
        </v-list-tile>
      </v-list>
      <v-list class="pa-1">
        <v-divider></v-divider>
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img :src="items.avatar">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{items.uname}}--({{ formatUserRole(items.user_role) }})</v-list-tile-title>
          </v-list-tile-content>
          <v-spacer></v-spacer>
          <v-icon v-if="items.status===200" color="green">gps_fixed</v-icon>
          <v-icon v-else color="red">gps_off</v-icon>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex sm12 d-flex >
              <v-card tile>
                <v-toolbar flat color="white">
                  <v-toolbar-title>用户信息</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-list dense>
                  <v-layout row wrap>
                    <v-flex >
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">用户ID：</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ items.user_id }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">昵称：</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{items.uname}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">真实姓名：</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{items.realname}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">手机号：</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{items.mobile}}</v-list-tile-content>
                      </v-list-tile>
                    </v-flex>
                    <v-flex >
                       <v-list-tile>
                        <v-list-tile-content class="grey--text">性别：</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ formatGender(items.gender) }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">身份：</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ formatUserRole(items.user_role) }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">推广员ID：</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{items.p_id}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">来源ID：</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{items.origin}}</v-list-tile-content>
                      </v-list-tile>
                    </v-flex>
                    <v-flex>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">国家：</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{items.country}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">城市：</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{items.province}}-{{items.city}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">in_time：</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{items.in_time}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">last_time：</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{items.last_time}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">简介：</v-list-tile-content>
                      </v-list-tile>
                      <v-flex xs11 offset-xs1>
                        {{items.intro}}
                      </v-flex>
                    </v-flex>
                  </v-layout>
                </v-list>
              </v-card>
            </v-flex>
            <v-flex sm12 d-flex >
              <v-card tile flat>
                <v-list dense>
                  <Dialog color="info" butCont="编辑用户信息" :setMan="setMan" which="setMan" @setMan="setEleFun"></Dialog>
                  <Dialog color="info" butCont="冻结用户" alert="true" :unbindWho="setMan" which="freezeMan" @freezeMan="setEleFun"></Dialog>
                  <v-btn color="error">删除用户</v-btn>
                  <Dialog v-if="(!items.ex || !items.ex.childlist || items.ex.childlist.length < 3) && items.user_role > 1" color="info"
                    :setMan="setMan" butCont="添加孩子" which="addChild" @addChild="setEleFun">
                  </Dialog>
                  <Dialog color="info" v-if="items.user_role !== 2" butCont="添加班级" which="addClass" @addClass="setEleFun"></Dialog>
                </v-list>
              </v-card>
            </v-flex>
            
            <v-flex sm12 v-if="items.ex && items.ex.childlist">
              <v-card tile>
                <v-toolbar flat color="white">
                  <v-toolbar-title>孩子信息</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>

                <v-data-iterator
                :items="items.ex.childlist"
                hide-actions
                loading
                no-data-text="用户尚无孩子"
                >
                <template slot="item" slot-scope="props">
                <v-list dense>
                  <v-layout row wrap>
                    <v-flex sm12 xs12 md6>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">头像:</v-list-tile-content>
                        <v-list-tile-avatar class="align-end"><img :src="props.item.avatar"></v-list-tile-avatar>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">用户ID:</v-list-tile-content>
                        <v-list-tile-content @click="alert(123)" @dblclick="''" class="align-end">{{ props.item.user_id }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">昵称:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ props.item.uname }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">真实姓名:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ props.item.realname }}</v-list-tile-content>
                      </v-list-tile>
                    </v-flex>
                    <v-flex sm12 xs12 md6>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">性别:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ formatGender(props.item.gender) }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">国家:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ props.item.country }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">城市:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{props.item.province}}-{{props.item.city}}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="grey--text">last_time:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ props.item.last_time }}</v-list-tile-content>
                      </v-list-tile>
                    </v-flex>
                    <v-flex md12>
                      <v-list-tile>
                        <Dialog color="info" butCont="解绑孩子" alert="true" :unbindWho="props.item" which="unbindchild" @unbindchild="setEleFun"></Dialog>
                      </v-list-tile>
                    </v-flex>
                  </v-layout>
                </v-list>
                <v-divider></v-divider>
                </template>
                </v-data-iterator>
              </v-card>
            </v-flex>
            
            <v-flex sm12 v-if="items.ex && items.ex.teahcer">
              <v-card tile>
                <v-toolbar flat color="white">
                  <v-toolbar-title>班级信息</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-data-iterator
                :items="items.ex.teahcer.ClsList"
                hide-actions
                loading
                no-data-text="用户尚未创建班级"
                >
                  <template slot="item" slot-scope="props">
                    <v-list dense>
                      <v-layout row wrap>
                        <v-flex sm12 xs12 md6>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">头像:</v-list-tile-content>
                            <v-list-tile-avatar class="align-end"><img :src="props.item.logo_url"></v-list-tile-avatar>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">班级ID:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.class_id }}</v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">系统班级名称:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.def_name }}</v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">自定义班级名称:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.class_name && (props.item.class_name.slice(-1) === '班' ? props.item.class_name : props.item.class_name + '班')}}</v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">班级性质:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ formatClassMode(props.item.class_mode) }}</v-list-tile-content>
                          </v-list-tile>
                        </v-flex>
                        <v-flex sm12 xs12 md6>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">教师人数:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.cnt_teacher }}</v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">学生人数:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.cnt_stu }}</v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">家长人数:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.cnt_parent }}</v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">届(年):</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.born_year }}</v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">学制:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.stage }}-{{ props.item.grade }}-{{ props.item.seq_id }}</v-list-tile-content>
                          </v-list-tile>
                        </v-flex>
                        <v-flex md6>
                          <v-list-tile>
                            <!-- <v-btn color="info" @click.stop="clickUnbindClass(props.item.class_id)">退出班级</v-btn> -->
                            <Dialog color="info" butCont="退出班级" alert="true" :unbindWho="props.item" which="unbindClass" @unbindClass="setEleFun"></Dialog>
                          </v-list-tile>
                        </v-flex>
                      </v-layout>
                    </v-list>
                    <v-divider></v-divider>
                  </template>
                </v-data-iterator>
              </v-card>
            </v-flex>

            <v-flex v-if="items.ex && items.ex.stu">
              <v-card tile>
                <v-toolbar flat color="white">
                  <v-toolbar-title>家长信息</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-data-iterator
                :items="items.ex.stu.Parents"
                hide-actions
                loading
                no-data-text="用户尚没有家长"
                >
                  <template slot="item" slot-scope="props">
                    <v-list dense>
                      <v-layout row wrap>
                        <v-flex sm12 xs12 md6>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">头像:</v-list-tile-content>
                            <v-list-tile-avatar class="align-end"><img :src="formatAvatar(props.item.avatar)"></v-list-tile-avatar>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">用户ID:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.user_id }}</v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">昵称:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.uname }}</v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">真实姓名:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.realname }}</v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">手机号:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.mobile }}</v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">性别:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ formatGender(props.item.gender) }}</v-list-tile-content>
                          </v-list-tile>
                        </v-flex>
                        <v-flex sm12 xs12 md6>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">国家:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.country }}</v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">城市:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{props.item.province}}-{{props.item.city}}</v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">推广ID:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.p_id }}</v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">in_time:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.in_time }}</v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-content class="grey--text">last_time:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{ props.item.last_time }}</v-list-tile-content>
                          </v-list-tile>
                        </v-flex>
                      </v-layout>
                    </v-list>
                  </template>
                </v-data-iterator>

                <v-divider></v-divider>
                <v-toolbar flat color="white">
                  <v-toolbar-title>所在班级信息</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-data-iterator
                :items="items.ex.stu.ClsList"
                hide-actions
                loading
                no-data-text="用户尚未存在班级内"
                >
                  <template slot="item" slot-scope="props">
                    <v-list dense>
                      <v-layout row wrap>
                      <v-flex sm12 xs12 md6>
                        <v-list-tile>
                          <v-list-tile-content class="grey--text">头像:</v-list-tile-content>
                          <v-list-tile-avatar class="align-end"><img :src="formatAvatar(props.item.logo_url)"></v-list-tile-avatar>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content class="grey--text">班级ID:</v-list-tile-content>
                          <v-list-tile-content class="align-end">{{ props.item.class_id }}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content class="grey--text">系统班级名称:</v-list-tile-content>
                          <v-list-tile-content class="align-end">{{ props.item.def_name }}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content class="grey--text">自定义班级名称:</v-list-tile-content>
                          <v-list-tile-content class="align-end">{{ props.item.class_name }}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content class="grey--text">班级性质:</v-list-tile-content>
                          <v-list-tile-content class="align-end">{{ formatClassMode(props.item.class_mode) }}</v-list-tile-content>
                        </v-list-tile>
                      </v-flex>
                      <v-flex sm12 xs12 md6>
                        <v-list-tile>
                          <v-list-tile-content class="grey--text">教师人数:</v-list-tile-content>
                          <v-list-tile-content class="align-end">{{ props.item.cnt_teacher }}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content class="grey--text">学生人数:</v-list-tile-content>
                          <v-list-tile-content class="align-end">{{ props.item.cnt_stu }}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content class="grey--text">家长人数:</v-list-tile-content>
                          <v-list-tile-content class="align-end">{{ props.item.cnt_parent }}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content class="grey--text">届(年):</v-list-tile-content>
                          <v-list-tile-content class="align-end">{{ props.item.born_year }}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content class="grey--text">学制:</v-list-tile-content>
                          <v-list-tile-content class="align-end">{{ props.item.stage }}-{{ props.item.grade }}-{{ props.item.seq_id }}</v-list-tile-content>
                        </v-list-tile>
                      </v-flex>
                      </v-layout>
                    </v-list>
                  </template>
                </v-data-iterator>
              </v-card>
            </v-flex>

          </v-layout>
        </v-container>
      </v-list>
    </v-navigation-drawer>
  </v-layout>


</div>
</template>
<script>
import API from '../api/API.js'
import Dialog from './actionComp/dialog'
import { formatGender, formatUserRole, formatStatus, formatAvatar, formatClassMode } from '../api/dist.js'
const api = new API()
export default {
  name: 'UserManage',
  components: {Dialog},
  data () {
    return {
      formatGender,
      formatUserRole,
      formatStatus,
      formatAvatar,
      formatClassMode,
      drawer: null,
      totalDesserts: 0,
      desserts: [],
      loading: true,
      pagination: {},
      headers: [
        { text: '头像', value: 'avatar', align: 'left', sortable: false },
        { text: '昵称', value: 'uname', align: 'right' },
        { text: '推广ID', value: 'p_id', align: 'right' },
        { text: '来源ID', value: 'origin', align: 'right' },
        { text: '手机号', value: 'mobile', align: 'right' },
        { text: '身份', value: 'user_role', align: 'right' },
        { text: '状态', value: 'status', align: 'right' },
        { text: '时间', value: 'last_time', align: 'right', class: 'hidden-sm-and-down' }
      ],
      items: [],
      dropdown_font: ['手机号', '用户ID', '推广员ID'],
      search: '',
      dropdown: '',
      cIndex: 0,
      logining: false,
      role: 0,
      unbindclilditem: {},
      setMan: []
    }
  },
  created () {
    this.dropdown = this.dropdown_font[0]
  },
  methods: {
    getuserlist (role, page, rowsPerPage) {
      let params = {
        api: this.HOSTCSM,
        param: {
          method: 'getuserlist',
          data: JSON.stringify({'role': role, 'num': page, 'size': rowsPerPage})
        }
      }
      return new Promise((resolve, reject) => {
        api
          .post(params)
          .then(res => {
            this.logining = false
            let msg = res.data
            if (msg.code === 0) {
              for (let val of msg.data.list) {
                val.avatar = formatAvatar(val.avatar)
              }
              let temp = msg.data.list
              let sumcount = msg.data.sumcount
              resolve({temp, sumcount})
            } else {
              this.$emit('update:setVsnackbar', [true, msg.msg, 'error'])
            }
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    clickListTableItem (props) {
      this.drawer = !this.drawer
      this.items = props
      this.getuser({'uid': props.user_id}, 1)
    },
    getNewData () {
      this.clickUserListRole(this.role)
    },
    clickUserListRole (props) {
      if (this.role !== props) {
        this.pagination.page = 1
      }
      this.role = props
      this.getDataFromApi(props)
        .then(data => {
          this.desserts = data.items
          this.totalDesserts = data.total
        })
    },
    getDataFromApi (role) {
      this.loading = true
      // let that=this
      return new Promise((resolve, reject) => {
        // const { sortBy, descending, page, rowsPerPage } = this.pagination
        const { page, rowsPerPage } = this.pagination
        this.getuserlist(role, page, rowsPerPage)
          .then(res => {
            let items = res.temp
            const total = res.sumcount
            setTimeout(() => {
              this.loading = false
              resolve({
                items,
                total
              })
            }, 500)
          })
      })
    },
    // 测试接口
    getuser (paramdata, dev) {
      console.log(paramdata, dev)
      this.logining = true
      console.log(123456)
      let params = {
        api: this.HOSTCSM,
        param: {
          method: 'getuser',
          data: JSON.stringify(paramdata)
        }
      }
      api
        .post(params)
        .then(res => {
          console.log(res)
          this.logining = false
          let msg = res.data
          if (msg.code === 0) {
            this.setMan = [msg.data.uname, msg.data.gender, msg.data.user_role, msg.data.user_id]
            msg.data.avatar = formatAvatar(msg.data.avatar)
            switch (dev) {
              case 0:
                this.desserts = [msg.data]
                this.totalDesserts = this.desserts.length
                break
              case 1:
                if (msg.ex && msg.ex.teahcer) {
                  for (let val of msg.ex.teahcer.ClsList) {
                    val.logo_url = formatAvatar(val.logo_url)
                  }
                }
                if (msg.ex && msg.ex.childlist) {
                  for (let val of msg.ex.childlist) {
                    val.avatar = formatAvatar(val.avatar)
                  }
                }
                this.items.ex = msg.ex
                break
            }
          } else {
            this.$emit('update:setVsnackbar', [true, msg.msg, 'error'])
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    clickListDropdownFont (item, index) {
      this.dropdown = item
      this.cIndex = index
      this.search = null
    },
    sendSearchUser () {
      let index = this.cIndex
      let paramsdata, temp
      switch (index) {
        case 0:
          temp = this.search
          if (!temp) {
            this.$emit('update:setVsnackbar', [true, '输入框内容为不能为空！', 'error'])
          } else {
            paramsdata = this.dataGetuser(this.search, null, null)
          }
          break
        case 1:
          temp = Number(this.search)
          if (isNaN(temp)) {
            this.$emit('update:setVsnackbar', [true, '输入错误', 'error'])
          } else {
            paramsdata = this.dataGetuser(null, this.search, null)
          }
          break
        case 2:
          temp = Number(this.search)
          if (isNaN(temp)) {
            this.$emit('update:setVsnackbar', [true, '输入错误', 'error'])
          } else {
            paramsdata = this.dataGetuser(null, null, this.search)
          }
          break
      }
      if (paramsdata && this.search) this.getuser(paramsdata, 0)
      // this.snackbar = '输入框内容为能为空！'
    },
    dataGetuser (phone, userid, pushid) {
      if (phone) {
        return {
          mobile: phone
        }
      }
      if (userid) {
        return {
          uid: parseInt(userid)
        }
      }
      if (pushid) {
        return {
          pid: parseInt(pushid)
        }
      }
    },
    // 退出班级 加入班级 设置用户信息 冻结用户 添加孩子 解绑孩子
    setEleFun (props, whichEle) {
      let whichMethod = {addClass: 'joinclass', unbindClass: 'quitclass', setMan: 'updateuser', freezeMan: 'frozenuser', addChild: 'bindchild', unbindchild: 'unbindchild'}
      let whichData = {}
      whichEle === 'addClass' && (whichData = {'uid': this.items.user_id, 'classid': props})
      whichEle === 'unbindClass' && (whichData = {'uid': this.items.user_id, 'classid': props.class_id})
      whichEle === 'setMan' && (whichData = {'uid': props[3], 'nickname': props[0], 'sex': props[1], 'role': props[2]})
      whichEle === 'freezeMan' && (whichData = {'uid': props[3]})
      whichEle === 'addChild' && (whichData = {'uid': this.items.user_id, 'childid': props[0] * 1, 'ParentType': props[1] * 1})
      whichEle === 'unbindchild' && (whichData = {'uid': this.items.user_id, 'childid': props.user_id})
      if (whichEle === 'addClass' && (!props || isNaN(props * 1))) {
        this.$emit('update:setVsnackbar', [true, '请输入正确的孩子ID', 'error'])
        return false
      }
      if (whichEle === 'setMan' && !props[0]) {
        this.$emit('update:setVsnackbar', [true, '请输入昵称', 'error'])
        return false
      }
      if (whichEle === 'addChild' && (!props[0] || isNaN(props[0] * 1) || props[0] * 1 === this.setMan[3])) {
        this.$emit('update:setVsnackbar', [true, '请输入正确的孩子ID', 'error'])
        return false
      }

      let params = {
        api: this.HOSTCSM,
        param: {
          method: whichMethod[whichEle],
          data: JSON.stringify(whichData)
        }
      }
      api
        .post(params)
        .then(res => {
          let msg = res.data
          if (msg.code === 0) {
            this.$emit('update:setVsnackbar', [true, msg.msg, 'success'])
            whichEle !== 'setMan' && this.getuser({'uid': this.items.user_id}, 1)
            if (whichEle === 'setMan') {
              this.setMan = props
              this.items = Object.assign({}, this.items, {'uname': props[0], 'gender': props[1], 'user_role': props[2]})
              this.desserts.forEach(element => {
                element.user_id === this.items.user_id && (Object.assign(element, this.items))
              })
            }
          } else {
            this.$emit('update:setVsnackbar', [true, msg.msg, 'error'])
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  watch: {
    search () {
      return this.search
    },
    pagination: {
      handler () {
        this.getDataFromApi(this.role)
          .then(data => {
            this.desserts = data.items
            this.totalDesserts = data.total
          })
      },
      deep: false
    }
  },
  mounted () {
  },
  activated () {
    this.$route.params.news && this.getNewData()
    this.$route.params.news = ''
  }
}
</script>
