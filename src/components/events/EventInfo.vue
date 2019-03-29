<template>
  <v-card class="container mt-4">
    <div class="entity-title d-flex justify-space-between" v-if="eventObject.title">
      {{ eventObject.title }}
      <v-flex xs3>
        <Voter :itemsObject="eventObject" type="event"></Voter>
      </v-flex>
    </div>
    <v-list two-line>
      <v-list-tile v-if="isLoading">
        <v-progress-linear
          indeterminate
          color="grey lighten-1"
          class="mb-0"
        ></v-progress-linear>
      </v-list-tile>
      <v-list-tile v-if="eventObject.description">
        <v-list-tile-content>
          <v-list-tile-title v-html="eventObject.description"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="eventObject.ownername">
        <v-list-tile-content>
          <v-list-tile-sub-title>Published by</v-list-tile-sub-title>
          <v-list-tile-title v-html="eventObject.ownername"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="eventObject.start">
        <v-list-tile-content>
          <v-list-tile-sub-title>Start date & time</v-list-tile-sub-title>
          <v-list-tile-title v-html="new Date(eventObject.start).toLocaleString()"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="eventObject.end">
        <v-list-tile-content>
          <v-list-tile-sub-title>End date & time</v-list-tile-sub-title>
          <v-list-tile-title v-html="new Date(eventObject.end).toLocaleString()"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="eventObject.tags && eventObject.tags.length">
        <v-list-tile-content>
          <v-list-tile-sub-title>{{ eventObject.tags.length>1 ? 'Tags' : 'Tag' }}</v-list-tile-sub-title>
          <div>
            <template v-for="tag in eventObject.tags">
              <v-chip :key="tag.address">{{ '#' + tag.title }}</v-chip>
            </template>
          </div>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="eventObject.images && eventObject.images.length">
        <v-list-tile-content>
          <v-list-tile-sub-title>{{ eventObject.images.length>1 ? 'Images' : 'Image' }}</v-list-tile-sub-title>
          <div>
            <template v-for="image in eventObject.images">
              <v-chip :key="image.address">{{ image.title }}</v-chip>
            </template>
          </div>
        </v-list-tile-content>
      </v-list-tile>
      <!--<v-list-tile v-if="eventObject.private">-->
      <!--<v-list-tile-content>-->
      <!--<v-list-tile-sub-title>Privacy</v-list-tile-sub-title>-->
      <!--<v-list-tile-title v-html="eventObject.private ? 'Private' : 'Public'"></v-list-tile-title>-->
      <!--</v-list-tile-content>-->
      <!--</v-list-tile>-->
      <div v-if="!isLoading" class="entity-actions">
        <router-link v-if="!hubUrl && isOwned" color="cyan lighten-1" class="entity-action entity-action--edit" :to="{ name: 'EditEvent', params: { eventProp: this.eventObject } }">
          <v-icon color="cyan lighten-1">edit</v-icon>
          Edit
        </router-link>
        <a v-if="isFavorite" class="entity-action entity-action--favorite" @click="removeFromFavorite">
          <v-icon color="teal lighten-1">favorite_border</v-icon>
          <span class="teal--text text--lighten-1">Remove from Favorite</span>
        </a>
        <a v-if="!isFavorite" class="entity-action entity-action--favorite" @click="addToFavorite">
          <v-icon color="teal lighten-1">favorite</v-icon>
          <span class="teal--text text--lighten-1">Add to Favorite</span>
        </a>
        <a class="entity-action entity-action--wallet" color="brown lighten-1" @click="redirectUser(eventObject.address)">
          <v-icon color="brown lighten-1">account_balance_wallet</v-icon>
          <span class="brown--text text--lighten-1">Donate Crypto</span>
        </a>
        <a v-if="markerCenter" class="entity-action entity-action--marker" @click="isShowMarker = !isShowMarker">
          <v-icon color="red lighten-1">place</v-icon>
          <span class="red--text text--lighten-1">View Marker</span>
        </a>
      </div>
      <open-map-with-marker v-if="isShowMarker" :center="markerCenter" readonly/>
      <v-list-tile v-if="eventObject.symbol">
        <v-list-tile-content>
          <v-list-tile-sub-title>Symbol</v-list-tile-sub-title>
          <v-list-tile-title v-html="eventObject.symbol"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="eventObject.address">
        <v-list-tile-content>
          <v-list-tile-sub-title>Crypto Address</v-list-tile-sub-title>
          <v-list-tile-title v-html="eventObject.address"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <div class="json-address">
          <v-text-field
            ref="urlInput"
            :value="eventUrl"
            class="url-field"
            readonly
          />
          <v-btn class="button-copy" color="#20C3A5" @click="copyUrl">{{ copyButtonText }}</v-btn>
        </div>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-sub-title>Privacy</v-list-tile-sub-title>
          <v-list-tile-title v-html="eventObject.private ? 'Private' : 'Public'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-sub-title>Archived</v-list-tile-sub-title>
          <v-list-tile-title v-html="eventObject.archived ? 'Yes' : 'No'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="eventObject.createdtime">
        <v-list-tile-content>
          <v-list-tile-sub-title>Date Created</v-list-tile-sub-title>
          <v-list-tile-title v-html="new Date(eventObject.createdtime).toLocaleString()"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
