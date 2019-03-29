<template>
  <div class="container">
    <v-layout row v-show="imagesArray.length">

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
              v-for="image in filteredImagesArray"
              :key="image.createdtime"
              :to="{name: 'ImageInfo', params: {
                imageName: 'image_'+image.createdtime,
                imageObject: image,
                hubUrl
              }}"
            >
              <v-list-tile-avatar>
                <v-icon color="green lighten-4">image</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title v-text="image.title"/>
                <v-list-tile-sub-title v-text="image.detail"/>
              </v-list-tile-content>

              <v-list-tile-action v-if="!hubUrl">
                <v-btn v-if="owned" icon :to="{ name: 'EditImage', params: { imageProp: image } }">
                  <v-icon color="grey lighten-1">edit</v-icon>
                </v-btn>
                <v-btn v-else icon @click.stop.prevent="removeFavorite($event, image)">
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
  name: 'ImageList',
  data: () => ({
    blockstack: window.blockstack,
    filterArchived: true,
    filterActive: true,
    sortBy: 'name',
    images: []
  }),
  props: {
    imagesArray: {
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
    filteredImagesArray () {
      let sortFunc = (prev, next) => this.sortBy === 'name' ? prev.title.localeCompare(next.title) : prev.createdtime - next.createdtime
      return this.images.filter(image => (this.filterArchived && image.archived) || (this.filterActive && !image.archived)).slice(0).sort(sortFunc)
    }
  },
  methods: {
    getFavImageName (image) {
      return `image_${image.createdtime}_${JSON.parse(localStorage['blockstack-gaia-hub-config']).address}`
    },
    removeFavorite (e, image) {
      storageService.reduceFavoriteImageIndex(this.getFavImageName(image), image.title)
      this.images = this.images.filter(item => item.createdtime !== image.createdtime)
    }
  },
  mounted () {
    this.images = this.imagesArray
  }
}
</script>
