<template>
    <oaui3-template2>
        <div class="con">
            <Table border :columns="columns1" :data="data1" :no-data-text="''"></Table>
            <div class="paging">
                <Page show-total :total="pageData1.total" :current.sync="pageData1.pageIndex" :page-size.sync="pageData1.pageSize" @on-change="getCatalog"></Page>
            </div>

            <h2 class="bj">
                <span style="color: red;">{{selectCatalogData.timerange}}</span>详细报表</h2>
            <!-- <div class="box space-between align-center bj">
                <span>
                    总计：
                    <span class="total-num">{{moneysum}}</span>
                </span>
                <span v-if="export_qx">
                    <a target="_blank" :href="'/cws/historyreport/historyreport/exportdata?id='+this.selectCatalogData.catalogId" class="exprot-btn">导出报表</a>
                </span>
            </div> -->

            <div style="position:relative">
                <div class="search">
                    {{keyword}}
                    <Input type="text" v-model="keyword" placeholder="输入公司名称搜索" style="width:200px;"/>
                    <personnelFloat :text="'人员'" :title="'人员列表'" :rebackData="personel" :changeData="{name: 'uname', id: 'uid'}"></personnelFloat>
                    <Cascader :data="classListFormat" v-model="checkClass" class="cas"></Cascader>
                    <Button type="primary" @click="reportlist('search')">搜索</Button>
                    
                    <span v-if="export_qx">
                        <a target="_blank" :href="'/cws/historyreport/historyreport/exportdata?id='+this.selectCatalogData.catalogId+'&keyword=' + this.keyword" class="exprot-btn">导出报表</a>
                    </span>
                </div>
                <Collapse v-if="add_qx && !selectCatalogData.salary_yearmonth">
                    <Panel>
                        <span class="font16">添加</span>
                        <p slot="content">
                            <add :catalogId="selectCatalogData.catalogId" :getList="reportlist"></add>
                        </p>
                    </Panel>
                </Collapse>
                <div class="paging">
                    <Page show-total :total="pageData2.total" :current.sync="pageData2.pageIndex" :page-size.sync="pageData2.pageSize" @on-change="reportlist"></Page>
                </div>
                <table class="table table-bordered text-center">
                    <thead>
                        <tr>
                            <th width="100">人员</th>
                            <th width="200">公司名称</th>
                            <th width="100">合同类型</th>
                            <th width="90">付款金额</th>
                            <th width="90">业绩提点</th>
                            
                            <th width="90">提成</th>

                            <th width="100">续开总负责</th>
                            <th width="100">中阿客服</th>
                            <th width="90">发票状态</th>
                            <th width="130">合同编号</th>
                            <th width="100">付款方式</th>
                            <th width="120">付款日期</th>
                            <th width="120">合同开始日期</th>
                            <th width="120">合同结束日期</th>
                            <th>备注</th>
                            <th width="150">操作</th>
                        </tr>
                    </thead>
                    <tbody v-for="item1 in data2" :key="item1.classname">
                        <tr  width="100" style="font-size:16px">
                            <th>部门：</th>
                            <th colspan="14" style="border-bottom:0">{{item1.classname}}</th>
                            <th width="150" style="border-bottom:0;color:red;">总计：{{item1.classmoneysum}}</th>
                        </tr>
                        <tr v-for="item2 in item1.userList" :key="item2.username">
                            <td style="border-right:0">
                                {{item2.username}}
                                <p style="color:red">底薪：{{item2.basemoney}}</p>
                                <p style="color:red">小计：{{item2.usermoneysum}}</p>
                                <p style="color:red">提成小计：{{item2.tcSum}}</p>
                            </td>
                            <td colspan="15" style="padding:0px; border:0px;">
                                <table class="table table-bordered text-center">
                                    <tbody>
                                        <tr v-for="item3 in item2.customList" :key="item3.id" :class="{bgcolor: item3.zlk > 0}" class="table-hover">
                                            <td width="200">
                                                <span style="cursor: default;">{{item3.customname}}</span>
                                                <span v-if="item3.invoice_name">发票名称：{{item3.invoice_name}}</span>
                                                <span v-html="getMonth(item3.month)"></span>
                                            </td>
                                            <td width="100">{{item3.contract_typename}}</td>
                                            <td width="90">
                                                {{item3.money}} {{item3.jiezhuan}}
                                            </td>
                                            <td width="90">{{item3.tdnum}}</td>
                                            <th width="90">{{item3.tcnum}}</th>
                                            <td width="100">{{item3.xkzfz}}</td>
                                            <td width="100">{{item3.znkf}}</td>
                                            <td width="90">{{item3.invoice_state}}</td>
                                            <td width="130">{{item3.contract_num}}</td>
                                            <td width="100">{{item3.payment_method}}</td>
                                            <td width="120">{{item3.money_adddate}}</td>
                                            <td width="120">{{item3.contract_start}}</td>
                                            <td width="120">{{item3.contract_end}}</td>
                                            <td>{{item3.remark}}</td>
                                            <td width="150">
                                                <Button size="small" type="info" @click="info(item3.contractid)">详情</Button>
                                                <Button size="small" type="primary" @click="edit(item3.id)" v-if="edit_qx && !selectCatalogData.salary_yearmonth">修改</Button>
                                                <Button size="small" type="error" @click="del(item3.id)" v-if="del_qx && !selectCatalogData.salary_yearmonth">删除</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="paging">
                    <Page show-total :total="pageData2.total" :current.sync="pageData2.pageIndex" :page-size.sync="pageData2.pageSize" @on-change="reportlist"></Page>
                </div>
            </div>
        </div>
    </oaui3-template2>
