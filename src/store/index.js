import Vue from 'vue'
import Vuex from 'vuex'
import Public from './Public'
import Float from './Float'

Vue.use(Vuex)

let Store = new Vuex.Store({
  modules: {
    Public,
    Float
  }
})
export default Store
