<template>
  <oaui3-template2>
    <div slot='headerRight'>
      <Button type='info' @click='add'>添加询盘</Button>
    </div>
    <div class='header'>
      <Input placeholder='请输入买家旺旺、买家电话、产品名称及产品链接' v-model='searchData.keyword' @keyup.enter='getList' style='width: 300px'></Input>
      <Cascader :data='provincialLeagueData' v-model='checkClass' placeholder='所有地区' filterable class='cas'></Cascader>
      <Select placeholder='是否加微信' v-model='searchData.isWechat' clearable style='width:100px'>
          <Option :value='1'>是</Option>
          <Option :value='2'>否</Option>
      </Select>
      <Select placeholder='购买意向' v-model='searchData.buyerIntention' clearable style='width:120px'>
          <Option :value='3'>高</Option>
          <Option :value='2'>中</Option>
          <Option :value='1'>低</Option>
      </Select>
      <Select placeholder='是否成交' v-model='searchData.saleStatus' clearable style='width:120px'>
          <Option value='1'>是</Option>
          <Option value='2'>跟进中</Option>
          <Option value='3'>否</Option>
          <Option value='4'>退款中</Option>
      </Select>

      <i-select v-model="searchData.noDealReason" placeholder='未成交原因' style="width:200px" clearable>
          <i-option v-for="(item,index) in noDealReasonList" :key="index" :value="item.name">{{ item.name }}</i-option>
      </i-select>
      <!-- <Input placeholder='未成交原因' v-model='searchData.noDealReason' @keyup.enter='getList' style='width: 200px'></Input> -->

      <DatePicker type='date' placeholder='询盘开始日期' :value='searchData.gmtCreateS' @on-change='searchData.gmtCreateS = $event' style='width: 150px'></DatePicker>
      -
      <DatePicker type='date' placeholder='询盘结束日期' :value='searchData.gmtCreateE' @on-change='searchData.gmtCreateE = $event' style='width: 150px'></DatePicker>

      <DatePicker type='date' placeholder='下次跟进开始日期' :value='searchData.nextFollowTimeS' @on-change='searchData.nextFollowTimeS = $event' style='width: 150px'></DatePicker>
      -
      <DatePicker type='date' placeholder='下次跟进结束日期' :value='searchData.nextFollowTimeE' @on-change='searchData.nextFollowTimeE = $event' style='width: 150px'></DatePicker>

      <Button type='primary' @click='getList'>搜索</Button>

      <Button type='success' @click='exportList'><Icon type='archive'></Icon>&nbsp; 导出</Button>
    </div>
    <h1 class="count-money-box">
      <p>询盘总金额:<span class='num'>{{moneySum}}</span></p>
    </h1>
    <div class='list'>
      <Table border :columns='columns1' :data='lists' :no-data-text="''" class='queryRecordTable'></Table>
      <Page show-total :total='searchData.total' :current.sync='searchData.pageIndex' :page-size.sync='searchData.pageSize' @on-change='getList' class='page'></Page>
    </div>
  </oaui3-template2>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import wordLimit from '@/components/public/wordLimit'
