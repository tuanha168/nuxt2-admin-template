<template lang="pug">
.project-page-header
  a-breadcrumb(:routes="crumbs")
    template(slot="itemRender" slot-scope="{ route }")
      nuxt-link(:to="route")
        a-icon(v-if="route.icon" :type="route.icon")
        span(v-else) {{ route.breadcrumbName }}
  h1.project-page-header__title {{ title }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PageHeaderComponent',
  computed: {
    ...mapGetters({
      crumbs: 'app/crumbs',
      title: 'app/title'
    })
  }
}
</script>
