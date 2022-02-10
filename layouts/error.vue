<template lang="pug">
a-result.text-white(
  status="warning"
  :title="`${statusCode}`"
  :sub-title="message"
)
  template(#extra)
    nuxt-link(to="/")
      a-button(type="primary") Back to home
</template>

<script>
export default {
  layout: 'blank',
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  },
  head() {
    return {
      title: this.message
    }
  },
  computed: {
    statusCode() {
      return (this.error && this.error.statusCode) || 500
    },
    message() {
      if (this.statusCode === 500) {
        return 'Error'
      }
      switch (this.statusCode) {
        case 401:
          return 'No permission'
        case 404:
          return 'Not found'
        default:
          return this.error && this.error.message
      }
    }
  }
}
</script>
