<template>
  <image-list
    :imagesArray='imagesArray'
    :owned="!!!hubUrl"
    :hubUrl="hubUrl"
  />
</template>

<script>
import axios from 'axios'
import ImageList from './ImageList'
import { mapGetters } from 'vuex'

const storageFile = 'my_images.json'

export default {
  name: 'MyImageList',
  components: {
    ImageList
  },
  computed: {
    ...mapGetters({
      contentData: 'getContentData'
    })
  },
  data: () => ({
    blockstack: window.blockstack,
    storageFile: storageFile,
    imagesArray: [],
    hubUrl: ''
  }),
  methods: {
    fetchImageFile () {
      // fetching project list
      this.blockstack.getFile(this.storageFile, { decrypt: false })
        .then((imagesText) => {
          const images = JSON.parse(imagesText || '[]')
          // looping over project list to fetch unique json files for every project
          for (let image in images) {
            this.blockstack.getFile(`${image}.json`, { decrypt: false }).then((imageJson) => {
              let imageData = typeof imageJson === 'string' ? JSON.parse(imageJson) : {}
              // this[data.id] = imageData
              // this[data.id].tasks = this[data.id].tasks || []
              // creating task array for listing tasks under their respective project
              this.imagesArray.push(imageData)
            })
          }
        })
    },

    fetchRedirectedUsersImageFile (hubUrl) {
      // fetching project list
      axios.get(hubUrl + storageFile)
        .then((imagesText) => {
          const images = imagesText.data || {}
          // looping over project list to fetch unique json files for every project
          for (let image in images) {
            axios.get(`${hubUrl + image}.json`).then((imageJson) => {
              let imageData = imageJson ? imageJson.data : {}
              this.imagesArray.push(imageData)
            })
          }
        })
    }
  },
  mounted () {
    let hubUrl = this.$store.state.hubUrl
    if (hubUrl) {
      this.hubUrl = hubUrl
      this.fetchRedirectedUsersImageFile(hubUrl)
    } else if (this.contentData && Object.keys(this.contentData).length > 0) {
      this.imagesArray.push(this.contentData)
      this.hubUrl = this.contentData.owner
    } else {
      this.fetchImageFile()
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
