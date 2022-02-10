<template lang="pug">
validation-provider(
  :vid="vid"
  :name="label"
  :rules="rules"
  v-slot="slotProps"
  slim
)
  a-form-model-item(
    :colon="colon"
    :validate-status="resolveState(slotProps)"
    :help="slotProps.errors[0]"
  )
    template(slot="label")
      span(:class="{ 'ant-form-item-required': isRequired }") {{ showLabel ? label : "" }}
    a-select(
      v-model="newValue"
      v-bind="$attrs"
      style="width: 100%"
      @blur="(val) => $emit('blur', val)"
      @change="(val) => $emit('change', val)"
      @search="(val) => $emit('search', val)"
      @popupScroll="(val) => $emit('scroll', val)"
    )
      div(slot="dropdownRender" slot-scope="menu")
        v-nodes(:vnodes="menu")
        a-spin(
          style="padding: 5px 12px"
          :spinning="true"
          v-if="$attrs.loading"
        )
      div(v-if="$attrs.loading" slot="notFoundContent")
      slot
</template>

<script>
import inputMixin from '@/utils/inputMixin.js'

export default {
  name: 'SelectField',
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  mixins: [inputMixin]
}
</script>
