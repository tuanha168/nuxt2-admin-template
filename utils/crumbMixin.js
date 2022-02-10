import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions({
      setCrumbs: 'app/setCrumbs',
      setTitle: 'app/setTitle'
    })
  }
}
