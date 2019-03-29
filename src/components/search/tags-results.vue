<template>
  <div>
    <v-layout v-if="searchResult.length > 0 && isResolved" row>
      <v-flex xs12 sm8 offset-sm2>
        <v-card class="br20">
          <v-subheader>Search Results</v-subheader>
          <v-list three-line>
            <template v-for="(item, index) in searchResult">
              <v-divider
                v-if="index !== 0"
                :inset="true"
                :key="index"
              ></v-divider>

              <v-list-tile
                :key="item.index"
                avatar
                @click="redirectUser(item)">

                <v-list-tile-avatar class="ml-2">
                  <v-icon v-if="item.type === 'EVENT'" large color="teal accent-4">today</v-icon>
                  <v-icon v-if="item.type === 'TAG'" large color="teal accent-4">place</v-icon>
                  <v-icon v-if="item.type === 'IMAGE'" large color="teal accent-4">image</v-icon>
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <!-- <v-list-tile-title v-html="item.type"></v-list-tile-title> -->
                  <v-list-tile-sub-title> Type: {{item.type}} </v-list-tile-sub-title>
                  <!-- <v-list-tile-title v-html="item.createdOn"></v-list-tile-title> -->
                  <v-list-tile-sub-title > Created On: {{item.createdOn}} </v-list-tile-sub-title>
                  <!-- <v-list-tile-title v-html="item.owner"></v-list-tile-title> -->
                  <v-list-tile-sub-title>Owner: {{item.owner}}</v-list-tile-sub-title>
                  <v-list-tile-sub-title>URL: {{item.originalUrl.substring(0, 55) + '....'}}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
    <div class="mt-5 text-xs-center" v-else-if="searchResult.length === 0 && !isResolved">
      <v-progress-circular
        :size="70"
        :width="5"
        color="teal accent-4"
        indeterminate
      ></v-progress-circular>
    </div>
    <div v-else class="mt-5 text-xs-center">
      <h1>No tags found</h1>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'tags-results',
  computed: {
    ...mapGetters({
      isSearching: 'isSearching',
      isResolved: 'isResolved',
      searchResult: 'getSearchResult',
      channels: 'getChannels'
    })
  },
  methods: {
    async redirectUser (content) {
      await this.$store.dispatch('ACTION_GET_CONTENT', content.originalUrl)
      this.$store.commit('MUTATION_SET_SEARCH_STATE', false)
      this.$store.commit('MUTATION_SET_SEARCH_RESULT', [])
      if (content.originalUrl.includes('marker')) this.$router.push({name: 'OwnedMarkers'})
      else if (content.originalUrl.includes('tag')) this.$router.push({name: 'Owned'})
      else if (content.originalUrl.includes('image')) this.$router.push({name: 'OwnedImages'})
      else if (content.originalUrl.includes('event')) this.$router.push({name: 'OwnedEvents'})
    }
  }
}
</script>

<style>
</style>
