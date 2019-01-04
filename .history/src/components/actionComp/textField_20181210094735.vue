<template>
  <div style="display:flex; align-items: center;">
    <v-text-field
      :label="label"
      :placeholder="placeholder"
      style="flex:0 1 150px;margin:10px 10px 10px 20px"
      clearable
      hide-details
      v-model="modelNumber"
      @keyup.enter="search()"
      append-icon="search"
    ></v-text-field>
    <v-btn flat icon color="#32b1fa" @click="search()" v-if="!buttonHide">
      <v-icon large>search</v-icon>
    </v-btn>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        modelNumber: ''
      }
    },
    props: ['label', 'placeholder', 'which', 'buttonHide', 'number'],
    watch: {
      modelNumber () {
        this.$emit('update:setModel', this.modelNumber)
      }
    },
    methods: {
      search () {
        this.$emit('searchClass', this.which)
      }
    }
  }
</script>
<style scoped>
                   
</style>