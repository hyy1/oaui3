<template>
    <oaui3-template1>
        <div>
            <table class="table">
                <tr>
                    <th>提点：</th>
                    <td>
                        <Input v-model="infoData.tdnum" placeholder="请输入提点数" style="width:120px;"/>
                    </td>
                </tr>
                <tr>
                    <th>提款人：</th>
                    <td>{{infoData.tkr}}</td>
                </tr>
                <tr>
                    <th>交换对象：</th>
                    <td>
                        <personnelFloat :text="'选择人员'" :title="'人员列表'" :idItem="[4]" :rebackData="personel" :changeData="{name: 'pname', id: 'pid'}"></personnelFloat>
                    </td>
                </tr>
                <tr>
                    <th>公司名称：</th>
                    <td>{{infoData.customname}}</td>
                </tr>
                <tr>
                    <th>合同类型：</th>
                    <td>{{infoData.contract_type}}</td>
                </tr>
                <tr>
                    <th>付款金额：</th>
                    <td>{{infoData.money}}</td>
                </tr>
                <tr>
                    <th>续开总负责：</th>
                    <td>{{infoData.xkzfz}}</td>
                </tr>
                <tr>
                    <th>中阿客服：</th>
                    <td>{{infoData.znkf}}</td>
                </tr>
                <tr>
                    <th>发票状态：</th>
                    <td>{{infoData.invoice_state}}</td>
                </tr>
                <tr>
                    <th>付款方式：</th>
                    <td>{{infoData.payment_method}}</td>
                </tr>
                <tr>
                    <th>付款日期：</th>
                    <td>{{infoData.money_addtime}}</td>
                </tr>
                <tr>
                    <th>合同开始日期：</th>
                    <td>{{infoData.contract_start}}</td>
                </tr>
                <tr>
                    <th>合同结束日期：</th>
                    <td>{{infoData.contract_end}}</td>
                </tr>
                <tr>
                    <th>备注：</th>
                    <td>{{infoData.remark}}</td>
                </tr>
                <tr>
                    <td></td>
                    <td colspan="2">
                        <Button type="primary" @click="subEdit">提交</Button>
                    </td>
                </tr>
            </table>
        </div>
    </oaui3-template1>
</template>

<script>
import personnelFloat from '@/components/public/personnelFloat'

export default {
  components: { personnelFloat },
  data () {
    return {
      personel: {
        pname: '',
        pid: ''
      },
      infoData: {},
      jhdx: 0,
      id: this.$route.params.id
    }
  },
  mounted () {
    this.$store.commit('setTitle', '历史报表-修改款项')
    this.getInfo()
  },
  methods: {
    subEdit () {
      this.cws.post('historyreport/historyreport/edit', {
        id: this.id,
        jhdx: this.personel.pid,
        tdnum: this.infoData.tdnum
      }).then((e) => {
        if (e.state === 200) {
          this.$Message.success('修改成功！')
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    getInfo () {
      this.cws.get('historyreport/historyreport/info', { id: this.id }).then((e) => {
        if (e.state === 200) {
          this.infoData = e.data
        } else {
          this.$Message.error(e.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
.table {
  margin: 0px auto;
}
.table tr {
  height: 50px;
}
.table tr th {
  text-align: right;
}
.table tr td:nth-child(2) {
  padding-left: 10px;
}
</style>
