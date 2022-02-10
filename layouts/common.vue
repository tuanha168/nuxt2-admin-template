<template lang="pug">
a-config-provider(v-if="!$auth.loggedIn")
  #userLayout(:class="['user-layout-wrapper', device]")
    a-spin.spinner(v-show="isLoading" size="large" :spinning="isLoading")
      a-icon(slot="indicator" type="loading" style="font-size: 48px" spin)
    .container
      nuxt
</template>

<script>
import { mapGetters } from 'vuex'
import deviceMixin from '@/utils/deviceMixin'

export default {
  name: 'CommonLayout',
  mixins: [deviceMixin],
  computed: {
    ...mapGetters({
      isLoading: 'app/loading'
    })
  },
  beforeCreate() {
    this.$auth.loggedIn && this.$router.push({ path: '/' })
  }
}
</script>

<style lang="scss" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;
  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }
  .container {
    height: calc(100vh - 28px);
    min-width: 1440px;
    min-height: 676px;
  }
}
</style>
