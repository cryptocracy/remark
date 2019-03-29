<template>
  <div>
    <v-layout v-if="searchResult.length > 0 && isResolved" row>
      <v-flex xs12 sm8 offset-sm2>
        <v-card class="br20">
          <v-subheader>Search Results</v-subheader>
          <v-list two-line>
            <template v-for="(item, index) in searchResult">
              <v-divider
                v-if="index !== 0"
                :inset="true"
                :key="index"
              ></v-divider>

              <v-list-tile
                :key="item.index"
                avatar
                @click="showChannelProfile(item)">

                <!-- <v-btn outline fab small color="teal accent-4"><v-icon  large @click="addToChannels(item)" color="teal accent-4">checked</v-icon></v-btn> -->
                <v-list-tile-avatar class="ml-2">
                  <img v-if="item.profile.hasOwnProperty('image')" :src="item.profile.image[0].contentUrl">
                  <v-icon v-else large color="purple accent-4">person</v-icon>

                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title v-html="item.fullyQualifiedName"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.profile.name"></v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-tooltip bottom v-if="!addedChannels.hasOwnProperty(item.fullyQualifiedName)">
                    <v-btn slot="activator" @click.stop="updateChannels(item, 'addition')" outline fab small color="purple accent-4">
                      <v-icon  color="purple accent-4">add_to_queue</v-icon>
                    </v-btn>
                    <span>Subscribe to this Channel</span>
                  </v-tooltip>

                  <v-tooltip bottom v-else>
                    <v-btn slot="activator" @click.stop="updateChannels(item, 'deletion')" outline fab small color="purple accent-4">
                      <v-icon  color="purple accent-4">delete</v-icon>
                    </v-btn>
                    <span>Unsubscribe from this Channel</span>
                  </v-tooltip>
                </v-list-tile-action>
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
        color="purple accent-4"
        indeterminate
      ></v-progress-circular>
    </div>
    <div v-else class="mt-5 text-xs-center">
      <h1>No Channels found</h1>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import channelService from '@/services/channels'

export default {
  name: 'channels-results',
  computed: {
    ...mapGetters({
      isSearching: 'isSearching',
      isResolved: 'isResolved',
      searchResult: 'getSearchResult',
      channels: 'getChannels'
    }),
    // computed property for showing addition/deletion button on channels
    addedChannels () {
      // creating an object with fullyQualifiedName as key/value to check,
      // wheteher a channel is already is in the channel list or not with O(1) as time complexity(just like to brag)
      const addedChannels = {}
      if (this.channels.length > 0) {
        this.channels.forEach((item) => {
          this.$set(addedChannels, item.fullyQualifiedName, item.fullyQualifiedName)
        })
      }
      return addedChannels
    }
  },
  mixins: [channelService],
  methods: {
    showChannelProfile (channel) {
      // setting user data for quick view of profile (now user does'nt have to wait for API response for searching user profile)
      this.$store.commit('MUTATION_SET_USER', channel)
      this.$store.commit('MUTATION_SET_REDIRECTION_STATE', true)
      this.$store.commit('MUTATION_SET_SEARCH_STATE', false)
      this.$store.commit('MUTATION_SET_SEARCH_RESULT', [])
      // taking user to profile page with user id as params
      this.$router.push({ name: 'Profile', params: { id: channel.fullyQualifiedName } })
    }
  },
  mounted () {
    // method from channelService mixin
    // updateChannels in HTML above is also from same mixin
    this.getChannels()
  }
}
</script>

<style>
</style>
