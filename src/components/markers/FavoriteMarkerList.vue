<template>
  <marker-list :markersArray="markersArray"/>
</template>

<script>
import MarkerList from './MarkerList'
import axios from 'axios'

const storageFile = 'my_fav_markers.json'

export default {
  name: 'MyFavoriteMarkerList',
  components: {
    MarkerList
  },
  data: () => ({
    blockstack: window.blockstack,
    storageFile: storageFile,
    markersArray: []
  }),
  methods: {
    fetchMarkerFile () {
      // fetching project list
      this.blockstack.getFile(this.storageFile, { decrypt: false })
        .then((markersText) => {
          const markers = JSON.parse(markersText || '[]')
          const urlPrefix = JSON.parse(localStorage['blockstack-gaia-hub-config']).url_prefix
          // looping over project list to fetch unique json files for every project
          for (let marker in markers) {
            axios.get(`${urlPrefix}${marker.split('_')[2]}/marker_${marker.split('_')[1]}.json`).then((markerJson) => {
              this.markersArray.push(markerJson.data)
            })
          }
        })
    }
  },
  mounted () {
    this.fetchMarkerFile()
  }
}
</script>

<style scoped>

</style>
