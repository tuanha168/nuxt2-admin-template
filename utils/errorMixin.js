export default {
  data: () => ({
    errorFromServer: ''
  }),
  methods: {
    handleClose() {
      this.errorFromServer = ''
    },
    handleError(err) {
      let errorDetails
      this.errorFromServer = _.get(err, 'response.data.message')
        ? err.response.data.message
        : 'Error'
      if (this.$refs.form && err.response?.data?.meta?.errors) {
        const errors = err.response.data.meta.errors
        for (const property in errors) {
          this.$refs.form.setErrors({
            [property]: errors[property][0]
          })
          if (
            _.includes(
              ['start_at', 'end_at', 'started_at', 'ended_at'],
              property
            )
          ) {
            errorDetails = errors[property][0]
          }
        }
      } else if (err.response?.data?.meta?.errors) {
        const errors = err.response.data.meta.errors
        errorDetails = errors[Object.keys(errors)[0]]
      }
      this.$nextTick(() => {
        this.scrollToError(true)
      })
      return errorDetails
    },
    scrollToError(fromServer = false) {
      let elFirstInValid
      if (fromServer) {
        elFirstInValid = document.querySelector('.ant-alert.ant-alert-error')
      } else {
        elFirstInValid = document.querySelector(
          '.ant-form-item-control.has-error'
        )
      }
      !!elFirstInValid &&
        elFirstInValid.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
    }
  }
}
