<template>
  <marker-list
    :markersArray='markersArray'
    :owned="!!!hubUrl"
    :hubUrl="hubUrl"
  />
</template>

<script>
import axios from 'axios'
import MarkerList from './MarkerList'
import { mapGetters } from 'vuex'

const storageFile = 'my_markers.json'

export default {
  name: 'MyMarkerList',
  components: {
    MarkerList
  },
  computed: {
    ...mapGetters({
      contentData: 'getContentData'
    })
  },
  data: () => ({
    blockstack: window.blockstack,
    storageFile: storageFile,
    markersArray: [],
    hubUrl: ''
  }),
  methods: {
    fetchMarkerFile () {
      // fetching project list
      this.blockstack.getFile(this.storageFile, { decrypt: false })
        .then((markersText) => {
          const markers = JSON.parse(markersText || '[]')
          // looping over project list to fetch unique json files for every project
          for (let marker in markers) {
            this.blockstack.getFile(`${marker}.json`, { decrypt: false }).then((markerJson) => {
              let markerData = typeof markerJson === 'string' ? JSON.parse(markerJson) : {}
              // this[data.id] = markerData
              // this[data.id].tasks = this[data.id].tasks || []
              // creating task array for listing tasks under their respective project
              this.markersArray.push(markerData)
            })
          }
        })
    },

    fetchRedirectedUsersMarkerFile (hubUrl) {
      // fetching project list
      axios.get(hubUrl + storageFile)
        .then((markersText) => {
          const markers = markersText.data || {}
          // looping over project list to fetch unique json files for every project
          for (let marker in markers) {
            axios.get(`${hubUrl + marker}.json`).then((markerJson) => {
              let markerData = markerJson ? markerJson.data : {}
              // this[data.id] = tagData
              // this[data.id].tasks = this[data.id].tasks || []
              // creating task array for listing tasks under their respective project
              this.markersArray.push(markerData)
            })
          }
        })
    }
  },
  mounted () {
    let hubUrl = this.$store.state.hubUrl
    if (hubUrl) {
      this.hubUrl = hubUrl
      this.fetchRedirectedUsersMarkerFile(hubUrl)
    } else if (this.contentData && Object.keys(this.contentData).length > 0) {
      this.markersArray.push(this.contentData)
      this.hubUrl = this.contentData.owner
    } else {
      this.fetchMarkerFile()
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
