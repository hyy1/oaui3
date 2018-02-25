<template>
    <div>
        <Button v-if="dirRow.issubmit==0 && qx.tijiao_qx" @click="sub" type="success" size="small" title="提交财务审核">提交</Button>
        <ButtonGroup v-if="qx.shenhe_qx && dirRow.issubmit==1 && dirRow.fincheck!=1" @click="isshow=!isshow" size="small">
            <Button  @click="check(1)" type="primary">通过</Button>
            <Button  @click="isshow=!isshow">不通过</Button>
        </ButtonGroup>
        <!--Button v-if="dirRow.issubmit==1 && dirRow.fincheck==0" @click="isshow=!isshow" size="small">审核</Button-->
        <!--@click="check(2)"-->
        <Modal v-model="isshow" title="审核状态" width="500" @on-ok="check(2)">
            <Input v-model="remark" type="textarea" placeholder="请输入不通过原因..."></Input>
        </Modal>
        <Button v-if="qx.shanchu_qx && dirRow.fincheck!=1" @click="del" type="error" size="small">删除</Button>
    </div>
</template>

<script>
export default {
  // 提交后不显示提交,当提交后才可显示审核，当未审核与审核不通过后可显示删除
  props: { dirRow: Object, pageIndex: Number, qx: Object },
  data () {
    return {
      isshow: false,
      remark: ''
    }
  },
  methods: {
    /* 提交审核数据 */
    sub () {
      this.cws.post('achievement/dyw/requestflag', {
        id: this.dirRow.id
      }).then(
        (e) => {
          if (e.state === 200) {
            this.$Message.success('设置成功')
            // 执行父页面的dir方法刷新页面
            this.$emit('dir', this.pageIndex)// 刷新父组件目录列表
          } else {
            this.$Message.error(e.msg)
          }
        })
    },
    /* 审核工资数据 */
    check (val) {
      this.cws.post('achievement/dyw/flag', {
        id: this.dirRow.id,
        fincheck: val,
        remark: this.remark
      }).then(
        (e) => {
          if (e.state === 200) {
            this.$Message.success('审核生效')
            this.remark = ''
            this.$emit('dir', this.pageIndex)// 刷新父组件目录列表
          } else {
            this.$Message.error(e.msg)
          }
        })
    },
    /* 删除数据 */
    del () {
      this.cws.post('achievement/dyw/del', {
        id: this.dirRow.id
      }).then(
        (e) => {
          if (e.state === 200) {
            this.$Message.success('删除生效')
            this.$emit('dir', this.pageIndex)// 刷新父组件目录列表
          } else {
            this.$Message.error(e.msg)
          }
        })
    }
  }
}
</script>
<style scoped>

</style>