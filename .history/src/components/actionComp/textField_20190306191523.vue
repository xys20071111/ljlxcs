<template>
  <div style="display:flex; align-items: center;">
    <v-text-field
      :label="label"
      :placeholder="placeholder"
      :style="{flex:width ? 'auto' : '0 1 150px',margin:'10px 10px 10px 20px',width: width ? width : 'auto', padding: padd ? padd : ''}"
      clearable
      hide-details
      v-model="modelNumber"
      @keyup.enter="search()"
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
    props: ['label', 'placeholder', 'which', 'buttonHide', 'number', 'width', 'padd'],
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