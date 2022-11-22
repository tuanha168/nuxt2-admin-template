<template lang="pug">
div
  validation-provider(
    :vid="vid"
    :name="label"
    :rules="rules"
    v-slot="slotProps"
    ref="fileUpload"
  )
    a-form-model-item.uploader(
      :validate-status="resolveState(slotProps)"
      :colon="colon"
      :help="slotProps.errors[0]"
    )
      template(slot="label")
        span(:class="{ 'ant-form-item-required': isRequired }") {{ showLabel ? label : "" }}

      a-upload.avatar-uploader(
        :name="vid"
        list-type="picture-card"
        :disabled="disabled"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        :custom-request="handleUpload"
        :accept="accept"
        @change="handleChange"
      )
        transition(name="fade-transform")
          .action(v-show="newValue")
            a-button(
              v-if="!isFileUpload"
              type="primary"
              shape="circle"
              icon="eye"
              size="small"
              @click.stop="handlePreview"
            )
            a-button(
              v-else
              type="primary"
              shape="circle"
              icon="download"
              size="small"
              @click.stop="handleDownloadFile"
            )
            a-button(
              type="danger"
              shape="circle"
              icon="delete"
              size="small"
              v-show="!disabled"
              @click.stop="handleRemove"
            )

        template(v-if="newValue")
          img(
            v-show="isImageUpload"
            :src="filePreview ? filePreview : newValue"
            alt="avatar"
          )
          a-icon(
            v-show="isFileUpload"
            type="file-pdf"
            style="font-size: 100px"
          )
          a-icon(
            v-show="isVideoUpload"
            type="play-square"
            style="font-size: 100px"
          )
        div(v-else)
          a-progress(:percent="uploadingPercent" size="small" v-if="uploading")
          template(v-else)
            a-icon(type="plus")
            .ant-upload-text Upload
        p.error-from-server(v-show="errorFromServer") {{ errorFromServer }}

  a-modal(
    :visible="previewVisible"
    :footer="null"
    @cancel="handleCancel"
    v-if="newValue"
  )
    a-icon(
      slot="closeIcon"
      type="close-circle"
      theme="twoTone"
      :style="{ fontSize: '22px' }"
    )
    img(
      v-show="isImageUpload"
      alt="img-preview"
      style="width: 100%"
      :src="filePreview ? filePreview : newValue"
    )
    video(
      v-if="previewVisible && isVideoUpload"
      width="100%"
      height="auto"
      controls
    )
      source(:src="filePreview ? filePreview : newValue")
</template>

<script>
import inputMixin from '@/utils/inputMixin.js'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default {
  name: 'UploadFile',
  mixins: [inputMixin],
  props: {
    accept: {
      type: String,
      default: () => null
    },
    typeUpload: {
      type: String,
      validator: (value) => _.includes(['image', 'file', 'video'], value),
      default: 'image'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    previewVisible: false,
    uploadingPercent: 0,
    uploading: false,
    filePreview: null,
    errorFromServer: null
  }),
  computed: {
    isImageUpload() {
      return this.typeUpload === 'image'
    },
    isFileUpload() {
      return this.typeUpload === 'file'
    },
    isVideoUpload() {
      return this.typeUpload === 'video'
    }
  },
  methods: {
    beforeUpload(file) {
      this.handleRemove()
      this.filePreview = null
      this.errorFromServer = null
      this.$refs.fileUpload.reset()
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, _reject) => {
        const { valid } = await this.$refs.fileUpload.validate(file)
        return valid ? resolve() : false
      })
    },
    async handleChange(info) {
      this.filePreview = await getBase64(info.file.originFileObj)
    },
    async handleUpload({ file }) {
      try {
        this.$emit('uploading', true)
        this.handleRemove()
        this.filePreview = null
        this.$refs.fileUpload.reset()
        const valid = await this.$refs.fileUpload.validate(file)
        if (!valid) return
        this.uploading = true
        // const self = this
        // const res = await this.$uploadFileToS3(
        //   file,
        //   function (uploadingPercent) {
        //     self.uploadingPercent = uploadingPercent
        //   }
        // )
        // this.newValue = res[0]
        this.newValue = file
      } catch (err) {
        this.filePreview = null
        this.errorFromServer = _.get(err, 'response.data.meta.message')
          ? err.response.data.meta.message
          : 'Something went wrong.'
        if (err.response && err.response.data.meta.errors) {
          this.errorFromServer = err.response.data.meta.errors.file_upload[0]
        }
      } finally {
        this.uploadingPercent = 0
        this.uploading = false
        this.$emit('uploading', false)
      }
    },
    handlePreview() {
      this.previewVisible = true
    },
    handleRemove() {
      this.newValue = null
    },
    handleCancel() {
      this.previewVisible = false
    },
    handleDownloadFile() {
      const fileLink = document.createElement('a')
      const temp = this.newValue.split('/')
      const fileName = temp[temp.length - 1]
      fileLink.href = this.newValue
      fileLink.setAttribute('download', fileName)
      document.body.appendChild(fileLink)
      fileLink.click()
    }
  }
}
</script>

<style lang="scss">
.uploader {
  .ant-form-item-control {
    line-height: 1 !important;
    position: relative;
  }
  .avatar-uploader {
    .ant-upload {
      position: relative;
      width: 128px;
      height: 128px;
      img {
        max-width: 100%;
        height: auto;
      }
    }
  }
  .ant-upload-select-picture-card .anticon-plus,
  .ant-upload-select-picture-card .anticon-loading {
    font-size: 32px;
    color: #999;
  }
  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .ant-upload.ant-upload-select-picture-card {
    margin: 0;
  }
}
.action {
  position: absolute;
  top: 0;
  right: -34px;
  .ant-btn {
    display: block;
    margin-bottom: 5px;
  }
}
.error-from-server {
  color: #f5222d;
  position: absolute;
  bottom: -19px;
  left: 0;
  white-space: nowrap;
  font-size: 0.8rem;
}
.message_upload {
  position: absolute;
  top: -4em;
  left: 11em;
  font-style: italic;
  font-size: 0.9em;
}
</style>
