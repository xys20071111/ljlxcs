<template>
  <v-data-table
    disable-initial-sort
    :headers="headers"
    :items="desserts"
    :pagination.sync="pagination"
    :total-items="0"
    :loading="loading"
    no-data-text="很抱歉，目前没有数据 :("
    rows-per-page-text="条/页"
    :rows-per-page-items="pageItems"
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <td class="text-xs-center" v-for="(item, index) in headers" :key="index">
        {{ item.value === 'city' ? props.item.country + '-' + props.item.province + '-' + props.item.city : props.item[item.value] }}</td>
    </template>
    <template slot="pageText" slot-scope="props">
      第 {{ props.pageStart }} - {{ props.pageStop }} 条，总共 {{ props.itemsLength }} 条
    </template>
  </v-data-table>
</template>

<script>
export default {
  components: {},
  props: ['headers', 'desserts', 'loading', 'news', 'totalDesserts'],
  watch: {
    desserts () {
      if (!this.news || this.news === 'news') {
        this.pageItems = this.getPageItems()
        this.pagination.page = 1
        this.pagination.rowsPerPage = this.pageItems[0]
        this.news === 'news' && this.$emit('update:setNew', 'new')
      }
    },
    pagination (newData) {
      if (this.news) {
        this.news === 'new' && this.$emit('getNew', newData)
      }
    }
  },
  data () {
    return {
      pagination: {},
      pageItems: [10]
    }
  },
  methods: {
    getPageItems (news) {
      let pageBox = []
      let dessertLength = this.totalDesserts ? this.totalDesserts : this.desserts.length
      pageBox.push(dessertLength > 9 ? 10 : dessertLength)
      dessertLength > 19 && pageBox.push(20)
      dessertLength > 29 && pageBox.push(30)
      dessertLength > 49 && pageBox.push(50)
      dessertLength > 99 && pageBox.push(100)
      dessertLength < 100 && pageBox.push({'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1})
      return pageBox
    }
  }
}
</script>
<style scoped>
</style>