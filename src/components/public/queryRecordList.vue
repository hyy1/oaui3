<template>
  <oaui3-template2>
    <div slot="headerRight">
      <Button type="info" @click="add">添加询盘</Button>
    </div>
    <div class="header">
      <Input placeholder="请输入买家旺旺、买家电话、产品名称及产品链接" v-model="searchData.keyword" @keyup.enter="getList" style="width: 300px"></Input>
      <Cascader :data="provincialLeagueData" v-model="checkClass" placeholder="所有地区" filterable class="cas"></Cascader>
      <Select placeholder="是否加微信" v-model="searchData.isWechat" clearable style="width:120px">
          <Option :value="1">是</Option>
          <Option :value="2">否</Option>
      </Select>
      <Select placeholder="购买意向" v-model="searchData.buyerIntention" clearable style="width:120px">
          <Option :value="3">高</Option>
          <Option :value="2">中</Option>
          <Option :value="1">低</Option>
      </Select>
      <Select placeholder="是否成交" v-model="searchData.saleStatus" clearable style="width:120px">
          <Option value="1">是</Option>
          <Option value="2">跟进中</Option>
          <Option value="3">否</Option>
      </Select>

      <Input placeholder="未成交原因" v-model="searchData.noDealReason" @keyup.enter="getList" style="width: 200px"></Input>
      
      <!-- <Select placeholder="未成交原因" v-model="searchData.noDealReason" clearable style="width:150px">
          <Option value="1">无现货</Option>
          <Option value="2">无产品</Option>
          <Option value="3">买家无应答</Option>
          <Option value="4">临时账号</Option>
          <Option value="5">其他</Option>
      </Select> -->
      <DatePicker type="date" placeholder="询盘开始日期" :value="searchData.gmtCreateS" @on-change="searchData.gmtCreateS = $event" style="width: 150px"></DatePicker>
      -
      <DatePicker type="date" placeholder="询盘结束日期" :value="searchData.gmtCreateE" @on-change="searchData.gmtCreateE = $event" style="width: 150px"></DatePicker>

      <DatePicker type="date" placeholder="下次跟进开始日期" :value="searchData.nextFollowTimeS" @on-change="searchData.nextFollowTimeS = $event" style="width: 150px"></DatePicker>
      -
      <DatePicker type="date" placeholder="下次跟进结束日期" :value="searchData.nextFollowTimeE" @on-change="searchData.nextFollowTimeE = $event" style="width: 150px"></DatePicker>

      <Button type="primary" @click="getList">搜索</Button>
      
      <Button type="success" @click="exportList"><Icon type="archive"></Icon>&nbsp; 导出</Button>
      <!-- <Button @click="clear">清除选中</Button> -->
    </div>
    <div class="list">
      <Table border :columns="columns1" :data="lists" :no-data-text="''" class="queryRecordTable"></Table>
      <Page show-total :total="searchData.total" :current.sync="searchData.pageIndex" :page-size.sync="searchData.pageSize" @on-change="getList" class="page"></Page>
    </div>
  </oaui3-template2>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import wordLimit from '@/component/public/wordLimit'
