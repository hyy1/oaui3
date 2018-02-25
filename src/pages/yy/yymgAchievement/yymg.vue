<template>
    <oaui3-template1>
        <div class="main">
            <div class="header">
                <Input placeholder="提单名称及账号" v-model="searchData.task_name" @keyup.enter="getList" style="width: 300px"></Input>

                <personnelFloat :title="'美工人员列表'" :text="'美工'" :idItem="[4]" :rebackData="searchData" :changeData="{name: 'mg_name', id: 'mg_id'}"></personnelFloat>
            
                <personnelFloat :title="'美工人员列表'" :text="'添加人'" :idItem="[4]" :rebackData="searchData" :changeData="{name: 'add_user_name', id: 'add_user_id', class2_id: 'mg_class2_id'}"></personnelFloat>

                <Select ref="classSelect" placeholder="请选择部门" v-model="searchData.mg_class2_id" clearable style="width:150px">
                    <Option :value="0">美工部</Option>
                    <Option v-for="item in class2List" :value="item.id" :key="item.id">{{item.classname}}</Option>
                </Select>
                <DatePicker type="date" placeholder="选择日期" :value="searchData.sdate" @on-change="searchData.sdate = $event" style="width: 150px"></DatePicker>
                -
                <DatePicker type="date" placeholder="选择日期" :value="searchData.edate" @on-change="searchData.edate = $event" style="width: 150px"></DatePicker>

                <Select placeholder="审核状态" v-model="searchData.audit_schedule" clearable style="width:150px">
                    <Option v-for="item in statusList" :value="item.key" :key="item.key">{{ item.text }}</Option>
                </Select>
                <Cascader :data="classList" v-model="checkClass" placeholder="请选择分类" filterable class="cas"></Cascader>
                <Button type="primary" @click="getList">搜索</Button>
                <Button @click="clear">清除选中</Button>
            </div>
            <div class="batch">
                <Button type="primary" v-if="del_qx" @click="del(chkid)">批量删除选中</Button>
                <Select placeholder="掌门审核" v-if="check_qx1" clearable @on-change="auditTask" style="width:200px">
                    <Option :value="0">未审核</Option>
                    <Option :value="-1">不通过</Option>
                    <Option :value="2">通过</Option>
                </Select>

                <Select placeholder="总监审核" v-if="check_qx2" clearable @on-change="auditTask" style="width:200px">
                    <Option :value="0">未审核</Option>
                    <Option :value="-2">不通过</Option>
                    <Option :value="2">通过</Option>
                </Select>
            </div>
            <Table border :columns="columns1" :data="lists" @on-selection-change="selection" :no-data-text="''"></Table>
            <div class="batch">
                <Page show-total :total="pageData.total" :current.sync="pageData.pageIndex" :page-size.sync="pageData.pageSize" @on-change="getList" style="text-align: right;"></Page>
            </div>
        </div>
        <!--审核浮动层-->
        <div v-if="check_isShow">
            <checked-float :auditTaskData="auditTaskData" :cancel="cancel" :getList="getList"></checked-float>
        </div>
    </oaui3-template1>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import personnelFloat from '@/components/public/personnelFloat'
import oaui3Ul from '@/components/yy/yymg/oaui3Ul'
import ula from '@/components/yy/yymg/ula2'
import checkedFloat from '@/components/yy/yymg/checked'