export default {
  components: {},
  data () {
    return {
      // 总金额
      moneySum: 0,
      lists: [],
      // 未成交原因
      noDealReasonList: [],
      // 搜索数据
      searchData: {
        aliAccountId: this.$route.query.aliAccountId || 0,
        customID: this.$route.query.customID || 0,
        customname: this.$route.query.customname || '',
        wwname: this.$route.query.wwname || '',
        keyword: this.$route.query.keyword || '',
        cityId: parseInt(this.$route.query.cityId) || '',
        provinceId: parseInt(this.$route.query.provinceId) || '',
        isWechat: parseInt(this.$route.query.isWechat) || '',
        buyerIntention: parseInt(this.$route.query.buyerIntention) || '',
        saleStatus: this.$route.query.saleStatus || '',
        noDealReason: this.$route.query.noDealReason || '',
        gmtCreateS: this.$route.query.gmtCreateS || '',
        gmtCreateE: this.$route.query.gmtCreateE || '',
        nextFollowTimeS: this.$route.query.nextFollowTimeS || '',
        nextFollowTimeE: this.$route.query.nextFollowTimeE || '',
        pageIndex: parseInt(this.$route.query.pageIndex) || 1,
        pageSize: 20,
        total: 0,
        export: 0
      },
      // 地区数组
      checkClass: this.$route.query.cityId
        ? [
          parseInt(this.$route.query.provinceId),
          parseInt(this.$route.query.cityId)
        ]
        : [],
      columns1: [
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
          width: 80,
          key: 'position'
        },
        {
          title: '买家电话',
          align: 'center',
          width: 80,
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
          width: 110,
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
          title: '产品规格',
          align: 'center',
          width: 70,
          // key: 'name'
          render: (h, params) => {
            var arr = []
            for (var i = 0; i < params.row.enquiryVos.length; i++) {
              arr.push(
                h(wordLimit, {
                  props: {
                    content: params.row.enquiryVos[i].specification,
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
              let dom = ''
              if (params.row.enquiryVos[i].productUrl) {
                dom = h('div', [
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
              } else dom = h('div', '')
              arr.push(dom)
            }
            return h('div', arr)
          }
        },
        {
          title: '数量',
          align: 'center',
          width: 90,
          // key: 'num'
          render: (h, params) => {
            let list = this.showProduct(
              params.row.enquiryVos,
              ['num', 'unit'],
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
          // key: 'price'
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
            // if (params.row.buyerIntention === 3) {
            //   return '高'
            // } else if (params.row.buyerIntention === 2) {
            //   return '中'
            // } else if (params.row.buyerIntention === 1) {
            //   return '低'
            // }
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
          // key: 'followAmount'
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
          // key: 'lossAmount'
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
          title: '是否同行购买',
          align: 'center',
          width: 100,
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
            // if (params.row.peerBuy === 1) {
            //   return '是'
            // } else if (params.row.peerBuy === 2) {
            //   return '否'
            // }
          }
        },
        {
          title: '同行名称',
          align: 'center',
          width: 90,
          // key: 'peerName'
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
          // key: 'peerPrice'
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
                    ).format('YYYY-MM-DD HH:mm:ss')
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
        },
        {
          title: '操作',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    type: 'info'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      window.open(
                        '/app/custom/show.aspx?id=' + this.searchData.customID
                      )
                    }
                  }
                },
                '明细'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    type: 'primary'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'queryEdit',
                        query: {
                          customname: this.searchData.customname,
                          customID: this.searchData.customID,
                          wwname: this.searchData.wwname,
                          aliAccountId: this.searchData.aliAccountId,
                          enquiryid: params.row.enquiryid,
                          id: params.row.id
                        }
                      })
                    }
                  }
                },
                '修改'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.hrConfirm('提示', '确定删除吗？', () => {
                        this.oas
                          .post('inquiry/record/delete', { id: params.row.id })
                          .then(e => {
                            if (e.state === 200) {
                              this.$Message.success('删除成功！')
                              this.getList()
                            } else {
                              this.$Message.success(e.msg)
                            }
                          })
                      })
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ]
    }
  },
  computed: {
    ...mapState({
      provincialLeagueData: state => state.Public.provincialLeagueData
    })
  },
  created () {
    // 设置页面标题
    this.$store.commit('setTitle', '询盘记录列表')
  },
  mounted () {
    this.getList()
    // 地区列表
    this.getProvincialLeagueData()
    // 未成交原因列表
    this.getDealNoReason()
  },
  methods: {
    ...mapActions(['getProvincialLeagueData']),
    add () {
      this.$router.push({
        name: 'queryAdd',
        query: {
          customID: this.searchData.customID,
          aliAccountId: this.searchData.aliAccountId,
          wwname: this.searchData.wwname,
          customname: this.searchData.customname
        }
      })
    },
    // 导出
    exportList () {
      this.searchData.export = 1
      window.open(
        '/oas/inquiry/record/list?aliAccountId=' +
        this.searchData.aliAccountId +
        '&keyword=' +
        this.searchData.keyword +
        '&provinceId=' +
        this.searchData.provinceId +
        '&cityId=' +
        this.searchData.cityId +
        '&isWechat=' +
        this.searchData.isWechat +
        '&buyerIntention=' +
        this.searchData.buyerIntention +
        '&saleStatus=' +
        this.searchData.saleStatus +
        '&noDealReason=' +
        this.searchData.noDealReason +
        '&gmtCreateS=' +
        this.searchData.gmtCreateS +
        '&gmtCreateE=' +
        this.searchData.gmtCreateE +
        '&nextFollowTimeS=' +
        this.searchData.nextFollowTimeS +
        '&nextFollowTimeE=' +
        this.searchData.nextFollowTimeE +
        '&pageIndex=' +
        this.searchData.pageIndex +
        '&export=' +
        this.searchData.export
      )
    },
    // 每条订单信息对多产品询盘显示方法
    showProduct (list, name, h, hName, styleObj, domObj, propsObj) {
      let arr = []
      let val = ''
      for (let index = 0; index < list.length; index++) {
        // 如果name为数组则循环name,显示多个字段值
        if (name instanceof Array) {
          val = ''
          for (let item of name) {
            val += list[index][item]
          }
        } else {
          // 显示一个字段值
          val = list[index][name]
        }
        arr.push(
          h(
            hName,
            { domProps: domObj, props: propsObj, style: styleObj },
            val
          )
        )
      }
      return arr
    },
    // 获取列表
    getList () {
      this.$router.push({
        name: 'queryRecordList',
        query: {
          ...this.searchData
        }
      })
      this.oas
        .get('inquiry/record/list', {
          ...this.searchData
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
            this.lists = lists
            this.searchData.total = e.data && e.data.count
          } else {
            this.$Message.error(e.msg)
          }
        })
    },
    // 获取未成交原因
    getDealNoReason () {
      this.oas.get('inquiry/nodealreason/list')
        .then(e => {
          if (e.state === 200) {
            this.noDealReasonList = e.data
          } else {
            this.$Message.success(e.msg)
          }
        })
    }
  },
  watch: {
    // 监听省市数组，得到省份id跟城市id
    checkClass: function (val) {
      this.searchData.provinceId = val[0] || ''
      this.searchData.cityId = val[1] || ''
    }
  }
}
</script>

