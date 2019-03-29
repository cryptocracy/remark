<template>
  <v-container>
    <v-layout row wrap justify-center>
      <v-flex xs10>
        <v-layout justify-end row wrap>
          <v-flex xs3 class='quorumList'>
            <v-select
              label="Sort By"
              :items="list"
              v-model="sortBy"
              @input="changeSortBy"
            >
            </v-select>
          </v-flex>
        </v-layout>

        <v-flex class="quorumtour">
          <v-card :hover="true" @click="redirectUser(item)" class="br20 mt-2" v-for="(item, index) in quorumData" :key="index">
            <v-card-text>
              <v-layout row>
                <v-flex v-if="lazyLoadedData[item.contentUrl]" class="space-between">
                  <h4 class="inline-block">{{lazyLoadedData[item.contentUrl].title}}</h4>
                  <v-btn dark color="teal accent-4" icon><v-icon dark>keyboard_arrow_right</v-icon></v-btn>
                </v-flex>
              </v-layout>
              <div>{{type(item.contentUrl)}}</div>
              <div class="v-list__tile__sub-title" v-if="lazyLoadedData[item.contentUrl]" >{{lazyLoadedData[item.contentUrl].description}}</div>
              <div class="v-list__tile__sub-title">Votes: {{item.votes}}</div>
              <div class="v-list__tile__sub-title">Content URL: <span>{{item.contentUrl}}</span></div>
              <div class="v-list__tile__sub-title">Created On: {{new Date(Number(item.createdOn)).toDateString()}}</div>
            </v-card-text>
            <!-- <v-list two-line>
              <v-list-tile-action></v-list-tile-action>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-sub-title>Votes: {{item.votes}}</v-list-tile-sub-title>
                  <v-list-tile-sub-title>Content URL: <span>{{item.contentUrl}}</span></v-list-tile-sub-title>
                  <v-list-tile-sub-title>Created On: {{new Date(Number(item.createdOn)).toDateString()}}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list> -->
          </v-card>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    list: [
      { text: 'Popularity', value: 'pop' },
      { text: 'Votes Sum', value: 'sum' }
    ],
    sortBy: 'pop',
    lazyLoadedData: {}
  }),
  computed: {
    ...mapGetters({
      quorumData: 'getQuorumData',
      contentUrlsData: 'getcontentUrlsData'
    })
  },
  watch: {
    deep: true,
    contentUrlsData () {
      this.lazyLoadedData = {}
      this.contentUrlsData.forEach(element => {
        this.lazyLoadedData[element.contentUrl] = element
      })
    }
  },
  methods: {
    type (contentUrl) {
      let type = contentUrl.includes('marker') ? 'MARKER'
        : contentUrl.includes('image') ? 'IMAGE'
          : contentUrl.includes('event') ? 'EVENT' : ''
      return type
    },
    async redirectUser (content) {
      this.$store.commit('toggleLoading')
      await this.$store.dispatch('ACTION_GET_CONTENT', content.contentUrl)
      this.$store.commit('toggleLoading')
      if (content.contentUrl.includes('marker')) this.$router.push({name: 'OwnedMarkers'})
      else if (content.contentUrl.includes('tag')) this.$router.push({name: 'Owned'})
      else if (content.contentUrl.includes('image')) this.$router.push({name: 'OwnedImages'})
      else if (content.contentUrl.includes('event')) this.$router.push({name: 'OwnedEvents'})
    },
    async changeSortBy () {
      this.$store.commit('toggleLoading')
      await this.$store.dispatch('ACTION_GET_QUORUM_DATA', { sort: this.sortBy })
      this.$store.commit('toggleLoading')
    }
  },
  created () {
    this.$store.dispatch('ACTION_GET_QUORUM_DATA', { sort: 'pop' })
  }
}
</script>

<style>
.br20 {
  border-radius: 20px
}
.inline-block {
  display: inline-block;
}
.space-between {
  margin-left: 2%;
  display: flex;
  justify-content: space-between;
  align-items: center
}
.v-list__tile__sub-title {
  color: rgba(0,0,0,.54)
}
</style>
