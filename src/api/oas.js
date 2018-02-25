import axios from 'axios'
import qs from 'qs'
import store from '../store'

// 查看资源地址
let pathUpload = '/resources'
// oa api
export default {
  pathUpload,
  get: (urlName = '', params = {}, config = {}) => {
    store.commit('setFetchLoading', true)
    return axios.get('/oas/' + urlName, {
      params: params,
      ...config
    }).then((res) => {
      store.commit('setFetchLoading', false)
      return res
    })
  },
  post: (urlName = '', params = {}, config = {}) => {
    store.commit('setFetchLoading', true)
    return axios.post('/oas/' + urlName, qs.stringify(params), config).then((res) => {
      store.commit('setFetchLoading', false)
      return res
    })
  },
  jsonPost: (urlName = '', params = {}, config = {}) => {
    store.commit('setFetchLoading', true)
    return axios.post('/oas/' + urlName, params, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      store.commit('setFetchLoading', false)
      return res
    })
  }
}
