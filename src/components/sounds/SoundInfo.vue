<template>
  <v-card class="container mt-4">
    <div class="entity-title d-flex justify-space-between" v-if="soundObject.title">
      {{ soundObject.title }}
      <v-flex xs3>
        <Voter :itemsObject="soundObject" type="sound"></Voter>
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
      <v-list-tile v-if="soundObject.description">
        <v-list-tile-content>
          <v-list-tile-title v-html="soundObject.description"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="soundObject.ownername">
        <v-list-tile-content>
          <v-list-tile-sub-title>Published by</v-list-tile-sub-title>
          <v-list-tile-title v-html="soundObject.ownername"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="soundObject.tags && soundObject.tags.length">
        <v-list-tile-content>
          <v-list-tile-sub-title>{{ soundObject.tags.length>1 ? 'Tags' : 'Tag' }}</v-list-tile-sub-title>
          <div>
            <template v-for="tag in soundObject.tags">
              <v-chip :key="tag.address">{{ '#' + tag.title }}</v-chip>
            </template>
          </div>
        </v-list-tile-content>
      </v-list-tile>
      <v-card class="br20" width="100%">
        <v-flex xs12>
          <!-- <audio class="soundplayer" autoplay controls>
            <source v-bind:src="soundObject.sound">
          </audio> -->
          <v-tooltip bottom>
            <v-btn v-if="!isAdded" @click="$store.commit('MUTATION_ADD_TO_PLAYLIST', soundObject); isAdded = true" color="primary" slot="activator" round icon ><v-icon>playlist_add</v-icon></v-btn>
            <v-btn v-else  color="primary" slot="activator" round icon ><v-icon>done</v-icon></v-btn>
            <span v-if="!isAdded">Add to current playlist</span>
            <span v-else>Added to current playlist</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" icon color="primary" @click="$store.commit('MUTATION_SET_SOUND', soundObject)" round ><v-icon>play_arrow</v-icon></v-btn>
            <span>Play</span>
          </v-tooltip>
          Path for the File: {{ soundObject.sound }}
        </v-flex>
      </v-card>
      <!--<v-list-tile v-if="soundObject.private">-->
      <!--<v-list-tile-content>-->
      <!--<v-list-tile-sub-title>Privacy</v-list-tile-sub-title>-->
      <!--<v-list-tile-title v-html="soundObject.private ? 'Private' : 'Public'"></v-list-tile-title>-->
      <!--</v-list-tile-content>-->
      <!--</v-list-tile>-->
      <div v-if="!isLoading" class="entity-actions">
        <router-link v-if="!hubUrl && isOwned" color="cyan lighten-1" class="entity-action entity-action--edit" :to="{ name: 'EditSound', params: { soundProp: this.soundObject } }">
          <v-icon color="cyan lighten-1">edit</v-icon>
          Edit
        </router-link>
        <a v-if="isFavorite" class="entity-action entity-action--favorite" @click="removeFromFavorite">
          <v-icon color="red lighten-1">favorite_border</v-icon>
          <span class="blue--text text--lighten-1">Remove from Likes</span>
        </a>
        <a v-if="!isFavorite" class="entity-action entity-action--favorite" @click="addToFavorite">
          <v-icon color="red lighten-1">favorite</v-icon>
          <span class="blue--text text--lighten-1">Add to Likes</span>
        </a>
        <a class="entity-action entity-action--wallet" color="brown lighten-1" @click="redirectUser(soundObject.address)">
          <v-icon color="brown lighten-1">account_balance_wallet</v-icon>
          <span class="brown--text text--lighten-1">Donate Crypto</span>
        </a>
      </div>
      <v-list-tile v-if="soundObject.symbol">
        <v-list-tile-content>
          <v-list-tile-sub-title>Symbol</v-list-tile-sub-title>
          <v-list-tile-title v-html="soundObject.symbol"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="soundObject.address">
        <v-list-tile-content>
          <v-list-tile-sub-title>Crypto Address</v-list-tile-sub-title>
          <v-list-tile-title v-html="soundObject.address"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <div class="json-address">
          <v-text-field
            ref="urlInput"
            :value="soundUrl"
            class="url-field"
            readonly
          />
          <v-btn class="button-copy" color="#409bf7" @click="copyUrl">{{ copyButtonText }}</v-btn>
        </div>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-sub-title>Privacy</v-list-tile-sub-title>
          <v-list-tile-title v-html="soundObject.private ? 'Private' : 'Public'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-sub-title>Archived</v-list-tile-sub-title>
          <v-list-tile-title v-html="soundObject.archived ? 'Yes' : 'No'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="soundObject.createdtime">
        <v-list-tile-content>
          <v-list-tile-sub-title>Date Created</v-list-tile-sub-title>
          <v-list-tile-title v-html="new Date(soundObject.createdtime).toLocaleString()"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
