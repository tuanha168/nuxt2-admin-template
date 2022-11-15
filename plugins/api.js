export default function (
  { $auth, $axios, store, redirect, error, $config },
  inject
) {
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
    listUsers: (params) => axios.$get(`users`, { params }),
    showUser: (userId) => axios.$get(`users/${userId}`),
    createUser: (payload) => axios.$post(`users`, payload),
    updateUser: (userId, payload) => axios.$put(`users/${userId}`, payload),
    deleteUser: (userId) => axios.$delete(`users/${userId}`)
  }
  inject('api', api)
}
