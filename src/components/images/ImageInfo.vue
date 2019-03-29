<template>
  <v-card class="container mt-4">
    <div class="image-container">
      <span v-if="imageObject.title" class="image-title">{{ imageObject.title }}</span>
      <img v-if="imageObject.image" :src="imageObject.image" class="main-image">
    </div>
    <v-list two-line>
      <v-list-tile v-if="isLoading">
        <v-progress-linear
          indeterminate
          color="grey lighten-1"
          class="mb-0"
        ></v-progress-linear>
      </v-list-tile>
      <v-list-tile v-if="imageObject.detail">
        <v-list-tile-content>
          <v-list-tile-title v-html="imageObject.detail"></v-list-tile-title>
        </v-list-tile-content>
        <v-flex xs3>
          <Voter :itemsObject="imageObject" type="image"></Voter>
        </v-flex>
      </v-list-tile>
      <v-list-tile v-if="imageObject.ownername">
        <v-list-tile-content>
          <v-list-tile-sub-title>Published by</v-list-tile-sub-title>
          <v-list-tile-title v-html="imageObject.ownername"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="imageObject.tags && imageObject.tags.length">
        <v-list-tile-content>
          <v-list-tile-sub-title>{{ imageObject.tags.length>1 ? 'Tags' : 'Tag' }}</v-list-tile-sub-title>
          <div>
            <template v-for="(tag, index) in imageObject.tags">
              <v-chip :key="index+'t'">{{ '#' + tag.title }}</v-chip>
            </template>
          </div>
        </v-list-tile-content>
      </v-list-tile>
      <!--<v-list-tile v-if="imageObject.private">-->
      <!--<v-list-tile-content>-->
      <!--<v-list-tile-sub-title>Privacy</v-list-tile-sub-title>-->
      <!--<v-list-tile-title v-html="imageObject.private ? 'Private' : 'Public'"></v-list-tile-title>-->
      <!--</v-list-tile-content>-->
      <!--</v-list-tile>-->
      <div v-if="!isLoading" class="entity-actions">
        <router-link v-if="!hubUrl && isOwned" color="cyan lighten-1" class="entity-action entity-action--edit" :to="{ name: 'EditImage', params: { imageProp: this.imageObject } }">
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
        <a class="entity-action entity-action--wallet" color="brown lighten-1" @click="redirectUser(imageObject.address)">
          <v-icon color="brown lighten-1">account_balance_wallet</v-icon>
          <span class="brown--text text--lighten-1">Donate Crypto</span>
        </a>
        <a v-if="markerCenter" class="entity-action entity-action--marker" @click="isShowMarker = !isShowMarker">
          <v-icon color="red lighten-1">place</v-icon>
          <span class="red--text text--lighten-1">View Marker</span>
        </a>
      </div>
      <open-map-with-marker v-if="isShowMarker" :center="markerCenter" readonly/>
      <v-list-tile v-if="imageObject.symbol">
        <v-list-tile-content>
          <v-list-tile-sub-title>Symbol</v-list-tile-sub-title>
          <v-list-tile-title v-html="imageObject.symbol"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="imageObject.address">
        <v-list-tile-content>
          <v-list-tile-sub-title>Crypto Address</v-list-tile-sub-title>
          <v-list-tile-title v-html="imageObject.address"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <div class="json-address">
          <v-text-field
            ref="urlInput"
            :value="imageUrl"
            class="url-field"
            readonly
          />
          <v-btn class="button-copy" color="#20C3A5" @click="copyUrl">{{ copyButtonText }}</v-btn>
        </div>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-sub-title>Privacy</v-list-tile-sub-title>
          <v-list-tile-title v-html="imageObject.private ? 'Private' : 'Public'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-sub-title>Archived</v-list-tile-sub-title>
          <v-list-tile-title v-html="imageObject.archived ? 'Yes' : 'No'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="imageObject.createdtime">
        <v-list-tile-content>
          <v-list-tile-sub-title>Date Created</v-list-tile-sub-title>
          <v-list-tile-title v-html="new Date(imageObject.createdtime).toLocaleString()"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
import axios from 'axios'
import OpenMapWithMarker from '@/components/maps/OpenMapWithMarker'
import storageService from '@/services/blockstack-storage'
import Voter from '@/components/vote-buttons/voter'

export default {
  name: 'ImageInfo',
  data: () => ({
    copyButtonText: 'Copy',
    isFavorite: false,
    isLoading: false,
    isShowMarker: false,
    markerCenter: null
  }),
  props: {
    imageObject: {
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
    imageUrl () {
      // parsing blockstack gaia hub cong from localhost for creating hub url
      let urlItems = {}
      if (localStorage['blockstack-gaia-hub-config']) {
        urlItems = JSON.parse(localStorage['blockstack-gaia-hub-config'])
      }
      // creating hub url(where our files are stored)
      const hubUrl = `${urlItems.url_prefix}${this.imageObject.owner}/`
      return this.imageObject ? `${hubUrl}image_${this.imageObject.createdtime}.json` : ''
    },
    isOwned () {
      return storageService.isResourceOwned(this.imageObject.owner)
    }
  },
  methods: {
    redirectUser (address) {
      this.$store.state.BTCAddress = address
      this.$router.push({name: 'Send'})
    },
    getFavImageName () {
      const imageUrlArr = this.imageUrl.split('/')
      return `${imageUrlArr.pop().split('.')[0]}_${imageUrlArr.pop()}`
    },
    copyUrl (e) {
      this.$refs.urlInput.$refs.input.select()
      document.execCommand('copy')
      this.copyButtonText = 'Copied!'
      setTimeout(() => { this.copyButtonText = 'Copy' }, 2000)
    },
    addToFavorite () {
      this.isLoading = true
      storageService.updateFavoriteImageIndex(this.getFavImageName(), this.imageObject.title)
        .then(() => {
          this.isFavorite = true
          this.isLoading = false
        })
    },
    removeFromFavorite () {
      this.isLoading = true
      storageService.reduceFavoriteImageIndex(this.getFavImageName(), this.imageObject.title)
        .then(() => {
          this.isFavorite = false
          this.isLoading = false
        })
    }
  },
  mounted () {
    if (!this.hubUrl) {
      this.$store.commit('toggleLoading')
      storageService.getFile({ fileName: 'my_fav_images.json', options: { decrypt: false } })
        .then(res => {
          if (res) {
            this.isFavorite = !!res[this.getFavImageName()]
          }
        })
        .then(() => {
          if (this.imageObject.marker) {
            axios.get(this.imageObject.marker.address)
              .then(res => {
                if (res) {
                  this.markerCenter = res.data.coordinates
                }
                this.$store.commit('toggleLoading')
              })
              .catch(e => {
                this.$store.commit('toggleLoading')
              })
          } else this.$store.commit('toggleLoading')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .image-container {
    width: calc(100% + 32px);
    margin: -16px -16px 0;
    max-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;

    .image-title {
      position: absolute;
      top: 16px;
      left: 16px;
      font-size: 24px;
      color: white;
      mix-blend-mode: difference;
    }

    .main-image {
      max-height: 100%;
      max-width: 100%;
    }
  }
  @media only screen and (min-width: 960px) {
    .image-container {
      width: calc(100% + 48px);
      margin: -24px -24px 0;
    }
    .image-title {
      top: 24px;
      left: 24px;
      font-size: 24px;
    }
  }
</style>
