<template lang="pug">
a-config-provider
  a-layout(:class="device")
    a-spin.spinner(v-show="isLoading" size="large" :spinning="isLoading")
      a-icon(slot="indicator" type="loading" style="font-size: 48px" spin)
    a-drawer(
      v-if="isMobile()"
      placement="left"
      :width="200"
      :body-style="{ padding: 0 }"
      :closable="false"
      :visible="collapsed"
      @close="() => (collapsed = false)"
    )
      side-menu(:collapsed="false")

    side-menu(:collapsed="collapsed" v-else)

    a-layout.app-layout(:style="{ paddingLeft: contentPaddingLeft }")
      global-header(
        :collapsed="collapsed"
        :sidebar-opened="sidebarOpened"
        @toggle="toggle"
      )
      project-page-header
      a-layout-content.app-content(:class="`${$route.name}-container`")
        nuxt
      global-footer
</template>

<script>
import { mapGetters } from 'vuex'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import SideMenu from '@/components/SideMenu'
import deviceMixin from '@/utils/deviceMixin'

export default {
  name: 'DefaultLayout',
  components: {
    GlobalHeader,
    GlobalFooter,
    SideMenu
  },
  mixins: [deviceMixin],
  data: () => ({
    collapsed: false,
    menus: []
  }),
  computed: {
    ...mapGetters({
      isLoading: 'app/loading'
    }),
    contentPaddingLeft() {
      if (this.isMobile()) {
        return '0'
      }
      if (this.sidebarOpened) {
        return '200px'
      }
      return '80px'
    }
  },
  watch: {
    sidebarOpened: {
      handler(val) {
        this.collapsed = !val
      },
      immediate: true
    }
  },
  methods: {
    toggle() {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
    }
  }
}
</script>