</template>

<script>
import add from './add'
import { mapState, mapActions } from 'vuex'
import personnelFloat from '@/components/public/personnelFloat'

export default {
  components: { add, personnelFloat },
  data () {
    return {
      personel: {
        uid: this.$route.query.uid || '',
        uname: this.$route.query.uname || ''
      },
      keyword: this.$route.query.keyword || '',
      checkClass: [parseInt(this.$route.query.class1id) || 0, parseInt(this.$route.query.class2id) || 0],
      pageData1: {
        total: 0,
        pageIndex: parseInt(this.$route.query.pageIndex1) || 1,
        pageSize: 10
      },
      pageData2: {
        total: 0,
        pageIndex: parseInt(this.$route.query.pageIndex2) || 1,
        pageSize: 1
      },
      columns1: [
        {
          title: '报表',
          key: 'timerange'
        },
        {
          title: '生成日期',
          key: 'addtime'
        },
        {
          title: '工资年月',
          key: 'salary_yearmonth'
        },
        {
          title: '操作',
          width: 300,
          render: (h, params) => {
            let ck = h('Button', {
              props: {
                type: 'info',
                size: 'small'
              },
              on: {
                click: () => {
                  this.catalogClick(params.row)
                }
              }
            }, '查看')
            let returnDOM = [ck]
            let setym = h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                margin: '0 5px'
              },
              on: {
                click: () => {
                  this.setYM(params.row.id)
                }
              }
            }, '设置工资年月')
            let settd = h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginLeft: '5px'
              },
              on: {
                click: () => {
                  if (!confirm('确定生成提点吗？')) { return }
                  this.cws.post('historyreport/historyreport/settdnum', {
                    id: params.row.id
                  }).then((e) => {
                    if (e.state === 200) {
                      this.$Message.success('生成成功！')
                    } else {
                      this.$Message.error(e.msg)
                    }
                  })
                }
              }
            }, '生成提点')
            let del = h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  if (!confirm('确定删除？')) { return }
                  this.cws.post('historyreport/historyreport/dirdel', {
                    id: params.row.id
                  }).then((e) => {
                    if (e.state === 200) {
                      this.$Message.success('删除成功！')
                      this.getCatalog()
                    } else {
                      this.$Message.error(e.msg)
                    }
                  })
                }
              }
            }, '删除')
            if (this.settd_qx && !params.row.salary_yearmonth) {
              returnDOM.push(settd)
            }
            if (this.setym_qx && !params.row.salary_yearmonth) {
              returnDOM.push(setym)
            }
            if (this.settd_qx && !params.row.salary_yearmonth) {
              returnDOM.push(del)
            }
            return h('div', returnDOM)
          }
        }
      ],
      yearmonth: '',
      data1: [],
      data2: [],
      moneysum: 0,
      // 查看的目录
      selectCatalogData: {
        catalogId: this.$route.query.id,
        timerange: '',
        // 工资年月
        salary_yearmonth: ''
      },
      // 权限
      add_qx: false,
      edit_qx: false,
      del_qx: false,
      export_qx: false,
      setym_qx: false,
      settd_qx: false,
      list_qx: false,
      mldel_qx: false
    }
  },
  created () {
    // 权限判断
    this.basejs.judgeQX('历史报表详情数据_添加').then((e) => {
      if (e.state === 200) {
        this.add_qx = e.data
      }
    })
    this.basejs.judgeQX('历史报表详情数据_修改').then((e) => {
      if (e.state === 200) {
        this.edit_qx = e.data
      }
    })
    this.basejs.judgeQX('历史报表详情数据_删除').then((e) => {
      if (e.state === 200) {
        this.del_qx = e.data
      }
    })
    this.basejs.judgeQX('历史报表详情数据_导出').then((e) => {
      if (e.state === 200) {
        this.export_qx = e.data
      }
    })
    this.basejs.judgeQX('历史报表详情数据_设置工资年月').then((e) => {
      if (e.state === 200) {
        this.setym_qx = e.data
      }
    })
    this.basejs.judgeQX('历史报表详情数据_设置提点').then((e) => {
      if (e.state === 200) {
        this.settd_qx = e.data
      }
    })
    this.basejs.judgeQX('历史报表目录_查看').then((e) => {
      if (e.state === 200) {
        this.list_qx = e.data
      }
    })
    this.basejs.judgeQX('历史报表目录_删除').then((e) => {
      if (e.state === 200) {
        this.mldel_qx = e.data
      }
    })
  },
  mounted () {
    this.$store.commit('setTitle', '历史报表')
    this.getCatalog()
    this.getClassListFormat()
  },
  computed: {
    ...mapState({
      classListFormat: state => state.Public.classListFormat
    })
  },
  methods: {
    ...mapActions(['getClassListFormat']),
    // 设置年月
    setYM (id) {
      this.$Modal.confirm({
        render: (h) => {
          return h('DatePicker', {
            props: {
              value: this.yearmonth,
              type: 'month',
              placeholder: '请选择年月'
            },
            on: {
              input: (val) => {
                this.yearmonth = val
              }
            }
          })
        },
        onOk: () => {
          this.cws.post('historyreport/historyreport/setSalaryMonth', {
            catalogid: id,
            salary_month: this.moment(this.yearmonth).format('YYYY-MM')
          }).then((e) => {
            if (e.state === 200) {
              this.$Message.success('设置成功！')
              this.getCatalog()
            } else {
              this.$Message.error(e.msg)
            }
          })
        }
      })
    },
    info (id) {
      window.open('/app/custom/moneyAdd.aspx?htID=' + id)
    },
    edit (id) {
      window.open('/ui3/historyReportEdit' + id)
    },
    del (id) {
      if (!confirm('确认删除？')) { return }
      this.cws.post('historyreport/historyreport/del', { id }).then((e) => {
        if (e.state === 200) {
          this.$Message.success('删除成功！')
          this.reportlist()
        }
      })
    },
    // 获取目录list
    getCatalog () {
      this.cws.get('historyreport/historyreport/dir', {
        pageIndex: this.pageData1.pageIndex,
        pageSize: this.pageData1.pageSize
      }).then((e) => {
        if (e.state === 200) {
          this.data1 = e.data.list
          this.pageData1.total = e.data.total
          this.selectCatalogData.catalogId = this.selectCatalogData.catalogId > 0 ? this.selectCatalogData.catalogId : e.data.list[0].id || 0
          this.selectCatalogData.timerange = e.data.list[0] && e.data.list[0].timerange ? e.data.list[0].timerange : ''
          this.selectCatalogData.salary_yearmonth = e.data.list[0] && e.data.list[0].salary_yearmonth ? e.data.list[0].salary_yearmonth : ''
          this.reportlist()
        }
      })
    },
    // 根据目录id获取报表list
    reportlist (search) {
      if (search === 'search') {
        this.pageData2.pageIndex = 1
      }
      this.$router.push({
        query: {
          id: this.selectCatalogData.catalogId,
          keyword: this.keyword,
          uid: this.personel.uid,
          uname: this.personel.uname,
          class1id: this.checkClass[0] ? this.checkClass[0] : '',
          class2id: this.checkClass[1] ? this.checkClass[1] : '',
          pageIndex1: this.pageData1.pageIndex,
          pageIndex2: this.pageData2.pageIndex
        }
      })
      this.cws.get('historyreport/historyreport/reportdetailsPage',
        {
          id: this.selectCatalogData.catalogId,
          keyword: this.keyword,
          uid: this.personel.uid,
          class1id: this.checkClass[0] ? this.checkClass[0] : '',
          class2id: this.checkClass[1] ? this.checkClass[1] : '',
          pageIndex: this.pageData2.pageIndex,
          pageSize: this.pageData2.pageSize
        })
        .then((e) => {
          if (e.state === 200) {
            this.data2 = e.data.list[0].classList
            this.moneysum = e.data.list[0].moneysum
            this.pageData2.total = e.data.total
          } else {
            this.$Message.error(e.msg)
          }
        })
    },
    // 点击目录查看
    catalogClick (row) {
      this.selectCatalogData.catalogId = row.id
      this.selectCatalogData.timerange = row.timerange
      this.selectCatalogData.salary_yearmonth = row.salary_yearmonth
      this.pageData2.pageIndex = 1
      // 清空搜索数据
      this.checkClass = []
      this.personel = {
        uid: 0,
        uname: ''
      }
      this.reportlist()
    },
    getMonth (month) {
      if (month > 0 && month < 4) {
        return month + '个月'
      } else if (month > 4) {
        return '4个月以上'
      }
    }
  }
}
</script>

<style>
.ivu-collapse {
  border-bottom: 0px;
}

.ivu-table-row-hover {
  background: #8cc1f9;
}
</style>

<style scoped>
.exprot-btn {
  background: #47d2f3;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
}

.table {
  margin-bottom: -1px;
}

.paging {
  text-align: right;
  padding: 10px 15px;
}

.bj {
  padding: 15px;
}

.total-num {
  color: red;
  font-size: 16px;
}

.search {
  padding: 0 15px 10px 15px;
}

.cas {
  width: 200px;
  display: inline-block;
}

.bgcolor {
  background: #c7c7c7;
}

.table-hover:hover {
  background: #8cc1f9;
}
</style>
