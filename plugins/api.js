export default function ({ $auth, $axios, error, $config }, inject) {
  const axios = $axios.create({
    headers: {
      common: {
        ContentType: 'application/json',
        Accept: 'application/json'
      }
    }
  })

  axios.onError((err) => {
    const code = parseInt(err.response && err.response.status)
    if ([401, 500, 503].includes(code)) {
      error({
        statusCode: code,
        message: err.response.data.meta.message
      })
    }
  })

  axios.onRequest((config) => {
    const domainFromUrl = config.url.match(/^(?:\/\/|[^/]+)*/g)
    const token = $auth.strategy.token.get()
    if (token) {
      if (
        domainFromUrl &&
        domainFromUrl[0].includes('https') &&
        domainFromUrl !== config.baseURL
      )
        return
      config.headers.Authorization = token
    }
  })

  const api = {
    // User
    listUsers: (params) => axios.$get(`auth/users`, { params }),
    userDetails: (id) => axios.$get(`auth/users/${id}`),

    // Upload
    getPreSignedUrl: () =>
      axios.post(`${$config.userApiVeosUrl}/files/temporary-url`),

    uploadImageByPreSignedUrl: (preSignedUrl, file, callback = false) => {
      const { type, name } = file
      const convertedName = unescape(encodeURIComponent(name))
      return axios.$put(preSignedUrl, file, {
        onUploadProgress: (progressEvent) => {
          const uploading = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          callback && callback(uploading)
        },
        headers: {
          'Content-Type': type,
          'Content-Disposition': `attachment; filename="${convertedName}"`
        }
      })
    }
  }
  inject('api', api)
}
