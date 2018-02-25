
// 财务区域
// 历史报表
const HISTORYREPORT = r => require.ensure([], () => r(require('@/pages/finance/historyReport/historyReport.vue')), 'historyReport')
const HISTORYREPORTEDIT = r => require.ensure([], () => r(require('@/pages/finance/historyReport/edit.vue')), 'historyReportEdit')

const CW = [
  {
    path: '/historyReport',
    name: 'historyReport',
    component: HISTORYREPORT,
    meta: {
      title: '历史报表'
    }
  },
  {
    path: '/historyReportEdit:id',
    name: 'historyReportEdit',
    component: HISTORYREPORTEDIT,
    meta: {
      title: '款项修改'
    }
  }
]
export default CW
