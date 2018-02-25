import Vue from 'vue'
import VueRouter from 'vue-router'
import YY from './yy'
import DYW from './dyw'
import Finance from './finance'
import Home from './home'
import XinKai from './xinkai'
import Eat from './eat'
import Query from './query'

Vue.use(VueRouter)

const NOTFOUNDCOMPONENT = r => require.ensure([], () => r(require('@/pages/notFound.vue')), 'pub')
const NOPERMISSION = r => require.ensure([], () => r(require('@/pages/noPermission.vue')), 'noPermission')
// const test = r => require.ensure([], () => r(require('@/pages/test.vue')), 'test');

const routerConfig = {
  mode: 'history',
  base: '/ui3',
  routes: [{
    path: '*',
    component: NOTFOUNDCOMPONENT
  },
  {
    path: '/noPermission',
    name: 'noPermission',
    component: NOPERMISSION
  },
    // { path: '/test', name: 'test', component: test },
  ...YY,
  ...Finance,
  ...Home,
  ...XinKai,
  ...DYW,
  ...Eat,
  ...Query
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      const position = {}
      if (to.matched.some(m => m.meta.scrollToTop)) {
        position.x = 0
        position.y = 0
      }
      return position
    }
  }
}

const vr = new VueRouter(routerConfig)

vr.beforeEach((to, from, next) => {
  document.title = (to.meta && to.meta.title) || '杭州四喜'
  next()
})

export default vr
