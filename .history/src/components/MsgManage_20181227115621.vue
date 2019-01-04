<template>
<div>
  <v-layout column wrap>
    <v-flex>
      <v-container fluid grid-list-xl>
      <v-layout row wrap>
        <v-flex><span class="grey--text">条数：</span>{{ totalDesserts }} 条</v-flex>
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
        item-key="m_id"
      >
        <template slot="items" slot-scope="props">
          <tr @click.stop="clickListTableItem(props.item)">
            <td class="text-xs-left" width="100">{{ props.item.m_id }}</td>
            <td class="text-xs-left" width="200">{{ props.item.title }}</td>
            <td class="text-xs-left">{{ props.item.owner }}</td>
            <td class="text-xs-left" style="word-wrap:break-word; max-width:400px">
              {{ props.item.content }}
              <span v-if="props.item.attachment.length>0"><v-icon color="blue lighten-2">attach_file</v-icon>({{props.item.attachment.length}})</span>
            </td>
            <td class="text-xs-right">{{ props.item.summary&&props.item.summary.cnt_class }}</td>
            <td class="text-xs-right">{{ props.item.summary&&props.item.summary.cnt_read }}/{{ props.item.summary&&props.item.summary.cnt_stu }}</td>
            <td class="text-xs-right">{{ props.item.summary&&props.item.summary.cnt_comment }}</td>
            <td class="text-xs-right" width="180">{{ props.item.pub_time }}</td>
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
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>m_id：{{items.m_id}}</v-list-tile-title>
        </v-list-tile-content>
        <v-spacer></v-spacer>
        <v-icon v-if="items.status===0" color="green">gps_fixed</v-icon>
        <v-icon v-else color="red">gps_off</v-icon>
      </v-list-tile>
      <v-divider></v-divider>
      <v-list-tile avatar>
        <v-list-tile-content>
          <v-list-tile-title><h3>{{items.title}}</h3></v-list-tile-title>
          <v-list-tile-sub-title>
            <span>作者：{{items.owner}}</span>
            <v-divider class="mx-3" inset vertical></v-divider>
            <span>发布时间：{{items.pub_time}}</span>
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
        
    </v-list>
    <v-list class="pt-0" dense>
      <v-divider></v-divider>
      <v-container fluid grid-list-md>
          <v-layout column wrap>
            <v-flex d-flex >
              <v-card tile flat>
                <v-list dense>
                  {{items.content}}
                </v-list>
                <v-divider></v-divider>
                
                <v-list dense>
                  <!-- {{items.attachment}} -->
                  <v-layout>
                    <v-flex>
                      <v-container grid-list-sm fluid>
                        <v-layout row wrap>
                          <v-flex
                            v-for="item in items.attachment"
                            :key="item.uid"
                            xs3 sm3 md2 xl2 lg2
                            d-flex
                          >
                            <v-card flat tile class="d-flex">
                              <v-img v-if="item.sort==='simg'||item.sort==='cimg'||item.sort==='vimg'"  @click="clickItemImg(item)"
                                :src="item.url"
                                :lazy-src="item.url"
                                aspect-ratio="1"
                                class="grey lighten-2"
                              >
                                <v-layout
                                  slot="placeholder"
                                  fill-height
                                  align-center
                                  justify-center
                                  ma-0
                                >
                                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                </v-layout>
                              </v-img>

                               <v-img v-if="item.sort==='video'||item.sort==='svideo'" @click="clickItemImg(item)"
                                src="../../static/images/icon-video.png"
                                lazy-src="../../static/images/icon-video.png"
                                aspect-ratio="1"
                                class=" lighten-2"
                              >
                                <v-layout
                                  slot="placeholder"
                                  fill-height
                                  align-center
                                  justify-center
                                  ma-0
                                >
                                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                </v-layout>
                              </v-img>

                              <v-img v-if="item.sort==='record'" @click="clickItemImg(item)"
                                src="../../static/images/icon-record.png"
                                lazy-src="../../static/images/icon-record.png"
                                aspect-ratio="1"
                                class=" lighten-2"
                              >
                                <v-layout
                                  slot="placeholder"
                                  fill-height
                                  align-center
                                  justify-center
                                  ma-0
                                >
                                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                </v-layout>
                              </v-img>
                            </v-card>
                            
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-flex>
                  </v-layout>
                  <!-- {{items.attachment}} -->
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>
      </v-container>
    </v-list>
    </v-navigation-drawer>

    <v-dialog
        v-model="dialog"
        width="500"
        :persistent="itemsImg.sort==='simg'||itemsImg.sort==='cimg'||itemsImg.sort==='vimg'? false : true"
        scrollable
      >
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            预览
          </v-card-title>
  
          <v-card-text>
            <v-img v-if="itemsImg.sort==='simg'||itemsImg.sort==='cimg'||itemsImg.sort==='vimg'" :src="itemsImg.url" :lazy-src="itemsImg.url" class="grey lighten-2" :style="style" @click="clickItemImgRotate" >
              <v-layout
                slot="placeholder"
                fill-height
                align-center
                justify-center
                ma-0
              >
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-layout>
            </v-img>

            <video id="video1" v-if="itemsImg.sort==='video' || itemsImg.sort==='svideo' " :src="itemsImg.url" controls="controls" style="width:100%">
              您的浏览器不支持 video 标签。
            </video>

            <audio id="video1" v-if="itemsImg.sort==='record'" :src="itemsImg.url" controls="controls">
              您的浏览器不支持 audio 标签。
            </audio>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              flat
              @click="clickItemImgClose"
            >
              关闭
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
  </v-layout>
