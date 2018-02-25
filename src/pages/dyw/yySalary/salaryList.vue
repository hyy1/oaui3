<template>
    <oaui3-template2>
        <div class="pad_10">
            <Row type="flex" justify="center" align="middle" class="bg_primary pad_mar_10">
                <Col class="font_18"><Icon type="clipboard"></Icon>  目录显示</Col>
                <Col class="font_18">
                    <Button v-if="qx.shencheng_qx && isshengcheng" @click="shengcheng" :loading="loading">生成业绩</Button>
                </Col>
            </Row>
            <Table :columns="th" :data="dirList.list"></Table>
            <Page class="text_center pad_t" :total="dirList.total" :page-size.sync="dirList.pageSize" :current.sync="searchData.pageIndexDir" size="small" @on-change="dir" show-total></Page>
        </div>
        <!--dir end-->
        <Row type="flex" justify="center" align="middle" class="bg_primary">
            <Col class="font_18"><Icon type="clipboard"></Icon>&nbsp; {{searchData.month}}</Col>
        </Row>
        <Alert>
            <personnelFloat :rebackData="searchData" :text="'人员'" :title="'人员列表'" :idItem="[16]" :changeData="{name:'peopleName', id: 'peopleId'}"></personnelFloat>
            <!--personnelFloat- :rebackData="searchData" :text="'人员'" :title="'人员列表'" :idItem="[16]" :changeData="{name:'peopleName', id: 'peopleId'}"></personnelFloat-->
            <Select class="wid_150" placeholder="选择部门" clearable v-model="searchData.class2id">
                <Option v-for="el in class2List" :value="el.id" :key="el.id">{{el.classname}}</Option>
            </Select>
            <Button type="primary" @click="search(1)"><Icon type="search"></Icon>&nbsp; 搜索</Button>
            <a v-if="qx.daochu_qx" class="ivu-btn ivu-btn-success" :href="`/cws/achievement/dyw/export?id=${this.searchData.id}&class1=${this.searchData.class2id}&userid=${searchData.peopleId}`"><Icon type="archive"></Icon>&nbsp; 导出</a>
            <Button type="primary" @click="locadd" v-if="this.fincheck!=1 && qx.add_qx">添加</Button>
        </Alert>
        <!--search end-->
        <Page  :total="salaryList.total" :current.sync="searchData.pageIndexInfo" :page-size.sync="salaryList.pageSize" @on-change="search" class="text_right" show-total></Page>
        <table class="table">
            <tr class="col_info">
                <th colspan="14">
                    <span v-for="el in salaryList.list" :key="el.class2">
                        {{el.class2Name}}
                    </span>
                </th>
            </tr>
            <tr class="col_info">
                <td width="70"><b>姓名</b></td>
                <td width="200"><b>客户名字</b></td>
                <td width="80"><b>月份</b></td>
                <td width="80"><b>业绩</b></td>
                <td width="60"><b>提点</b></td>
                <td width="100"><b>算提点业绩</b></td>
                <td width="80"><b>底薪</b></td>
                <td width="60"><b>绩效</b></td>
                <td width="130"><b>提成</b></td>
                <td width="80"><b>特殊薪资</b></td>
                <td width="80"><b>入职时间</b></td>
                <td width="80"><b>工资合计</b></td>
                <td width="80"><b>操作</b></td>
                <td width="200"><b>备注</b></td>
            </tr>
            
            <template v-for="el0 in salaryList.list">
                <template v-for="el in el0.userList">
                    <tr>
                        <td>{{el.username}}</td>
                        <td>{{el.grade}}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td :rowspan="el.customList.length+2" class="card" valign="top">
                            <p><b class="remark" v-text="fitremark(el.weijieList)"></b><a @click="isshow = true; modelfloat = el.weijieList" class="fr">更多...</a></p>
                            <template v-for="(el2,index) in el.weijieList" v-if="el.weijieList && index<1">
                                <ul class="pad">
                                <li><b>公司名：</b><a v-text="el2.customName" @click="loc(el2.type,el2.customName,el2.month)"></a></li>
                                <li><b>年&#12288;月：</b>{{el2.month}}</li> 
                                <li><b>金&#12288;额：</b>{{el2.achievement}}</li> 
                                <li><b>类&#12288;别：</b><span v-text="filterorder(el2.type,['阿里','淘宝天猫'])"></span></li>
                                </ul>
                            </template>
                        </td>
                    </tr>
                    <tr v-for="el2 in el.customList" :key="el2.id" class="hov">
                        <td></td>
                        <td><a @click="loc(el2.type,el2.customName,el2.month)">{{el2.customName}}</a></td>
                        <td>{{el2.month}}</td>
                        <td>{{el2.achievement}}</td>
                        <td>{{el2.tidian}}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            {{el2.commission}}
                            <Tag color="blue" v-if="el2.moneyType==1">特殊</Tag>
                            <Tag color="green" v-text="filterorder(el2.uesrtype,['运营','客服'])"></Tag>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Button type="error" size="small" @click="del(el2)" v-if="fincheck != 1  && qx.del_qx">删除</Button></td>
                    </tr>
                    <tr class="hov">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><b>{{el.achievementTotal}}</b></td>
                        <td><b>{{el.baseMoney}}</b></td>
                        <td><b>{{el.performance}}</b></td>
                        <td><b>{{el.commissionTotal}}</b></td>
                        <td><b>{{el.specialMoney}}</b></td>
                        <td><b v-text="filtime(el.entryTime)"></b></td>
                        <td><b>{{el.totalMoney}}</b></td>
                        <td></td>
                    </tr>
                </template>
        </template>
        </table>
        <Page  :total="salaryList.total" :current.sync="searchData.pageIndexInfo" :page-size.sync="salaryList.pageSize" @on-change="search" class="text_right" show-total></Page>
        <Modal title="未结款集合" v-model="isshow" width="500">
            <div style="height:400px; overflow:auto">
                <template v-for="el2 in modelfloat">
                    <ul class="pad">
                        <li><b>公司名：</b><a @click="loc(el2.type,el2.customName,el2.month)">{{el2.customName}}</a></li>
                        <li><b>年&#12288;月：</b>{{el2.month}}</li> 
                        <li><b>金&#12288;额：</b>{{el2.achievement}}</li> 
                        <li><b>类&#12288;别：</b><span v-text="filterorder(el2.type,['阿里','淘宝天猫'])"></span></li>
                    </ul>
                    <br/>
                </template>
            </div>
                <div slot="footer">
                    <Button type="primary" @click="isshow = false">关闭</Button>
                </div>
        </Modal>
        <br/>
        <BackTop></BackTop>
    </oaui3-template2>
