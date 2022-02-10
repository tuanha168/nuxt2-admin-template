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
    :has-feedback="hasFeedback"
  )
    template(slot="label")
      span(:class="{ 'ant-form-item-required': isRequired }") {{ showLabel ? label : "" }}
    a-date-picker.project-date-picker(
      :disabled-date="disableDate"
      v-bind="$attrs"
      v-model="newValue"
      @change="(val) => $emit('change', val)"
    )
</template>

<script>
import inputMixin from '@/utils/inputMixin.js'

export default {
  name: 'TimePicker',
  mixins: [inputMixin],
  computed: {
    newValue: {
      get() {
        return this.value ? this.$moment(this.value) : null
      },
      set(val) {
        this.$emit(
          'input',
          val ? val.format(this.$attrs.format || 'YYYY-MM-DD HH:mm:ss') : null
        )
      }
    }
  },
  methods: {
    disableDate(current) {
      return (
        current && current < this.$moment().subtract(1, 'days').endOf('day')
      )
    }
  }
}
</script>

<style lang="scss">
.project-date-picker {
  width: 45%;
}
</style>
