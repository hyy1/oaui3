<template>
    <oaui3-template1>
        <table class="table">
            <tr>
                <td>公司名</td>
                <td><companyFloat @changeData="(row)=> this.backData=row"></companyFloat></td>
            </tr>
            <tr>
                <td>姓名</td>
                <td>{{backData.yunyingname}}</td>
            </tr>
            <tr>
                <td>提成</td>
                <td><InputNumber :min="1" v-model="fromData.money"></InputNumber></td>
            </tr>
            <tr>
                <td>账号</td>
                <td>{{backData.zh}}</td>
            </tr>
            <tr>
                <td>月份</td>
                <td>{{backData.yearmonth}}</td>
            </tr>
            <tr>
                <td>业绩</td>
                <td>{{backData.yj}}</td>
            </tr>
            <tr>
                <td>提成点</td>
                <td>{{backData.td}}</td>
            </tr>
        </table>
        <Button type="primary" class="text_center" @click="add">添加</Button>
        <br><br>
    </oaui3-template1>
</template>

<script>
import companyFloat from '@/pages/dyw/yySalary/companyFloat'

export default {
  components: { companyFloat },
  data () {
    return {
      fromData: {
        peopleName: '',
        peopleId: '',
        money: 1
      },
      // backData:{"customid": '',"yearmonth": '',"yunyingid": '',"yj": '',"uidName": '',"td": '',"zh": '',"customname": '',"yunyingname": '',"uid": '',"xukainame": '',}
      backData: {}
    }
  },
  methods: {
    // 添加记录
    add () {
      // 判断是否为空对象
      if (Object.keys(this.backData).length === 0) {
        this.$Message.error('请选择公司名以获取信息')
        return false
      }
      let obj = {
        id: this.backData.id,
        dirid: this.$route.query.dirid,
        tc: this.fromData.money
      }
      this.cws.post('achievement/dyw/add', obj).then((e) => {
        if (e.state === 200) {
          this.$Message.success('添加成功')
        } else { this.$Message.error(e.msg) }
      })
    }
  },
  created () {
    this.$store.commit('setTitle', this.$route.query.salaryYearmonth + '业绩添加')// 设置页面标题
  }
}
</script>
<style>
.table {
  border-collapse: collapse;
  border: none;
  margin: 0px auto;
}
.hov:hover {
  background: #bcd9e4;
}
.table > tr > td {
  border: solid #ccc 1px;
  padding: 5px 4px;
  height: 45px;
}
.table td:nth-child(odd) {
  padding-right: 80px;
  font-weight: bold;
  width: 450px;
  text-align: right;
}
.table td:nth-child(even) {
  padding-left: 80px;
  text-align: left;
}
.col_info {
  background: #f8f8f9;
  color: #495060;
  font-size: 16px;
  font-weight: bold;
}
.text_center {
  margin: 50px auto 0px auto;
  width: 100px;
  display: block;
}
</style>
