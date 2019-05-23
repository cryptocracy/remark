import storageServive from '@/services/blockstack-storage'
import axios from 'axios'

const storageHandler = {
  state: {
    channels: [],
    channelsByCategories: {},
    goldChannels: [],
    silverChannels: [],
    bronzeChannels: [],
    goldFeed: [],
    silverFeed: [],
    bronzeFeed: []
  },
  mutations: {
    MUTATION_SET_CHANNELS (state, payload) {
      state.channels = payload || []
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
    },
    MUTATION_SET_CHANNELS_BY_CATEGORIES (state) {
      state.channelsByCategories = state.channels.reduce((acc, item) => {
        console.log(item)
        if (acc[item.channelLeague]) {
          if (item.profile) {
            item['hubUrl'] = item.profile.apps[window.location.origin] || item.profile.apps['https://remark_cryptocracy_io']
          }
          acc[item.channelLeague].push(item)
        } else {
          acc[item.channelLeague] = []
          if (item.profile) {
            item['hubUrl'] = item.profile.apps[window.location.origin] || item.profile.apps['https://remark_cryptocracy_io']
          }
          acc[item.channelLeague].push(item)
        }
        return acc
      }, {})
    },
    MUTATION_SET_GOLD_FEED (state, payload) {
      if (!payload) {
        state.goldFeed = []
        return
      }
      state.goldFeed.push(payload)
      console.log(state.goldFeed)
    },
    MUTATION_SET_SILVER_FEED (state, payload) {
      if (!payload) {
        state.silverFeed = []
        return
      }
      state.silverFeed.push(payload)
      console.log(state.silverFeed)
    },
    MUTATION_SET_BRONZE_FEED (state, payload) {
      if (!payload) {
        state.bronzeFeed = []
        return
      }
      state.bronzeFeed.push(payload)
      console.log(state.bronzeFeed)
    }
  },
  actions: {
    // fetching my_channels.json file
    async ACTION_GET_CHANNELS (context, payload) {
      const channels = await storageServive.getFile(payload)
      context.commit('MUTATION_SET_CHANNELS', channels)
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
      context.commit('MUTATION_SET_NOTIFICATION', {
        show: true,
        notification:
        `Channel ${payload.type === 'addition' ? 'subscribed' : 'unsubscribed'} successfully.`,
        type: 'success'
      })
    },
    async ACTION_GET_LATEST_FEED (context, payload) {
      await context.dispatch('ACTION_GET_CHANNELS', {
        fileName: 'my_channels.json',
        options: { decrypt: true }
      })
      context.commit('MUTATION_SET_CHANNELS_BY_CATEGORIES')
      await context.dispatch('ACTION_GET_GOLD_FEED', context.state.channelsByCategories.gold)
      context.dispatch('ACTION_GET_SILVER_FEED', context.state.channelsByCategories.silver)
      context.dispatch('ACTION_GET_BRONZE_FEED', context.state.channelsByCategories.bronze)
    },
    async ACTION_GET_GOLD_FEED (context, payload) {
      context.commit('MUTATION_SET_GOLD_FEED')
      if (payload) {
        payload.forEach(async item => {
          let res = await axios.get(item.hubUrl + 'my_sounds.json')
          item.sounds = res.data
          context.commit('MUTATION_SET_GOLD_FEED', item)
        })
      }
    },
    async ACTION_GET_SILVER_FEED (context, payload) {
      context.commit('MUTATION_SET_SILVER_FEED')
      if (payload) {
        payload.forEach(async item => {
          let res = await axios.get(item.hubUrl + 'my_sounds.json')
          item.sounds = res.data
          context.commit('MUTATION_SET_SILVER_FEED', item)
        })
      }
    },
    async ACTION_GET_BRONZE_FEED (context, payload) {
      context.commit('MUTATION_SET_BRONZE_FEED')
      if (payload) {
        payload.forEach(async item => {
          let res = await axios.get(item.hubUrl + 'my_sounds.json')
          item.sounds = res.data
          context.commit('MUTATION_SET_BRONZE_FEED', item)
        })
      }
    }
  },
  getters: {
    getChannels: state => state.channels,
    getGoldFeed: state => state.goldFeed,
    getSilverFeed: state => state.silverFeed,
    getBronzeFeed: state => state.bronzeFeed
  }
}
export default storageHandler
