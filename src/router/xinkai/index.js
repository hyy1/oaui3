// 新开路由区域
// 诚信通客户列表
const CUSTOMLIST = r => require.ensure([], () => r(require('@/pages/xinkai/cxtkehlist/customList.vue')), 'customList')
const GETCUSTOM = r => require.ensure([], () => r(require('@/pages/xinkai/cxtkehlist/getcustom.vue')), 'getCustom')

const XINKAI = [
  {
    path: '/customList',
    name: 'customList',
    component: CUSTOMLIST,

    meta: {
      title: '诚信通客户列表'
    }
  },
  {
    path: '/getCustom:id', name: 'getCustom', component: GETCUSTOM
  }
]
export default XINKAI
