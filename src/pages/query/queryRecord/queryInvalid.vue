<template>
  <oaui3-template1>
    <p class="title">{{searchData.customname}}【账号：{{searchData.wwname}}】</p>
    <Tabs v-model="active" type="card">
        <Tab-pane label="添加" icon="plus-round">
          <i-form ref='form1' :model="addData" :rules="ruleValidate" class="header" inline>
            <Form-item label="询盘日期" prop="enquiryDate" :label-width="100">
              <DatePicker type="date" :value="addData.enquiryDate" @on-change="addData.enquiryDate = $event" transfer placeholder="询盘日期" style="width: 150px"></DatePicker>
            </Form-item>
            <Form-item label="无效询盘次数" prop="invalidCount" :label-width="100">
              <Input v-model="addData.invalidCount" placeholder="请输入无效询盘次数"style="width: 200px"></Input>
            </Form-item>
            <Form-item>
              <Button type="primary" @click="add('form1')">提交</Button>
            </Form-item>
          </i-form>
        </Tab-pane>
        <Tab-pane label="修改" icon="edit" disabled>
          <i-form ref='form2' :model="editData" :rules="editRuleValidate" class="header" inline>
            <Form-item label="询盘日期" prop="enquiryDate" :label-width="100">
              <DatePicker type="date" :value="editData.enquiryDate" @on-change="editData.enquiryDate = $event" transfer placeholder="询盘日期" style="width: 150px"></DatePicker>
            </Form-item>
            <Form-item label="无效询盘次数" prop="invalidCount" :label-width="100">
              <Input v-model="editData.invalidCount" placeholder="请输入无效询盘次数" style="width: 200px"></Input>
            </Form-item>
            <Form-item>
              <Button type="primary" @click="edit('form2')">提交</Button>
            </Form-item>
          </i-form>
        </Tab-pane>
    </Tabs>

    <p class="search">
      <span class="time-title">统计周期：</span>
      <RadioGroup v-model="searchData.time">
        <Radio label="1">近90天</Radio>
        <Radio label="2">近30天</Radio>
        <Radio label="3">近7天</Radio>
        <Radio label="4">自定义日期</Radio>
      </RadioGroup>
      
      <span v-if="searchData.time == '4'">
        <DatePicker type="date" placeholder="开始时间" :value="searchData.sdate" @on-change="searchData.sdate = $event" style="width: 150px"></DatePicker>
        -
        <DatePicker type="date" placeholder="结束时间" :value="searchData.edate" @on-change="searchData.edate = $event" style="width: 150px"></DatePicker>
      </span>
      <Button type="primary" @click="getList" icon="ios-search">搜索</Button>
    </p>

    <div class="list">
      <Table border :columns="columns1" :data="lists" :no-data-text="''" border></Table>
      <Page show-total :total="searchData.total" :current.sync="searchData.pageIndex" :page-size.sync="searchData.pageSize" @on-change="getList" class="page"></Page>
    </div>
  </oaui3-template1>
</template>

