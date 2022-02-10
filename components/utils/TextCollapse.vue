<template lang="pug">
.project-text-collapse(@click.stop="$emit('onClick')")
  a-tooltip(v-if="textLength > max")
    template(slot="title") {{ text.replace(/\s/g, "&nbsp;") }}
    span {{ newText }}
  span(v-else) {{ text.replace(/\s/g, "&nbsp;") }}
</template>

<script>
export default {
  name: 'TextCollapse',
  props: {
    text: {
      type: String,
      required: true
    },
    max: {
      type: Number,
      default: 16
    }
  },
  computed: {
    textLength() {
      return this.text.length
    },
    newText() {
      const chunk = this.text.split('')
      let result = ''
      for (let i = 0; i < this.max; i++) {
        result = `${result}${chunk[i]}`
      }
      return `${result}...`
    }
  }
}
</script>
