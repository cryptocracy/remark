<template lang="html">
  <v-menu light bottom left min-width=200>
    <v-btn icon slot="activator" dark>
      <v-avatar size="32px">
        <img v-if="profileData.hasOwnProperty('profile') && profileData.profile.hasOwnProperty('image')" :src="profileData.profile.image[0].contentUrl" alt="avatar">
        <v-icon v-else>account_circle</v-icon>
      </v-avatar>
    </v-btn>
    <v-list>
      <v-list-tile @click="showProfile">
        <v-list-tile-action>
          <v-icon>face</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Profile</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="dummyFunction">
        <v-list-tile-action>
          <v-icon>color_lens</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Theme</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="redirectToSettings">
        <v-list-tile-action>
          <v-icon>settings</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Settings</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
      <v-list-tile @click="signOut">
        <v-list-tile-action>
          <v-icon>exit_to_app</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Logout</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-menu>

</template>

<script>
import { mapGetters } from 'vuex'
import profileAvatar from '../../assets/img/user12.jpg'

export default {
  computed: {
    ...mapGetters({
      profileData: 'getProfileData'
    })
  },
  data: () => ({
    profileAvatar,
    blockstack: window.blockstack
  }),
  methods: {
    showProfile () {
      this.$store.commit('MUTATION_SET_USER')
      this.$store.commit('MUTATION_SET_SEARCH_STATE', false)
      this.$store.commit('MUTATION_SET_SEARCH_RESULT', [])
      this.$router.push({ name: 'Profile', params: { id: 'my-profile' } })
    },
    redirectToSettings () {
      this.$router.push({name: 'Settings'})
    },
    signOut () {
      this.blockstack.signUserOut(window.location.href)
      window.location.href = '/'
    }
  }
}
</script>

<style lang="css">
</style>
