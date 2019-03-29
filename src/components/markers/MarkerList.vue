<template>
  <div class="container">
    <v-layout row v-show="markersArray.length">

      <v-flex xs12 sm6 offset-sm3>
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
              v-for="marker in filteredMarkersArray"
              :key="marker.createdtime"
              :to="{name: 'MarkerInfo', params: {
                markerName: 'marker_'+marker.createdtime,
                markerObject: marker,
                hubUrl
              }}"
            >
              <v-list-tile-avatar>
                <v-icon color="red lighten-4">place</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title v-text="marker.title"/>
                <v-list-tile-sub-title v-text="marker.detail"/>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn v-if="owned" icon :to="{ name: 'EditMarker', params: { markerProp: marker } }">
                  <v-icon color="grey lighten-1">edit</v-icon>
                </v-btn>
                <v-btn v-if="!owned && !hubUrl" icon @click.stop.prevent="removeFavorite($event, marker)">
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
  name: 'MarkerList',
  data: () => ({
    blockstack: window.blockstack,
    filterArchived: true,
    filterActive: true,
    sortBy: 'name',
    markers: []
  }),
  props: {
    markersArray: {
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
      }
    },
    filteredMarkersArray () {
      let sortFunc = (prev, next) => this.sortBy === 'name' ? prev.title.localeCompare(next.title) : prev.createdtime - next.createdtime
      return this.markers.filter(marker => (this.filterArchived && marker.archived) || (this.filterActive && !marker.archived)).slice(0).sort(sortFunc)
    }
  },
  methods: {
    getFavMarkerName (marker) {
      return `marker_${marker.createdtime}_${JSON.parse(localStorage['blockstack-gaia-hub-config']).address}`
    },
    removeFavorite (e, marker) {
      storageService.reduceFavoriteMarkerIndex(this.getFavMarkerName(marker), marker.title)
      this.markers = this.markers.filter(item => item.createdtime !== marker.createdtime)
    }
  },
  mounted () {
    this.markers = this.markersArray
  }
}
</script>
