<template>
  <sound-list
    :soundsArray='soundsArray'
    :owned="!!!hubUrl"
    :hubUrl="hubUrl"
  />
</template>

<script>
import SoundList from './SoundList'
import axios from 'axios'
import { mapGetters } from 'vuex'

const storageFile = 'my_sounds.json'

export default {
  name: 'MySoundList',
  components: {
    SoundList
  },
  computed: {
    ...mapGetters({
      contentData: 'getContentData'
    })
  },
  data: () => ({
    blockstack: window.blockstack,
    storageFile: storageFile,
    soundsArray: [],
    hubUrl: ''
  }),
  methods: {
    fetchSoundFile () {
      // fetching project list
      this.blockstack.getFile(this.storageFile, { decrypt: false })
        .then((soundsText) => {
          const sounds = JSON.parse(soundsText || '[]')
          // looping over project list to fetch unique json files for every project
          for (let sound in sounds) {
            this.blockstack.getFile(`${sound}.json`, { decrypt: false }).then((soundJson) => {
              let soundData = typeof soundJson === 'string' ? JSON.parse(soundJson) : {}
              // this[data.id] = soundData
              // this[data.id].tasks = this[data.id].tasks || []
              // creating task array for listing tasks under their respective project
              this.soundsArray.push(soundData)
            })
          }
        })
    },

    fetchRedirectedUsersSoundFile (hubUrl) {
      // fetching project list
      axios.get(hubUrl + storageFile)
        .then((soundsText) => {
          const sounds = soundsText.data || {}
          // looping over project list to fetch unique json files for every project
          for (let sound in sounds) {
            axios.get(`${hubUrl + sound}.json`).then((soundJson) => {
              let soundData = soundJson ? soundJson.data : {}
              this.soundsArray.push(soundData)
            })
          }
        })
    }
  },
  mounted () {
    let hubUrl = this.$store.state.hubUrl
    if (hubUrl) {
      this.hubUrl = hubUrl
      this.fetchRedirectedUsersSoundFile(hubUrl)
    } else if (this.contentData && Object.keys(this.contentData).length > 0) {
      this.soundsArray.push(this.contentData)
      this.hubUrl = this.contentData.owner
    } else {
      this.fetchSoundFile()
    }
  },
  destroyed () {
    this.$store.state.hubUrl = null
    this.$store.commit('MUTATION_SET_CONTENT_DATA', null)
  }
}
</script>

<style scoped>

</style>
