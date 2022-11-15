<template lang="pug">
transition(name="showHeader")
  a-layout-header.ant-header-fixedHeader(
    :class="sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed'"
    style="background: #fff"
  )
    .header
      a-icon.trigger(
        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
        @click="toggle"
      )
      a-dropdown
        a.ant-dropdown-link(@click="(e) => e.preventDefault()")
          a-avatar(
            style="backgroundcolor: #87d068; margin-right: 10px"
            icon="user"
          )
          | Admin
          a-icon(type="down")
        a-menu(slot="overlay")
          a-menu-item(key="0" @click="logout") Logout
</template>

<script>
export default {
  name: 'GlobalHeader',
  props: {
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    sidebarOpened: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    toggle() {
      this.$emit('toggle')
    },
    async logout() {
      try {
        await Promise.all([this.$auth.logout('local')])
        this.$message.success('Logout successfully')
      } catch (error) {
        this.$message.error('Error')
      }
    }
  }
}
</script>

<style lang="scss">
.showHeader-enter-active {
  transition: all 0.25s ease;
}
.showHeader-leave-active {
  transition: all 0.5s ease;
}
.showHeader-enter,
.showHeader-leave-to {
  opacity: 0;
}
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #1890ff;
  }
}
.ant-header-fixedHeader {
  position: fixed;
  z-index: 1;
  width: 100%;
  padding: 0;
  top: 0;
  right: 0;
  z-index: 99;
  -webkit-transition: width 0.2s;
  transition: width 0.2s;
  .header {
    // background: $white;
    padding-right: 12px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    -webkit-box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    -moz-box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  }
  &.ant-header-side-opened {
    width: calc(100% - 200px);
  }

  &.ant-header-side-closed {
    width: calc(100% - 80px);
  }
}
</style>