// 搜索数据
const _searchData = {
  edate: '',
  sdate: '',
  task_name: '',
  mg_id: 0,
  mg_name: '',
  add_user_id: 0,
  add_user_name: '',
  mg_class2_id: '',
  top_work_id: 0,
  work_id: 0,
  audit_schedule: ''
}
export default {
  props: ['task_name'],
  components: { personnelFloat, checkedFloat },
  data () {
    return {
      searchData: {
        edate: this.$route.query.edate || '',
        sdate: this.$route.query.sdate || '',
        task_name: this.$route.query.task_name || '',
        mg_id: this.$route.query.mg_id || 0,
        mg_name: this.$route.query.mg_name || '',
        add_user_id: this.$route.query.add_user_id || 0,
        add_user_name: this.$route.query.add_user_name || '',
        mg_class2_id: parseInt(this.$route.query.mg_class2_id) || 0,
        top_work_id: this.$route.query.top_work_id || 0,
        work_id: this.$route.query.work_id || 0,
        audit_schedule: this.$route.query.audit_schedule || ''
      },
      statusList: [
        {
          key: '0',
          text: '未审核'
        },
        {
          key: '1',
          text: '掌门审核通过'
        },
        {
          key: '-1',
          text: '掌门审核不通过'
        },
        {
          key: '2',
          text: '总监审核通过'
        },
        {
          key: '-2',
          text: '总监审核不通过'
        }
      ],
      // 审核浮动层参数
      auditTaskData: {
        title: '',
        id: 0,
        type: 1
      },
      // 列表
      columns1: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: '提单名称',
          width: 220,
          render: (h, params) => {
            if (params.row.task_source_id === 1) {
              return h('a', {
                attrs: {
                  href: '/app1/TbLading/Show.aspx?id=' + params.row.task_id,
                  target: '_blank'
                }
              }, params.row.task_name)
            } else {
              return params.row.task_name
            }
          }
        },
        {
          title: '美工',
          width: 120,
          key: 'mg_name'
        },
        {
          title: '日期',
          width: 150,
          key: 'add_time'
        },
        {
          title: '添加人',
          width: 120,
          key: 'add_user'
        },
        {
          title: '分类',
          width: 200,
          render: (h, params) => {
            return h(oaui3Ul, {
              props: {
                liData: params.row.work_record,
                text: 'top_work_name'
              }
            })
          }
        },
        {
          title: '二级分类',
          width: 200,
          render: (h, params) => {
            return h(oaui3Ul, {
              props: {
                liData: params.row.work_record,
                text: 'work_name'
              }
            })
          }
        },
        {
          title: '分数',
          width: 120,
          render: (h, params) => {
            return h(oaui3Ul, {
              props: {
                liData: params.row.work_record,
                text: 'score'
              }
            })
          }
        },
        {
          title: '附件',
          width: 120,
          render: (h, params) => {
            return h(ula, {
              props: {
                liData: params.row.work_record,
                text: 'attachment'
              }
            })
          }
        },
        {
          title: '操作',
          className: 'padding5',
          render: (h, params) => {
            let returnDOM = []
            let btnText = ''
            let pText = ''
            if (params.row.audit_schedule === 0) {
              btnText = '掌门审核'
              pText = '未审核'
            } else if (params.row.audit_schedule === 1) {
              btnText = '总监审核'
              pText = '掌门审核通过'
            } else if (params.row.audit_schedule === 2) {
              btnText = '总监审核通过'
              pText = '总监审核通过'
            } else if (params.row.audit_schedule === -1) {
              btnText = '掌门审核不通过'
              pText = '掌门审核不通过'
            } else if (params.row.audit_schedule === -2) {
              btnText = '总监审核不通过'
              pText = '总监审核不通过'
            }
            let checkBtn = h('Button', {
              props: {
                size: 'small',
                type: 'primary'
              },
              style: {
                marginRight: '5px',
                marginBottom: '5px'
              },
              on: {
                click: () => {
                  if (params.row.audit_schedule === 0) {
                    this.auditTaskModal(params.row.id, 1)
                  } else if (params.row.audit_schedule === 1) {
                    this.auditTaskModal(params.row.id, 2)
                  }
                }
              }
            }, btnText)
            let checkText = h('p', pText)

            // let rejectedReason = h('p', {
            //   style: {
            //     color: 'red'
            //   }
            // }, params.row.rejectedReason ? params.row.rejectedReason : '')

            let infoDOM = h('Button', {
              props: {
                size: 'small',
                type: 'info'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  window.open('/ui3/yymg/info' + params.row.id)
                }
              }
            }, '详情')
            let delDOM = h('Button', {
              props: {
                size: 'small',
                type: 'error'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.del(params.row.id)
                }
              }
            }, '删除')

            if ((params.row.audit_schedule === 0 && this.check_qx1) || (params.row.audit_schedule === 1 && this.check_qx1)) {
              returnDOM.push(checkBtn)
            } else {
              returnDOM.push(checkText)
            }
            returnDOM.push(infoDOM)
            if (this.del_qx) {
              returnDOM.push(delDOM)
            }
            return h('div', returnDOM)
          }
        }
      ],
      lists: [],
      checkClass: parseInt(this.$route.query.top_work_id) ? [parseInt(this.$route.query.top_work_id), parseInt(this.$route.query.work_id)] : [],
      classList: [],
      rejectedReason: '',
      chkid: [],
      pageData: {
        total: 0,
        pageSize: 20,
        pageIndex: parseInt(this.$route.query.pageIndex) || 1
      },
      check_qx1: false,
      check_qx2: false,
      del_qx: false,
      check_isShow: false
    }
  },
  computed: {
    ...mapState({
      class2List: state => state.Public.class2List // 部门数据
    })
  },
  created () {
    // 页面权限判断
    this.basejs.judgeQX('运营美工业绩提单列表_查看', 'page')
    // 权限判断
    this.basejs.judgeQX('运营美工业绩提单列表_掌门审核').then((e) => {
      if (e.state === 200) {
        this.check_qx1 = e.data
      }
    })
    this.basejs.judgeQX('运营美工业绩提单列表_总监审核').then((e) => {
      if (e.state === 200) {
        this.check_qx2 = e.data
      }
    })
    this.basejs.judgeQX('运营美工业绩提单列表_删除').then((e) => {
      if (e.state === 200) {
        this.del_qx = e.data
      }
    })
  },
  mounted () {
    // 设置标题
    this.$store.commit('setTitle', '运营美工业绩提单列表')
    // 获取列表
    this.getList()
    // 获取工作类型
    this.getClassList()
    // 获取美工二级部门
    this.getClass2(4)
  },
  watch: {
    // 监听分类选择list，
    'checkClass': function (val) {
      this.searchData.top_work_id = val[0]
      this.searchData.work_id = val[1]
    }
  },
  methods: {
    ...mapActions(['getClass2']),
    // 删除
    del (id) {
      if (id.length === 0) {
        this.$Message.error('请选择要删除的数据！')
        return
      }
      if (!confirm('确认删除？')) {
        return
      }
      this.oas.post('yymg/delTaskById', { task_ids: id }).then((e) => {
        if (e.state === 200) {
          this.$Message.success('删除成功！')
          this.getList()
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    selection (selection) {
      this.chkid = []
      selection.map((item) => {
        this.chkid.push(item.id)
      })
      this.chkid = this.chkid.join(',')
    },
    // 列表
    getList () {
      this.$router.push({
        name: 'yymg',
        query: {
          pageIndex: this.pageData.pageIndex,
          ...this.searchData
        }
      })
      this.oas.get('yymg/getTaskPageList',
        {
          pageIndex: this.pageData.pageIndex,
          pageSize: this.pageData.pageSize,
          ...this.searchData
        }
      ).then((e) => {
        if (e.state === 200) {
          this.lists = e.data.list
          this.pageData.total = e.data.total
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    // 工作类型级联
    getClassList () {
      this.oas.get('yymg/getAllWorkTypeFormat').then((e) => {
        if (e.state === 200) {
          this.classList = e.data
        }
      })
    },
    // 清除选中
    clear () {
      this.searchData = JSON.parse(JSON.stringify(_searchData))
      // this.$refs['classSelect'].selectedSingle = undefined
      this.checkClass = []
      this.getList()
    },
    // 审核浮动层
    auditTaskModal (id, type) {
      this.auditTaskData.id = id
      this.auditTaskData.type = type
      this.auditTaskData.title = type === 1 ? '掌门' : '总监'
      this.check_isShow = true
      this.$store.commit('yymgCheckFloatSet', true)
    },
    // 下拉框审核
    auditTask (value) {
      if (this.chkid.length === 0) {
        this.$Message.error('请选择审核数据！')
        return
      }
      if (value < 0 && this.rejectedReason.length === 0) {
        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: this.rejectedReason,
                autofocus: true,
                placeholder: '请填写不通过原因'
              },
              on: {
                input: (val) => {
                  this.rejectedReason = val
                }
              }
            })
          },
          onOk: () => {
            if (this.rejectedReason.length === 0) {
              this.$Message.error('未填写不通过原因！')
              return
            }
            this.subAudit(value)
          }
        })
        return
      }
      this.subAudit(value)
    },
    subAudit (value) {
      this.oas.post('yymg/auditTask', {
        audit_schedule: value,
        rejectedReason: this.rejectedReason,
        task_ids: this.chkid
      }).then((e) => {
        if (e.state === 200) {
          this.$Message.success('审核成功！')
          this.rejectedReason = ''
          this.getList()
        } else {
          this.$Modal.error({
            title: '错误提示',
            content: e.msg
          })
        }
      })
    },
    cancel () {
      this.$store.commit('yymgCheckFloatSet', false)
      this.check_isShow = false
    }
  }
}
</script>

<style scoped>
.header {
  padding: 15px;
}
.batch {
  padding: 15px;
}
.cas {
  width: 150px;
  margin: 0 auto;
  display: inline-block;
}
</style>

<style>
.padding5 {
  padding: 5px;
}
</style>                                                                         