<template lang="pug">
.game
  #advanced-search
    validation-observer(ref="form" v-slot="{ passes }")
      a-form-model(@submit="passes(handleFilter)" @submit.native.prevent)
        a-row(:gutter="24")
          a-col(:span="8")
            project-text(
              label="Name"
              vid="name"
              type="text"
              size="large"
              rules="max:255"
              :max-length="255"
              v-model="tmpFilterParams.name"
              colon
            )

          a-col(:span="8")
            project-select(
              label="Category"
              vid="category"
              size="large"
              placeholder="Please select category"
              v-model="tmpFilterParams.category"
              :disabled="loadingCat"
              :loading="loadingCat"
              :filter-option="filterOption"
            )
              a-select-option(
                v-for="category in categories"
                :key="category._id"
                :value="category._id"
              ) {{ category.name }}
        a-row(:span="24" :style="{ textAlign: 'center' }")
          project-submit-button(label="Search")

  .table-operations
    nuxt-link.ms-1(to="/games/new")
      a-button(type="primary" icon="plus") Create Game

  a-table.project-table(
    :columns="columns"
    :data-source="gamesList"
    :loading="loading"
    :pagination="pagination"
    row-key="_id"
    bordered
    size="small"
    @change="handleTableChange"
  )
    span(slot="category" slot-scope="record")
      | {{ record.name }}
    span(slot="timeFormat" slot-scope="text")
      | {{ text ? $moment(text).format('YYYY-MM-DD HH:mm') : '-' }}
    span(slot="action" slot-scope="record")
      a-space(size="middle")
        nuxt-link(:to="`/games/${record._id}/edit`")
          a-button(type="primary" icon="edit" size="small")
        a-popconfirm(
          title="Do you really want to Delete this game?"
          placement="topRight"
          ok-text="Yes"
          cancel-text="No"
          @confirm="deleteGame(record._id)"
        )
          a-button(type="danger" icon="delete" size="small")
</template>

<script>
import errorMixin from '@/utils/errorMixin'
import crumbMixin from '@/utils/crumbMixin'
import { GameConstant } from '@/config/constant/game'

export default {
  name: 'GamesListComponent',
  mixins: [errorMixin, crumbMixin],
  data: () => ({
    crumbs: _.clone(GameConstant.CRUMBS),
    columns: _.clone(GameConstant.COLUMNS),
    loading: false,
    loadingCat: false,
    gamesList: [],
    tmpFilterParams: {
      name: null,
      category: null
    },
    filterParams: {},
    pagination: {
      size: 'small',
      hideOnSinglePage: true,
      pageSize: 10,
      position: 'bottom',
      current: 1
    }
  }),
  head: () => ({
    title: 'Games List',
    meta: [
      {
        content: 'Games List Page'
      }
    ]
  }),
  created() {
    this.getCategories()
    this.getListGames()
    this.setCrumbs(this.crumbs)
    this.setTitle('Games List')
  },
  methods: {
    async deleteGame(gameId) {
      try {
        this.$loadingPage.open()
        await this.$api.deleteGame(gameId)
        this.$message.success('Deleted Successfully')
        await this.getListGames()
      } catch (err) {
        this.handleError(err)
      } finally {
        this.$loadingPage.close()
      }
    },
    handleFilter() {
      this.filterParams = _.clone(this.tmpFilterParams)
      this.getListGames()
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current
    },
    async getListGames() {
      try {
        this.loading = true
        const res = await this.$api.listGames({
          ...this.filterParams
        })
        this.gamesList = res.games
        this.pagination.total = this.gamesList.length
      } catch (err) {
        this.handleError(err)
      } finally {
        this.loading = false
      }
    },
    async getCategories() {
      try {
        this.loadingCat = true
        const res = await this.$api.listCategories()
        this.categories = _.assign({}, this.categories, res.categories)
      } catch (err) {
        this.handleError(err)
      } finally {
        this.loadingCat = false
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text
        .toLowerCase()
        .includes(input.toLowerCase())
    }
  }
}
</script>
