<template>
  <div class="container">
    <div>
      <channels v-if="searchType === 'channels'"></channels>
      <tags v-if="searchType === 'tags'"></tags>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import channelsResults from './channels-results'
import tagsResults from './tags-results'

export default {
  name: 'search-results',
  components: {
    'channels': channelsResults,
    'tags': tagsResults
  },
  computed: {
    ...mapGetters({
      searchType: 'getSearchType'
    })
  }
}
</script>
<style>
  .br20 {
    border-radius: 20px
  }
</style>
