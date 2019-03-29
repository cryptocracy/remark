import axios from 'axios'

// common axios instance for all blockstack api calls with base Url
const HTTP = axios.create({
  baseURL: 'https://core.blockstack.org/v1/',
  headers: {
    'Content-Type': 'application/json'
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    // 'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
  }
})

// axios interceptors for request and response,
// these can be used to perfrom some action based on requirement
// before response reached the fucntion calling the api
HTTP.interceptors.request.use(
  request => request,
  error => Promise.reject(error)
)

HTTP.interceptors.response.use(
  response => Promise.resolve(response),
  error => Promise.reject(error)
)
export default HTTP
