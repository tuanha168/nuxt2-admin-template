<template lang="pug">
a-button(
  type="primary"
  html-type="submit"
  :btn-class="btnClass"
  v-bind="$attrs"
) {{ label }}
</template>

<script>
export default {
  name: 'SubmitButton',
  props: {
    label: {
      type: String,
      default: 'Submit'
    },
    btnClass: {
      type: String,
      default: null
    }
  }
}
</script>
