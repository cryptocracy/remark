import Axios from 'axios'

const cryptocracyServices = {
  proximitySearch: (query) => {
    return Axios.get('https://search.cryptocracy.io/souq/search/proximity', { params: {...query} })
  },
  searchTags: async (query) => {
    let res = await Axios.get('https://search.cryptocracy.io/souq/search/tags', { params: {...query} })
    return res.data
  },
  countVotes: async (query) => {
    let res = await Axios.get('https://search.cryptocracy.io/remark/popular/votes', { params: {...query} })
    return res.data
  },
  notifyServer: async (fqn) => {
    let res = await Axios.get(`https://search.cryptocracy.io/remark/popular/check?user=${fqn}`)
    return res.data
  },
  getQuorumContent: async (query) => {
    let res = await Axios.get('https://search.cryptocracy.io/remark/popular', { params: {...query} })
    return res.data
  }
}
export default cryptocracyServices
