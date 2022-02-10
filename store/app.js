export const state = () => ({
  sidebar: true,
  device: 'desktop',
  loading: false,
  crumbs: null,
  title: null
})

export const getters = {
  sidebarOpened: (state) => state.sidebar,
  device: (state) => state.device,
  loading: (state) => state.loading,
  crumbs: (state) => state.crumbs,
  title: (state) => state.title
}

export const mutations = {
  SET_SIDEBAR_TYPE: (state, type) => {
    state.sidebar = type
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LOADING_STATUS(state, payload) {
    state.loading = payload
  },
  SET_CRUMBS(state, payload) {
    state.crumbs = _.cloneDeep(payload)
  },
  SET_TITLE(state, payload) {
    state.title = payload
  }
}

export const actions = {
  setSidebar({ commit }, type) {
    commit('SET_SIDEBAR_TYPE', type)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setLoadingStatus({ commit }, status) {
    commit('SET_LOADING_STATUS', status)
  },
  setCrumbs({ commit }, crumbs) {
    commit('SET_CRUMBS', crumbs)
  },
  setTitle({ commit }, title) {
    commit('SET_TITLE', title)
  }
}
