<template lang="pug">
.codes
  .table-operations
    a-button(type="primary" icon="plus" @click="generateCode()") Generate Code

  a-table.project-table(
    :columns="columns"
    :data-source="codesList"
    :loading="loading"
    :pagination="pagination"
    row-key="_id"
    bordered
    size="small"
    @change="handleTableChange"
  )
    span(slot="status" slot-scope="_, record")
      a-tag(:color="statusCode[checkStatus(record)]") {{ checkStatus(record) }}
    span(slot="timeFormat" slot-scope="text")
      | {{ text ? $moment(text).format("YYYY-MM-DD HH:mm") : "-" }}
</template>

<script>
import errorMixin from '@/utils/errorMixin'
import crumbMixin from '@/utils/crumbMixin'
import { CodeConstant } from '@/config/constant/code'

export default {
  name: 'CodesListComponent',
  mixins: [errorMixin, crumbMixin],
  data: () => ({
    crumbs: _.clone(CodeConstant.CRUMBS),
    columns: _.clone(CodeConstant.COLUMNS),
    statusCode: _.clone(CodeConstant.STATUS),
    loading: false,
    loadingCat: false,
    codesList: [],
    categories: [],
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
    title: 'Codes List',
    meta: [
      {
        content: 'Codes List Page'
      }
    ]
  }),
  created() {
    this.getListCodes()
    this.setCrumbs(this.crumbs)
    this.setTitle('Codes List')
  },
  methods: {
    async generateCode() {
      try {
        this.$loadingPage.open()
        await this.$api.generateCode()
        this.$message.success('Generate Successfully')
      } catch (err) {
        this.$message.error('Generate Failed')
      } finally {
        this.$loadingPage.close()
        this.getListCodes()
      }
    },
    handleFilter() {
      this.filterParams = _.clone(this.tmpFilterParams)
      this.getListCodes()
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current
    },
    async getListCodes() {
      try {
        this.loading = true
        const res = await this.$api.listCodes({
          ...this.filterParams
        })
        this.codesList = res.codes
        this.pagination.total = this.codesList.length
        this.pagination.current = 1
      } catch (err) {
        this.handleError(err)
      } finally {
        this.loading = false
      }
    },
    checkStatus(record) {
      return record.is_activated
        ? 'Used'
        : this.$moment(record.expired_time).isSameOrAfter()
          ? 'Available'
          : 'Expired'
    }
  }
}
</script>
