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
    project-select(
      label="Category"
      vid="category"
      size="large"
      placeholder="Please select category"
      rules="required"
      v-model="form.category"
      :disabled="loadingCat"
      :loading="loadingCat"
      :filter-option="filterOption"
    )
      a-select-option(
        v-for="category in categories"
        :key="category._id"
        :value="category._id"
      ) {{ category.name }}

    project-text(
      label="Name"
      vid="name"
      type="text"
      size="large"
      rules="required|max:255"
      :max-length="255"
      v-model="form.name"
    )

    project-date-picker(
      label="Release date"
      vid="release_date"
      size="large"
      rules="required"
      v-model="form.release_date"
    )

    project-textarea(
      label="Description"
      vid="description"
      size="large"
      rules="max:1000"
      :max-length="1000"
      v-model="form.description"
    )

    project-text(
      label="Developer"
      vid="developer"
      type="text"
      size="large"
      rules="required|max:255"
      :max-length="255"
      v-model="form.developer"
    )

    project-text(
      label="Publisher"
      vid="publisher"
      type="text"
      size="large"
      rules="required|max:255"
      :max-length="255"
      v-model="form.publisher"
    )

    project-number(
      label="Price"
      vid="price"
      size="large"
      rules="required"
      v-model="form.price"
    )

    project-number(
      label="Discount"
      vid="discount"
      size="large"
      rules="required"
      v-model="form.discount"
    )

    project-upload-file(
      label="Banner"
      vid="feature_image"
      :rules="`${form.feature_image ? '' : 'required|'}image|size:10240`"
      :multiple="false"
      accept="image/*"
      type-upload="image"
      v-model="form.feature_image"
      @uploading="handleUpload"
    )
    project-upload-multi-file(
      label="Images"
      vid="images"
      :rules="`${form.images.length > 0 ? '' : 'required|'}image|size:10240`"
      accept="image/*"
      max="3"
      v-model="form.images"
      @uploading="handleUpload"
    )

    a-form-model-item(:wrapper-col="{ span: 10, offset: 7 }")
      project-submit-button(
        :label="gameId ? 'Update' : 'Create'"
        :disabled="uploading"
      )
</template>

<script>
import errorMixin from '@/utils/errorMixin'
import crumbMixin from '@/utils/crumbMixin'
import { GameConstant } from '@/config/constant/game'
export default {
  name: 'GameForm',
  mixins: [errorMixin, crumbMixin],
  data: () => ({
    categories: [],
    crumbs: _.clone(GameConstant.CRUMBS),
    loadingCat: false,
    uploading: false,
    form: {
      category: null,
      name: null,
      description: null,
      developer: null,
      publisher: null,
      price: 0,
      discount: 0,
      images: [],
      feature_image: null,
      release_date: null
    }
  }),
  computed: {
    gameId() {
      return this.$route.params.gameId
    }
  },
  async created() {
    this.getCategories()
    this.gameId && (await this.getGame())
    let partialCrumb = {
      path: 'new',
      breadcrumbName: 'Create Game'
    }
    if (this.gameId) {
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
      this.setTitle('Create Game')
    }
    this.crumbs.push(partialCrumb)
    this.setCrumbs(this.crumbs)
  },
  methods: {
    async getGame() {
      try {
        this.$loadingPage.open()
        const res = await this.$api.showGame(this.gameId)
        this.form = _.assign({}, this.form, res.game)
        this.form.release_date = this.$moment(this.form.release_date)
        this.form.category = res.game?.category._id
      } catch (err) {
        this.handleError(err)
      } finally {
        this.$loadingPage.close()
      }
    },
    async getCategories() {
      try {
        this.loadingCat = true
        const res = await this.$api.listCategories()
        this.categories = _.assign({}, this.categories, res.categories)
      } catch (err) {
        this.handleError(err)
      } finally {
        this.loadingCat = false
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
        if (this.gameId) {
          await this.$api.updateGame(this.gameId, formData)
        } else {
          await this.$api.createGame(formData)
          successMsg = 'Create Successfully.'
        }
        this.$message.success(successMsg)
        this.$router.push({ path: '/games' })
      } catch (err) {
        this.handleError(err)
      } finally {
        this.$loadingPage.close()
      }
    }
  }
}
</script>
