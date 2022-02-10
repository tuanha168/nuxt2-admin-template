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
    :colon="colon"
  )
    template(slot="label" v-if="showLabel")
      span(:class="{ 'ant-form-item-required': isRequired }") {{ label }}
    a-checkbox-group(v-model="newValue" :class="customClass" v-bind="$attrs")
      slot
</template>

<script>
import inputMixin from '@/utils/inputMixin.js'

export default {
  name: 'CheckboxGroupField',
  mixins: [inputMixin],
  props: {
    customClass: {
      type: String,
      default: ''
    }
  }
}
</script>
