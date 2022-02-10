import { mapGetters, mapActions } from 'vuex'
import { deviceEnquire, DEVICE_TYPE } from '@/utils/device'

export default {
  computed: {
    ...mapGetters({
      device: 'app/device',
      sidebarOpened: 'app/sidebarOpened'
    })
  },
  mounted() {
    deviceEnquire((deviceType) => {
      switch (deviceType) {
        case DEVICE_TYPE.DESKTOP:
          this.toggleDevice('desktop')
          this.setSidebar(true)
          break
        case DEVICE_TYPE.TABLET:
          this.toggleDevice('tablet')
          this.setSidebar(false)
          break
        case DEVICE_TYPE.MOBILE:
        default:
          this.toggleDevice('mobile')
          this.setSidebar(true)
          break
      }
    })
  },
  methods: {
    ...mapActions({
      setSidebar: 'app/setSidebar',
      toggleDevice: 'app/toggleDevice'
    }),
    isMobile() {
      return this.device === DEVICE_TYPE.MOBILE
    },
    isDesktop() {
      return this.device === DEVICE_TYPE.DESKTOP
    },
    isTablet() {
      return this.device === DEVICE_TYPE.TABLET
    }
  }
}
