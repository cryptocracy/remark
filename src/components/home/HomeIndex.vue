<template lang="html">
  <div class="container-fluid">
    <div>
      <v-layout row flex-wrap>
        <v-flex md12>
          <v-card>
            <h1>Latest Sound Discovery Coming Soon</h1>
          </v-card>
        </v-flex>
        <v-flex md12>
          <v-card :hover="true" class="br20">
            <v-card-text>
              <v-layout row>
                <v-flex v-if="lazyLoadedData[item.contentUrl]" class="space-between">
                  <h4 class="inline-block">{{lazyLoadedData[item.contentUrl].title}} TITLE</h4>
                </v-flex>
              </v-layout>
              <div>{{type(item.contentUrl)}}</div>
              <div class="v-list__tile__sub-title" v-if="lazyLoadedData[item.contentUrl]" >{{lazyLoadedData[item.contentUrl].description}} DETAIL</div>
              <div class="v-list__tile__sub-title">Storage URL: <span>{{item.contentUrl}}</span></div>
            </v-card-text>
            <v-tooltip bottom>
              <v-btn :disabled="!lazyLoadedData[item.contentUrl]" v-if="!isAdded" @click="$store.commit('MUTATION_ADD_TO_PLAYLIST', lazyLoadedData[item.contentUrl]); isAdded = true" color="primary" slot="activator" round icon ><v-icon>playlist_add</v-icon></v-btn>
              <v-btn v-else  color="primary" slot="activator" round icon ><v-icon>done</v-icon></v-btn>
              <span v-if="!isAdded">Add to current playlist</span>
              <span v-else>Added to current playlist</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-btn slot="activator" icon color="primary" @click="$store.commit('MUTATION_SET_SOUND', lazyLoadedData[item.contentUrl])" round ><v-icon>play_arrow</v-icon></v-btn>
              <span>Play</span>
            </v-tooltip>
            <div class="v-list__tile__sub-title"><v-btn><v-icon color="red accent-4">favorite_border</v-icon> {{item.votes}} </v-btn> - Created: {{new Date(Number(item.createdOn)).toDateString()}}</div>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  computed: {
  },
  data: () => ({
    timer: null
  }),
  methods: {}
}
</script>

<style scoped lang="css">
span {
  color: grey
}
/* .map-wrapper-ini {
  padding-bottom: 37.5%;
}
.map-wrapper {
  padding-bottom: 0%
} */
</style>
