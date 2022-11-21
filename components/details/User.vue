<template lang="pug">
.user-details
</template>

<script>
import errorMixin from '@/utils/errorMixin'
import crumbMixin from '@/utils/crumbMixin'
import { UserConstant } from '@/config/constant/user'

export default {
  name: 'UsersDetailsComponent',
  mixins: [errorMixin, crumbMixin],
  data: () => ({
    crumbs: _.clone(UserConstant.CRUMBS),
    columns: _.clone(UserConstant.COLUMNS),
    loading: false,
    userDetails: null
  }),
  head: () => ({
    title: 'User Details',
    meta: [
      {
        content: 'User Details Page'
      }
    ]
  }),
  computed: {
    userId() {
      return this.$route.params.userId
    }
  },
  created() {
    this.getUserDetails()
    this.setCrumbs(this.crumbs)
    this.setTitle('User Details')
  },
  methods: {
    async getUserDetails() {
      try {
        this.loading = true
        const res = await this.$api.userDetails(this.userId)
        this.setTitle(res.user.name)
        this.userDetails = res.users
      } catch (err) {
        this.handleError(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
