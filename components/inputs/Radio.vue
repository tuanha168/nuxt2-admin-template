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
    template(slot="label")
      span(:class="{ 'ant-form-item-required': isRequired }") {{ showLabel ? label : "" }}
    a-radio-group(v-model="newValue" v-bind="$attrs")
      slot
</template>

<script>
import inputMixin from '@/utils/inputMixin.js'

export default {
  name: 'RadioField',
  mixins: [inputMixin]
}
</script>
