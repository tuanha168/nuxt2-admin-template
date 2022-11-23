<template lang="pug">
div
  validation-provider(
    :vid="vid"
    :name="label"
    :rules="rules"
    v-slot="slotProps"
    ref="fileUpload"
  )
    a-form-model-item.multi-uploader(
      :validate-status="resolveState(slotProps)"
      :colon="colon"
      :help="slotProps.errors[0]"
      :wrapper-col="{ span: 12 }"
    )
      template(slot="label")
        span(:class="{ 'ant-form-item-required': isRequired }") {{ showLabel ? label : "" }}

      a-row.multi-file-uploader
        a-col(:span="8" v-for="(item, index) in value" :key="index")
          a-upload.avatar-uploader(
            :name="vid"
            list-type="picture-card"
            :disabled="disabled"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :custom-request="(file) => { handleUpload(file, index); }"
            :accept="accept"
          )
            transition(name="fade-transform")
              .action(v-show="item")
                a-button(
                  v-if="!isFileUpload"
                  type="primary"
                  shape="circle"
                  icon="eye"
                  size="small"
                  @click.stop="handlePreview(item)"
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
                  @click.stop="handleRemove(index)"
                )
            template(v-if="item")
              img(v-show="isImageUpload" :src="previewFiles[index]" alt="")
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
              a-progress(:percent="uploadingList[index]" size="small")
            p.error-from-server(v-show="errorFromServer") {{ errorFromServer }}
        a-col(:span="8" v-if="value.length < max")
          a-upload.avatar-uploader(
            :name="vid"
            list-type="picture-card"
            :disabled="disabled"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :custom-request="handleUpload"
            :accept="accept"
          )
            div
              a-progress(
                :percent="uploadingPercent"
                size="small"
                v-if="uploading"
              )
              template(v-else)
                a-icon(type="plus")
                .ant-upload-text アップロード
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
      :src="previewUrl"
    )
    video(
      v-if="previewVisible && isVideoUpload"
      width="100%"
      height="auto"
      controls
    )
      source(:src="previewUrl")
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
  name: 'UploadMultiFile',
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
    },
    max: {
      type: Number,
      default: 5
    }
  },
  data: () => ({
    previewVisible: false,
    uploadingPercent: 0,
    uploading: false,
    previewUrl: null,
    errorFromServer: null,
    uploadingList: 0,
    previewFiles: []
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
  watch: {
    async value(val) {
      this.previewFiles = await Promise.all(
        val.map((item) => {
          if (typeof item === 'string') {
            return item
          }
          return getBase64(item)
        })
      )
    }
  },
  methods: {
    beforeUpload(file) {
      this.errorFromServer = null
      this.$refs.fileUpload.reset()
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        const { valid } = await this.$refs.fileUpload.validate(file)
        return valid ? resolve() : false
      })
    },
    async handleUpload({ file }, index) {
      try {
        this.$emit('uploading', true)
        this.previewUrl = null
        this.$refs.fileUpload.reset()
        const valid = await this.$refs.fileUpload.validate(file)
        if (!valid) return
        if (index >= 0) {
          this.newValue[index] = null
          this.newValue = [...this.newValue]
        } else {
          this.uploading = true
        }
        // const self = this
        // const res = await this.$uploadFileToS3(
        //   file,
        //   function (uploadingPercent) {
        //     if (index >= 0) {
        //       const temp = {}
        //       temp[index] = uploadingPercent
        //       self.uploadingList = { ...temp }
        //     } else {
        //       self.uploadingPercent = uploadingPercent
        //     }
        //   }
        // )
        if (index >= 0) {
          this.newValue[index] = file
          this.newValue = [...this.newValue]
          this.previewFiles[index] = await getBase64(file)
        } else {
          this.newValue.push(file)
          this.previewFiles.push(await getBase64(file))
        }
      } catch (err) {
        this.previewUrl = null
        this.errorFromServer = _.get(err, 'response.data.meta.message')
          ? err.response.data.meta.message
          : 'Something went wrong.'
        if (err.response && err.response.data.meta.errors) {
          this.errorFromServer = err.response.data.meta.errors.file_upload[0]
        }
      } finally {
        if (index >= 0) {
          this.uploadingList[index] = 0
        } else {
          this.uploadingPercent = 0
          this.uploading = false
        }
        this.$emit('uploading', false)
      }
    },
    handlePreview(url) {
      this.previewUrl = url
      this.previewVisible = true
    },
    handleRemove(index) {
      this.newValue.splice(index, 1)
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
.multi-uploader {
  .ant-form-item-control {
    line-height: 1 !important;
  }
  .avatar-uploader {
    margin-top: 10px;
    .ant-upload {
      position: relative;
      width: 128px;
      height: 128px;
      img {
        max-width: 112px;
        max-height: 112px;
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

  .ant-form-explain {
    margin-top: 1.5em;
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
.message_multi-file {
  position: absolute;
  bottom: -3em;
  font-style: italic;
  font-size: 0.9em;
}
</style>
