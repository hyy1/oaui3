
// 公共区域
// 密码查询结果列表
const PWDREPORT = r => require.ensure([], () => r(require('@/pages/home/pwdQuery/list.vue')), 'pwdQuery')

const HOME = [
  {
    path: '/pwdQuery',
    name: 'pwdQuery',
    component: PWDREPORT,
    meta: {
      title: '软件密码查询结果'
    }
  }
]
export default HOME
