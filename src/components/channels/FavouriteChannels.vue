<template>
  <div class="container">
    <div>
      <v-layout v-if="channels.length > 0" row>
        <v-flex xs12 sm8 offset-sm2>
          <v-card class="br20">
            <!--            <v-toolbar color="teal accent-4" dark>
              <v-toolbar-side-icon><v-icon>channels</v-icon></v-toolbar-side-icon>

              <v-toolbar-title>My Channels</v-toolbar-title>

              <v-spacer></v-spacer>

            </v-toolbar>-->
            <!-- <v-subheader>My Channels</v-subheader> -->
            <v-list two-line>
              <template v-for="(item, index) in channels">
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
                    <v-icon v-else large color="blue accent-4">loupe</v-icon>

                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title v-html="item.fullyQualifiedName"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="item.profile.name"></v-list-tile-sub-title>
                  </v-list-tile-content>

                  <v-list-tile-action>

                    <v-tooltip bottom>
                      <v-btn slot="activator" @click.stop="updateChannels(item, 'deletion')" outline fab small color="red accent-4">
                        <v-icon  color="red accent-4">cancel</v-icon>
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
      <div v-else class="mt-5 text-xs-center">
        <h1>You're not subscribed to any Channels yet.</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import channelService from '@/services/channels'

export default {
  name: 'subscribed-channels',
  computed: {
    ...mapGetters({
      channels: 'getChannels'
    })
  },
  mixins: [channelService],
  methods: {
    showChannelProfile (channel) {
      this.$store.commit('MUTATION_SET_USER', channel)
      this.$store.commit('MUTATION_SET_REDIRECTION_STATE', true)
      this.$store.commit('MUTATION_SET_SEARCH_STATE', false)
      this.$store.commit('MUTATION_SET_SEARCH_RESULT', [])
      this.$router.push({ name: 'Profile', params: { id: channel.fullyQualifiedName } })
    }
  },
  mounted () {
    // method from channelService mixin
    this.getChannels()
  }
}
</script>
