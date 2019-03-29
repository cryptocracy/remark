<template>
  <v-card class="container mt-4">
    <div class="entity-title d-flex justify-space-between" v-if="taskObject.title">
      {{ taskObject.title }}
      <v-flex xs3>
        <Voter :itemsObject="taskObject" type="task"></Voter>
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
      <v-list-tile v-if="taskObject.description">
        <v-list-tile-content>
          <v-list-tile-title v-html="taskObject.description"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="taskObject.stage">
        <v-list-tile-content>
          <v-list-tile-sub-title>Stage</v-list-tile-sub-title>
          <v-list-tile-title v-html="taskObject.stage"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="taskObject.amount" class="tile-progress">
        <v-list-tile-content>
          <v-list-tile-sub-title>Amount</v-list-tile-sub-title>
          <v-progress-circular size="96" width="12" class="task-progress" :value="+currentAmount/100000000/taskObject.amount*100" color="teal">{{+currentAmount/100000000}}/{{taskObject.amount}}</v-progress-circular>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="taskObject.ownername">
        <v-list-tile-content>
          <v-list-tile-sub-title>Published by</v-list-tile-sub-title>
          <v-list-tile-title v-html="taskObject.ownername"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="taskObject.due">
        <v-list-tile-content>
          <v-list-tile-sub-title>Due date</v-list-tile-sub-title>
          <v-list-tile-title v-html="new Date(taskObject.due).toLocaleDateString()"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="taskObject.tags && taskObject.tags.length">
        <v-list-tile-content>
          <v-list-tile-sub-title>{{ taskObject.tags.length>1 ? 'Tags' : 'Tag' }}</v-list-tile-sub-title>
          <div>
            <template v-for="tag in taskObject.tags">
              <v-chip :key="tag.address">{{ '#' + tag.title }}</v-chip>
            </template>
          </div>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="taskObject.events && taskObject.events.length">
        <v-list-tile-content>
          <v-list-tile-sub-title>{{ taskObject.events.length>1 ? 'Events' : 'Event' }}</v-list-tile-sub-title>
          <div>
            <template v-for="event in taskObject.events">
              <v-chip :key="event.address">{{ event.title }}</v-chip>
            </template>
          </div>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="taskObject.images && taskObject.images.length">
        <v-list-tile-content>
          <v-list-tile-sub-title>{{ taskObject.images.length>1 ? 'Images' : 'Image' }}</v-list-tile-sub-title>
          <div>
            <template v-for="image in taskObject.images">
              <v-chip :key="image.address">{{ image.title }}</v-chip>
            </template>
          </div>
        </v-list-tile-content>
      </v-list-tile>
      <!--<v-list-tile v-if="taskObject.private">-->
      <!--<v-list-tile-content>-->
      <!--<v-list-tile-sub-title>Privacy</v-list-tile-sub-title>-->
      <!--<v-list-tile-title v-html="taskObject.private ? 'Private' : 'Public'"></v-list-tile-title>-->
      <!--</v-list-tile-content>-->
      <!--</v-list-tile>-->
      <div v-if="!isLoading" class="entity-actions">
        <router-link v-if="!hubUrl && isOwned" color="cyan lighten-1" class="entity-action entity-action--edit" :to="{ name: 'EditTask', params: { taskProp: this.taskObject } }">
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
        <a class="entity-action entity-action--wallet" color="brown lighten-1" @click="redirectUser(taskObject.address)">
          <v-icon color="brown lighten-1">account_balance_wallet</v-icon>
          <span class="brown--text text--lighten-1">Donate Crypto</span>
        </a>
        <a v-if="markerCenter" class="entity-action entity-action--marker" @click="isShowMarker = !isShowMarker">
          <v-icon color="red lighten-1">place</v-icon>
          <span class="red--text text--lighten-1">View Marker</span>
        </a>
      </div>
      <open-map-with-marker v-if="isShowMarker" :center="markerCenter" readonly/>
      <v-list-tile v-if="taskObject.symbol">
        <v-list-tile-content>
          <v-list-tile-sub-title>Symbol</v-list-tile-sub-title>
          <v-list-tile-title v-html="taskObject.symbol"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="taskObject.address">
        <v-list-tile-content>
          <v-list-tile-sub-title>Crypto Address</v-list-tile-sub-title>
          <v-list-tile-title v-html="taskObject.address"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <div class="json-address">
          <v-text-field
            ref="urlInput"
            :value="taskUrl"
            class="url-field"
            readonly
          />
          <v-btn class="button-copy" color="#20C3A5" @click="copyUrl">{{ copyButtonText }}</v-btn>
        </div>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-sub-title>Privacy</v-list-tile-sub-title>
          <v-list-tile-title v-html="taskObject.private ? 'Private' : 'Public'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-sub-title>Archived</v-list-tile-sub-title>
          <v-list-tile-title v-html="taskObject.archived ? 'Yes' : 'No'"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="taskObject.createdtime">
        <v-list-tile-content>
          <v-list-tile-sub-title>Date Created</v-list-tile-sub-title>
          <v-list-tile-title v-html="new Date(taskObject.createdtime).toLocaleString()"></v-list-tile-title>
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
  name: 'TaskInfo',
  data: () => ({
    copyButtonText: 'Copy',
    isFavorite: false,
    isLoading: false,
    isShowMarker: false,
    markerCenter: null,
    currentAmount: null
  }),
  props: {
    taskObject: {
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
    taskUrl () {
      // parsing blockstack gaia hub cong from localhost for creating hub url
      const urlItems = JSON.parse(localStorage['blockstack-gaia-hub-config'])
      // creating hub url(where our files are stored)
      const hubUrl = this.hubUrl ? `${urlItems.url_prefix}${this.hubUrl}/` : `${urlItems.url_prefix}${this.taskObject.owner}/`
      return this.taskObject ? `${hubUrl}task_${this.taskObject.createdtime}.json` : ''
    },
    isOwned () {
      return storageService.isResourceOwned(this.taskObject.owner)
    }
  },
  methods: {
    redirectUser (address) {
      this.$store.state.BTCAddress = address
      this.$router.push({name: 'Send'})
    },
    getFavTaskName () {
      const taskUrlArr = this.taskUrl.split('/')
      return `${taskUrlArr.pop().split('.')[0]}_${taskUrlArr.pop()}`
    },
    copyUrl (e) {
      this.$refs.urlInput.$refs.input.select()
      document.execCommand('copy')
      this.copyButtonText = 'Copied!'
      setTimeout(() => { this.copyButtonText = 'Copy' }, 2000)
    },
    addToFavorite () {
      this.isLoading = true
      storageService.updateFavoriteTaskIndex(this.getFavTaskName(), this.taskObject.title)
        .then(() => {
          this.isFavorite = true
          this.isLoading = false
        })
    },
    removeFromFavorite () {
      this.isLoading = true
      storageService.reduceFavoriteTaskIndex(this.getFavTaskName(), this.taskObject.title)
        .then(() => {
          this.isFavorite = false
          this.isLoading = false
        })
    }
  },
  mounted () {
    if (!this.hubUrl) {
      this.$store.commit('toggleLoading')
      storageService.getFile({ fileName: 'my_fav_tasks.json', options: { decrypt: false } })
        .then(res => {
          if (res) {
            this.isFavorite = !!res[this.getFavTaskName()]
          }
        })
        .then(() => {
          if (this.taskObject.marker) {
            axios.get(this.taskObject.marker.address)
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
        .then(() => {
          axios.get('https://blockchain.info/q/addressbalance/' + this.taskObject.address)
            .then((res) => {
              console.log(res)
              this.currentAmount = res.data
            })
        })
    }
  }
}
</script>
