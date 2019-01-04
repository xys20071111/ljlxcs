<template>
  <v-data-table
    disable-initial-sort
    :headers="headers"
    :items="desserts"
    :pagination.sync="pagination"
    :loading="loading"
    no-data-text="很抱歉，目前没有数据 :("
    rows-per-page-text="条/页"
    :rows-per-page-items="pageItems"
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <td class="text-xs-center" v-for="(item, index) in headers" :key="index">
        {{ item.value === 'city' ? getCountry(props.item.country, props.item.province, props.item.city) : props.item[item.value] }}</td>
    </template>
    <template slot="pageText" slot-scope="props">
      第 {{ props.pageStart }} - {{ props.pageStop }} 条，总共 {{ props.itemsLength }} 条
    </template>
  </v-data-table>
</template>

<script>
import { getCountry } from '../../api/dist.js'
export default {
  components: {},
  props: ['headers', 'desserts', 'loading', 'news'],
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
      getCountry,
      pagination: {},
      pageItems: [10]
    }
  },
  methods: {
    getPageItems (news) {
      let pageBox = []
      pageBox.push(this.desserts.length > 9 ? 10 : this.desserts.length)
      this.desserts.length > 19 && pageBox.push(20)
      this.desserts.length > 29 && pageBox.push(30)
      this.desserts.length > 49 && pageBox.push(50)
      this.desserts.length < 50 && pageBox.push({'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1})
      return pageBox
    }
  }
}
</script>
<style scoped>
</style>