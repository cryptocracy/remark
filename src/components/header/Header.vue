<template lang="html">
  <div>
    <v-toolbar id='headerTour' dark app clipped-left fixed>
      <!-- Logo and Sidebar toggle icon area -->
      <v-toolbar-title :style="$vuetify.breakpoint.smAndUp ? 'width: 260px; min-width: 250px' : 'min-width: 72px'" class="ml-0 pl-3 d-flex justify-content-between align-items-center">
        <router-link to="/"><span class="brand"><img :src="logo"></span></router-link>
        <v-btn flat icon class="mainMenu" color="white" @click="sideBarToggle()">
          <v-icon>sort</v-icon>
        </v-btn>
      </v-toolbar-title>

      <!-- Search Box -->
      <v-text-field
        dark
        class="hidden-xs-only searchShepherd"
        prepend-icon="search"
        placeholder="Search"
        elevation-5
        style="max-width: 500px; min-width: 128px;box-shadow: none; background: transparent;"
        v-model="searchText"
        @keyup="search"
      >
      </v-text-field>

      <div>
        <v-select
          primary
          style="max-width: 150px;"
          class="pl-3 hidden-xs-only changeSearch"
          placeholder="Select search type"
          :items="selectItems"
          v-model="searchType"
        >
        </v-select>
      </div>
      <!-- Header right side notification and progile menu -->
      <div class="d-flex align-center" style="margin-left: auto">
        <v-btn flat class='livehelp_position' @click="showHelp()">
          <v-icon>live_help
          </v-icon>
        </v-btn>
        <v-btn icon @click.stop="showNotification">
          <v-icon color="white">notifications</v-icon>
        </v-btn>
        <app-avatar-menu></app-avatar-menu>
      </div>
    </v-toolbar>

    <!-- Notification drawer component show hide div -->
    <div :class="[toggleNotification ? 'toggle' : '', 'slide-content']">
      <app-notification></app-notification>
    </div>
  </div>
</template>

<script>
import { eventBus } from '../../main'
import Notifications from '../notifications/Notifications'
import AvatarMenu from './Avatarmenu'
// import logo from '../../assets/img/logo.svg'
import { tourMixin } from '@/helpers/tourHelper'
import logo from '../../assets/img/mic.png'

export default {
  components: {
    'app-notification': Notifications,
    'app-avatar-menu': AvatarMenu
  },
  mixins: [tourMixin],
  data: () => ({
    timer: '',
    toggleNotification: false,
    logo,
    // for dropdown on the rigth hand side of search bar
    selectItems: [
      { text: 'Channels', value: 'channels' },
      { text: 'Tags', value: 'tags' }
    ],
    searchType: 'channels',
    searchText: ''
  }),
  created () {
  },
  watch: {
    searchType () {
      this.$store.commit('MUTATION_SET_SEARCH_TYPE', this.searchType)
      this.$store.commit('MUTATION_SET_SEARCH_STATE', false)
      this.$store.commit('MUTATION_SET_SEARCH_RESULT', [])
      this.searchText = ''
    }
  },
  methods: {
    /**
    * Notification Toggle
    *
    * @type {function}
    * @return {Boolean} true / false based on toggleNotification Data
    */
    showNotification () {
      this.toggleNotification = !this.toggleNotification
    },
    search () {
      const searchText = this.searchText.trim()
      let searchObj = {}
      if (searchText === '') {
        // to remove search page when there is not text in search bar
        this.$store.commit('MUTATION_SET_SEARCH_STATE', false)
        this.$store.commit('MUTATION_SET_SEARCH_RESULT', [])
      } else {
        // searching for results
        if (this.searchType === 'channels') {
          searchObj = {
            endpoint: 'search',
            query: searchText,
            type: 'channels'
          }
        } else if (this.searchType === 'tags') {
          searchObj = {
            endpoint: 'search',
            query: {title: searchText.toLowerCase()},
            type: 'tags'
          }
        }
        this.debounce(this.activateSearch, 800)(searchObj)
      }
    },
    activateSearch (searchObj) {
      this.$store.commit('MUTATION_SET_SEARCH_RESULT', [])
      this.$store.commit('MUTATION_SET_SEARCH_STATE', true)
      this.$store.dispatch('ACTION_GET_SEARCH_RESULT', searchObj)
    },
    debounce (func, delay) {
      return (args) => {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => func.call(this, args), delay)
      }
    },
    sideBarToggle () {
      eventBus.$emit('sidebartoggled')
      this.$store.commit('toggleSidebar')
    }
  }
}
</script>

<style lang="css" scoped>
.v-toolbar {
  background: linear-gradient(to right, #409bf7 , #91c3f7);
  box-shadow: 0 6px 25px 0 rgba(38, 50, 56, 0.2);
}
.livehelp_position {
  position: relative;
  left: 11.6%;
}
.v-toolbar >>> .v-input__slot {
  background: transparent !important;
  border-radius: 0;
  box-shadow: none !important;
  margin-bottom: 0;
}

.v-toolbar >>> .v-btn--icon {
  width: 36px;
  height: 36px;
  flex: 0 0 36px!important;
}

.z-important {
  z-index: 1000000 !important;
}

.v-toolbar >>> .v-toolbar__title {
  padding-left: 0 !important;
}
/* .v-menu__content.menuable__content__active.theme--dark .v-select-list.v-card.theme--dark .v-list.theme--dark{
 background: white !important;
  color: black !important;
} */

</style>
