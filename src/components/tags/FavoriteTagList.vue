<template>
  <tag-list :tagsArray="tagsArray"/>
</template>

<script>
import TagList from './TagList'
import axios from 'axios'

const storageFile = 'my_fav_tags.json'

export default {
  name: 'MyFavoriteTagList',
  components: {
    TagList
  },
  data: () => ({
    blockstack: window.blockstack,
    storageFile: storageFile,
    tagsArray: []
  }),
  methods: {
    fetchTagFile () {
      // fetching project list
      this.blockstack.getFile(this.storageFile, { decrypt: false })
        .then((tagsText) => {
          const tags = JSON.parse(tagsText || '[]')
          const urlPrefix = JSON.parse(localStorage['blockstack-gaia-hub-config']).url_prefix
          // looping over project list to fetch unique json files for every project
          for (let tag in tags) {
            axios.get(`${urlPrefix}${tag.split('_')[2]}/tag_${tag.split('_')[1]}.json`).then((tagJson) => {
              this.tagsArray.push(tagJson.data)
            })
          }
        })
    }
  },
  mounted () {
    this.fetchTagFile()
  }
}
</script>

<style scoped>

</style>
