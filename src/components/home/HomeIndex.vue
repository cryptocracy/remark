<template >
  <div>
    <v-layout dark mt-4 row wrap>
      <v-flex xs6><h2>Channels Feed</h2></v-flex>
      <v-flex xs3>
        <v-select
          :items="duration"
          label="Select feed duration"
          v-model="selectedDuration"
        ></v-select>
      </v-flex>
      <v-flex xs3>
        <v-select
          :items="sortByOptions"
          label="Sort By"
          v-model="sortBy"
        ></v-select>
      </v-flex>
      <v-flex v-if="finalFeed.length > 0" xs12>
        <v-flex  v-for="(feed, index) in finalFeed" :key="index" xs12>
          <v-card class="mt-2 br20">
            <v-card-text>
              <v-list>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>{{feed.title}}</v-list-tile-title>
                    <v-list-tile-sub-title>{{new Date(feed.uploadedAt).toUTCString()}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-tooltip bottom light>
                      <v-btn v-if="!isAddedObj[index]" @click="$store.commit('MUTATION_ADD_TO_PLAYLIST', { sound: feed.sound, title: feed.title }); $set(isAddedObj, index, true)" color="primary" slot="activator" round icon ><v-icon>playlist_add</v-icon></v-btn>
                      <v-btn v-else  color="primary" slot="activator" round icon ><v-icon>done</v-icon></v-btn>
                      <span class="white--text" v-if="!isAddedObj[index]">Add to queue</span>
                      <span class="white--text" v-else>Added to queue</span>
                    </v-tooltip>
                  </v-list-tile-action>
                  <v-list-tile-action>
                    <v-tooltip bottom>
                      <v-btn slot="activator" icon color="primary" @click="$store.commit('MUTATION_SET_SOUND', { sound: feed.sound, title: feed.title })" round ><v-icon>play_arrow</v-icon></v-btn>
                      <span class="white--text">Play</span>
                    </v-tooltip>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-flex>
    </v-layout>

    <!-- <v-layout dark mt-4 v-if="finalSilverFeed.length > 0" row wrap>
      <v-flex xs12><h2>Silver Channels Feed</h2></v-flex>
      <v-flex v-for="(feed, index) in finalSilverFeed" :key="index" xs12>
        <v-card class="mt-2 br20">
          <v-card-text>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>{{feed.title}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{new Date(feed.uploadedAt).toUTCString()}}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-tooltip bottom light>
                    <v-btn v-if="!isAddedSilverObj[index]" @click="$store.commit('MUTATION_ADD_TO_PLAYLIST', { sound: feed.sound, title: feed.title }); $set(isAddedSilverObj, index, true)" color="primary" slot="activator" round icon ><v-icon>playlist_add</v-icon></v-btn>
                    <v-btn v-else  color="primary" slot="activator" round icon ><v-icon>done</v-icon></v-btn>
                    <span class="white--text" v-if="!isAddedSilverObj[index]">Add to queue</span>
                    <span class="white--text" v-else>Added to queue</span>
                  </v-tooltip>
                </v-list-tile-action>
                <v-list-tile-action>
                  <v-tooltip bottom>
                    <v-btn slot="activator" icon color="primary" @click="$store.commit('MUTATION_SET_SOUND', { sound: feed.sound, title: feed.title })" round ><v-icon>play_arrow</v-icon></v-btn>
                    <span class="white--text">Play</span>
                  </v-tooltip>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout> -->

    <!-- <v-layout dark mt-4 v-if="finalBronzeFeed.length > 0" row wrap>
      <v-flex xs12><h2>Bronze Channels Feed</h2></v-flex>
      <v-flex v-for="(feed, index) in finalBronzeFeed" :key="index" xs12>
        <v-card class="mt-2 br20">
          <v-card-text>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>{{feed.title}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{new Date(feed.uploadedAt).toUTCString()}}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-tooltip bottom light>
                    <v-btn v-if="!isAddedBronzeObj[index]" @click="$store.commit('MUTATION_ADD_TO_PLAYLIST', { sound: feed.sound, title: feed.title }); $set(isAddedBronzeObj, index, true)" color="primary" slot="activator" round icon ><v-icon>playlist_add</v-icon></v-btn>
                    <v-btn v-else  color="primary" slot="activator" round icon ><v-icon>done</v-icon></v-btn>
                    <span class="white--text" v-if="!isAddedBronzeObj[index]">Add to queue</span>
                    <span class="white--text" v-else>Added to queue</span>
                  </v-tooltip>
                </v-list-tile-action>
                <v-list-tile-action>
                  <v-tooltip bottom>
                    <v-btn slot="activator" icon color="primary" @click="$store.commit('MUTATION_SET_SOUND', { sound: feed.sound, title: feed.title })" round ><v-icon>play_arrow</v-icon></v-btn>
                    <span class="white--text">Play</span>
                  </v-tooltip>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout> -->
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
    }),
    finalFeed () {
      let finalFeed = []
      let tempFeed = []
      if (this.goldFeed.length || this.silverFeed.length || this.bronzeFeed.length) {
        tempFeed = [ ...this.goldFeed, ...this.silverFeed, ...this.bronzeFeed ]
        finalFeed = tempFeed.reduce((acc, channel) => {
          Object.keys(channel.sounds).forEach(element => {
            let item = {
              hubUrl: channel.hubUrl,
              title: channel.sounds[element],
              user: channel.fullyQualifiedName || channel.username,
              sound: channel.hubUrl + element + '.mp3',
              uploadedAt: parseInt(element.split('_')[1])
            }
            acc.push(item)
          })
          return acc
        }, [])
      }
      // finalFeed.filter()

      if (this.selectedDuration) {
        let currentDate = +new Date()
        let stamp = currentDate - this.selectedDuration * 86400000
        finalFeed = finalFeed.filter(e => e.uploadedAt >= stamp)
      }
      // console.log(currentDate.setDate() - )
      if (!this.sortBy) {
        return finalFeed.sort((a, b) => a.uploadedAt - b.uploadedAt)
      } else {
        return finalFeed.sort((a, b) => b.uploadedAt - a.uploadedAt)
      }
    }
    // finalSilverFeed () {
    //   let finalFeed = []
    //   if (this.silverFeed.length) {
    //     finalFeed = this.silverFeed.reduce((acc, channel) => {
    //       Object.keys(channel.sounds).forEach(element => {
    //         let item = {
    //           hubUrl: channel.hubUrl,
    //           title: channel.sounds[element],
    //           user: channel.fullyQualifiedName || channel.username,
    //           sound: channel.hubUrl + element + '.mp3',
    //           uploadedAt: parseInt(element.split('_')[1])
    //         }
    //         acc.push(item)
    //       })
    //       return acc
    //     }, [])
    //   }
    //   return finalFeed.sort((a, b) => a.uploadedAt - b.uploadedAt)
    // },
    // finalBronzeFeed () {
    //   let finalFeed = []
    //   if (this.bronzeFeed.length) {
    //     finalFeed = this.bronzeFeed.reduce((acc, channel) => {
    //       Object.keys(channel.sounds).forEach(element => {
    //         let item = {
    //           hubUrl: channel.hubUrl,
    //           title: channel.sounds[element],
    //           user: channel.fullyQualifiedName || channel.username,
    //           sound: channel.hubUrl + element + '.mp3',
    //           uploadedAt: parseInt(element.split('_')[1])
    //         }
    //         acc.push(item)
    //       })
    //       return acc
    //     }, [])
    //   }
    //   return finalFeed.sort((a, b) => a.uploadedAt - b.uploadedAt)
    // }
  },
  // watch: {
  //   deep: true,
  //   goldFeed () {
  //     console.log('THIS FEED', this.goldFeed)
  //   }
  // },
  data: () => ({
    duration: [
      { text: '1 day', value: 1 },
      { text: '3 day', value: 3 },
      { text: '7 day', value: 7 },
      { text: '15 day', value: 15 },
      { text: '30 day', value: 30 },
      { text: 'All time', value: null }
    ],
    sortByOptions: [
      { text: 'Newest First', value: 1 },
      { text: 'Oldest First', value: 0 }
    ],
    selectedDuration: null,
    sortBy: 1,
    isAddedObj: {},
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
      this.$set(this.isAddedObj, i, false)
      // this.$set(this.isAddedSilverObj, i, false)
      // this.$set(this.isAddedBronzeObj, i, false)
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
