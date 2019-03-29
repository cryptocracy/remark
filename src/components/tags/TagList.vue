<template>
  <div class="container">
    <v-layout row v-show="tagsArray.length">

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
              v-for="tag in filteredTagsArray"
              :key="tag.createdtime"
              :to="{name: 'TagInfo', params: {
                tagName: 'tag_'+tag.createdtime,
                tagObject: tag,
                hubUrl: hubUrl
              }}"
            >
              <v-list-tile-avatar>
                <v-icon color="blue lighten-4">label</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title v-text="tag.title"/>
                <v-list-tile-sub-title v-text="tag.detail"/>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn v-if="owned" icon :to="{ name: 'EditTag', params: { tagProp: tag } }">
                  <v-icon color="grey lighten-1">edit</v-icon>
                </v-btn>
                <v-btn v-if="!hubUrl" icon @click.stop.prevent="removeFavorite($event, tag)">
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
  name: 'TagList',
  data: () => ({
    blockstack: window.blockstack,
    filterArchived: true,
    filterActive: true,
    sortBy: 'name',
    tags: []
  }),
  props: {
    tagsArray: {
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
    filteredTagsArray () {
      let sortFunc = (prev, next) => this.sortBy === 'name' ? prev.title.localeCompare(next.title) : prev.createdtime - next.createdtime
      return this.tags.filter(tag => (this.filterArchived && tag.archived) || (this.filterActive && !tag.archived)).slice(0).sort(sortFunc)
    }
  },
  methods: {
    getFavTagName (tag) {
      return `tag_${tag.createdtime}_${JSON.parse(localStorage['blockstack-gaia-hub-config']).address}`
    },
    removeFavorite (e, tag) {
      storageService.reduceFavoriteTagIndex(this.getFavTagName(tag), tag.title)
      this.tags = this.tags.filter(item => item.createdtime !== tag.createdtime)
    }
  },
  mounted () {
    this.tags = this.tagsArray
  }
}
</script>