import axios from 'axios'
import storageService from '@/services/blockstack-storage'
import OpenMapWithMarker from '@/components/maps/OpenMapWithMarker'
import Voter from '@/components/vote-buttons/voter'

export default {
  name: 'EventInfo',
  data: () => ({
    copyButtonText: 'Copy',
    isFavorite: false,
    isLoading: false,
    isShowMarker: false,
    markerCenter: null
  }),
  props: {
    eventObject: {
      type: Object
    },
    hubUrl: {
      type: String
    }
  },
  components: {
    OpenMapWithMarker,
    Voter
  },
  computed: {
    eventUrl () {
      // parsing blockstack gaia hub cong from localhost for creating hub url
      const urlItems = JSON.parse(localStorage['blockstack-gaia-hub-config'])
      // creating hub url(where our files are stored)
      const hubUrl = this.hubUrl ? `${urlItems.url_prefix}${this.hubUrl}/` : `${urlItems.url_prefix}${this.eventObject.owner}/`
      return this.eventObject ? `${hubUrl}event_${this.eventObject.createdtime}.json` : ''
    },
    isOwned () {
      return storageService.isResourceOwned(this.eventObject.owner)
    }
  },
  methods: {
    redirectUser (address) {
      this.$store.state.BTCAddress = address
      this.$router.push({name: 'Send'})
    },
    getFavEventName () {
      const eventUrlArr = this.eventUrl.split('/')
      return `${eventUrlArr.pop().split('.')[0]}_${eventUrlArr.pop()}`
    },
    copyUrl (e) {
      this.$refs.urlInput.$refs.input.select()
      document.execCommand('copy')
      this.copyButtonText = 'Copied!'
      setTimeout(() => { this.copyButtonText = 'Copy' }, 2000)
    },
    addToFavorite () {
      this.isLoading = true
      storageService.updateFavoriteEventIndex(this.getFavEventName(), this.eventObject.title)
        .then(() => {
          this.isFavorite = true
          this.isLoading = false
        })
    },
    removeFromFavorite () {
      this.isLoading = true
      storageService.reduceFavoriteEventIndex(this.getFavEventName(), this.eventObject.title)
        .then(() => {
          this.isFavorite = false
          this.isLoading = false
        })
    }
  },
  mounted () {
    if (!this.hubUrl) {
      this.$store.commit('toggleLoading')
      storageService.getFile({ fileName: 'my_fav_events.json', options: { decrypt: false } })
        .then(res => {
          if (res) {
            this.isFavorite = !!res[this.getFavEventName()]
          }
        })
        .then(() => {
          if (this.eventObject.marker) {
            axios.get(this.eventObject.marker.address)
              .then(res => {
                if (res) {
                  this.markerCenter = res.data.coordinates
                }
                this.$store.commit('toggleLoading')
              })
              .catch(e => this.$store.commit('toggleLoading'))
          } else {
            this.$store.commit('toggleLoading')
          }
        })
    }
  }
}
</script>
