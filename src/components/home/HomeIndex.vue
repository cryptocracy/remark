<template lang="html">
  <div class="container-fluid">
    Coming Soon
    <div>
      <v-layout row flex-wrap>
        <v-flex md12>
          <v-card class="br20">
            <v-card-text>
              <v-layout row>
                <v-flex class="space-between">
                  <h4 class="inline-block">COMING SOON</h4>
                </v-flex>
              </v-layout>
              <div></div>
              <div class="v-list__tile__sub-title">DETAIL</div>
              <div class="v-list__tile__sub-title">Storage URL: <span>URL</span></div>
            </v-card-text>
            <v-tooltip bottom>
              <v-btn :disabled="!lazyLoadedData[item.contentUrl]" v-if="!isAdded" @click="$store.commit('MUTATION_ADD_TO_PLAYLIST', lazyLoadedData[item.contentUrl]); isAdded = true" color="primary" slot="activator" round icon ><v-icon>playlist_add</v-icon></v-btn>
              <v-btn v-else  color="primary" slot="activator" round icon ><v-icon>done</v-icon></v-btn>
              <span v-if="!isAdded">Add to current playlist</span>
              <span v-else>Added to current playlist</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-btn slot="activator" icon color="primary" @click="$store.commit('MUTATION_SET_SOUND', lazyLoadedData[item.contentUrl])" round ><v-icon>play_arrow</v-icon></v-btn>
              <span>Play</span>
            </v-tooltip>
            <div class="v-list__tile__sub-title"><v-btn><v-icon color="red accent-4">favorite_border</v-icon> {{item.votes}} </v-btn> - Created: {{new Date(Number(item.createdOn)).toDateString()}}</div>
          </v-card>
        </v-flex>
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
