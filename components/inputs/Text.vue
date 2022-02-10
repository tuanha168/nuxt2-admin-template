<template lang="pug">
validation-provider(
  :vid="vid"
  :name="label"
  :rules="rules"
  v-slot="slotProps"
  slim
)
  a-form-model-item(
    :validate-status="resolveState(slotProps)"
    :help="slotProps.errors[0]"
    :colon="showLabel ? colon : false"
    :has-feedback="hasFeedback || loading"
    v-bind="formItemLayout"
  )
    template(slot="label")
      span(
        v-show="showLabel"
        :class="{ 'ant-form-item-required': isRequired }"
      ) {{ label }}
    a-input(v-model="newValue" v-bind="$attrs" @blur="trimInput")
      span(slot="addonAfter" v-if="hasAddon")
        slot
</template>

<script>
import inputMixin from '@/utils/inputMixin.js'

export default {
  name: 'TextField',
  mixins: [inputMixin],
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    formItemLayout: {
      type: Object,
      default: () => {}
    },
    hasAddon: {
      type: Boolean,
      default: false
    }
  }
}
</script>
