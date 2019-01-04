<template>
  <v-layout style="display:inline-flex">
    <v-dialog v-model="dialog" max-width="600px">
      <v-btn slot="activator" :color="color" dark>{{butCont}}</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">设置用户信息</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap style="align-items:center">
                <v-flex style="flex:0 0 auto" blue--text>用户昵称：</v-flex>
                <v-text-field :placeholder="123"></v-text-field>
            </v-layout>
            <v-layout>
              <v-flex xs12 sm6>
                <v-autocomplete
                  :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                  label="Interests"
                  multiple
                ></v-autocomplete>
              </v-flex>
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