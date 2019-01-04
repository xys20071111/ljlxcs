<template>
  <v-layout style="display:inline-flex">
    <v-dialog v-model="dialog" max-width="600px">
      <v-btn slot="activator" :color="color" dark>{{butCont}}</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">设置用户信息</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md style="padding:0">
            <v-layout wrap style="align-items:center;">
                <v-flex style="flex:0 0 auto;font-size:16px" blue--text>用户昵称：</v-flex>
                <v-text-field :placeholder="123"></v-text-field>
            </v-layout>
            <v-layout wrap style="align-items:center">
              <v-radio-group v-model="state" hide-details row style="margin: 10px 10px 10px 0px;flex: 0 0 auto;">
                <v-flex style="flex:0 0 auto;font-size:16px" blue--text>用户性别：</v-flex>
                <v-radio
                  v-for="(value, key) in ['男', '女']"
                  :key="value"
                  :label="value"
                  :value="key + 1"
                  color="#2196f3"
                  @change="radioChange(key + 1)"
                ></v-radio>
              </v-radio-group>
            </v-layout>
            <v-layout style="align-items:center">
              <v-radio-group v-model="state" hide-details row style="margin: 10px 10px 10px 0px;flex: 0 0 auto;">
                <v-flex style="flex:0 0 auto;font-size:16px" blue--text>用户身份：</v-flex>
                <v-flex wrap flex>
                  <v-radio
                    v-for="(value, key) in ['学生', '家长', '老师']"
                    :key="value"
                    :label="value"
                    :value="key + 1"
                    color="#2196f3"
                    @change="radioChange(key + 1)"
                  ></v-radio>
                </v-flex>
              </v-radio-group>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">关闭</v-btn>
          <v-btn color="blue darken-1" flat @click="dialog = false">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false
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
      }
    },
    watch: {

    },
    computed: {

    },
    methods: {

    },
    created () {

    },
    mounted () {

    }
  }
</script>
<style scoped>

</style>