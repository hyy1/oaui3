
import Vue from 'vue'
import Vuex from 'vuex'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import axios from 'axios'
import App from './app.vue'
import oas from './api/oas.js'
import cws from './api/cws.js'
import lodash from 'lodash'
import store from './store'
import router from './router'
import '@/filter'
import moment from 'moment'
import basejs from './assets/base.js'
import template1 from '@/components/template/template1'
import template2 from '@/components/template/template2'

Vue.use(iView)

Vue.use(Vuex)

// Vue.use(api)

Vue.prototype.oas = oas
Vue.prototype.cws = cws
Vue.prototype.basejs = basejs
Vue.prototype._ = lodash
Vue.prototype.moment = moment

const goLogin = function (res) {
  // 本地
  if (res.request.responseURL.indexOf('http://172.30.34.157:8890') !== -1) {
    location.href = '/login/login'
  } else if (res.request.responseURL.indexOf('http://172.30.34.157:889') !== -1) {
    location.href = '/SignIn.aspx'
  }

  // 线上
  // if ((res.request.responseURL.indexOf('http://192.168.2.8:183') != -1) || (res.request.responseURL.indexOf('http://192.168.0.8:183') != -1)) {
  //   location.href = '/login/login';
  // } else{
  //   location.href = '/SignIn.aspx';
  // }
}
// 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 添加一个响应拦截器
axios.interceptors.response.use(function (res) {
  // 未登录跳转到登录页
  if (res.data && res.data.state === 401) {
    goLogin(res)
  }
  // 其他错误返回空
  if (res && res.data && res.data.state !== 200) {
    res.data.data = {

    }
  }
  return res.data
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

Vue.component('oaui3-template1', template1)
Vue.component('oaui3-template2', template2)

Vue.mixin({
  methods: {
    hrConfirm (title, content, ok, cancel) {
      this.$Modal.confirm({
        title,
        content,
        okText: '取消',
        cancelText: '确定',
        onOk: () => {
          if (typeof cancel === 'function') {
            cancel()
          }
        },
        onCancel: () => {
          if (typeof ok === 'function') {
            ok()
          }
        }
      })
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#root',
  store,
  router,
  template: '<app/>',
  components: {
    app: App
  }
})
