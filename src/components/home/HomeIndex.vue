<template >
  <div class= 'text-xs-center'>
    <v-layout mt-4 v-if="goldFeed.length > 0" row wrap>
      <v-flex xs12><h2>Gold Channels Feed</h2></v-flex>
      <v-flex v-for="(channel, ind) in goldFeed" :key="ind" xs12>
        <v-flex v-for="(sound, index) in Object.keys(channel.sounds)" :key="index" xs12>
          <v-card class="mt-2 br20" >
            <v-card-text>
              <v-list>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>{{channel.sounds[sound]}}</v-list-tile-title>
                    <v-list-tile-sub-title>{{new Date(parseInt(sound.split('_')[1])).toUTCString()}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <!-- <v-list-tile-sub-title>{{sounds[item]}}</v-list-tile-sub-title> -->
                  <v-list-tile-action>
                    <!-- <v-spacer></v-spacer> -->
                    <v-tooltip bottom>
                      <v-btn v-if="!isAddedGoldObj[index]" @click="$store.commit('MUTATION_ADD_TO_PLAYLIST', { sound: channel.hubUrl+sound+'.mp3', title: channel.sounds[sound] }); $set(isAddedGoldObj, index, true)" color="primary" slot="activator" round icon ><v-icon>playlist_add</v-icon></v-btn>
                      <v-btn v-else  color="primary" slot="activator" round icon ><v-icon>done</v-icon></v-btn>
                      <span v-if="!isAddedGoldObj[index]">Add to current playlist</span>
                      <span v-else>Added to current playlist</span>
                    </v-tooltip>
                  </v-list-tile-action>
                  <v-list-tile-action>
                    <v-tooltip bottom>
                      <v-btn slot="activator" icon color="primary" @click="$store.commit('MUTATION_SET_SOUND', { sound: channel.hubUrl+sound+'.mp3', title: channel.sounds[item] })" round ><v-icon>play_arrow</v-icon></v-btn>
                      <span>Play</span>
                    </v-tooltip>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-flex>
    </v-layout>

    <v-layout mt-5 v-if="silverFeed.length > 0" row wrap>
      <v-flex xs12><h2>Silver Channels Feed</h2></v-flex>
      <v-flex v-for="(channel, ind) in silverFeed" :key="ind" xs12>
        <v-flex v-for="(sound, index) in Object.keys(channel.sounds)" :key="index" xs12>
          <v-card class="mt-2 br20" >
            <v-card-text>
              <v-list>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>{{channel.sounds[sound]}}</v-list-tile-title>
                    <v-list-tile-sub-title>{{new Date(parseInt(sound.split('_')[1])).toUTCString()}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <!-- <v-list-tile-sub-title>{{sounds[item]}}</v-list-tile-sub-title> -->
                  <v-list-tile-action>
                    <!-- <v-spacer></v-spacer> -->
                    <v-tooltip bottom>
                      <v-btn v-if="!isAddedSilverObj[index]" @click="$store.commit('MUTATION_ADD_TO_PLAYLIST', { sound: channel.hubUrl+sound+'.mp3', title: channel.sounds[sound] }); $set(isAddedSilverObj, index, true)" color="primary" slot="activator" round icon ><v-icon>playlist_add</v-icon></v-btn>
                      <v-btn v-else  color="primary" slot="activator" round icon ><v-icon>done</v-icon></v-btn>
                      <span v-if="!isAddedSilverObj[index]">Add to current playlist</span>
                      <span v-else>Added to current playlist</span>
                    </v-tooltip>
                  </v-list-tile-action>
                  <v-list-tile-action>
                    <v-tooltip bottom>
                      <v-btn slot="activator" icon color="primary" @click="$store.commit('MUTATION_SET_SOUND', { sound: channel.hubUrl+sound+'.mp3', title: channel.sounds[item] })" round ><v-icon>play_arrow</v-icon></v-btn>
                      <span>Play</span>
                    </v-tooltip>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-flex>
    </v-layout>

    <v-layout mt-5 v-if="bronzeFeed.length > 0" row wrap>
      <v-flex xs12><h2>Bronze Channels Feed</h2></v-flex>
      <v-flex v-for="(channel, ind) in bronzeFeed" :key="ind" xs12>
        <v-flex v-for="(sound, index) in Object.keys(channel.sounds)" :key="index" xs12>
          <v-card class="mt-2 br20" >
            <v-card-text>
              <v-list>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>{{channel.sounds[sound]}}</v-list-tile-title>
                    <v-list-tile-sub-title>{{new Date(parseInt(sound.split('_')[1])).toUTCString()}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <!-- <v-list-tile-sub-title>{{sounds[item]}}</v-list-tile-sub-title> -->
                  <v-list-tile-action>
                    <!-- <v-spacer></v-spacer> -->
                    <v-tooltip bottom>
                      <v-btn v-if="!isAddedBronzeObj[index]" @click="$store.commit('MUTATION_ADD_TO_PLAYLIST', { sound: channel.hubUrl+sound+'.mp3', title: channel.sounds[sound] }); $set(isAddedBronzeObj, index, true)" color="primary" slot="activator" round icon ><v-icon>playlist_add</v-icon></v-btn>
                      <v-btn v-else  color="primary" slot="activator" round icon ><v-icon>done</v-icon></v-btn>
                      <span v-if="!isAddedBronzeObj[index]">Add to current playlist</span>
                      <span v-else>Added to current playlist</span>
                    </v-tooltip>
                  </v-list-tile-action>
                  <v-list-tile-action>
                    <v-tooltip bottom>
                      <v-btn slot="activator" icon color="primary" @click="$store.commit('MUTATION_SET_SOUND', { sound: channel.hubUrl+sound+'.mp3', title: channel.sounds[item] })" round ><v-icon>play_arrow</v-icon></v-btn>
                      <span>Play</span>
                    </v-tooltip>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import storageService from '@/services/blockstack-storage'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isSearching: 'isSearching',
      goldFeed: 'getGoldFeed',
      silverFeed: 'getSilverFeed',
      bronzeFeed: 'getBronzeFeed',
      isResolved: 'isResolved',
      searchResult: 'getSearchResult',
      showDonationGraph: 'showDonationGraph',
      showPayoutGraph: 'showPayoutGraph',
      settings: 'getSettings',
      proximitySearchResult: 'getProximitySearchResult'
    })
    // goldFeedFinal () {
    //   let finalFeed = []
    //   let tempFeed = []
    //   goldFeed.reduce((acc, channel) => {
    //     tempFeed = [...tempFeed, ...channel.sounds]
    //   })
    // }
  },
  data: () => ({
    isAddedGoldObj: {},
    isAddedSilverObj: {},
    isAddedBronzeObj: {},
    timer: null,
    mapCenter: {
      lat: '',
      lng: '',
      radius: ''
    }
  }),
  created () {
    this.$store.dispatch('ACTION_GET_LATEST_FEED')
    for (let i = 0; i < 100; i++) {
      this.$set(this.isAddedGoldObj, i, false)
      this.$set(this.isAddedSilverObj, i, false)
      this.$set(this.isAddedBronzeObj, i, false)
    }
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
.br20 {
  border-radius: 20px;
}
/* .map-wrapper-ini {
  padding-bottom: 37.5%;
}
.map-wrapper {
  padding-bottom: 0%
} */
</style>
