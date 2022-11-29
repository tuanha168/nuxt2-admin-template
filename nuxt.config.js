import webpack from 'webpack'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  target: 'static',

  loadingIndicator: {
    name: 'folding-cube',
    color: '#3B8070',
    background: 'white'
  },

  router: {
    middleware: ['auth']
  },

  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.API_URL
    }
  },
  privateRuntimeConfig: {},

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - ADMIN',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500&display=swap'
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['ant-design-vue/dist/antd.css', 'assets/style/scss/main.scss'],

  loading: false,

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/antd-ui',
    '@/plugins/vee-validate',
    '@/plugins/loading-page',
    '@/plugins/s3-upload.client',
    '@/plugins/custom-listener'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    { path: '@/components/inputs/', prefix: 'project' },
    { path: '@/components/utils/', prefix: 'project' }
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/moment'
  ],

  auth: {
    resetOnError: true,
    plugins: ['@/plugins/api.js'],
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/login',
      home: false
    },
    cookie: {
      prefix: 'auth.',
      options: {
        path: '/',
        maxAge: parseInt(process.env.MAX_AGE),
        secure: process.env.COOKIE_SECURE === 'true'
      }
    },
    localStorage: {
      prefix: 'auth.',
      options: {
        path: '/',
        maxAge: parseInt(process.env.MAX_AGE),
        secure: process.env.COOKIE_SECURE === 'true'
      }
    },
    strategies: {
      local: {
        token: {
          property: 'token',
          global: false
        },
        user: {
          property: 'user'
        },
        endpoints: {
          login: {
            url: `auth/login`,
            method: 'post'
          },
          logout: false,
          user: {
            url: `auth/profile`,
            method: 'get'
          }
        }
      }
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  styleResources: {
    scss: ['@/assets/style/scss/variables/*.scss']
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    plugins: [
      new webpack.ProvidePlugin({
        _: 'lodash'
      })
    ],
    transpile: ['vee-validate/dist/rules']
  }
}
