const filterService = {
  methods: {
    // mixin methods for updating my_channels.json file
    getHubUrl (profileData) {
      if (profileData && profileData.hasOwnProperty('profile') && typeof profileData.profile.apps === 'object') {
        return profileData.profile.apps['https://remark_cryptocracy_io']
      } else return null
    },
    // // mixin methods for fetching my_channels.json file
    // getChannels () {
    //   this.$store.dispatch('ACTION_GET_CHANNELS', {
    //     fileName: 'my_channels.json',
    //     options: { decrypt: true }
    //   })
    // }
  }
}
export default filterService
