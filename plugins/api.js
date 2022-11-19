export default function ({ $axios, error, app }, inject) {
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
    const token = app.$auth.strategy.token.get()
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

    // Games
    listGames: (params) => axios.$get(`games`, { params }),
    showGame: (gameId) => axios.$get(`games/${gameId}`),
    createGame: (payload) =>
      axios.$post(`games`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    updateGame: (gameId, payload) => axios.$put(`games/${gameId}`, payload),
    deleteGame: (gameId) => axios.$delete(`games/${gameId}`),

    // Categories
    listCategories: (params) => axios.$get(`categories`, { params }),
    showCategory: (categoryId) => axios.$get(`categories/${categoryId}`),
    createCategory: (payload) => axios.$post(`categories`, payload),
    updateCategory: (categoryId, payload) =>
      axios.$put(`categories/${categoryId}`, payload),
    deleteCategory: (categoryId) => axios.$delete(`categories/${categoryId}`)
  }
  inject('api', api)
}
