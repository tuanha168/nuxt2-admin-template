<template lang="pug">
.user
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
            project-text(
              label="Email"
              vid="email"
              type="text"
              size="large"
              rules="max:255"
              :max-length="255"
              v-model="tmpFilterParams.email"
              colon
            )

        a-row(:span="24" :style="{ textAlign: 'center' }")
          project-submit-button(label="Search")

  .table-operations
    nuxt-link.ms-1(to="/users/new")
      a-button(type="primary" icon="plus") Create User

  a-table.project-table(
    :columns="columns"
    :data-source="usersList"
    :loading="loading"
    :pagination="pagination"
    row-key="id"
    bordered
    size="small"
    @change="handleTableChange"
  )
    span(slot="status" slot-scope="text")
      a-tag(:color="text === 'ACTIVE' ? '#87d068' : ''") {{ text }}
    span(slot="action" slot-scope="record")
      a-space(size="middle")
        nuxt-link(:to="`/users/${record.id}/edit`")
          a-button(type="primary" icon="edit" size="small")
        a-popconfirm(
          title="Do you really want to Delete this user?"
          placement="topRight"
          ok-text="Yes"
          cancel-text="No"
          @confirm="deleteUser(record.id)"
        )
          a-button(type="danger" icon="delete" size="small")
</template>

<script>
import errorMixin from '@/utils/errorMixin'
import crumbMixin from '@/utils/crumbMixin'
import { UserConstant } from '@/config/constant/user'

export default {
  name: 'UsersListComponent',
  mixins: [errorMixin, crumbMixin],
  data: () => ({
    crumbs: _.clone(UserConstant.CRUMBS),
    columns: _.clone(UserConstant.COLUMNS),
    loading: false,
    usersList: null,
    tmpFilterParams: {
      name: null,
      email: null
    },
    filterParams: {},
    pagination: {
      size: 'small',
      hideOnSinglePage: true,
      pageSize: 10,
      position: 'bottom'
    }
  }),
  head: () => ({
    title: 'Users List',
    meta: [
      {
        content: 'Users List Page'
      }
    ]
  }),
  created() {
    this.getListUsers()
    this.setCrumbs(this.crumbs)
    this.setTitle('Users List')
  },
  methods: {
    async deleteUser(userId) {
      try {
        this.$loadingPage.open()
        await this.$api.deleteUser(userId)
        this.$message.success('Deleted Successfully')
        await this.getListUsers()
      } catch (err) {
        this.handleError(err)
      } finally {
        this.$loadingPage.close()
      }
    },
    handleFilter() {
      this.filterParams = _.clone(this.tmpFilterParams)
      this.getListUsers()
    },
    handleTableChange(pagination) {
      this.getListUsers(pagination.current)
    },
    async getListUsers(page = 1) {
      try {
        this.loading = true
        // const res = await this.$api.listUsers({
        //   page,
        //   ...this.filterParams
        // })
        // this.usersList = res.data
        // const {
        //   total,
        //   per_page: pageSize,
        //   current_page: current
        // } = res.meta.pagination
        // this.pagination = _.assign({}, this.pagination, {
        //   total,
        //   pageSize,
        //   current
        // })
        this.usersList = await [
          {
            id: 1,
            name: 'haha',
            email: 'test@gmail.com',
            status: 'ACTIVE'
          },
          {
            id: 2,
            name: 'hihi',
            email: 'test2@gmail.com',
            status: 'PENDING'
          }
        ]
      } catch (err) {
        this.handleError(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
