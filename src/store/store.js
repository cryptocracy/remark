import Vue from 'vue'
import Vuex from 'vuex'
import notifications from './moduels/notifications'
import teams from './moduels/teams'
import searchHandler from './moduels/search-handler'
import channelsHandler from './moduels/channels-handler'
import userProfileData from './moduels/profileData'
import transactionsHandler from '@/store/moduels/transactions-handler'
import cryptocracyHandler from '@/store/moduels/cryptocracy-handler'

Vue.use(Vuex)

// All store data should place inside state as a central store
const stateObject = {
  audioUrl: String,
  soundObject: Object,
  playlistArr: [],
  notification: String,
  showNotification: false,
  showPlayer: false,
  notifications,
  teams,
  sidebarOpen: true,
  isLoading: false,
  pay_to: {},
  hubUrl: '',
  BTCAddress: '',
  settings: {
    distanceUnit: 'mi',
    searchRadius: 150,
    latitude: 45.5122,
    longitude: -122.6587
  }
}

export default new Vuex.Store({
  state: stateObject,
  modules: {
    userProfileData,
    searchHandler,
    channelsHandler,
    transactionsHandler,
    cryptocracyHandler
  },
  mutations: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    MUTATION_SET_NOTIFICATION: (state, payload) => {
      state.showNotification = payload.show || false
      state.notification = payload.notification
    },
    MUTATION_SET_SOUND: (state, payload) => {
      state.soundObject = {}
      state.soundObject = payload
      state.audioUrl = payload.sound
      // state.playlistArr = []
      // state.playlistArr.push(payload)
      state.showPlayer = true
    },
    MUTATION_ADD_TO_PLAYLIST: (state, payload) => {
      if (state.playlistArr.length === 0 && Object.keys(state.soundObject).length === 0) {
        state.audioUrl = payload.sound
        state.soundObject = payload
      }
      if (state.playlistArr.indexOf(payload) === -1) {
        state.playlistArr.push(payload)
      }
      state.showPlayer = true
    },
    MUTATION_REMOVE_FROM_PLAYLIST: (state, index) => {
      state.playlistArr.splice(index, 1)
    },
    MUTATION_HIDE_PLAYER: (state, payload) => {
      state.audioUrl = ''
      state.soundObject = {}
      state.playlistArr = []
      state.showPlayer = false
    },
    toggleLoading: (state, payload) => {
      state.isLoading = payload || !state.isLoading
    },
    MUTATION_CHANGE_SETTINGS (state, payload) {
      state.settings = payload
    }
  },
  getters: {
    isLoading: state => state.isLoading,
    showNotification: state => state.showNotification,
    notification: state => state.notification,
    playlistArr: state => state.playlistArr,
    soundObject: state => state.soundObject,
    showPlayer: state => state.showPlayer,
    getSettings: state => state.settings
  }
})
