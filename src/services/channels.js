const channelService = {
  methods: {
    // mixin methods for updating my_channels.json file
    updateChannels (channel, type) {
      this.$store.dispatch('ACTION_UPDATE_CHANNELS', {
        fileName: 'my_channels.json',
        channel,
        type,
        options: { encrypt: true }
      })
    },
    // mixin methods for fetching my_channels.json file
    getChannels () {
      this.$store.dispatch('ACTION_GET_CHANNELS', {
        fileName: 'my_channels.json',
        options: { decrypt: true }
      })
    }
  }
}
export default channelService
