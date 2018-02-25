<template>
  <div class="inquiryDataAnalysis">
    <p class="title">询盘地区 统计</p>
    <div class="box justify-center align-center">
      <Table border :columns="columns1" :data="regionList" :no-data-text="''" class="table"></Table>
      <div id="myChart1" :style="{width: '800px', height: '300px'}"></div>  
    </div>
    <p class="title">高频询盘产品排行</p>
    <div class="box justify-center align-center">
      <Table border :columns="columns2" :data="inquiryList" :no-data-text="''" class="table"></Table>
      <div id="myChart3" :style="{width: '800px', height: '300px'}"></div>  
    </div>
    <p class="title">未成交高频询盘产品排行</p>
    <div class="box justify-center align-center">
      <Table border :columns="columns2" :data="noDealList" :no-data-text="''" class="table"></Table>
      <div id="myChart4" :style="{width: '800px', height: '300px'}"></div>  
    </div>
    <p class="title">已成交高频询盘产品排行</p>
    <div class="box justify-center align-center">
      <Table border :columns="columns2" :data="dealList" :no-data-text="''" class="table"></Table>
      <div id="myChart5" :style="{width: '800px', height: '300px'}"></div>  
    </div>
  </div>  
</template>

<script>
let echarts = require('echarts/lib/echarts')
// 按需加载
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
  data () {
    return {
      columns1: [
        {
          title: '询盘地区',
          key: ''
        },
        {
          title: '询盘数量',
          key: ''
        },
        {
          title: '询盘总金额',
          key: ''
        },
        {
          title: '实际成交金额',
          key: ''
        },
        {
          title: '成交占比',
          key: ''
        }
      ],
      columns2: [
        {
          title: '产品名称',
          key: ''
        },
        {
          title: '询盘数量',
          key: ''
        },
        {
          title: '公司报价',
          key: ''
        },
        {
          title: '同行报价',
          key: ''
        }
      ],
      regionList: [],
      inquiryList: [],
      noDealList: [],
      dealList: []
    }
  },
  mounted () {
    this.myChart1()
  },
  methods: {
    myChart1 () {
      // 初始化echarts实例
      let myChart = echarts.init(document.getElementById('myChart1'))
      // 绘制图表
      myChart.setOption({
        // title: {
        //   text: '某站点用户访问来源',
        //   subtext: '纯属虚构',
        //   x: 'center'
        // },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          y: 'center',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        calculable: true,
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ]
          }
        ]
      })
    },
    getList () {

    }
  }
}
</script>
<style scoped>
.inquiryDataAnalysis {
  padding: 10px;
}
.title {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  line-height: 40px;
}
.table {
  width: 950px;
}
</style>

