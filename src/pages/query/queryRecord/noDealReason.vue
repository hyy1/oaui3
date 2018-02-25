<template>
  <oaui3-template1>
      <div class="add">
        <i-form ref="form1" :model="formData" :rules="ruleValidate" :label-width="120" inline>
          <Form-item label="添加未成交原因" prop="noDealReason">
            <Input v-model='formData.noDealReason' placeholder='输入未成交原因' style="width:200px" />
          </Form-item>
          <Button type='primary' @click='add'>添加</Button>
        </i-form>
      </div>
      <div class="list">
        <Table border :columns='columns1' :data='lists' :no-data-text="''" class='queryRecordTable'></Table>
      </div>
  </oaui3-template1>

</template>
<script>
export default {
  data () {
    return {
      formData: {
        noDealReason: ''
      },
      ruleValidate: {
        noDealReason: [
          { required: true, message: '未成交原因不能为空', trigger: 'blur' }
        ]
      },
      lists: [],
      columns1: [
        {
          type: 'index',
          align: 'center',
          title: '序号'
        },
        {
          title: '未成交原因',
          align: 'center',
          key: 'name'
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h(
              'Button',
              {
                props: {
                  size: 'small',
                  type: 'error'
                },
                on: {
                  click: () => {
                    this.del(params.row, params.index)
                  }
                }
              },
              '删除'
            )
          }
        }
      ]
    }
  },
  created () {
    this.$store.commit('setTitle', '未成交原因管理')
  },
  mounted () {
    this.getList()
  },
  methods: {
    add () {
      this.$refs['form1'].validate(b => {
        if (!b) {
          return
        }
        this.lists.push({ name: this.formData.noDealReason })
        this.oas.jsonPost('inquiry/nodealreason/add', JSON.stringify({ key: 'NO_DEAL_REASON', value: this.lists }))
          .then(e => {
            if (e.state === 200) {
              this.$Message.success('添加成功！')
              this.formData.noDealReason = ''
              this.getList()
            } else {
              this.$Message.success(e.msg)
              this.getList()
            }
          })
      })
    },
    getList () {
      this.oas.get('inquiry/nodealreason/list')
        .then(e => {
          if (e.state === 200) {
            this.lists = e.data
          } else {
            this.$Message.success(e.msg)
          }
        })
    },
    del (v, index) {
      this.hrConfirm('提示', '确定删除吗？', () => {
        this.lists.splice(index, 1)
        this.oas.jsonPost('inquiry/nodealreason/add', JSON.stringify({ key: 'NO_DEAL_REASON', value: this.lists }))
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
}
</script>

<style scoped>
.add {
  font-size: 16px;
  font-weight: bold;
  padding: 20px;
}
.txt {
  margin-bottom: 5px;
}
.error {
  color: red;
  font-size: 12px;
}
</style>
