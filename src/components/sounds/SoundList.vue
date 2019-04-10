<template>
  <div class="container">
    <v-layout row v-show="soundsArray.length">

      <v-flex xs12 sm10 offset-sm1>
        <v-card class="br20">
          <div class="entity-preferences">
            <div class="entity-filter">
              <div class="entity-check-group">
                <v-checkbox
                  v-model="filterAll"
                  :disabled="filterAll"
                />
                <span class="checkbox-label">All</span>
              </div>
              <div class="entity-check-group">
                <v-checkbox v-model="filterArchived"/>
                <span class="checkbox-label">Archived</span>
              </div>
              <div class="entity-check-group">
                <v-checkbox v-model="filterActive"/>
                <span class="checkbox-label">Active</span>
              </div>
            </div>
            <div class="entity-sorting">
              <v-radio-group v-model="sortBy" row>
                <div class="entity-radio-group">
                  <v-radio value="name"></v-radio>
                  <span class="radio-label">By Name</span>
                </div>
                <div class="entity-radio-group">
                  <v-radio value="date"></v-radio>
                  <span class="radio-label">By Date</span>
                </div>
              </v-radio-group>
            </div>
          </div>
          <v-divider/>
          <v-list two-line subheader>
            <v-list-tile
              v-for="sound in filteredSoundsArray"
              :key="sound.createdtime"
              :to="{name: 'SoundInfo', params: {
                soundName: 'sound_'+sound.createdtime,
                soundObject: sound,
                hubUrl
              }}"
            >
              <v-list-tile-avatar>
                <v-icon color="blue lighten-2">fa-play-circle</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title v-text="sound.title"/>
                <v-list-tile-sub-title v-text="sound.detail"/>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn v-if="owned" icon :to="{ name: 'EditSound', params: { soundProp: sound } }">
                  <v-icon color="grey lighten-1">edit</v-icon>
                </v-btn>
                <v-btn v-if="!owned && !hubUrl" icon @click.stop.prevent="removeFavorite($event, sound)">
                  <v-icon color="grey lighten-1">favorite_border</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import storageService from '@/services/blockstack-storage'

export default {
  name: 'SoundList',
  data: () => ({
    blockstack: window.blockstack,
    filterArchived: false,
    filterActive: true,
    sortBy: 'name',
    sounds: []
  }),
  props: {
    soundsArray: {
      type: Array,
      required: true,
      default: () => []
    },
    owned: {
      type: Boolean
    },
    hubUrl: {
      type: String
    }
  },
  computed: {
    filterAll: {
      get () {
        return this.filterArchived && this.filterActive
      },
      set () {
        this.filterArchived = true
        this.filterActive = true
        this.filterUpcoming = true
      }
    },
    filteredSoundsArray () {
      let sortFunc = (prev, next) => {
        if (this.sortBy === 'name') return prev.title.localeCompare(next.title)
        else if (this.sortBy === 'date') return prev.createdtime - next.createdtime
      }
      return this.sounds.filter(sound => (this.filterArchived && sound.archived) || (this.filterActive && !sound.archived)).slice(0).sort(sortFunc)
    }
  },
  methods: {
    getFavSoundName (sound) {
      return `sound_${sound.createdtime}_${JSON.parse(localStorage['blockstack-gaia-hub-config']).address}`
    },
    removeFavorite (e, sound) {
      storageService.reduceFavoriteSoundIndex(this.getFavSoundName(sound), sound.title)
      this.sounds = this.sounds.filter(item => item.createdtime !== sound.createdtime)
    }
  },
  mounted () {
    this.sounds = this.soundsArray
  }
}
</script>
