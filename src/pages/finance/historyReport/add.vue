<template>
    <div>
        <contract-float :rebackData="contractData" style="margin-bottom:10px"></contract-float>
        <Alert type="success" show-icon v-if="contractData.moneyid" style="width:250px;">{{contractData.customname}}</Alert>
        <Button type="primary" @click="add">添加</Button>
    </div>
</template>

<script>
import contractFloat from '@/components/historyReport/contractFloat'

export default {
  props: ['catalogId', 'getList'],
  components: { contractFloat },
  data () {
    return {
      contractData: {
        moneyid: 0,
        customname: '',
        contract_type: '',
        yuy: '',
        money: 0,
        htdate: '',
        startime: '',
        endtime: ''
      }
    }
  },
  methods: {
    add () {
      if (!this.catalogId) { this.$Message.error('请查看您要添加到的报表'); return }
      this.cws.post('historyreport/historyreport/add',
        {
          dirid: this.catalogId,
          moneyId: this.contractData.moneyid
        })
        .then((e) => {
          if (e.state === 200) {
            this.$Message.success('添加成功！')
            this.getList()
          } else {
            this.$Message.error(e.msg)
          }
        })
    }
  }
}
</script>
