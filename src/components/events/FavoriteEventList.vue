<template>
  <event-list :eventsArray="eventsArray"/>
</template>

<script>
import EventList from './EventList'
import axios from 'axios'

const storageFile = 'my_fav_events.json'

export default {
  name: 'MyFavoriteEventList',
  components: {
    EventList
  },
  data: () => ({
    blockstack: window.BlockstackUserSession,
    storageFile: storageFile,
    eventsArray: []
  }),
  methods: {
    fetchEventFile () {
      // fetching project list
      this.blockstack.getFile(this.storageFile, { decrypt: false })
        .then((eventsText) => {
          const events = JSON.parse(eventsText || '[]')
          const urlPrefix = JSON.parse(localStorage['blockstack-session']).userData.gaiaHubConfig.url_prefix
          // looping over project list to fetch unique json files for every project
          for (let event in events) {
            axios.get(`${urlPrefix}${event.split('_')[2]}/event_${event.split('_')[1]}.json`).then((eventJson) => {
              this.eventsArray.push(eventJson.data)
            })
          }
        })
    }
  },
  mounted () {
    this.fetchEventFile()
  }
}
</script>

<style scoped>

</style>
