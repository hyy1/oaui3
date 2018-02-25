// 新开路由区域
// 诚信通客户列表
const TRYEATLIST = r => require.ensure([], () => r(require('@/pages/eat/tryEat/tryEatList.vue')), 'tryEatList')
const TRYEATPEOPLE = r => require.ensure([], () => r(require('@/pages/eat/tryEatPeople/tryEatPeople.vue')), 'tryEatPeople')
const WANTTOEAT = r => require.ensure([], () => r(require('@/pages/eat/wantToEat/wantToEat.vue')), 'wantToEat')
const EAT = [
  {
    path: '/tryEatList',
    name: 'tryEatList',
    component: TRYEATLIST,

    meta: {
      title: '试吃产品列表'
    }
  },
  {
    path: '/tryEatPeople',
    name: 'tryEatPeople',
    component: TRYEATPEOPLE,

    meta: {
      title: '试吃人员列表'
    }
  },
  {
    path: '/wantToEat',
    name: 'wantToEat',
    component: WANTTOEAT,

    meta: {
      title: '想吃产品列表'
    }
  }
]
export default EAT
