<template lang="pug">
.category
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

        a-row(:span="24" :style="{ textAlign: 'center' }")
          project-submit-button(label="Search")

  .table-operations
    nuxt-link.ms-1(to="/categories/new")
      a-button(type="primary" icon="plus") Create category

  a-table.project-table(
    :columns="columns"
    :data-source="filterCategoriesList"
    :loading="loading"
    :pagination="pagination"
    row-key="_id"
    bordered
    size="small"
    @change="handleTableChange"
  )
    span(slot="image" slot-scope="text")
      img(:src="text" style="width: 100%; height: 100%; object-fit: cover")
    span(slot="timeFormat" slot-scope="text")
      | {{ text ? $moment(text).format("YYYY-MM-DD HH:mm") : "-" }}
    span(slot="action" slot-scope="record")
      a-space(size="middle")
        nuxt-link(:to="`/categories/${record._id}/edit`")
          a-button(type="primary" icon="edit" size="small")
        a-popconfirm(
          title="Do you really want to Delete this category?"
          placement="topRight"
          ok-text="Yes"
          cancel-text="No"
          @confirm="deleteCategory(record._id)"
        )
          a-button(type="danger" icon="delete" size="small")
</template>

<script>
import errorMixin from '@/utils/errorMixin'
import crumbMixin from '@/utils/crumbMixin'
import { CategoryConstant } from '@/config/constant/category'

export default {
  name: 'CategoriesListComponent',
  mixins: [errorMixin, crumbMixin],
  data: () => ({
    crumbs: _.clone(CategoryConstant.CRUMBS),
    columns: _.clone(CategoryConstant.COLUMNS),
    loading: false,
    categoriesList: [],
    filterCategoriesList: [],
    tmpFilterParams: {
      name: null
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
    title: 'Categories List',
    meta: [
      {
        content: 'Categories List Page'
      }
    ]
  }),
  created() {
    this.getListCategories()
    this.setCrumbs(this.crumbs)
    this.setTitle('Categories List')
  },
  methods: {
    async deleteCategory(categoryId) {
      try {
        this.$loadingPage.open()
        await this.$api.deleteCategory(categoryId)
        this.$message.success('Deleted Successfully')
      } catch (err) {
        this.handleError(err)
      } finally {
        this.$loadingPage.close()
        this.getListCategories()
      }
    },
    handleFilter() {
      this.filterParams = _.clone(this.tmpFilterParams)
      this.pagination.current = 1
      if (!this.filterParams.name) {
        this.filterCategoriesList = _.clone(this.categoriesList)
      }
      this.filterCategoriesList = this.categoriesList.filter((category) =>
        category.name
          .toLowerCase()
          .includes(this.filterParams.name.toLowerCase())
      )
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current
    },
    async getListCategories() {
      try {
        this.loading = true
        const res = await this.$api.listCategories({
          ...this.filterParams
        })
        this.categoriesList = res.categories
        this.filterCategoriesList = res.categories
        this.pagination.total = this.categoriesList.length
      } catch (err) {
        this.handleError(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
