<template>
   <div>
     <!-- <v-layout row wrap>
      <v-flex xs12>
        <v-card dark color="primary">
          <v-card-text class="px-0">{{ $route.name }}</v-card-text>
        </v-card>
      </v-flex>
     </v-layout> -->
    <v-data-table
      disable-initial-sort
      :headers="headers"
      :items="desserts"
      :pagination.sync="pagination"
      :total-items="totalDesserts"
      :loading="loading"
      no-data-text="很抱歉，目前没有数据 :("
      rows-per-page-text="条/页"
      :rows-per-page-items="[10,25,30,{'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-right">{{ props.item.calories }}</td>
        <td class="text-xs-right">{{ props.item.fat }}</td>
        <td class="text-xs-right">{{ props.item.carbs }}</td>
        <td class="text-xs-right">{{ props.item.protein }}</td>
        <td class="text-xs-right">{{ props.item.iron }}</td>
        <td class="text-xs-right">{{ props.item.stu }}</td>
      </template>
      <template slot="pageText" slot-scope="props">
        第 {{ props.pageStart }} - {{ props.pageStop }} 条，总共 {{ props.itemsLength }} 条
      </template>
      
    </v-data-table>
  </div>
</template>

<script>
// import { userinfoTest } from './mockjs.js'
export default {
  data () {
    return {
      totalDesserts: 0,
      desserts: [],
      loading: true,
      pagination: {},
      headers: [
        { text: '日期', value: 'name', align: 'left', sortable: false },
        { text: 'DAU', value: 'calories', align: 'right' },
        { text: 'DRU', value: 'fat', align: 'right' },
        { text: 'MAU', value: 'carbs', align: 'right' },
        { text: '老师', value: 'protein', align: 'right' },
        { text: '家长', value: 'iron', align: 'right' },
        { text: '学生', value: 'stu', align: 'right' }
      ]
    }
  },
  watch: {
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
  created () {
  },
  mounted () {
    this.getDataFromApi()
      .then(data => {
        this.desserts = data.items
        this.totalDesserts = data.total
      })
  },
  methods: {
    // userinfoData () {   // 测试数据
    //   userinfoTest()
    //   let params = {
    //     api: '/userinfoTest'
    //       // param: {
    //       //   method: 'getuser',
    //       //   data: JSON.stringify(paramdata)
    //       // }
    //   }
    //   api
    //       .post(params)
    //       .then(res => {
    //         this.logining = false
    //         let msg = res.data
    //         // console.log(msg.userinfo)
    //         if (msg.code === 0) this.items = msg.userinfo
    //         else this.show = true
    //         this.snackbar = msg.msg

    //         this.getDataFromApi()
    //           .then(data => {
    //             this.desserts = data.items
    //             this.totalDesserts = data.total
    //           })
    //       })
    //       .catch(err => {
    //         console.log(err)
    //       })
    // },
    getNewData () {
      console.log(123456)
    },
    getDataFromApi () {
      this.loading = true
      return new Promise((resolve, reject) => {
        const { sortBy, descending, page, rowsPerPage } = this.pagination

        let items = this.getDesserts()
        const total = items.length

        if (this.pagination.sortBy) {
          items = items.sort((a, b) => {
            const sortA = a[sortBy]
            const sortB = b[sortBy]

            if (descending) {
              if (sortA < sortB) return 1
              if (sortA > sortB) return -1
              return 0
            } else {
              if (sortA < sortB) return -1
              if (sortA > sortB) return 1
              return 0
            }
          })
        }

        if (rowsPerPage > 0) {
          items = items.slice((page - 1) * rowsPerPage, page * rowsPerPage)
        }

        setTimeout(() => {
          this.loading = false
          resolve({
            items,
            total
          })
        }, 1000)
      })
    },
    getDesserts () {
      return []
    }
  },
  activated () {
    this.$route.params.news && this.getNewData()
    this.$route.params.news = ''
  }
}
</script>