import axios from 'axios'
import storageService from '@/services/blockstack-storage'
import Voter from '@/components/vote-buttons/voter'

export default {
  name: 'SoundInfo',
  data: () => ({
    copyButtonText: 'Copy',
    isFavorite: false,
    isLoading: false,
    isAdded: false
  }),
  props: {
    soundObject: {
      type: Object
    },
    hubUrl: {
      type: String
    }
  },
  components: {
    Voter
  },
  computed: {
    soundUrl () {
      // parsing blockstack gaia hub cong from localhost for creating hub url
      const urlItems = JSON.parse(localStorage['blockstack-session']).userData.gaiaHubConfig
      // creating hub url(where our files are stored)
      const hubUrl = this.hubUrl || `${urlItems.url_prefix}${this.soundObject.owner}/`
      return this.soundObject ? `${hubUrl}sound_${this.soundObject.createdtime}.json` : ''
    },
    isOwned () {
      return storageService.isResourceOwned(this.soundObject.owner)
    }
  },
  methods: {
    redirectUser (address) {
      this.$store.state.BTCAddress = address
      this.$router.push({name: 'Send'})
    },
    getFavSoundName () {
      const soundUrlArr = this.soundUrl.split('/')
      return `${soundUrlArr.pop().split('.')[0]}_${soundUrlArr.pop()}`
    },
    copyUrl (e) {
      this.$refs.urlInput.$refs.input.select()
      document.execCommand('copy')
      this.copyButtonText = 'Copied!'
      setTimeout(() => { this.copyButtonText = 'Copy' }, 2000)
    },
    addToFavorite () {
      this.isLoading = true
      storageService.updateFavoriteSoundIndex(this.getFavSoundName(), this.soundObject.title)
        .then(() => {
          this.isFavorite = true
          this.isLoading = false
        })
    },
    removeFromFavorite () {
      this.isLoading = true
      storageService.reduceFavoriteSoundIndex(this.getFavSoundName(), this.soundObject.title)
        .then(() => {
          this.isFavorite = false
          this.isLoading = false
        })
    }
  },
  mounted () {
    if (!this.hubUrl) {
      this.$store.commit('toggleLoading')
      storageService.getFile({ fileName: 'my_fav_sounds.json', options: { decrypt: false } })
        .then(res => {
          if (res) {
            this.isFavorite = !!res[this.getFavSoundName()]
          }
        })
        .then(() => {
          if (this.soundObject.marker) {
            axios.get(this.soundObject.marker.address)
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
.profile-info {
  .headline {
  color: #5a5d5f
  }
  h3{
    color: grey
  }
}
.br20 {
  border-radius: 20px
}
.qr-code {
  margin: 1% 0% 3% 0%
}
.ml25 {
  margin-left: 1em
}
#myavatar {
  margin-top: -144px
}
.soundplayer {
  width: 100%
}
.si {
  .v-icon {
  font-size: 15px !important
  }
}

</style>
