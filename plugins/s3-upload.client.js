export default ({ app }, inject) => {
  const uploadFileToS3 = async (file, callback) => {
    const res = await app.$api.getPreSignedUrl()
    const { url, path } = res.data.data
    return Promise.all([
      path,
      app.$api.uploadImageByPreSignedUrl(url, file, callback)
    ])
  }
  inject('uploadFileToS3', uploadFileToS3)
}
