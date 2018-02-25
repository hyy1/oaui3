import axios from 'axios'
import qs from 'qs'
import store from '../store'

// axios.defaults.baseURL = '/cws'
// axios.defaults.timeout = 10000

let pathUpload = '/resources'
// 财务api
export default {
  pathUpload,
  get: (urlName = '', params = {}, config = {}) => {
    store.commit('setFetchLoading', true)
    return axios.get('/cws/' + urlName, { params: params, ...config }).then((res) => {
      store.commit('setFetchLoading', false)
      return res
    })
  },
  post: (urlName = '', params = {}, config = {}) => {
    store.commit('setFetchLoading', true)
    return axios.post('/cws/' + urlName, qs.stringify(params), config).then((res) => {
      store.commit('setFetchLoading', false)
      return res
    })
  }
}
