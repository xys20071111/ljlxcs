<template>
  
    <v-dialog v-model="dialog" :disabled="disabledOrNo" scrollable
      :max-width="(alert && 290) || ({'addChild': 450, 'addParent': 470}[which]) || ((image || media) && 1000]) || 360"
    >
      <slot slot="activator" name="slotButton">
        <v-img v-if="image" :style="{'width':imageArr[0] + 'px','width':imageArr[0] + 'px'}" 
          :src="imageArr[3]" :lazy-src="noImage" aspect-ratio="1" class="lighten-2">
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
        <v-img v-else-if="media"
          :src="imageArr[3]"
          :lazy-src="imageArr[1]"
          aspect-ratio="1"
          class="lighten-2"
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
          <v-flex style="color:green">{{imageArr[0]}}</v-flex>
        </v-img>
        <v-btn v-else :flat="which === 'quitclass'||which === 'addMember'" :disabled="disabledOrNo" :small="which === 'quitclass'" :color="color">{{butCont}}</v-btn>
      </slot>
      <v-card>
        <v-card-title  v-if="!image&&!media">
          <span class="headline">{{alertCont[which] || butCont}}</span>
        </v-card-title>
        <v-card-text  v-if="which === 'setMan'">
          <v-container grid-list-md style="padding:0">
            <v-layout wrap align-center>
              <v-flex style="flex:0 0 auto;font-size:16px" blue--text>用户昵称：</v-flex>
              <v-text-field placeholder="请输入用户昵称" v-model="modelMan[0]" @keyup.enter="setWhich"></v-text-field>
            </v-layout>
            <v-layout nowrap align-center>
              <v-flex style="flex:0 0 auto;font-size:16px" blue--text>用户性别：</v-flex>
              <v-radio-group v-model="modelMan[1]" hide-details row style="flex: 1;margin:0">
                <v-radio
                  v-for="(value, key) in ['男', '女']"
                  :key="value"
                  :label="value"
                  :value="key + 1"
                  color="#2196f3"
                ></v-radio>
              </v-radio-group>
            </v-layout>
            <v-layout nowrap align-center v-if="modelMan[2] !== 1">
              <v-flex style="flex:0 0 auto;font-size:16px" blue--text>用户身份：</v-flex>
              <v-radio-group v-model="modelMan[2]" hide-details row style="flex: 1;margin:0">
                <v-radio
                  v-for="(value, key) in ['家长', '老师']"
                  :key="value"
                  :label="value"
                  :value="key + 2"
                  color="#2196f3"
                ></v-radio>
              </v-radio-group>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-text  v-else-if="which === 'addChild'">
          <v-container grid-list-md style="padding:0">
            <v-layout wrap align-center>
              <v-flex style="flex:0 0 auto;font-size:16px" blue--text>孩子ID：</v-flex>
              <v-text-field placeholder="请输入用户ID" v-model="childCont[0]" @keyup.enter="setWhich"></v-text-field>
            </v-layout>
          </v-container>
          <v-layout nowrap align-center v-if="modelMan[2] !== 1">
            <v-flex style="flex:0 0 auto;font-size:16px" blue--text>亲子关系：</v-flex>
            <v-radio-group v-model="childCont[1]" hide-details row style="flex: 1;margin:0">
              <v-radio
                v-for="(value, key) in cardBox[modelMan[1] - 1]"
                :key="value"
                :label="value"
                :value="key + 1"
                color="#2196f3"
              ></v-radio>
            </v-radio-group>
          </v-layout>
        </v-card-text>

        <v-card-text  v-else-if="which === 'addParent'">
          <v-container grid-list-md style="padding:0">
            <v-layout wrap align-center>
              <v-flex style="flex:0 0 auto;font-size:16px" blue--text>家长ID：</v-flex>
              <v-text-field placeholder="请输入家长ID" v-model="childCont[0]" @keyup.enter="setWhich"></v-text-field>
            </v-layout>
          </v-container>
          <v-layout nowrap align-center v-if="modelMan[2] === 1">
            <v-flex style="flex:0 0 auto;font-size:16px" blue--text>亲子关系：</v-flex>
            <v-radio-group v-model="childCont[1]" hide-details row style="flex: 1;margin:0">
              <v-radio
                v-for="(value, key) in cardBoxChild[modelMan[1] - 1]"
                :key="value"
                :label="value"
                :value="key + 1"
                color="#2196f3"
              ></v-radio>
            </v-radio-group>
          </v-layout>
        </v-card-text>

        <v-card-text  v-else-if="which === 'addClass'">
          <v-container grid-list-md style="padding:0">
            <v-layout wrap align-center>
              <v-flex style="flex:0 0 auto;font-size:16px" blue--text>班级ID：</v-flex>
              <v-text-field placeholder="请输入班级ID" v-model="classCont" @keyup.enter="setWhich"></v-text-field>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-text  v-else-if="which === 'addMember'">
          <v-container grid-list-md style="padding:0">
            <v-layout wrap align-center>
              <v-flex style="flex:0 0 auto;font-size:16px" blue--text>用户ID：</v-flex>
              <v-text-field placeholder="请输入用户ID" v-model="classCont" @keyup.enter="setWhich"></v-text-field>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-text v-else-if="which === 'unbindchild' || which === 'unbindParent'">
          {{alertName[which]}}：{{unbindWho.uname || '暂无昵称'}}({{unbindWho.user_id}})
        </v-card-text>

        <v-card-text v-else-if="which === 'freezeMan'">
          {{alertName[which]}}：{{unbindWho[0] || '暂无昵称'}}({{unbindWho[3]}})
        </v-card-text>

        <v-card-text v-else-if="which === 'unbindClass' || which === 'cancelClass'">
          {{alertName[which]}}：{{unbindWho.class_name && (unbindWho.class_name.slice(-1) === '班' ? unbindWho.class_name : unbindWho.class_name + '班') || unbindWho.def_name || '暂无昵称'}}({{unbindWho.class_id}})
        </v-card-text>

        <v-card-text v-else-if="which === 'quitclass'">
          {{alertName[which]}}：{{unbindWho.uname || unbindWho.uname.nick || '暂无昵称'}}({{unbindWho.user_id}})
        </v-card-text>

        <v-card-text v-else-if="image">
          <v-img :src="imageArr[3]" :lazy-src="noImage" aspect-ratio="1" class="lighten-2">
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
        </v-card-text>

        <v-card-text v-else-if="which === 'imageLook'">
          <v-img
            :src="imageArr[3]"
            :lazy-src="imageArr[1]"
            class="lighten-2"
            :style="rotate"
            ref="clickImage"
            contain
            @click="clickImage"
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
        </v-card-text>
        
        <v-card-text v-else-if="which === 'videoLook' && dialog">
          <video loop autoplay :src="imageArr[4]" controls="controls" width="100%">
            您的浏览器不支持 video 标签。
          </video>
        </v-card-text>

        <v-card-text v-else-if="which === 'recordLook' && dialog">
          <video loop autoplay :src="imageArr[4]"  controls="controls" width="100%">
            您的浏览器不支持 audio 标签。
          </video>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">关闭</v-btn>
          <v-btn v-if="!image && !media" color="blue darken-1" flat @click="setWhich">确定</v-btn>
        </v-card-actions>
      </v-card>


    </v-dialog>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
        modelMan: [],
        childCont: ['', 2],
        classCont: '',
        noImage: require('../../../static/images/icon-pic-none.png'),
        cardBox: [['爷爷', '爸爸', '叔叔', '监护人'], ['奶奶', '妈妈', '阿姨', '监护人']],
        cardBoxChild: [['孙子', '儿子', '侄子', '被监护人'], ['孙女', '女儿', '侄女', '被监护人']],
        alertCont: {'unbindchild': '确定与孩子解除绑定关系？', 'unbindParent': '确定与家长解除绑定关系？', 'freezeMan': '确定冻结该用户账号？', 'unbindClass': '确定退出该班级？', 'quitclass': '确定退出该班级？', 'addMember': '添加成员', 'cancelClass': '确定注销该班级？'},
        alertName: {'unbindchild': '孩子名称', 'unbindParent': '家长名称', 'freezeMan': '用户名称', 'unbindClass': '要退出的班级', 'quitclass': '成员姓名', 'cancelClass': '要注销的班级'},
        imageRotate: 0
  
      }
    },
    components: {

    },
    props: {
      color: {
        type: String,
        default: 'primary'
      },
      butCont: {
        type: String,
        default: 'click me'
      },
      which: {
        type: String,
        default: ''
      },
      setMan: {
        type: Array,
        default () { return [] }
      },
      alert: {
        type: String,
        default: ''
      },
      unbindWho: {
        type: [Object, Array],
        default () { return {} }
      },
      disabledOrNo: {
        type: Boolean,
        default: false
      },
      image: {
        type: String,
        default: ''
      },
      media: {
        type: String,
        default: ''
      },
      imageArr: {
        type: Array,
        default () { return [] }
      }
    },
    watch: {
      dialog () {
        console.log(this.unbindWho, this.modelMan)
        this.modelMan = this.setMan.concat()
        this.childCont = ['', 2]
        this.classCont = ''
        this.imageRotate = 0
      }
    },
    computed: {
      rotate () {
        return {
          'transform': 'rotate(' + this.imageRotate + 'deg)',
          '-ms-transform': 'rotate(' + this.imageRotate + 'deg)',
          '-moz-transform': 'rotate(' + this.imageRotate + 'deg)',
          '-webkit-transform': 'rotate(' + this.imageRotate + 'deg)',
          '-o-transform': 'rotate(' + this.imageRotate + 'deg)'
        }
      }
    },
    methods: {
      setWhich () {
        this.dialog = false
        this.which === 'setMan' && this.$emit('setMan', this.modelMan, 'setMan')
        this.which === 'addChild' && this.$emit('addChild', this.childCont, 'addChild')
        this.which === 'addParent' && this.$emit('addParent', this.childCont, 'addParent')
        this.which === 'unbindchild' && this.$emit('unbindchild', this.unbindWho, 'unbindchild')
        this.which === 'unbindParent' && this.$emit('unbindParent', this.unbindWho, 'unbindParent')
        this.which === 'freezeMan' && this.$emit('freezeMan', this.unbindWho, 'freezeMan')
        this.which === 'unbindClass' && this.$emit('unbindClass', this.unbindWho, 'unbindClass')
        this.which === 'addClass' && this.$emit('addClass', this.classCont, 'addClass')
        this.which === 'quitclass' && this.$emit('quitclass', this.unbindWho, 'quitclass')
        this.which === 'addMember' && this.$emit('addMember', this.classCont, 'addMember')
        this.which === 'cancelClass' && this.$emit('cancelClass', this.classCont, 'cancelClass')
      },
      clickImage (e) {
        let imageWidth = this.$refs.clickImage.$el.clientWidth
        let imageRotate = e.layerX * 2 > imageWidth ? this.imageRotate + 90 : this.imageRotate - 90
        this.imageRotate = imageRotate > 270 ? 0 : imageRotate < 0 ? 270 : imageRotate
      }
    }
  }
</script>
<style scoped>

</style>