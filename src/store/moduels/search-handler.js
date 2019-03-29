import searchService from '@/services/search'
import cryptocracyService from '@/services/cryptocracy'

const searchHandler = {
  state: {
    searchResult: [],
    isSearching: false,
    isRedirected: false,
    isResolved: true,
    userProfileData: {},
    searchType: 'channels'
  },
  mutations: {
    MUTATION_SET_SEARCH_RESULT (state, payload) {
      if (payload.type === 'tags') {
        payload.data = payload.data.reduce((acc, item) => {
          let a = item.split('/')
          acc.push({
            'owner': a[4],
            'type': a[5].split('_')[0].toUpperCase(),
            'createdOn': new Date(Number(a[5].split('_')[1].split('.')[0])).toLocaleString(),
            'originalUrl': item
          })
          return acc
        }, [])
      }
      state.searchResult = payload.data || []
    },
    MUTATION_SET_SEARCH_STATE (state, payload) {
      state.isSearching = payload
    },
    MUTATION_SET_RESOLVED_STATE (state, payload) {
      state.isResolved = payload
    },
    MUTATION_SET_REDIRECTION_STATE (state, payload) {
      state.isRedirected = payload
    },
    MUTATION_SET_USER (state, payload) {
      state.userProfileData = payload
    },
    MUTATION_SET_SEARCH_TYPE (state, payload) {
      state.searchType = payload
    }
  },
  actions: {
    async ACTION_GET_SEARCH_RESULT (context, searchObj) {
      let type = searchObj.type
      // mutation for showing loader while searching
      let searchResult = {
        type: searchObj.type,
        data: []
      }
      context.commit('MUTATION_SET_RESOLVED_STATE', false)
      if (searchObj.type === 'channels') {
        searchResult.data = await searchService.search(searchObj)
        // setting search state true when user comes on profile page directly via URL
        // and the Id he entered in URL giving multiple results
        // with search state active, multiple search-results are going to render
        // and user can seelct one of them to view their profiles
        if (searchResult.data.length > 1 && !searchObj.isAbsolute) {
          context.commit('MUTATION_SET_SEARCH_STATE', true)
        }
        // again this is when user user comes on profile page directly via URL
        // and to show the profile of user when only single result is returned from API
        context.commit('MUTATION_SET_USER', searchResult.data[0] || {})
      }
      if (searchObj.type === 'tags') {
        searchResult.data = await cryptocracyService.searchTags(searchObj.query)
      }
      context.commit('MUTATION_SET_SEARCH_RESULT', searchResult, type)
      // changing resolved state to stop loader
      context.commit('MUTATION_SET_RESOLVED_STATE', true)
      return searchResult
    },
    // action to search specific user from /users endpoint (do not delete, will need it in near future)
    async ACTION_GET_USER (context, searchObj) {
      context.commit('MUTATION_SET_RESOLVED_STATE', false)
      const user = await searchService.searchUser(searchObj)
      context.commit('MUTATION_SET_USER', user)
      context.commit('MUTATION_SET_RESOLVED_STATE', true)
      return user
    }
  },
  getters: {
    getSearchResult: state => state.searchResult,
    isSearching: state => state.isSearching,
    isResolved: state => state.isResolved,
    isRedirected: state => state.isRedirected,
    getUserProfileData: state => state.userProfileData,
    getSearchType: state => state.searchType
  }
}
export default searchHandler
