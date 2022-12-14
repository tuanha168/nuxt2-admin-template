<template lang="pug">
.users
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

  a-table.project-table(
    :columns="columns"
    :data-source="filterUsersList"
    :loading="loading"
    :pagination="pagination"
    row-key="_id"
    bordered
    size="small"
    @change="handleTableChange"
  )
    span(slot="sex" slot-scope="text")
      a-tag(:color="text ? 'yellow' : '#87d068'") {{ text ? "Female" : "Male" }}
    span(slot="action" slot-scope="record")
      a-space(size="middle")
        nuxt-link(:to="`/users/${record._id}/details`")
          a-button(type="primary" icon="edit" size="small")
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
    filterUsersList: null,
    tmpFilterParams: {
      name: null,
      email: null
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
    handleFilter() {
      this.filterParams = _.clone(this.tmpFilterParams)
      this.pagination.current = 1
      if (!this.filterParams.name && !this.filterParams.email) {
        this.filterUsersList = _.clone(this.usersList)
        return
      }
      this.filterUsersList = this.usersList.filter((user) => {
        let isMatch = false
        if (this.filterParams.name) {
          isMatch =
            user.name
              ?.toLowerCase()
              .includes(this.filterParams.name.toLowerCase()) ||
            user.username
              ?.toLowerCase()
              .includes(this.filterParams.name.toLowerCase())
        }
        if (this.filterParams.email) {
          isMatch = this.filterParams.name
            ? isMatch &&
              user.email
                ?.toLowerCase()
                .includes(this.filterParams.email.toLowerCase())
            : user.email
                ?.toLowerCase()
                .includes(this.filterParams.email.toLowerCase())
        }
        return isMatch
      })
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current
    },
    async getListUsers() {
      try {
        this.loading = true
        const res = await this.$api.listUsers({
          ...this.filterParams
        })
        this.usersList = res.users
        this.filterUsersList = res.users
        this.pagination.total = this.usersList.length
      } catch (err) {
        this.handleError(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
