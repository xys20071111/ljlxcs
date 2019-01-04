<template>
  <v-layout style="display:inline-flex">
    <v-dialog v-model="dialog" max-width="600px">
      <v-btn slot="activator" :color="color" dark>{{butCont}}</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">{{butCont}}</span>
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
              <v-flex style="flex:0 0 auto;font-size:16px" blue--text>用户ID：</v-flex>
              <v-text-field placeholder="请输入用户ID" v-model="modelMan[0]"></v-text-field>
            </v-layout>
          </v-container>
        </v-card-text>


        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">关闭</v-btn>
          <v-btn color="blue darken-1" flat @click="setWhich">保存</v-btn>
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
        childId: ''
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
      }
    },
    watch: {
      dialog () {
        console.log(this.setMan, this.modelMan)
        this.modelMan = this.setMan.concat()
        console.log(this.modelMan)
      }

    },
    computed: {
      modelMan: {
        get () {
          return this.setMan.concat()
        },
        set (v) {
        }
      }

    },
    methods: {
      setWhich () {
        this.dialog = false
        this.which === 'setMan' && this.$emit('setManFun', this.modelMan)
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