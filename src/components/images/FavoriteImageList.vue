<template>
  <image-list :imagesArray="imagesArray"/>
</template>

<script>
import ImageList from './ImageList'
import axios from 'axios'

const storageFile = 'my_fav_images.json'

export default {
  name: 'MyFavoriteImageList',
  components: {
    ImageList
  },
  data: () => ({
    blockstack: window.blockstack,
    storageFile: storageFile,
    imagesArray: []
  }),
  methods: {
    fetchImageFile () {
      // fetching project list
      this.blockstack.getFile(this.storageFile, { decrypt: false })
        .then((imagesText) => {
          const images = JSON.parse(imagesText || '[]')
          const urlPrefix = JSON.parse(localStorage['blockstack-gaia-hub-config']).url_prefix
          // looping over project list to fetch unique json files for every project
          for (let image in images) {
            axios.get(`${urlPrefix}${image.split('_')[2]}/image_${image.split('_')[1]}.json`).then((imageJson) => {
              this.imagesArray.push(imageJson.data)
            })
          }
        })
    }
  },
  mounted () {
    this.fetchImageFile()
  }
}
</script>

<style scoped>

</style>
