<template>
    <div class="tableList" style="width:100%;">
      <p class="title"><span>最近添加询盘记录：</span></p>
      <Table border :columns="columns" :data="QueryRecordLists" class="queryRecordTable"></Table>
    </div>
</template>
<script>
import wordLimit from '@/components/public/wordLimit'

export default {
  data () {
    return {
      QueryRecordLists: [],
      columns: [
        {
          type: 'index',
          align: 'center',
          title: '序号',
          width: 45
        },
        {
          title: '询盘日期',
          align: 'center',
          width: 80,
          render: (h, params) => {
            return h(
              'span',
              this.moment(params.row.gmtCreate).format('YYYY-MM-DD')
            )
          }
        },
        {
          title: '买家身份',
          align: 'center',
          width: 70,
          render: (h, params) => {
            if (params.row.type === 1) {
              return '淘宝'
            } else if (params.row.type === 2) {
              return '经销商'
            } else if (params.row.type === 3) {
              return '微商'
            } else if (params.row.type === 4) {
              return '外贸'
            } else if (params.row.type === 5) {
              return '其他'
            }
          }
        },
        {
          title: '买家旺旺',
          align: 'center',
          width: 70,
          key: 'alitm'
        },
        {
          title: '买家职位',
          align: 'center',
          width: 70,
          key: 'position'
        },
        {
          title: '买家电话',
          align: 'center',
          width: 70,
          key: 'phone'
        },
        {
          title: '询盘总金额',
          align: 'center',
          width: 80,
          key: 'orderSum'
        },
        {
          title: '地区',
          align: 'center',
          width: 80,
          render: (h, params) => {
            // 当省份id与城市id相同时，只显示省份
            if (params.row.provinceId === params.row.cityId) {
              return params.row.provinceName
            } else {
              return `${params.row.provinceName} - ${params.row.cityName}`
            }
          }
        },
        {
          title: '加微信',
          align: 'center',
          width: 60,
          render: (h, params) => {
            if (params.row.isWechat === 1) {
              return '是'
            } else if (params.row.isWechat === 2) {
              return '否'
            }
          }
        },
        {
          title: '产品名称',
          align: 'center',
          width: 90,
          // key: 'name'
          render: (h, params) => {
            var arr = []
            for (var i = 0; i < params.row.enquiryVos.length; i++) {
              arr.push(
                h(wordLimit, {
                  props: {
                    content: params.row.enquiryVos[i].name,
                    length: 10
                  }
                })
              )
            }
            return h('div', arr)
          }
        },
        {
          title: '产品链接',
          align: 'center',
          width: 70,
          render: (h, params) => {
            var arr = []
            for (var i = 0; i < params.row.enquiryVos.length; i++) {
              arr.push(
                h('div', [
                  h(
                    'a',
                    {
                      domProps: {
                        href: params.row.enquiryVos[i].productUrl,
                        target: '_blank'
                      }
                    },
                    '点击打开链接'
                  )
                ])
              )
            }
            return h('div', arr)
          }
        },
        {
          title: '数量',
          align: 'center',
          width: 50,
          // key: 'num'
          render: (h, params) => {
            let list = this.showProduct(
              params.row.enquiryVos,
              'num',
              h,
              'div'
            )
            return h('div', list)
          }
        },
        {
          title: '报价',
          align: 'center',
          width: 60,
          render: (h, params) => {
            let list = this.showProduct(
              params.row.enquiryVos,
              'price',
              h,
              'div'
            )
            return h('div', list)
          }
        },
        {
          title: '购买意向',
          align: 'center',
          width: 70,

          render: (h, params) => {
            var arr = []
            for (var i = 0; i < params.row.enquiryVos.length; i++) {
              arr.push(
                h('div', [
                  h(
                    'div',
                    {
                      style: {
                        height: '60px',
                        lineHeight: '60px'
                      }
                    },
                    params.row.enquiryVos[i].buyerIntention === 3
                      ? '高'
                      : params.row.enquiryVos[i].buyerIntention === 2
                        ? '中'
                        : params.row.enquiryVos[i].buyerIntention === 1
                          ? '低'
                          : ''
                  )
                ])
              )
            }
            return h('div', arr)
          }
        },
        {
          title: '是否成交',
          align: 'center',
          width: 70,
          render: (h, params) => {
            var arr = []
            for (var i = 0; i < params.row.enquiryVos.length; i++) {
              arr.push(
                h('div', [
                  h(
                    'div',
                    {
                      style: {
                        height: '60px',
                        lineHeight: '60px'
                      }
                    },
                    params.row.enquiryVos[i].saleStatus === 1
                      ? '是'
                      : params.row.enquiryVos[i].saleStatus === 2
                        ? '跟进中'
                        : params.row.enquiryVos[i].saleStatus === 3
                          ? '否'
                          : params.row.enquiryVos[i].saleStatus === 4
                            ? '退款中'
                            : ''
                  )
                ])
              )
            }
            return h('div', arr)
          }
        },
        {
          title: '成交金额',
          align: 'center',
          width: 70,
          // key: 'gmvAmount'
          render: (h, params) => {
            let list = this.showProduct(
              params.row.enquiryVos,
              'gmvAmount',
              h,
              'div',
              {
                height: '60px',
                lineHeight: '60px'
              },
              null
            )
            return h('div', list)
          }
        },
        {
          title: '跟踪金额',
          align: 'center',
          width: 70,
          render: (h, params) => {
            let list = this.showProduct(
              params.row.enquiryVos,
              'followAmount',
              h,
              'div',
              {
                height: '60px',
                lineHeight: '60px'
              },
              null
            )
            return h('div', list)
          }
        },
        {
          title: '流失金额',
          align: 'center',
          width: 70,
          render: (h, params) => {
            let list = this.showProduct(
              params.row.enquiryVos,
              'lossAmount',
              h,
              'div',
              {
                height: '60px',
                lineHeight: '60px'
              },
              null
            )
            return h('div', list)
          }
        },
        {
          title: '未成交原因',
          align: 'center',
          width: 80,
          render: (h, params) => {
            var arr = []
            for (var i = 0; i < params.row.enquiryVos.length; i++) {
              arr.push(
                h('div', [
                  h(wordLimit, {
                    props: {
                      content: params.row.enquiryVos[i].noDealReason,
                      length: 10
                    }
                  })
                ])
              )
            }
            return h('div', arr)
          }
        },
        {
          title: '是否去同行购买',
          align: 'center',
          width: 110,
          render: (h, params) => {
            var arr = []
            for (var i = 0; i < params.row.enquiryVos.length; i++) {
              arr.push(
                h(
                  'div',
                  params.row.enquiryVos[i].peerBuy === 1
                    ? '是'
                    : params.row.enquiryVos[i].peerBuy === 2 ? '否' : ''
                )
              )
            }
            return h('div', arr)
          }
        },
        {
          title: '同行名称',
          align: 'center',
          width: 90,
          render: (h, params) => {
            let list = this.showProduct(
              params.row.enquiryVos,
              'peerName',
              h,
              'div',
              {
                height: '60px',
                lineHeight: '60px'
              },
              null
            )
            return h('div', list)
          }
        },
        {
          title: '同行报价',
          align: 'center',
          width: 80,
          render: (h, params) => {
            let list = this.showProduct(
              params.row.enquiryVos,
              'peerPrice',
              h,
              'div',
              {
                height: '60px',
                lineHeight: '60px'
              },
              null
            )
            return h('div', list)
          }
        },
        {
          title: '附件',
          align: 'center',
          width: 80,
          render: (h, params) => {
            var arr = []
            for (var i = 0; i < params.row.enquiryVos.length; i++) {
              var pathAry =
                params.row.enquiryVos[i].attachUrl &&
                params.row.enquiryVos[i].attachUrl.split('|')
              var returnDOM = []
              for (let item in pathAry) {
                returnDOM.push(
                  h(
                    'a',
                    {
                      attrs: {
                        href: this.oas.pathUpload + pathAry[item],
                        target: '_blank'
                      }
                    },
                    '附件' + (Number(item) + 1)
                  ),
                  h('br')
                )
              }

              arr.push(h('div', [h('span', returnDOM)]))
            }
            return h('div', arr)
          }
        },
        {
          title: '下次跟进',
          align: 'center',
          width: 80,
          render: (h, params) => {
            var arr = []
            for (var i = 0; i < params.row.enquiryVos.length; i++) {
              arr.push(
                h('div', [
                  h(
                    'span',
                    this.moment(
                      params.row.enquiryVos[i].nextFollowTime
                    ).format('YYYY-MM-DD hh:mm:ss')
                  )
                ])
              )
            }
            return h('div', arr)
          }
        },
        {
          title: '备注',
          align: 'center',
          width: 90,
          key: 'remark',
          render: (h, params) => {
            var arr = []
            for (var i = 0; i < params.row.enquiryVos.length; i++) {
              arr.push(
                h(wordLimit, {
                  props: {
                    content: params.row.enquiryVos[i].remark,
                    length: 10
                  }
                })
              )
            }
            return h('div', arr)
          }
        }
      ]
    }
  },
  mounted () {
    // 获取最近的三条询盘
    this.getQueryRecordLists()
  },
  methods: {
    // 获取最近三条询盘
    getQueryRecordLists () {
      this.oas
        .get('inquiry/record/list', {
          aliAccountId: this.$route.query.aliAccountId,
          customid: this.$route.query.customid,
          pageSize: 3
        })
        .then(e => {
          if (e.state === 200) {
            this.moneySum = e.data.sum
            let lists = []
            // 拼接后端传过来的数据，用于列表渲染
            e.data.list.forEach(e => {
              let obj = {
                ...e.buyer,
                enquiryVos: e.enquiryVos,
                ...e.oaUserId,
                ...e.order
              }
              lists.push(obj)
            })
            this.QueryRecordLists = lists || []
          } else {
            this.$Message.error(e.msg)
          }
        })
    },
    // 每条订单信息对多产品询盘显示方法
    showProduct (list, name, h, hName, styleObj, domObj, propsObj) {
      let arr = []
      for (let index = 0; index < list.length; index++) {
        arr.push(
          h(
            hName,
            { domProps: domObj, props: propsObj, style: styleObj },
            list[index][name]
          )
        )
      }
      return arr
    }
  }
}
</script>