</template>

<script>
import basecss from '@/assets/base.css'
import operation from '@/components/dyw/yySalary/operation'
import personnelFloat from '@/components/public/personnelFloat'

export default ({
  components: { basecss, personnelFloat, operation },
  data () {
    return {
      modelfloat: {},
      searchData: {
        peopleName: this.$route.query.peopleName || '',
        peopleId: this.$route.query.userid || '',
        // 目录id，默认0
        id: this.$route.query.id || 0,
        // 部门id
        class2id: parseInt(this.$route.query.class2id) || '',
        // 仅显示月份
        month: this.$route.query.month || '',
        pageIndexInfo: parseInt(this.$route.query.pageIndexInfo) || 1,
        pageIndexDir: parseInt(this.$route.query.pageIndexDir) || 1
      },
      // 添加删除设置
      fincheck: 0,
      // 更多
      isshow: false,
      loading: false,
      // 生成
      istrue: '',
      class2List: {},
      th: [
        {
          title: '工资年月',
          key: 'salaryYearmonth',
          render: (h, params) => {
            return h('a', {
              domProps: {// 设置值
                innerHTML: params.row.salaryYearmonth
              },
              on: {
                click: () => {
                  this.theMonth(params.row.salaryYearmonth, params.row.id, params.row.fincheck)
                }
              }
            })
          }
        },
        {
          title: '添加时间',
          key: 'addtime',
          width: '180px',
          render: (h, params) => {
            return this.moment(params.row.addtime).format('YYYY-MM-DD HH:MM:SS')
          }
        },
        {
          title: '生成时间段',
          key: 'timerange',
          width: '180px'
        },
        { title: '备注', key: 'remark' },
        {
          title: '提交情况',
          key: 'issubmit',
          render: (h, params) => {
            let issubmit
            params.row.issubmit === 1 ? issubmit = '已提交' : issubmit = '未提交'
            return issubmit
          }
        },
        {
          title: '审核状态',
          key: 'fincheck',
          render: (h, params) => {
            let fincheck = ['未审核', '通过', '不通过']
            return fincheck[params.row.fincheck]
          }
        },
        {
          title: '操作',
          width: '180px',
          render: (h, params) => {
            return h(operation, {
              props: { dirRow: params.row, pageIndex: this.dirList.pageIndex, qx: this.qx },
              on: {
                dir: this.dir
              }
            })
          }
        }
      ],
      dirList: {},
      salaryList: {},
      qx: {
        shencheng_qx: false,
        tijiao_qx: false,
        shenhe_qx: false,
        shanchu_qx: false,
        daochu_qx: false,
        del_qx: false,
        add_qx: false
      }
    }
  },
  methods: {
    /* 生成业绩 */
    shengcheng (info = 1) {
      let _this = this
      this.loading = true
      this.$Notice.info({ title: '通知', desc: '正在自动生成中,当前数据较多,请稍等1~2分钟...', duration: 10 })
      this.cws.post('achievement/dyw/generate').then(
        (e) => {
          if (e.state === 200) {
            this.$Message.success('生成成功')
            this.loading = false
            this.dir('')
          } else {
            this.dir('')
            this.$Message.error(e.msg)
          }
        })
        .catch(function (error) {
          if (error.response.status === 504) {
            _this.$store.commit('setFetchLoading', false)
          }
        })
    },
    /* 过滤计算 */
    fitremark (val) {
      if (val.length !== 0) {
        return '未结款集合'
      } else {
        return '无未结款'
      }
    },
    /* 数据匹配过滤 如0 1 2 3 */
    filterorder (val, arr) {
      let filarr = arr
      return filarr[val]
    },
    /* 时间格式化 */
    filtime (val) {
      return val === 'null' || val == null || val === '' ? '' : this.moment(val).format('YYYY-MM-DD')
    },
    /* 跳转淘宝,天猫交易核对列表 */
    loc (type, customname, month) {
      if (type === 1) {
        window.open(`/ui2/index.php/DYW/DywCheck/Dir_Finance_TBTM?keyword=${customname}&date_s=${month}&date_e=${month}`)
      } else {
        window.open(`/ui2/index.php/DYW/DywCheck/Dir_Finance?keyword=${customname}&date_s=${month}&date_e=${month}`)
      }
    },
    /* 搜索的细化信息 */
    search (val) {
      this.$router.push({
        name: 'yysalarylist',
        query: {
          id: this.searchData.id,
          class2id: this.searchData.class2id,
          peopleName: this.searchData.peopleName,
          userid: this.searchData.peopleId,
          month: this.searchData.month,
          pageIndexDir: this.dirList.pageIndex,
          pageIndexInfo: this.searchData.pageIndexInfo
        }
      })
      // 搜索需要指定条件为当前第一页，分页需要满足当前搜索条件为空（分页为切换部门，一个部门一页）
      var class2Id = val === 1 ? this.searchData.class2id : ''
      var userId = val === 1 ? this.searchData.peopleId : ''
      if (class2Id !== '' || userId !== '') { val = 1 }
      this.cws.get('achievement/dyw/dirinfo', {
        id: this.searchData.id,
        class2id: this.$route.query.class2id || class2Id,
        userid: this.$route.query.userid || userId,
        pageIndex: val
      }).then(
        (e) => {
          if (e.state === 200) {
            this.salaryList = e.data
          } else {
            this.$Message.error(e.msg)
          }
        })
    },
    /* 搜索当前选中月工资 */
    theMonth (month, id, fincheck) {
      this.searchData.id = id
      this.searchData.month = month
      this.fincheck = fincheck
      this.search(1)
      this.searchData.pageIndexInfo = 1
    },
    /* 获取目录列表 */
    dir (val) {
      this.cws.get('achievement/dyw/dir', {
        pageIndex: val,
        pageSize: 5
      }).then(
        (e) => {
          if (e.state === 200) {
            this.dirList = e.data
            // 判断目录列表是否有值
            this.istrue = this.dirList.list.length > 0 ? this.dirList.list[0].salaryYearmonth : ''
            // 数据不存在时，清空原有详细数据
            if (typeof (this.dirList.list[0]) === 'undefined') {
              this.salaryList = {}
              return
            }
            // 初始化数据和解决默认显示问题（默认显示目录第一页第一条数据）
            if (val <= 0) {
              this.searchData.id = this.dirList.list[0].id
              this.searchData.month = this.dirList.list[0].salaryYearmonth
              this.fincheck = this.dirList.list[0].fincheck// 目录通过状态，控制当月详细数据的删除
              this.search(this.searchData.pageIndexInfo)
            }
          } else {
            this.$Message.error(e.msg)
          }
        })
    },
    /* 获取指定部门的列表 */
    getyyClass () {
      this.cws.get('common/class2/list', {
        class1Str: 16
      }).then(
        (e) => {
          if (e.state === 200) {
            this.class2List = e.data
          } else {
            this.$Message.error(e.msg)
          }
        })
    },
    locadd () {
      window.open('/ui3/dyw/yysalarylistAdd?dirid=' + this.searchData.id + '&salaryYearmonth=' + this.searchData.month)
    },
    del (row) {
      this.cws.post('achievement/dyw/delcustom', { id: row.id }).then((e) => {
        if (e.state === 200) {
          this.search(this.searchData.pageIndexInfo)
          this.$Message.success('删除成功')
        } else {
          this.$Message.error(e.msg)
        }
      })
    }
  },
  computed: {
    /* 生成业绩按钮是否显示 */
    isshengcheng () {
      // 判断是否有上月数据，有不显示生成按钮
      if (this.istrue !== this.moment().subtract(1, 'months').format('YYYY-MM')) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    /* 权限 */
    this.basejs.judgeQX('代运维薪资业绩_查看', 'page')
    this.basejs.judgeQX('代运维薪资业绩_生成').then((e) => {
      if (e.state === 200) {
        this.qx.shencheng_qx = e.data
      }
    })
    this.basejs.judgeQX('代运维薪资业绩_提交').then((e) => {
      if (e.state === 200) {
        this.qx.tijiao_qx = e.data
      }
    })
    this.basejs.judgeQX('代运维薪资业绩_审核').then((e) => {
      if (e.state === 200) {
        this.qx.shenhe_qx = e.data
      }
    })
    this.basejs.judgeQX('代运维薪资业绩_删除').then((e) => {
      if (e.state === 200) {
        this.qx.shanchu_qx = e.data
      }
    })
    this.basejs.judgeQX('代运维薪资业绩_导出').then((e) => {
      if (e.state === 200) {
        this.qx.daochu_qx = e.data
      }
    })
    this.basejs.judgeQX('代运维薪资_删除').then((e) => {
      if (e.state === 200) {
        this.qx.del_qx = e.data
      }
    })
    this.basejs.judgeQX('代运维薪资_添加').then((e) => {
      if (e.state === 200) {
        this.qx.add_qx = e.data
      }
    })
  },
  mounted () {
    this.$store.commit('setTitle', '代运维最新薪资报表')// 设置页面标题
    this.dir('')// 初始化目录
    this.getyyClass()// 初始化部门列表
  }
})
</script>

<style scoped>
.pad_10 {
  margin: 0 auto;
  width: 70%;
  padding-top: 20px;
}
.pad {
  padding: 0px 20px 0px 20px;
}
.pad_mar_10 {
  padding: 5px;
  border-radius: 10px 10px 0px 0px;
}
.text_right {
  text-align: right;
}
.ivu-collapse {
  text-align: center;
}
.ivu-tag {
  line-height: 18px;
  height: 18px;
  margin: 0px;
  padding: 0px 4px;
}
.fr {
  float: right;
  margin-left: 5px;
}
.add {
  padding: 15px 0px 15px 0px;
}
.table {
  border-collapse: collapse;
  border: none;
  width: 100%;
  margin: 10px auto;
  text-align: center;
  box-shadow: 0px 3px 20px #c3c3c3;
}
.hov:hover {
  background: #bcd9e4;
}
.table > tr > td {
  border: solid #e9eaec 1px;
  padding: 5px 4px;
}
.col_info {
  background: #f8f8f9;
  color: #495060;
  font-size: 16px;
}
.remark {
  font-size: 15px;
}

.ivu-table-body {
  overflow: visible;
}
.card {
  background: #f3f3f3;
  text-align: left;
}
</style>