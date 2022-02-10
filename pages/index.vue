<template lang="pug">
div
  | Dashboard
</template>

<script>
import crumbMixin from '@/utils/crumbMixin'
import errorMixin from '@/utils/errorMixin'

export default {
  name: 'DashboardPage',
  mixins: [crumbMixin, errorMixin],
  head: () => ({
    title: 'Dashboard',
    meta: [
      {
        content: 'Dashboard Page'
      }
    ]
  }),
  created() {
    this.setCrumbs([
      {
        path: '/',
        icon: 'home',
        breadcrumbName: 'home'
      }
    ])
    this.setTitle('Dashboard')
  }
}
</script>
