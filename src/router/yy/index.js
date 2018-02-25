// 运营区域
// 运营美工业绩
const YYMG = r => require.ensure([], () => r(require('@/pages/yy/yymgAchievement/yymg.vue')), 'yymg')
const WORKTYPE = r => require.ensure([], () => r(require('@/pages/yy/yymgAchievement/workType.vue')), 'workType')
const ADDYYMGYJ = r => require.ensure([], () => r(require('@/pages/yy/yymgAchievement/add.vue')), 'addyymgyj')
const YYMGINFO = r => require.ensure([], () => r(require('@/pages/yy/yymgAchievement/info.vue')), 'yymgInfo')
const TOTALSCOREREPORT = r => require.ensure([], () => r(require('@/pages/yy/yymgAchievement/totalScoreReport.vue')), 'totalScoreReport')

const YY = [
  {
    path: '/yymg',
    name: 'yymg',
    component: YYMG,
    meta: {
      title: '运营美工业绩列表'
    }
  },
  {
    path: '/yymg/workType',
    name: 'yymgWorkType',
    component: WORKTYPE,
    meta: {
      title: '运营美工业绩-工作分类'
    }
  },
  {
    path: '/yymg/addyj',
    name: 'yymgAddyj',
    component: ADDYYMGYJ,
    meta: {
      title: '添加运营美工业绩'
    }
  },
  {
    path: '/yymg/info:id',
    name: 'yymgInfo',
    component: YYMGINFO,
    meta: {
      title: '运营美工业绩详情'
    }
  },
  {
    path: '/yymg/totalScoreReport',
    name: 'yymgTotalScoreReport',
    component: TOTALSCOREREPORT,
    meta: {
      title: '运营美工总分报表'
    }
  }
]
export default YY
