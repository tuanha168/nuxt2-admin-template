<template lang="pug">
a-layout-sider.custom-sider(v-model="collapsed" :trigger="null" collapsible)
  .logo
    img(src="~/assets/img/logo.png" width="100%" height="100%")
  a-menu(
    style="background-color: #2a2a2a"
    mode="inline"
    theme="dark"
    :open-keys="openKeys"
    :selected-keys="selectedKeys"
    :inline-collapsed="collapsed"
    @click="select"
    @openChange="openChange"
  )
    template(v-for="item in menu")
      template(v-if="item.children")
        a-sub-menu(:key="item.key")
          span(slot="title")
            a-icon(:type="item.icon")
            span {{ item.label }}
          a-menu-item(v-for="childItem in item.children" :key="childItem.key")
            a-icon(:type="childItem.icon")
            nuxt-link.menu-item(:to="childItem.url") {{ childItem.label }}
      template(v-else)
        a-menu-item(:key="item.key")
          a-icon(:type="item.icon")
          nuxt-link.menu-item(:to="item.url") {{ item.label }}
</template>

<script>
export default {
  name: 'SideMenu',
  props: {
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      openKeys: [],
      selectedKeys: [],
      rootSubmenuKeys: ['/contents'],
      menu: [
        {
          label: 'Dashboard',
          icon: 'dashboard',
          key: '/',
          url: '/'
        },
        {
          label: 'Users',
          icon: 'user',
          key: '/users',
          url: '/users'
        }
      ]
    }
  },
  watch: {
    '$route.path'() {
      this.handleSidebar()
    }
  },
  created() {
    this.handleSidebar()
  },
  methods: {
    handleSidebar() {
      let selectedKeys
      const path = this.$route.path
      const rootKey = path.substr(0, path.indexOf('/', 1))
      this.openKeys = [rootKey]
      if (path.includes('/', 1) && !_.includes(this.rootSubmenuKeys, rootKey)) {
        selectedKeys = rootKey
      } else {
        const arrayPath = path.split('/')
        const number = arrayPath.length - 1
        if (number === 1) {
          selectedKeys = arrayPath[1]
        } else if (number >= 2) {
          selectedKeys = arrayPath[2]
        }
      }
      if (!_.includes(selectedKeys, '/')) {
        selectedKeys = '/' + selectedKeys
      }
      this.selectedKeys = [selectedKeys]
    },
    openChange(openKeys) {
      const latestOpenKey = _.find(
        openKeys,
        (key) => !_.includes(this.openKeys, key)
      )
      if (!_.includes(this.rootSubmenuKeys, latestOpenKey)) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    select({ key }) {
      this.selectedKeys = [key]
    }
  }
}
</script>

<style lang="scss">
.custom-sider {
  position: fixed;
  height: 100%;
  background-color: #2a2a2a;
  overflow-y: auto;
  .ant-menu-sub {
    background-color: #2a2a2a !important;
    box-shadow: none !important;
  }
}
.logo {
  display: block;
  height: 135px;
  margin: 16px;
  transition: all 0.25s;
}
.ant-layout-sider-collapsed .logo {
  height: 32px;
}
</style>
