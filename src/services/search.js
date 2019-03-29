import HTTP from './http-request-handler'

const searchService = {
  // method for searchin users via /search?query={query} (can return 0 to )
  search: (searchObj) => {
    return HTTP.get(searchObj.endpoint, { params: { query: searchObj.query } })
      .then(res => res.data.results)
      .catch(e => e)
  },
  // method for searching user via /users endpoint (returns only one result)
  searchUser: async (searchObj) => {
    let res = await HTTP.get(searchObj.endpoint)
    return res.data[searchObj.query]
  }
}
export default searchService
