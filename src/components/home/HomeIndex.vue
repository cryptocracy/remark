<template lang="html">
  <div class="container-fluid">
    <div>
      <v-layout transition="slide-y-transition" row class="mt-0 mb-3" :class="proximitySearchResult.length > 0 ? 'map-wrapper' : 'map-wrapper-ini'" v-if="proximitySearchResult">
        <v-flex col >
          <v-subheader class="pl-0 mt-0"></v-subheader>
          <!-- <span v-if="proximitySearchResult.length > 0" color="grey"></span>
          <span v-else color="grey"></span> -->
          <OpenMapWithMultipleMarkers
            v-if="proximitySearchResult"
            :markers="proximitySearchResult"
            :center="mapCenter"
            @updateMap="getNewData"
            class="dashboardMap"
          >
          </OpenMapWithMultipleMarkers>
        </v-flex>
      </v-layout>
      <app-box></app-box>

      <v-layout row flex-wrap>
        <v-flex md6>
          <app-layout
            height="300px"
            title="Wallet Input (Received)"
            :children="LineChart"
            class='walletInput'
            :showGraph="showDonationGraph"
            error_message_title = "No Donations found."
            error_message="Be patient, it may take time for other users to show interest in your content."
          >
          </app-layout>
        </v-flex>
        <v-flex md6>
          <app-layout
            height="300px"
            title="Wallet Output (Payouts)"
            :children="BarChart"
            class='walletOutput'
            :showGraph="showPayoutGraph"
            error_message_title = "No Payouts found."
            error_message="Looks like you have not initiated any payouts yet."
          >
          </app-layout>
        </v-flex>

        <!-- <v-flex md12>
          <app-layout
            title="User Table"
            :children="UserTable"
          >
          </app-layout>
        </v-flex>-->
      </v-layout>
    </div>

  </div>
</template>

<script>
import BoxWrapper from '@/components/icon-box/BoxWrapper'
import LineChart from '@/components/charts/line-chart/LineChart'
import BarChart from '@/components/charts/bar-chart/BarChart'
import storageService from '@/services/blockstack-storage'
import OpenMapWithMultipleMarkers from '@/components/maps/OpenMapWithMultipleMarkers'
import { mapGetters } from 'vuex'

export default {
  components: {
    'app-box': BoxWrapper,
    OpenMapWithMultipleMarkers
  },
  computed: {
    ...mapGetters({
      isSearching: 'isSearching',
      isResolved: 'isResolved',
      searchResult: 'getSearchResult',
      showDonationGraph: 'showDonationGraph',
      showPayoutGraph: 'showPayoutGraph',
      settings: 'getSettings',
      proximitySearchResult: 'getProximitySearchResult'
    })
  },
  data: () => ({
    LineChart,
    BarChart,
    timer: null,
    mapCenter: {
      lat: '',
      lng: '',
      radius: ''
    }
  }),
  created () {
    this.$store.dispatch('ACTION_GET_TRANSACTIONS_DATA')
    this.$store.dispatch('ACTION_GET_QUORUM_DATA', { sort: 'pop' })
    storageService.getFile({
      fileName: 'settings.json',
      options: {decrypt: true}
    }).then(res => {
      if (res) {
        this.$store.commit('MUTATION_CHANGE_SETTINGS', res)
        this.searchProximity({ settings: res })
      } else {
        this.searchProximity({ settings: this.settings })
        this.createFile()
      }
      this.mapCenter = {
        lat: res ? res.latitude : this.settings.latitude,
        lng: res ? res.longitude : this.settings.longitude
      }
    })
  },
  methods: {
    createFile () {
      storageService.putFile({
        fileName: 'settings.json',
        data: this.settings,
        options: {encrypt: true}
      })
    },
    searchProximity (paramObj) {
      let {settings, query} = paramObj
      let proximityQuery = query || {
        lat: settings.latitude,
        lng: settings.longitude,
        distance: settings.searchRadius,
        unit: settings.distanceUnit
      }
      this.$store.dispatch('ACTION_PROXIMITY_SEARCH', proximityQuery)
    },
    getNewData (center) {
      let query = {
        lat: center.lat,
        lng: center.lng,
        distance: this.settings.searchRadius,
        unit: this.settings.distanceUnit
      }
      this.debounce(this.searchProximity, 1000)({ query })
      // this.timer = setTimeout(this.searchProximity({ query }), 500)
    },
    debounce (func, delay) {
      return (args) => {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => func.call(this, args), delay)
      }
    }
  }
}
</script>

<style scoped lang="css">
span {
  color: grey
}
/* .map-wrapper-ini {
  padding-bottom: 37.5%;
}
.map-wrapper {
  padding-bottom: 0%
} */
</style>
