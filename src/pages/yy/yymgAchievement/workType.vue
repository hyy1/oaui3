<template>
      <oaui3-template1>
          <div class="addwordtype">
            <Row>
                <Col span="10" class="row-txt">所属</Col>
                <Col span="5" class="row-con">
                    <Select v-model="subData.parent" style="width:200px">
                        <Option :value="0">一级分类</Option>
                        <Option v-for="item in data1" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
            </Row>
            <Row>
                <Col span="10" class="row-txt">分类名称</Col>
                <Col span="5" class="row-con">
                    <Input placeholder="输入分类名称" v-model="subData.work_name" style="width: 300px"></Input>
                </Col>
            </Row>
            <Row>
                <Col span="10" class="row-txt">输入分数</Col>
                <Col span="5" class="row-con">
                    <Input placeholder="输入分数" v-model="subData.score" style="width: 300px"></Input>
                </Col>
            </Row>
            <Row>
                <Col span="10" class="row-txt">排序</Col>
                <Col span="5" class="row-con">
                    <Input placeholder="输入排序" v-model="subData.sort" style="width: 300px"></Input>
                </Col>
            </Row>
            <Row>
                <Col span="10" class="row-txt"></Col>
                <Col span="5" class="row-con">
                    <span v-if="!editbtn">
                        <Button type="primary" @click="subAdd" class="sub-btn">添加</Button>
                        <Button type="default" v-if="!editbtn" @click="clearData" class="sub-btn">清空</Button>
                    </span>
                    <span v-else>
                        <Button type="primary" @click="subEdit" class="sub-btn">修改</Button>
                        <Button type="primary" @click="rebackAdd" class="sub-btn">返回添加</Button>
                    </span>
                </Col>
            </Row>
          </div>
          <Table :columns="columns1" :data="data1"></Table>
      </oaui3-template1>
</template>

<script>
import expandRow from '@/components/yy/yymg/expandRow'
export default {
  components: { expandRow },
  data () {
    return {
      subData: {
        parent: 0,
        score: '',
        score_mode: '',
        work_name: '',
        sort: ''
      },
      editbtn: false,
      columns1: [
        {
          title: '序号',
          render: (h, params) => {
            return h('span', params.index + 1)
          }
        },
        {
          title: '分类名称',
          width: 100,
          key: 'work_name'
        },
        {
          text: 'center',
          width: 50,
          type: 'expand',
          render: (h, params) => {
            return h(expandRow, {
              props: {
                data: params.row.children,
                editFn: this.edit,
                delFn: this.del
              }
            })
          }
        },
        {
          title: '分数',
          align: 'center',
          key: 'score'
        },
        {
          title: '排序',
          align: 'center',
          key: 'sort'
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.edit(params.row.id)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.del(params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data1: [],
      add_qx: false
    }
  },
  created () {
    // 页面权限判断
    this.basejs.judgeQX('运营美工业绩分类_查看', 'page')
  },
  mounted () {
    this.getAllWorkType()
    this.$store.commit('setTitle', '运营美工业绩分类')
  },
  methods: {
    // 列表数据
    getAllWorkType () {
      this.oas.get('yymg/getAllWorkTypeFormat').then((e) => {
        if (e.state === 200) {
          this.data1 = e.data
        }
      })
    },
    validataForm () {
      if (!this.subData.work_name) {
        this.$Message.error('请填写分类名称！')
        return false
      }
      if (!this.subData.score) {
        this.$Message.error('请填写分数！')
        return false
      }
      return true
    },
    subAdd () {
      if (!this.validataForm()) {
        return
      }
      this.oas.post('yymg/addWorkType', this.subData).then((e) => {
        if (e.state === 200) {
          this.$Message.success('添加成功！')
          this.reload()
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    edit (id) {
      this.editbtn = true
      this.oas.get('yymg/getWorkTypeInfoById', { id }).then((e) => {
        if (e.state === 200) {
          this.subData = e.data
        }
      })
    },
    del (row) {
      if (row.parent === 0) {
        if (!confirm('确认删除该一级分类及该一级分类下的所有子分类？')) {
          return
        }
      } else {
        if (!confirm('确认删除？')) {
          return
        }
      }
      this.oas.post('yymg/delWorkTypeById', { id: row.id }).then((e) => {
        if (e.state === 200) {
          this.$Message.success('删除成功！')
          this.getAllWorkType()
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    subEdit () {
      if (!this.validataForm()) {
        return
      }
      this.oas.post('yymg/updateWorkType', this.subData).then((e) => {
        if (e.state === 200) {
          this.$Message.success('修改成功！')
          this.reload()
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    rebackAdd () {
      this.editbtn = false
      this.clearData()
    },
    clearData () {
      this.subData = {
        parent: 0,
        score: '',
        score_mode: '',
        work_name: '',
        sort: ''
      }
    },
    reload () {
      this.getAllWorkType()
      this.clearData()
    }
  }
}
</script>

<style>
td.ivu-table-expanded-cell {
  padding: 10px 0;
}
</style>

<style scoped>
.addwordtype {
  padding: 10px 0 30px 0;
}
.sub-btn {
  margin-top: 10px;
  padding: 6px 30px;
}
</style>
