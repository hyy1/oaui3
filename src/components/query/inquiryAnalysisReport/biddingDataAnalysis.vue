<template>
  <div class="biddingDataAnalysis">
    <Row>
        <i-col span="3" class="col">抢标次数：<span class="num">4次</span></i-col>
        <i-col span="4" class="col">关键词：<span class="num">PPR水管、塑料管、PE</span></i-col>
    </Row>
    <div class="box space-between">
      <span>
        <p class="col">关键词详情：</p>
        <Table border :columns="columns1" :data="lists1" :no-data-text="''" class="table"></Table>
      </span>
      <span>
        <p class="col">标王月度分析</p>
        <Table border :columns="columns2" :data="lists2" :no-data-text="''" class="table"></Table>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      columns1: [
        {
          title: '抢标月份',
          key: ''
        },
        {
          title: '抢标金额（元）',
          key: ''
        },
        {
          title: '抢标公司',
          key: ''
        },
        {
          title: '产生交易额（元）',
          key: ''
        }
      ],
      lists1: [],
      columns2: [
        {
          title: '抢标月份',
          key: ''
        },
        {
          title: '抢标词',
          key: ''
        },
        {
          title: '共计投入金额（元）',
          key: ''
        },
        {
          title: '共计产出金额（元）',
          key: ''
        }
      ],
      lists2: []
    }
  }
}
</script>
<style scoped>
.biddingDataAnalysis {
  padding: 10px;
  font-size: 14px;
}
.table {
  width: 850px;
}
</style>
