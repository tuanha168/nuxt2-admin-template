<template lang="pug">
.login-page
  .login-form
    validation-observer(ref="form" v-slot="{ passes }")
      a-form-model.user-layout-login(
        layout="vertical"
        @submit="passes(handleSubmit)"
        @submit.native.prevent
      )
        .user-login-input
          project-text(
            label="ID"
            vid="email"
            type="text"
            rules="required|email|max:255"
            :max-length="255"
            v-model="form.email"
          )

          project-text(
            label="Password"
            vid="password"
            type="password"
            rules="required"
            v-model="form.password"
          )

        project-submit-button.login-button(label="Login")
</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'common',
  data: () => ({
    form: {
      email: '',
      password: ''
    }
  }),
  head: () => ({
    title: 'Login',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Login Page'
      }
    ]
  }),
  methods: {
    async handleSubmit() {
      try {
        this.$loadingPage.open()
        await this.$auth.loginWith('local', {
          data: { ...this.form }
        })
        this.$router.push({ path: '/' })
        this.$message.success('Login successfully')
      } catch (err) {
        let errorFromServer = 'Error'
        if (_.get(err, 'response.data.meta.message')) {
          errorFromServer = err.response.data.meta.message
        }
        this.$refs.form.setErrors({
          email: errorFromServer
        })
      } finally {
        this.$loadingPage.close()
      }
    }
  }
}
</script>
