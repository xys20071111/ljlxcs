<template>
  <v-layout style="display:inline-flex">
    <v-dialog v-model="dialog" :max-width="(alert && 290) || (['addChild', 'addParent'].indexOf(which) !== -1  && 450) || 360" :disabled="quitOrNo">
      <v-btn slot="activator" :flat="which === 'quitclass'" :disabled="quitOrNo" :small="which === 'quitclass'" :color="color">{{butCont}}</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">{{alertCont[which] || butCont}}</span>
        </v-card-title>
        <v-card-text  v-if="which === 'setMan'">
          <v-container grid-list-md style="padding:0">
            <v-layout wrap align-center>
              <v-flex style="flex:0 0 auto;font-size:16px" blue--text>用户昵称：</v-flex>
              <v-text-field placeholder="请输入用户昵称" v-model="modelMan[0]"></v-text-field>
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

        <v-card-text  v-if="which === 'addChild'">
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

        <v-card-text  v-if="which === 'addParent'">
          <v-container grid-list-md style="padding:0">
            <v-layout wrap align-center>
              <v-flex style="flex:0 0 auto;font-size:16px" blue--text>家长ID：</v-flex>
              <v-text-field placeholder="请输入用户ID" v-model="childCont[0]" @keyup.enter="setWhich"></v-text-field>
            </v-layout>
          </v-container>
          <v-layout nowrap align-center v-if="modelMan[2] === 1">
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

        <v-card-text  v-if="which === 'addClass'">
          <v-container grid-list-md style="padding:0">
            <v-layout wrap align-center>
              <v-flex style="flex:0 0 auto;font-size:16px" blue--text>班级ID：</v-flex>
              <v-text-field placeholder="请输入班级ID" v-model="classCont" @keyup.enter="setWhich"></v-text-field>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-text v-if="which === 'unbindchild'">
          {{alertName[which]}}：{{unbindWho.uname}}({{unbindWho.user_id}})
        </v-card-text>

        <v-card-text v-if="which === 'freezeMan'">
          {{alertName[which]}}：{{unbindWho[0] || '暂无昵称'}}({{unbindWho[3]}})
        </v-card-text>

        <v-card-text v-if="which === 'unbindClass'">
          {{alertName[which]}}：{{unbindWho.class_name && (unbindWho.class_name.slice(-1) === '班' ? unbindWho.class_name : unbindWho.class_name + '班') || unbindWho.def_name}}({{unbindWho.class_id}})
        </v-card-text>

        <v-card-text v-if="which === 'quitclass'">
          {{alertName[which]}}：{{unbindWho.uname}}({{unbindWho.user_id}})
        </v-card-text>


        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">关闭</v-btn>
          <v-btn color="blue darken-1" flat @click="setWhich">确定</v-btn>
        </v-card-actions>
      </v-card>


    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
        modelMan: [],
        childCont: ['', 2],
        classCont: '',
        cardBox: [['爷爷', '爸爸', '叔叔', '监护人'], ['奶奶', '妈妈', '阿姨', '监护人']],
        alertCont: {'unbindchild': '确定与孩子解除绑定关系？', 'freezeMan': '确定冻结该用户账号？', 'unbindClass': '确定退出该班级？', 'quitclass': '确定退出该班级？'},
        alertName: {'unbindchild': '孩子名称', 'freezeMan': '用户名称', 'unbindClass': '要退出的班级', 'quitclass': '成员姓名'}
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
      quitOrNo: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      dialog () {
        console.log(this.unbindWho)
        this.modelMan = this.setMan.concat()
        this.childCont = ['', 2]
        this.classCont = ''
      }
    },
    computed: {
    },
    methods: {
      setWhich () {
        this.dialog = false
        this.which === 'setMan' && this.$emit('setMan', this.modelMan, 'setMan')
        this.which === 'addChild' && this.$emit('addChild', this.childCont, 'addChild')
        this.which === 'unbindchild' && this.$emit('unbindchild', this.unbindWho, 'unbindchild')
        this.which === 'unbindClassChild' && this.$emit('unbindClassChild', this.unbindWho, 'unbindClassChild')
        this.which === 'freezeMan' && this.$emit('freezeMan', this.unbindWho, 'freezeMan')
        this.which === 'unbindClass' && this.$emit('unbindClass', this.unbindWho, 'unbindClass')
        this.which === 'addClass' && this.$emit('addClass', this.classCont, 'addClass')
        this.which === 'quitclass' && this.$emit('quitclass', this.unbindWho, 'unbindWho')
      }

    },
    created () {

    },
    mounted () {

    }
  }
</script>
<style scoped>

</style>