<style>
.queryRecordTable .ivu-table-cell {
  padding: 0 8px;
}
.queryRecordTable tr > td:nth-child(n + 10):nth-child(-n + 25) .ivu-table-cell {
  padding: 0;
}
.queryRecordTable
  tr
  > td:nth-child(n + 10):nth-child(-n + 25)
  .ivu-table-cell
  > div
  > div {
  padding: 0 8px;
  height: 60px;
  /* line-height: 60px; */
  border-bottom: 1px solid #e9eaec;
  display: -webkit-box;
  -webkit-box-orient: horizontal;
  -webkit-box-pack: center;
  -webkit-box-align: center;

  display: -moz-box;
  -moz-box-orient: horizontal;
  -moz-box-pack: center;
  -moz-box-align: center;

  display: -o-box;
  -o-box-orient: horizontal;
  -o-box-pack: center;
  -o-box-align: center;

  display: -ms-box;
  -ms-box-orient: horizontal;
  -ms-box-pack: center;
  -ms-box-align: center;

  display: box;
  box-orient: horizontal;
  box-pack: center;
  box-align: center;
}
.queryRecordTable
  tr
  > td:nth-child(n + 10):nth-child(-n + 25)
  .ivu-table-cell
  > div
  > div:last-child {
  border: 0;
}
</style>

<style scoped>
.header {
  padding: 15px;
  line-height: 42px;
}
.cas {
  width: 150px;
  margin: 0 auto;
  display: inline-block;
}
.count-money-box {
  padding-left: 10px;
  margin-bottom: 20px;
}
.num {
  margin: 0 10px;
  color: red;
}
</style>
