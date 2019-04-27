<template>
  <sound-list :soundsArray="soundsArray"/>
</template>

<script>
import SoundList from './SoundList'
import axios from 'axios'

const storageFile = 'my_fav_sounds.json'

export default {
  name: 'MyFavoriteSoundList',
  components: {
    SoundList
  },
  data: () => ({
    blockstack: window.BlockstackUserSession,
    storageFile: storageFile,
    soundsArray: []
  }),
  methods: {
    fetchSoundFile () {
      // fetching project list
      this.blockstack.getFile(this.storageFile, { decrypt: false })
        .then((soundsText) => {
          const sounds = JSON.parse(soundsText || '[]')
          const urlPrefix = JSON.parse(localStorage['blockstack-gaia-hub-config']).url_prefix
          // looping over project list to fetch unique json files for every project
          for (let sound in sounds) {
            axios.get(`${urlPrefix}${sound.split('_')[2]}/sound_${sound.split('_')[1]}.json`).then((soundJson) => {
              this.soundsArray.push(soundJson.data)
            })
          }
        })
    }
  },
  mounted () {
    this.fetchSoundFile()
  }
}
</script>

<style scoped>

</style>
