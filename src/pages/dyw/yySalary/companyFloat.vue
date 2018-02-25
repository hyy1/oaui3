<template>
    <div>
        <!--<Button v-if="rebackData.task_name" @click="showTask">{{rebackData.task_name}}</Button>-->
        <Button @click="showTask">{{company}}</Button>
        <Modal 
            v-model="isShow"
            :mask-closable="false"
            @on-cancel="cancel"
            width="850"
            title="提单列表">
            
            <Input v-model="keyword" placeholder="请输入公司名称搜索" class="keyword"/>
            <DatePicker type="month" :value="YearMonth" @on-change="YearMonth = $event" @on-clear="YearMonth = ''" placeholder="搜索年月" id="wid"></DatePicker>
            <Button type="primary" @click="getList">搜索</Button>
            <Button type="warning" @click="clearData">清除选中</Button>
            <Table height="400" :columns="columns1" :data="lists.list" border @on-row-click="changeTask" class="marginTop15"></Table>
            <Page  :total="lists.total" :current.sync="pageIndex" :page-size="20" @on-change="getList" size="small" show-total class="page"></Page>
            <div slot="footer">
                <Button type="primary" size="large" @click="cancel">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
// 公用提单列表浮动层

export default {
  props: {
    // 返回数据，暂未设置
  },
  data () {
    return {
      isShow: false,
      company: '请设置公司名称',
      keyword: '',
      YearMonth: '',
      lists: [],
      pageIndex: 1,
      columns1: [
        {
          title: '公司名称',
          key: 'customname',
          width: 200,
          align: 'center'
        },
        {
          title: '年月',
          key: 'yearmonth',
          align: 'center'
        },
        {
          title: '深度运营',
          key: 'uidName',
          align: 'center'
        },
        {
          title: '阿里账号',
          key: 'zh',
          width: 100,
          align: 'center'
        },
        {
          title: '续开',
          key: 'xukainame',
          width: 100,
          align: 'center'
        },
        {
          title: '业绩',
          key: 'yj',
          width: 100,
          align: 'center'
        },
        {
          title: '提成点',
          key: 'td',
          width: 100,
          align: 'center'
        }
      ]
    }
  },
  methods: {
    getList () {
      this.cws.get('achievement/dyw/contract', {
        key: this.keyword,
        YearMonth: this.YearMonth,
        pageIndex: this.pageIndex,
        pageSize: 20
      }).then((e) => {
        if (e.state === 200) {
          this.lists = e.data
        }
      })
    },
    // 开关，浮动层的隐藏显示
    showTask () {
      this.getList()
      this.isShow = true
    },
    // 开关，关闭页面和还原默认值
    cancel () {
      this.keyword = ''
      this.keyword = this.YearMonth
      this.isShow = false
    },
    // 点击设置公司名，并返回公司信息
    changeTask (row) {
      this.company = row.customname
      this.$emit('changeData', row)
      this.cancel()
    },
    // 清除选中
    clearData () {
      this.company = '请选择公司名'
      this.$emit('changeData', {})
      this.cancel()
    }
  }
}
</script>

<style scoped>
.keyword {
  width: 300px;
  line-height: 1.5;
  padding: 6px 15px;
}
#wid {
  padding-right: 15px;
  line-height: 1.5;
}
.marginTop15 {
  margin-top: 15px;
}
.page {
  margin-top: 10px;
  text-align: center;
}
</style>
