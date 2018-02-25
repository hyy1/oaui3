// 代运营薪资相关
const YYSALARYLIST = r => require.ensure([], () => r(require('@/pages/dyw/yySalary/salaryList.vue')), 'salaryList')
const YYSALARYLISTADD = r => require.ensure([], () => r(require('@/pages/dyw/yySalary/salaryListAdd.vue')), 'salaryListAdd')

const DYW = [
  {
    path: '/dyw/yysalarylist',
    name: 'yysalarylist',
    component: YYSALARYLIST,
    meta: {
      title: '代运维最新薪资'
    }
  },
  {
    path: '/dyw/yysalarylistAdd',
    name: 'yysalarylistAdd',
    component: YYSALARYLISTADD,
    meta: {
      title: '添加'
    }
  }
]
export default DYW