<script>
export default {
  data () {
    // 添加时验证日期是否已存在
    const validateEnquiryDate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('日期不能为空'))
      } else {
        for (let item of this.lists) {
          if (value === item.enquiryDate) {
            callback(new Error('已存在的询盘日期'))
          }
        }
        callback()
      }
    }
    // 修改时验证日期是否已存在且不是当前数据
    const validateEnquiryDate2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('日期不能为空'))
      } else {
        for (let item of this.lists) {
          if (value === item.enquiryDate && this.editData.id !== item.id) {
            callback(new Error('已存在的询盘日期'))
          }
        }
        callback()
      }
    }
    // 验证无效询盘
    const validateInvalidCount1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('无效询盘次数不能为空'))
      }
      let patt = new RegExp(/[^\d]/g) // 匹配数字以外的字符
      if (patt.test(value) || value < 0) {
        callback(new Error('请输入正整数'))
      }
      callback()
    }
    // 验证无效询盘
    const validateInvalidCount2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('无效询盘次数不能为空'))
      }

      let patt = new RegExp(/[^\d]/g) // 匹配数字以外的字符
      if (patt.test(value) || value < 0) {
        callback(new Error('请输入正整数'))
      }
      callback()
    }

    return {
      lists: [],
      // 搜索数据
      searchData: {
        aliAccountId: this.$route.query.aliAccountId,
        customname: this.$route.query.customname,
        wwname: this.$route.query.wwname,
        time: 2,
        sdate: this.$route.query.sdate || '',
        edate: this.$route.query.edate || '',
        pageIndex: parseInt(this.$route.query.pageIndex) || 1,
        pageSize: 20,
        total: 0
      },
      // tab选中序号
      active: 0,
      // 添加数据
      addData: {
        // 询盘日期
        enquiryDate: this.moment().format('YYYY-MM-DD'),
        // 无效询盘次数
        invalidCount: ''
      },
      // 修改数据
      editData: {
        // 记录id
        id: 0,
        // 询盘日期
        enquiryDate: '',
        // 无效询盘次数
        invalidCount: ''
      },
      // 添加验证规则
      ruleValidate: {
        enquiryDate: [
          { validator: validateEnquiryDate, trigger: 'blur' }
        ],
        invalidCount: [
          // { required: true, message: '询盘次数不能为空', trigger: 'blur' }
          { validator: validateInvalidCount1, trigger: 'blur' }
        ]
      },
      // 修改验证规则
      editRuleValidate: {
        enquiryDate: [
          { validator: validateEnquiryDate2, trigger: 'blur' }
        ],
        invalidCount: [
          // { required: true, message: '询盘次数不能为空', trigger: 'blur' }
          { validator: validateInvalidCount2, trigger: 'blur' }
        ]
      },
      // 列表
      columns1: [
        {
          type: 'index',
          align: 'center',
          width: 100,
          title: '序号'
        },
        {
          title: '询盘日期',
          align: 'center',
          render: (h, params) => {
            return h('span', this.moment(params.row.enquiryDate).format('YYYY-MM-DD'))
          }
        },
        {
          title: '无效询盘个数',
          align: 'center',
          key: 'invalidCount'
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
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
                    // 给修改数据赋值
                    this.editData.enquiryDate = params.row.enquiryDate
                    this.editData.invalidCount = params.row.invalidCount
                    this.editData.id = params.row.id
                    // 切换到修改tab
                    this.active = 1
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
                    this.del(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  created () {
    // 设置页面标题
    this.$store.commit('setTitle', '无效询盘记录')
  },
  mounted () {
    // 初始加载列表数据
    this.getList()
  },
  methods: {
    // 添加
    add (name) {
      this.$refs[name].validate(valid => {
        if (!valid) {
          return false
        } else {
          this.oas.post('inquiry/enquiry/insert',
            {
              aliAccountId: this.searchData.aliAccountId,
              enquiryDate: this.addData.enquiryDate,
              invalidCount: this.addData.invalidCount
            }
          ).then((e) => {
            if (e.state === 200) {
              this.$Message.success('添加成功！')
              // 刷新列表
              this.getList()
            } else {
              this.$Message.error(e.msg)
            }
          })
        }
      })
    },
    // 修改
    edit (name) {
      this.$refs[name].validate(valid => {
        if (!valid) {
          return false
        } else {
          this.oas.post('inquiry/enquiry/update',
            {
              aliAccountId: this.searchData.aliAccountId,
              id: this.editData.id,
              enquiryDate: this.editData.enquiryDate,
              invalidCount: this.editData.invalidCount
            }
          ).then((e) => {
            if (e.state === 200) {
              this.$Message.success('修改成功！')
              // 刷新列表
              this.getList()
            } else {
              this.$Message.error(e.msg)
            }
          })
        }
      })
    },
    // 获取列表
    getList () {
      this.$router.push({
        name: 'queryInvalid',
        query: {
          ...this.searchData
        }
      })
      this.oas.get('inquiry/enquiry/listInvalid',
        {
          ...this.searchData
        }
      ).then((e) => {
        if (e.state === 200) {
          this.lists = e.data.list
          this.searchData.total = e.data && e.data.count
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    del (id) {
      this.hrConfirm('提示', '确定删除吗？', () => {
        this.oas
          .post('inquiry/enquiry/delete', { id })
          .then(e => {
            if (e.state === 200) {
              this.$Message.success('删除成功！')
              // 刷新列表
              this.getList()
            } else {
              this.$Message.success(e.msg)
            }
          })
      })
    }
  },
  watch: {
    // 监听用户选择的时间段，计算出对应日期
    'searchData.time': function (val) {
      var currentTime = this.moment().format('YYYY-MM-DD')
      this.searchData.edate = currentTime
      if (val === '1') {
        this.searchData.sdate = this.moment(currentTime).subtract('day', 89).format('YYYY-MM-DD')
      } else if (val === '2') {
        this.searchData.sdate = this.moment(currentTime).subtract('day', 29).format('YYYY-MM-DD')
      } else if (val === '3') {
        this.searchData.sdate = this.moment(currentTime).subtract('day', 6).format('YYYY-MM-DD')
      } else {
        this.searchData.sdate = ''
        this.searchData.edate = ''
      }
    }
  }
}
</script>

<style scoped>
.title {
  font-size: 16px;
  padding: 15px;
  margin-bottom: 10px;
}
.search {
  padding: 35px 15px 10px 15px;
}
.error {
  color: red;
  font-size: 12px;
}
</style>
