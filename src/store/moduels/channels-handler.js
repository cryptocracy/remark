import storageServive from '@/services/blockstack-storage'
import axios from 'axios'

const storageHandler = {
  state: {
    channels: [],
    userSettings: {}
  },
  mutations: {
    MUTATION_SET_CHANNELS (state, payload) {
      state.channels = payload || []
    },
    MUTATION_SET_USER_SETTINGS (state, payload) {
      state.settings = payload || {}
    },
    // mutation for handling addition and deletion of channels from state.channels
    // for real time data changes
    MUTATION_UPDATE_CHANNELS (state, payload) {
      if (payload.type === 'addition') {
        // if channels is already an array then pushing the changes
        // else creating an array with a new channel
        if (Array.isArray(state.channels)) {
          state.channels.push(payload.channel)
        } else {
          state.channels = [payload.channel]
        }
      } else {
        // case for deletion of array
        state.channels.forEach((item, index) => {
          if (item.fullyQualifiedName === payload.channel.fullyQualifiedName) {
            state.channels.splice(index, 1)
          }
        })
      }
    }
  },
  actions: {
    // fetching my_channels.json file
    async ACTION_GET_CHANNELS (context, payload) {
      const channels = await storageServive.getFile(payload)
      context.commit('MUTATION_SET_CHANNELS', channels)
    },
    // fetching settings.json file
    async ACTION_GET_USER_SETTINGS (context, payload) {
      axios.get(payload.fileName)
        .then((res) => {
          console.log(res)
        })
      const settings = await storageServive.getFile(payload)
      context.commit('MUTATION_SET_USER_SETTINGS', channels)
    },
    // updating channels in my_channels.json file
    ACTION_UPDATE_CHANNELS (context, payload) {
      // updating channels list in state.channels and my_channels.json file
      context.commit('MUTATION_UPDATE_CHANNELS', payload)
      storageServive.putFile({
        fileName: payload.fileName,
        data: context.state.channels,
        options: payload.options
      })
    }
  },
  getters: {
    getChannels: state => state.channels,
    getUserSettings: state => state.userSettings
  }
}
export default storageHandler
