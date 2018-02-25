<template>
    <div>
        <Button @click="showFloat">选择合同</Button>
        <Modal 
            v-model="isShow"
            :mask-closable="false"
            width="850"
            class-name="vertical-center-modal"
            title="合同列表">
            <Input v-model="keyword" placeholder="请输入公司名称搜索" class="marginBottom15" style="width: 300px;"></Input>
            <Button type="primary" @click="getList" class="marginBottom15">搜索</Button>
            <Button type="warning" @click="clearTask" class="marginBottom15">清除选中</Button>
            
            <Table :columns="columns1" :data="lists" border @on-row-click="changeTask"></Table>
            <Page show-total :total="total" :current.sync="pageIndex" :page-size.sync="pageSize" @on-change="getList" class="page"></Page>

            <div slot="footer">
                <Button type="primary" size="large" @click="isShow = false">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
  props: {
    rebackData: {
      type: Object,
      default: {
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
  data () {
    return {
      isShow: false,
      keyword: '',
      lists: [],
      columns1: [
        {
          type: 'index',
          width: 80,
          title: '序号',
          align: 'center'
        },
        {
          title: '公司名称',
          key: 'customname',
          align: 'center'
        },
        {
          title: '合同类型',
          key: 'contract_type',
          width: 100,
          align: 'center'
        },
        {
          title: '业务员',
          key: 'yuy',
          width: 100,
          align: 'center'
        },
        {
          title: '金额',
          key: 'money',
          width: 100,
          align: 'center'
        },
        {
          title: '合同签订',
          key: 'htdate',
          width: 100,
          align: 'center'
        },
        {
          title: '合同日期',
          key: 'time',
          width: 200,
          align: 'center'
        }
      ],
      pageIndex: 1,
      pageSize: 5,
      total: 0
    }
  },
  methods: {
    getList () {
      this.cws.get('historyreport/historyreport/getmoneyfloat', {
        keyword: this.keyword,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then((e) => {
        if (e.state === 200) {
          this.lists = e.data.list
          e.data.list.map((item, index) => {
            this.lists[index].time = item.startime + '-' + item.endtime
          })
          this.total = e.data.total
        }
      })
    },
    showFloat () {
      this.isShow = true
      this.keyword = ''
      this.pageIndex = 1
      this.getList()
    },
    changeTask (row) {
      this.rebackData.moneyid = row.moneyid
      this.rebackData.customname = row.customname
      this.rebackData.contract_type = row.contract_type
      this.rebackData.yuy = row.yuy
      this.rebackData.money = row.money
      this.rebackData.htdate = row.htdate
      this.rebackData.startime = row.startime
      this.rebackData.endtime = row.endtime
      this.rebackData.xinkai_name = row.xinkai_name
      this.isShow = false
    },
    clearTask () {
      this.rebackData.moneyid = 0
      this.rebackData.customname = ''
      this.rebackData.contract_type = ''
      this.rebackData.yuy = ''
      this.rebackData.money = 0
      this.rebackData.htdate = ''
      this.rebackData.startime = ''
      this.rebackData.endtime = ''
      this.rebackData.xinkai_name = ''
      this.isShow = false
    }
  }
}
</script>
<style scoped>
.page {
  text-align: right;
  margin-top: 10px;
}
.marginBottom15 {
  margin-bottom: 15px;
}
</style>
