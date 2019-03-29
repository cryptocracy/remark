<template>
  <div class="container">
    <v-layout row v-show="eventsArray.length">

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
              <div class="entity-check-group">
                <v-checkbox v-model="filterUpcoming"/>
                <span class="checkbox-label">Upcoming</span>
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
                <div class="entity-radio-group">
                  <v-radio value="startDate"></v-radio>
                  <span class="radio-label">By Start Date</span>
                </div>
              </v-radio-group>
            </div>
          </div>
          <v-divider/>
          <v-list two-line subheader>
            <v-list-tile
              v-for="event in filteredEventsArray"
              :key="event.createdtime"
              :to="{name: 'EventInfo', params: {
                eventName: 'event_'+event.createdtime,
                eventObject: event,
                hubUrl: hubUrl
              }}"
            >
              <v-list-tile-avatar>
                <v-icon color="orange lighten-4">today</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title v-text="event.title"/>
                <v-list-tile-sub-title v-text="event.detail"/>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn v-if="owned" icon :to="{ name: 'EditEvent', params: { eventProp: event } }">
                  <v-icon color="grey lighten-1">edit</v-icon>
                </v-btn>
                <v-btn v-if="!hubUrl" icon @click.stop.prevent="removeFavorite($event, event)">
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
  name: 'EventList',
  data: () => ({
    blockstack: window.blockstack,
    filterArchived: false,
    filterActive: false,
    filterUpcoming: true,
    sortBy: 'name',
    events: []
  }),
  props: {
    eventsArray: {
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
    filteredEventsArray () {
      let sortFunc = (prev, next) => {
        if (this.sortBy === 'name') return prev.title.localeCompare(next.title)
        else if (this.sortBy === 'date') return prev.createdtime - next.createdtime
        else return +new Date(prev.start) - new Date(next.start)
      }
      return this.events.filter(event => (this.filterArchived && event.archived) || (this.filterActive && !event.archived) || (this.filterUpcoming && (+new Date() < +new Date(event.end)))).slice(0).sort(sortFunc)
    }
  },
  methods: {
    getFavEventName (event) {
      return `event_${event.createdtime}_${JSON.parse(localStorage['blockstack-gaia-hub-config']).address}`
    },
    removeFavorite (e, event) {
      storageService.reduceFavoriteEventIndex(this.getFavEventName(event), event.title)
      this.events = this.events.filter(item => item.createdtime !== event.createdtime)
    }
  },
  mounted () {
    this.events = this.eventsArray
  }
}
</script>
