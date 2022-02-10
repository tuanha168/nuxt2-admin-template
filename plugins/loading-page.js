export default ({ store }, inject) => {
  inject('loadingPage', {
    open() {
      store.dispatch('app/setLoadingStatus', true)
    },
    close() {
      store.dispatch('app/setLoadingStatus', false)
    }
  })
}
