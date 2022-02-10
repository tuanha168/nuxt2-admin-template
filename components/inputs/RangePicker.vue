<template lang="pug">
validation-provider(
  :vid="vid"
  :name="label"
  :rules="rules"
  v-slot="slotProps"
  slim
)
  a-form-model-item(:colon="colon" :has-feedback="hasFeedback" v-bind="$attrs")
    template(slot="label")
      span(:class="{ 'ant-form-item-required': isRequired }") {{ showLabel ? label : "" }}
    a-range-picker(
      :default-value="newValue"
      v-bind="$attrs"
      v-model="newValue"
      @focus="$emit('focus')"
    )
</template>

<script>
import inputMixin from '@/utils/inputMixin.js'

export default {
  name: 'RangePicker',
  mixins: [inputMixin],
  computed: {
    newValue: {
      get() {
        return this.value.startAt && this.value.endAt
          ? [this.$moment(this.value.startAt), this.$moment(this.value.endAt)]
          : null
      },
      set(val) {
        let handledVal = { startAt: null, endAt: null }
        if (val.length) {
          handledVal = {
            startAt: val[0].tz('UTC').format(),
            endAt: val[1].tz('UTC').format()
          }
        }
        this.$emit('input', handledVal)
      }
    }
  }
}
</script>
