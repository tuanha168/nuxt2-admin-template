<template lang="pug">
a-form-model-item(:label="label")
  a-switch(v-model="newValue" v-bind="$attrs")
  a-tag(
    v-if="showText"
    :color="newValue ? '#87d068' : ''"
    :style="{ 'margin-left': '1rem' }"
  ) {{ newValue ? trueText : falseText }}
</template>

<script>
import inputMixin from '@/utils/inputMixin.js'

export default {
  name: 'Checkbox',
  mixins: [inputMixin],
  props: {
    trueValue: {
      type: [String, Boolean],
      default: true
    },
    falseValue: {
      type: [String, Boolean],
      default: false
    },
    showText: {
      type: Boolean,
      default: false
    },
    trueText: {
      type: String,
      default: null
    },
    falseText: {
      type: String,
      default: null
    }
  },
  computed: {
    newValue: {
      get() {
        return this.value === this.trueValue
      },
      set(val) {
        this.$emit('input', val ? this.trueValue : this.falseValue)
      }
    }
  }
}
</script>
