import cryptocracyServices from '@/services/cryptocracy'
import axios from 'axios'
const cryptocracyHandler = {
  state: {
    searchResult: [],
    contentData: {},
    quorumData: [],
    contentUrlArray: [],
    contentUrlsData: {}
  },
  mutations: {
    MUTATION_SAVE_SEARCHED_RESULT (state, payload) {
      let modifiedData = payload.reduce((acc, item) => {
        acc.push({
          fileUrl: item[0],
          distance: item[1],
          coordinates: [item[2][1], item[2][0]]
        })
        return acc
      }, [])
      state.searchResult = modifiedData
    },
    MUTATION_SET_CONTENT_DATA (state, payload) {
      state.contentData = payload
    },
    MUTATION_SET_CONTENT_URLS_DATA (state, payload) {
      payload.data['contentUrl'] = payload.url
      state.contentUrlsData.push(payload.data)
    },
    MUTATION_SET_QUORUM_DATA (state, payload) {
      state.contentUrlArray = []
      state.contentUrlsData = []
      let modifiedData = payload.reduce((acc, item, index) => {
        if (!(index % 2)) {
          let url = payload[index + 1].split('_')
          url.splice(0, 1)
          let createdOn = url[url.length - 1].split('.')[0]
          let contentUrl = url.join('_')
          state.contentUrlArray.push(contentUrl)
          acc.push({
            'votes': item,
            'contentUrl': contentUrl,
            'createdOn': createdOn
          })
        }
        return acc
      }, [])
      state.quorumData = modifiedData
    }
  },
  actions: {
    async ACTION_PROXIMITY_SEARCH (context, payload) {
      let res = await cryptocracyServices.proximitySearch(payload)
      context.commit('MUTATION_SAVE_SEARCHED_RESULT', res.data)
      return res
    },
    async ACTION_GET_CONTENT (context, fileUrl) {
      let res = await axios.get(fileUrl)
      context.commit('MUTATION_SET_CONTENT_DATA', res.data)
      return res
    },
    async ACTION_GET_QUORUM_DATA (context, query) {
      let res = await cryptocracyServices.getQuorumContent(query)
      context.commit('MUTATION_SET_QUORUM_DATA', res)
      this.dispatch('ACTION_GET_CONTENT_URL_DATA', this.getters.contentUrlArray)
      // console.log('yooooooo', this, this.getters.contentUrlArray)
      return res
    },
    ACTION_GET_CONTENT_URL_DATA (context, contentUrls) {
      contentUrls.forEach(async item => {
        let res = await axios.get(item)
        context.commit('MUTATION_SET_CONTENT_URLS_DATA', {url: item, data: res.data})
      })
    },
    ACTION_NOTIFY_SERVER (context, fqn) {
      cryptocracyServices.notifyServer(fqn)
    }
  },
  getters: {
    getProximitySearchResult: state => state.searchResult,
    getContentData: state => state.contentData,
    getQuorumData: state => state.quorumData,
    contentUrlArray: state => state.contentUrlArray,
    getcontentUrlsData: state => state.contentUrlsData
  }
}
export default cryptocracyHandler