export default {
  components: {},
  data () {
    return {
      lists: [],
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
      checkClass: this.$route.query.cityId ? [parseInt(this.$route.query.provinceId), parseInt(this.$route.query.cityId)] : [],
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
            return h('span', this.moment(params.row.gmtCreate).format('YYYY-MM-DD'))
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
          align: 'buyer.center',
          width: 70,
          key: 'position'
        },
        {
          title: '买家电话',
          align: 'buyer.center',
          width: 70,
          key: 'phone'
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
          key: 'name'
        },
        {
          title: '产品链接',
          align: 'center',
          width: 70,
          // key: 'productUrl'
          render: (h, params) => {
            if (!params.row.productUrl) {
              return ''
            } else {
              return h('a', {
                domProps: {
                  target: '_blank',
                  href: params.row.productUrl
                }
              }, '点击打开链接')
            }
          }
        },
        {
          title: '数量',
          align: 'center',
          width: 50,
          key: 'num'
        },
        {
          title: '报价',
          align: 'center',
          width: 60,
          key: 'price'
        },
        {
          title: '购买意向',
          align: 'center',
          width: 70,
          // key: 'buyerIntention'
          render: (h, params) => {
            if (params.row.buyerIntention === 3) {
              return '高'
            } else if (params.row.buyerIntention === 2) {
              return '中'
            } else if (params.row.buyerIntention === 1) {
              return '低'
            }
          }
        },
        {
          title: '是否成交',
          align: 'center',
          width: 70,
          render: (h, params) => {
            if (params.row.saleStatus === 1) {
              return '是'
            } else if (params.row.saleStatus === 2) {
              return '跟进中'
            } else if (params.row.saleStatus === 3) {
              return '否'
            }
          }
        },
        {
          title: '成交金额',
          align: 'center',
          width: 70,
          key: 'gmvAmount'
        },
        {
          title: '跟踪金额',
          align: 'center',
          width: 70,
          key: 'followAmount'
        },
        {
          title: '流失金额',
          align: 'center',
          width: 70,
          key: 'lossAmount'
        },
        {
          title: '未成交原因',
          align: 'center',
          width: 80,
          // key: 'noDealReason',
          render: (h, params) => {
            return h(wordLimit, {
              props: {
                content: params.row.noDealReason,
                length: 10
              }
            })
          }
        },
        {
          title: '是否去同行购买',
          align: 'center',
          width: 110,
          render: (h, params) => {
            if (params.row.peerBuy === 1) {
              return '是'
            } else if (params.row.peerBuy === 2) {
              return '否'
            }
          }
        },
        {
          title: '同行名称',
          align: 'center',
          width: 90,
          key: 'peerName'
        },
        {
          title: '同行报价',
          align: 'center',
          width: 80,
          key: 'peerPrice'
        },
        {
          title: '下次跟进',
          align: 'center',
          width: 80,
          render: (h, params) => {
            return h('span', this.moment(params.row.nextFollowTime).format('YYYY-MM-DD hh:mm:ss'))
          }
        },
        {
          title: '备注',
          align: 'center',
          width: 90,
          key: 'remark',
          render: (h, params) => {
            return h(wordLimit, {
              props: {
                content: params.row.remark,
                length: 10
              }
            })
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  size: 'small',
                  type: 'info'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    window.open('/app/custom/show.aspx?id=' + this.searchData.customID)
                  }
                }
              }, '明细'),
              h('Button', {
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
                        enquiryid: params.row.enquiryid
                      }
                    })
                  }
                }
              }, '修改'),
              h('Button', {
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
              }, '删除')
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
    this.getProvincialLeagueData()
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
      window.open('/oas/inquiry/record/list?aliAccountId=' + this.searchData.aliAccountId + '&keyword=' + this.searchData.keyword + '&provinceId=' + this.searchData.provinceId + '&cityId=' + this.searchData.cityId + '&isWechat=' + this.searchData.isWechat + '&buyerIntention=' + this.searchData.buyerIntention + '&saleStatus=' + this.searchData.saleStatus + '&noDealReason=' + this.searchData.noDealReason + '&gmtCreateS=' + this.searchData.gmtCreateS + '&gmtCreateE=' + this.searchData.gmtCreateE + '&nextFollowTimeS=' + this.searchData.nextFollowTimeS + '&nextFollowTimeE=' + this.searchData.nextFollowTimeE + '&pageIndex=' + this.searchData.pageIndex + '&export=' + this.searchData.export)
    },
    // 获取列表
    getList () {
      this.$router.push({
        name: 'queryRecordList',
        query: {
          ...this.searchData
        }
      })
      this.oas.get('inquiry/record/list',
        {
          ...this.searchData
        }
      ).then((e) => {
        if (e.state === 200) {
          let lists = []
          e.data.list.forEach(e => {
            let obj = { ...e.buyer, ...e.product, ...e.enquiry, ...{ enquiryid: e.enquiry.id } }
            lists.push(obj)
          })
          this.lists = lists || []
          this.searchData.total = e.data && e.data.count
        } else {
          this.$Message.error(e.msg)
        }
      })
    }
  },
  watch: {
    'checkClass': function (val) {
      this.searchData.provinceId = val[0] || ''
      this.searchData.cityId = val[1] || ''
    }
  }
}
</script>

<style>
.queryRecordTable .ivu-table-cell {
  padding-left: 8px;
  padding-right: 8px;
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
</style>
