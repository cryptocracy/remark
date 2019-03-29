<template>
  <v-app light>
    <div id="app">
      <login v-if="!blockstack.isUserSignedIn()"></login>
      <div v-else>
        <app-header></app-header>
        <app-sidebar/>
        <div :class="isSidebarOpen">
          <transition name="slide-fade" mode="out-in">
            <search-results v-if="isSearching"></search-results>
            <router-view v-else/>
          </transition>
        </div>
        <!--<v-btn fab fixed bottom right dark color="teal accent-4">-->
        <!--<v-icon>add</v-icon>-->
        <!--</v-btn>-->
        <!-- <v-progress-linear v-if="isLoading" :indeterminate="true" class="loading-bar"></v-progress-linear> -->
        <div class="mt-5 text-xs-center loading-bar" v-if="isLoading">
          <v-progress-circular
            :size="70"
            :width="5"
            color="purple accent-4"
            indeterminate
          ></v-progress-circular>
        </div>
        <floating-button/>
        <v-footer class="pa-3" >
          <v-spacer></v-spacer>
          <div>powered by <a href="https://blockstack.org">Blockstack</a> - source code on <a href="https://github.com/cryptocracy/replay">Github</a></div>
        </v-footer>
      </div>

    </div>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import Header from './components/header/Header'
import Sidebar from './components/sidebar/Sidebar'
import Login from './components/Login'
import searchResults from './components/search/Search-results'
import FloatingButton from './components/button/FloatingButton'

export default {
  components: {
    'app-header': Header,
    'app-sidebar': Sidebar,
    'search-results': searchResults,
    login: Login,
    FloatingButton
  },
  name: 'app',

  data: () => ({
    windowWidth: 0,
    blockstack: window.blockstack
  }),
  methods: {
    /**
     * Get window width to toggle sidebar state value
     *
     * @type {function}
     * @return {Boolean} true / false based on sidebarOpen Data
     */
    getWindowWidth () {
      this.windowWidth = document.documentElement.clientWidth
      if (this.windowWidth < 991) {
        this.$store.state.sidebarOpen = false
      } else {
        this.$store.state.sidebarOpen = true
      }
    }
  },

  computed: {
    /**
    * Toggle sidebar
    *
    * @type {function}
    * @return {Boolean} true / false based on sidebarOpen Data
    */
    ...mapGetters({
      isSearching: 'isSearching',
      isLoading: 'isLoading'
    }),
    isSidebarOpen () {
      return {
        'main-wrapper': true,
        'sidebar-open': this.$store.state.sidebarOpen
      }
    }
  },

  mounted () {
    const blockstack = this.blockstack
    if (blockstack.isUserSignedIn()) {
      this.userData = blockstack.loadUserData()
      this.user = new blockstack.Person(this.userData.profile)
      this.user.username = this.userData.username
      this.$store.commit('MUTATION_SET_USER_PROFILE_DATA', this.userData)
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn()
        .then(() => {
          window.location = window.location.origin
        })
    }
    this.$nextTick(() => {
      window.addEventListener('resize', this.getWindowWidth)
      this.getWindowWidth()
    })
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowWidth)
  }
}
</script>

<style media="screen" scoped>

  .slide-fade-enter-active {
    transition: all .2s ease;
  }
  .slide-fade-leave-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateY(10px);
    opacity: 0;

  }
  .fab-mt4 {
    margin-top: 4%;
  }

  .br20 {
    border-radius: 20px;
  }

  .loading-bar {
    position: absolute;
    top: 30%;
    left: 3%;
    width: 100%;
  }

</style>
