<template lang="html">
  <div class="container-fluid">
    <div>
      <v-layout row flex-wrap>
        <v-flex md12>
          <v-card class="br20">
            <v-card-text>
              <v-layout row>
                <v-flex class="space-between">
                  <h4 class="inline-block">COMING SOON</h4>
                </v-flex>
              </v-layout>
              <div></div>
              <div class="v-list__tile__sub-title">The Latest Uploads from Subscribed Channels</div>
              <div class="v-list__tile__sub-title">Storage URL: <span></span></div>
            </v-card-text>
            <v-tooltip bottom>
              <v-btn color="primary" slot="activator" round icon ><v-icon>playlist_add</v-icon></v-btn>
              <span>Add to current playlist</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-btn slot="activator" icon color="primary" round ><v-icon>play_arrow</v-icon></v-btn>
              <span>Play</span>
            </v-tooltip>
            <div class="v-list__tile__sub-title"><v-btn><v-icon color="red accent-4">favorite_border</v-icon> 0 </v-btn> - Created: </div>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import channelService from '@/services/channels'
import { mapGetters } from 'vuex'

export default {
  mixins: [channelService],
  computed: {
    ...mapGetters({
      channelFeed: 'getChannelsFeed'
    })
  },
  data: () => ({
  }),
  created () {
    this.getChannels()
  }
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
