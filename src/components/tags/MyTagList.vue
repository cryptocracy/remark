<template>
  <tag-list
    :tagsArray='tagsArray'
    :hubUrl='hubUrl'
    :owned="!!!hubUrl"
  />
</template>

<script>
import TagList from './TagList'
import axios from 'axios'
import { mapGetters } from 'vuex'

const storageFile = 'my_tags.json'

export default {
  name: 'MyTagList',
  components: {
    TagList
  },
  computed: {
    ...mapGetters({
      contentData: 'getContentData'
    })
  },
  data: () => ({
    blockstack: window.blockstack,
    storageFile: storageFile,
    tagsArray: [],
    hubUrl: ''
  }),
  methods: {
    fetchTagFile () {
      // fetching project list
      this.blockstack.getFile(this.storageFile, { decrypt: false })
        .then((tagsText) => {
          const tags = JSON.parse(tagsText || '[]')
          // looping over project list to fetch unique json files for every project
          for (let tag in tags) {
            this.blockstack.getFile(`${tag}.json`, { decrypt: false }).then((tagJson) => {
              let tagData = typeof tagJson === 'string' ? JSON.parse(tagJson) : {}
              // this[data.id] = tagData
              // this[data.id].tasks = this[data.id].tasks || []
              // creating task array for listing tasks under their respective project
              this.tagsArray.push(tagData)
            })
          }
        })
    },
    fetchRedirectedUsersTagFile (hubUrl) {
      // fetching project list
      axios.get(hubUrl + storageFile)
        .then((tagsText) => {
          const tags = tagsText.data || {}
          // looping over project list to fetch unique json files for every project
          for (let tag in tags) {
            axios.get(`${hubUrl + tag}.json`).then((tagJson) => {
              let tagData = tagJson ? tagJson.data : {}
              this.tagsArray.push(tagData)
            })
          }
        })
    }
  },
  mounted () {
    let hubUrl = this.$store.state.hubUrl
    if (hubUrl) {
      this.hubUrl = hubUrl
      this.fetchRedirectedUsersTagFile(hubUrl)
    } else if (this.contentData && Object.keys(this.contentData).length > 0) {
      this.tagsArray.push(this.contentData)
      this.hubUrl = this.contentData.owner
    } else {
      this.fetchTagFile()
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
