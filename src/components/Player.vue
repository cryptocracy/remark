<template>
  <v-card color="primary" class="br50">
    <v-card-text class="player-content-in p-1" >
      <h5 class="ml-3 mr-3 white--text">{{soundObject && soundObject.title.substring(0,20)}}</h5>
      <audio id="audioplayer" color="primary" :src="soundObject.sound" controls autoplay></audio>
      <v-menu open-on-hover top offset-y>
        <template slot="activator">
          <v-btn
            round
            :disabled="playlistArr.length === 0"
          >
            Playlist
          </v-btn>
        </template>

        <v-list v-if="playlistArr.length > 0">
          <v-list-tile
            v-for="(item, index) in playlistArr"
            :key="index"
            @click="$store.commit('MUTATION_SET_SOUND', item)"
          >
            <v-list-tile-title>{{ item && item.title }}</v-list-tile-title>
            <v-list-tile-action class="ml-3"><v-btn @click.stop="$store.commit('MUTATION_REMOVE_FROM_PLAYLIST', index)" small color="primary" icon><v-icon small="">close</v-icon></v-btn></v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-btn @click="$store.commit('MUTATION_HIDE_PLAYER')" icon color="primary"><v-icon>close</v-icon></v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      // audioUrl: 'audioUrl',
      playlistArr: 'playlistArr',
      soundObject: 'soundObject'
    })
  },
  mounted () {
    const audio = document.getElementById('audioplayer')
    audio.addEventListener('ended', () => {
      let currentIndex = this.playlistArr.indexOf(this.soundObject)
      if (this.playlistArr.length > (currentIndex + 1)) {
        audio.src = this.playlistArr[currentIndex + 1].sound
        audio.load()
        audio.play()
        this.$store.commit('MUTATION_SET_SOUND', this.playlistArr[currentIndex + 1])
      }
    })
  }
}
</script>

<style>
.abc{
  /* position: absolute;
  bottom: 5%; */
  display: flex;
  justify-content: center;
  left: 10%;
  right: 10%;
}
.br50 {
  border-radius: 50px;
}
.player-content-in {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
}
</style>
