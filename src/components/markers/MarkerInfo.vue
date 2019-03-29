<template>
  <v-card class="container mt-4">
    <div class="entity-title d-flex justify-space-between" v-if="markerObject.title">
      {{ markerObject.title }}
      <v-flex xs3>
        <Voter :itemsObject="markerObject" type="marker"></Voter>
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
      <v-list-tile v-if="markerObject.detail">
        <v-list-tile-content>
          <v-list-tile-title v-html="markerObject.detail"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="markerObject.ownername">
        <v-list-tile-content>
          <v-list-tile-sub-title>Published by</v-list-tile-sub-title>
          <v-list-tile-title v-html="markerObject.ownername"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile v-if="markerObject.tags && markerObject.tags.length">
        <v-list-tile-content>
          <v-list-tile-sub-title>{{ markerObject.tags.length>1 ? 'Tags' : 'Tag' }}</v-list-tile-sub-title>
          <div>
            <template v-for="(tag, index) in markerObject.tags">
              <v-chip :key="index+'t'">{{ '#' + tag.title }}</v-chip>
            </template>
          </div>
        </v-list-tile-content>
      </v-list-tile>
      <!--<v-list-tile v-if="markerObject.private">-->
      <!--<v-list-tile-content>-->
      <!--<v-list-tile-sub-title>Privacy</v-list-tile-sub-title>-->
      <!--<v-list-tile-title v-html="markerObject.private ? 'Private' : 'Public'"></v-list-tile-title>-->
      <!--</v-list-tile-content>-->
      <!--</v-list-tile>-->
      <div v-if="!isLoading" class="entity-actions">
        <router-link v-if="!hubUrl && isOwned" color="cyan lighten-1" class="entity-action entity-action--edit" :to="{ name: 'EditMarker', params: { markerProp: this.markerObject } }">
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
        <a class="entity-action entity-action--wallet" color="brown lighten-1" @click="redirectUser(markerObject.address)">
          <v-icon color="brown lighten-1">account_balance_wallet</v-icon>
          <span class="brown--text text--lighten-1">Donate Crypto</span>
        </a>
        <a v-if="markerCenter" class="entity-action entity-action--marker" @click="isShowMarker = !isShowMarker">
          <v-icon color="red lighten-1">place</v-icon>
          <span class="red--text text--lighten-1">View Marker</span>
        </a>
      </div>
      <open-map-with-marker v-if="isShowMarker" :center="markerCenter" readonly/>
      <v-list-tile v-if="markerObject.symbol">
        <v-list-tile-content>
          <v-list-tile-sub-title>Symbol</v-list-tile-sub-title>
          <v-list-tile-title v-html="markerObject.symbol"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="markerObject.address">
        <v-list-tile-content>
          <v-list-tile-sub-title>Crypto Address</v-list-tile-sub-title>
          <v-list-tile-title v-html="markerObject.address"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <div class="json-address">
          <v-text-field
            ref="urlInput"
            :value="markerUrl"
            class="url-field"
            readonly
          />
          <v-btn class="button-copy" color="#20C3A5" @click="copyUrl">{{ copyButtonText }}</v-btn>
        </div>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-sub-title>Privacy</v-list-tile-sub-title>
          <v-list-tile-title v-html="markerObject.private ? 'Private' : 'Public'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-sub-title>Archived</v-list-tile-sub-title>
          <v-list-tile-title v-html="markerObject.archived ? 'Yes' : 'No'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="markerObject.createdtime">
        <v-list-tile-content>
          <v-list-tile-sub-title>Date Created</v-list-tile-sub-title>
          <v-list-tile-title v-html="new Date(markerObject.createdtime).toLocaleString()"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
import OpenMapWithMarker from '@/components/maps/OpenMapWithMarker'
import storageService from '@/services/blockstack-storage'
import Voter from '@/components/vote-buttons/voter'

export default {
  name: 'MarkerInfo',
  data: () => ({
    copyButtonText: 'Copy',
    isFavorite: false,
    isLoading: false,
    isShowMarker: true
  }),
  components: {
    OpenMapWithMarker,
    Voter
  },
  props: {
    markerObject: {
      type: Object
    },
    hubUrl: {
      type: String
    }
  },
  computed: {
    markerCenter () {
      return this.markerObject ? {
        lat: this.markerObject.coordinates.lat,
        lng: this.markerObject.coordinates.lng
      } : {}
    },
    markerUrl () {
      // parsing blockstack gaia hub cong from localhost for creating hub url
      let urlItems = ''
      if (localStorage['blockstack-gaia-hub-config']) {
        urlItems = JSON.parse(localStorage['blockstack-gaia-hub-config'])
      }
      // creating hub url(where our files are stored)
      const hubUrl = this.hubUrl ? `${urlItems.url_prefix}${this.hubUrl}/` : `${urlItems.url_prefix}${this.markerObject.owner}/`
      return this.markerObject ? `${hubUrl}marker_${this.markerObject.createdtime}.json` : ''
    },
    isOwned () {
      return storageService.isResourceOwned(this.markerObject.owner)
    }
  },
  methods: {
    redirectUser (address) {
      this.$store.state.BTCAddress = address
      this.$router.push({name: 'Send'})
    },
    getFavMarkerName () {
      const markerUrlArr = this.markerUrl.split('/')
      return `${markerUrlArr.pop().split('.')[0]}_${markerUrlArr.pop()}`
    },
    copyUrl (e) {
      this.$refs.urlInput.$refs.input.select()
      document.execCommand('copy')
      this.copyButtonText = 'Copied!'
      setTimeout(() => { this.copyButtonText = 'Copy Gaia URL' }, 2000)
    },
    addToFavorite () {
      this.isLoading = true
      storageService.updateFavoriteMarkerIndex(this.getFavMarkerName(), this.markerObject.title)
        .then(() => {
          this.isFavorite = true
          this.isLoading = false
        })
    },
    removeFromFavorite () {
      this.isLoading = true
      storageService.reduceFavoriteMarkerIndex(this.getFavMarkerName(), this.markerObject.title)
        .then(() => {
          this.isFavorite = false
          this.isLoading = false
        })
    }
  },
  mounted () {
    if (!this.hubUrl) {
      storageService.getFile({ fileName: 'my_fav_markers.json', options: { decrypt: false } })
        .then(res => {
          if (res) {
            this.isFavorite = !!res[this.getFavMarkerName()]
          }
        })
    }
  }
}
</script>
