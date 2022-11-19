<template lang="pug">
validation-observer(ref="form")
  a-row
    a-col(:span="10" :offset="7")
      a-alert(
        :message="errorFromServer"
        type="error"
        show-icon
        v-show="errorFromServer"
        style="margin-bottom: 30px"
      )
  a-form-model(
    :label-col="{ span: 7 }"
    :wrapper-col="{ span: 10 }"
    @submit="handleSubmit"
    @submit.native.prevent
  )
    project-text(
      label="Name"
      vid="name"
      type="text"
      size="large"
      rules="required|max:255"
      :max-length="255"
      v-model="form.name"
    )

    project-upload-file(
      label="Image"
      vid="image"
      :rules="`${form.image ? '' : 'required|'}size:20480|ext:jpg,jpeg,gif,png`"
      :multiple="false"
      accept="image/*"
      type-upload="image"
      v-model="form.image"
      @uploading="handleUpload"
    )

    a-form-model-item(:wrapper-col="{ span: 10, offset: 7 }")
      project-submit-button(
        :label="categoryId ? 'Update' : 'Create'"
        :disabled="uploading"
      )
</template>

<script>
import errorMixin from '@/utils/errorMixin'
import crumbMixin from '@/utils/crumbMixin'
import { CategoryConstant } from '@/config/constant/category'
export default {
  name: 'CategoryForm',
  mixins: [errorMixin, crumbMixin],
  data: () => ({
    categories: [],
    crumbs: _.clone(CategoryConstant.CRUMBS),
    uploading: false,
    form: {
      image: null,
      name: null
    }
  }),
  computed: {
    categoryId() {
      return this.$route.params.categoryId
    }
  },
  async created() {
    this.categoryId && (await this.getCategory())
    let partialCrumb = {
      path: 'new',
      breadcrumbName: 'Create Category'
    }
    if (this.categoryId) {
      const name =
        this.form.name.length > 20
          ? this.form.name.substring(0, 20) + '...'
          : this.form.name
      partialCrumb = {
        path: 'edit',
        breadcrumbName: name
      }
      this.setTitle(name)
    } else {
      this.setTitle('Create Category')
    }
    this.crumbs.push(partialCrumb)
    this.setCrumbs(this.crumbs)
  },
  methods: {
    async getCategory() {
      try {
        this.$loadingPage.open()
        const res = await this.$api.showCategory(this.categoryId)
        this.form = _.assign({}, this.form, res.category)
      } catch (err) {
        this.handleError(err)
      } finally {
        this.$loadingPage.close()
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text
        .toLowerCase()
        .includes(input.toLowerCase())
    },
    handleUpload(status) {
      this.uploading = status
    },
    async handleSubmit() {
      try {
        const valid = await this.$refs.form.validate()
        if (!valid) {
          return this.scrollToError()
        }
        this.$loadingPage.open()
        const formData = new FormData()
        Object.keys(this.form).forEach((key) => {
          formData.append(key, this.form[key])
        })
        let successMsg = 'Edit Successfully.'
        if (this.categoryId) {
          await this.$api.updateCategory(this.categoryId, formData)
        } else {
          await this.$api.createCategory(formData)
          successMsg = 'Create Successfully.'
        }
        this.$message.success(successMsg)
        this.$router.push({ path: '/categories' })
      } catch (err) {
        this.handleError(err)
      } finally {
        this.$loadingPage.close()
      }
    }
  }
}
</script>
