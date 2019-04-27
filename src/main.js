// Font Awesome v5 icons
import 'font-awesome/css/font-awesome.css'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueClipboard from 'vue-clipboard2'
// Google map vue plugin
// import * as VueGoogleMaps from 'vue2-google-maps'
// OpenStreetMaps
import 'leaflet/dist/leaflet.css'
import 'shepherd.js/dist/css/shepherd-theme-square.css'
import App from './App'
import router from './router'
// Import layout file to use for all
import Layout from './layouts/Layout'

/* Import Vendor styles and main style files */
import './assets/sass/vendors/font-awesome/font-awesome.scss'
import './assets/sass/vendor-styles.scss'
import './assets/sass/App.scss'

/* Import Vuetify stylesheets for material deisgn */
import '../node_modules/vuetify/dist/vuetify.min.css'
import * as blockstack from 'blockstack'
/* Import store */
import store from './store/store'

// window.blockstack = require('blockstack')
const appConfig = new blockstack.AppConfig(['store_write', 'publish_data'])
window.BlockstackUserSession = new blockstack.UserSession({ appConfig })
window.blockstack = blockstack
Vue.config.productionTip = false

Vue.use(VueClipboard)

/* Initialize Vuetify for app */
Vue.use(Vuetify, {
  theme: {
    primary: '#409bf7'
  },
  iconfont: 'fa'
})
// eslint-disable-next-line
export const eventBus = new Vue();
// dummy global function for empty @click functions
window.dummyFunction = function () {}
Vue.prototype.dummyFunction = window.dummyFunction

// Vue.use(VueGoogleMaps, {
//   load: {
//     key: 'AIzaSyDLAOmejqle801yXt-mKafbYH4rwLIK2ts',
//     libraries: 'places' // This is required if you use the Autocomplete plugin
//     // OR: libraries: 'places,drawing'
//     // OR: libraries: 'places,drawing,visualization'
//     // (as you require)
//   }
// })

/** Globally register layout component */
Vue.component('app-layout', Layout)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  // Attach the Vue instance to the window,
  // so it's available globally.
  created: () => { window.Vue = this },
  router,
  render: h => h(App)
})
