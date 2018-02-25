const BINDING = r => require.ensure([], () => r(require('@/pages/query/bind/binding.vue')), 'binding') // 绑定手机
const AREARANKING = r => require.ensure([], () => r(require('@/pages/query/ranking/areaRanking.vue')), 'areaRanking') // 地区排名

const QUERYADD = r => require.ensure([], () => r(require('@/pages/query/queryRecord/queryAdd.vue')), 'queryAdd') // 询盘添加
const QUERYEDIT = r => require.ensure([], () => r(require('@/pages/query/queryRecord/queryEdit.vue')), 'queryEdit') // 询盘修改
const QUERYRECORDLIST = r => require.ensure([], () => r(require('@/pages/query/queryRecord/queryRecordList.vue')), 'queryRecordList') // 询盘记录列表
const QUERYINVALID = r => require.ensure([], () => r(require('@/pages/query/queryRecord/queryInvalid.vue')), 'queryInvalid') // 无效询盘列表
const NODEALRESON = r => require.ensure([], () => r(require('@/pages/query/queryRecord/noDealReason.vue')), 'noDealReason') // 未成交原因

const QUERY = [{
  path: '/query/bind/binding',
  name: 'binding',
  component: BINDING,
  meta: {
    title: '绑定手机'
  }
},
{
  path: '/query/ranking/areaRanking',
  name: 'areaRanking',
  component: AREARANKING,
  meta: {
    title: '询盘地区排名'
  }
},
{
  path: '/query/queryRecord/queryAdd',
  name: 'queryAdd',
  component: QUERYADD,
  meta: {
    title: '询盘添加'
  }
},
{
  path: '/query/queryRecord/queryEdit',
  name: 'queryEdit',
  component: QUERYEDIT,
  meta: {
    title: '询盘修改'
  }
},
{
  path: '/query/queryRecord/queryRecordList',
  name: 'queryRecordList',
  component: QUERYRECORDLIST,
  meta: {
    title: '询盘记录列表'
  }
},
{
  path: '/query/queryRecord/queryInvalid',
  name: 'queryInvalid',
  component: QUERYINVALID,
  meta: {
    title: '无效询盘列表'
  }
},
{
  path: '/query/queryRecord/noDealReason',
  name: 'noDealReason',
  component: NODEALRESON,
  meta: {
    title: '未成交原因'
  }
}
]
export default QUERY
