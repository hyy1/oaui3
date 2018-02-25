<template>
    <Modal 
        v-model="yymgCheckFloat"
        :mask-closable="false"
        :title="auditTaskData.title+'审核'">
        
        <Form :model="formItem" :rules="ruleValidate" ref="form1" :label-width="100">
            <FormItem label="审核状态：">
                <RadioGroup v-model="formItem.audit_schedule">
                    <Radio v-for="item in items" :label="item.key" :key="item.key">{{item.text}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="不通过理由:" v-if="rejected" prop="rejected_reason">
                <Input v-model="formItem.rejected_reason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="primary" size="large" @click="subChecked">确定</Button>
            <Button type="primary" size="large" @click="cancel">取消</Button>
        </div>
    </Modal>
</template>

<script>
const item1 = [
  {
    key: 0,
    text: '未审核'
  },
  {
    key: 1,
    text: '通过'
  },
  {
    key: -1,
    text: '驳回'
  }
]
const item2 = [
  {
    key: 0,
    text: '未审核'
  },
  {
    key: 2,
    text: '通过'
  },
  {
    key: -2,
    text: '驳回'
  }
]
export default {
  props: {
    auditTaskData: {
      type: Object,
      default: {
        title: '',
        id: 0,
        type: 0
      }
    },
    getList: {
      type: Function,
      default: function () { }
    },
    cancel: {
      type: Function,
      default: function () {
      }
    }
  },
  data () {
    return {
      isShow: true,
      formItem: {
        audit_schedule: 0,
        rejected_reason: ''
      },
      rejected: false,
      ruleValidate: {
        rejected_reason: [
          { required: true, message: '不通过理由不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'formItem.audit_schedule': 'rejected_isshow'
  },
  computed: {
    items: {
      get: function () {
        return this.auditTaskData.type === 1 ? item1 : item2
      }
    },
    yymgCheckFloat: {
      get: function () {
        return this.$store.state.Float.yymgCheckFloat
      },
      set: function (newValue) {
        this.$store.state.Float.yymgCheckFloat = newValue
      }
    }
  },
  methods: {
    subChecked () {
      if (this.formItem.audit_schedule < 0) {
        this.$refs['form1'].validate((valid) => {
          if (!valid) {
            return
          }
          this.sub()
        })
        return
      }
      this.sub()
    },
    sub () {
      this.oas.post('yymg/auditTask', {
        audit_schedule: this.formItem.audit_schedule,
        rejected_reason: this.formItem.rejected_reason,
        task_ids: this.auditTaskData.id
      }).then((e) => {
        if (e.state === 200) {
          this.$Message.success('审核成功！')
          this.getList()
          this.cancel()
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    rejected_isshow (val) {
      if (val < 0) {
        this.rejected = true
      } else {
        this.rejected = false
      }
    }
  }
}
</script>