</div>
</template>
<script>
import API from '../api/API.js'
const api = new API()
export default {
  name: 'MsgManage',
  data () {
    return {
      drawer: null,
      totalDesserts: 0,
      desserts: [],
      loading: true,
      pagination: {},
      headers: [
        { text: 'm_id', value: 'm_id', align: 'left', sortable: false },
        { text: '标题', value: 'title', align: 'left' },
        { text: '作者', value: 'owner', align: 'left' },
        { text: '内容', value: 'content', align: 'left' },
        { text: '发布班级数', value: 'summary.cnt_class', align: 'right' },
        { text: '班级阅读数', value: 'summary.cnt_read', align: 'right' },
        { text: '评论数', value: 'summary.cnt_comment', align: 'right' },
        { text: '发布时间', value: 'pub_time', align: 'right' }
      ],
      items: [],
      search: '',
      dropdown: '',
      cIndex: 0,
      logining: false,
      dialog: false,
      itemsImg: '',
      style: '',
      current: 0
    }
  },
  methods: {
    getNewData () {
      this.getDataFromApi()
        .then(data => {
          this.desserts = data.items
          this.totalDesserts = data.total
        })
    },
    clickItemImgRotate () {
      this.current = (this.current + 90) % 360
      this.style = 'transform:rotate(' + this.current + 'deg)'
    },
    clickItemImgClose () {
      this.dialog = !this.dialog
      let myVideo = document.getElementById('video1')
      myVideo && myVideo.pause()
    },
    clickItemImg (props) {
      this.dialog = !this.dialog
      this.style = 'transform:rotate(0deg)'
      this.itemsImg = {
        ...props,
        url: props.url.replace(/compress_/g, '')
      }
    },
    clickListTableItem (props) {
      this.drawer = !this.drawer
      this.items = props
    },
    //   getmsglist&data={num:1,
    getmsglist (page, rowsPerPage) {
      let params = {
        api: this.HOSTCSM,
        param: {
          method: 'getmsglist',
          data: JSON.stringify({'num': page, 'size': rowsPerPage})
        }
      }
      return new Promise((resolve, reject) => {
        api
          .post(params)
          .then(res => {
            this.logining = false
            let msg = res.data
            if (msg.code === 0) {
              let temp = msg.data.list
              console.log(temp)
              let sumcount = msg.data.sumcount
              for (let val of temp) {
                val.attachment = val.attachment ? JSON.parse(val.attachment) : []
              }
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
    getDataFromApi () {
      this.loading = true
      return new Promise((resolve, reject) => {
        // const { sortBy, descending, page, rowsPerPage } = this.pagination
        const { page, rowsPerPage } = this.pagination
        this.getmsglist(page, rowsPerPage)
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
    }
  },
  watch: {
    search () {
      return this.search
    },
    pagination: {
      handler () {
        this.getDataFromApi()
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
