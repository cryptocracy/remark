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
    toggleLoading: (state, payload) => {
      state.isLoading = payload || !state.isLoading
    },
    MUTATION_CHANGE_SETTINGS (state, payload) {
      state.settings = payload
    }
  },
  getters: {
    isLoading: state => state.isLoading,
    getSettings: state => state.settings
  }
})
