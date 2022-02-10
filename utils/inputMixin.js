export default {
  props: {
    value: {
      type: null,
      default: '',
      required: true
    },
    vid: {
      type: String,
      default: ''
    },
    rules: {
      type: [Object, String],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    subLabel: {
      type: String,
      default: ''
    },
    colon: {
      type: Boolean,
      default: true
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    hasFeedback: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    newValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    isRequired() {
      return !!(
        (typeof this.rules === 'string' &&
          _.includes(this.rules, 'required')) ||
        (typeof this.rules === 'object' && this.rules.required)
      )
    }
  },
  methods: {
    trimInput() {
      this.newValue = _.trim(this.newValue)
    },
    resolveState({ errors, pending, valid }) {
      if (errors[0]) return 'error'
      if (pending || this.loading) return 'validating'
      if (valid) return 'success'
      return ''
    }
  }
}
