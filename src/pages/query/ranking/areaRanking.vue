<template>
  <oaui3-template1>
    <Alert class="pad">
      <p class="time">
        <span class="time-title">统计周期：</span>
        <RadioGroup v-model="searchData.time">
          <Radio label="1">近90天</Radio>
          <Radio label="2">近30天</Radio>
          <Radio label="3">近7天</Radio>
          <Radio label="4">自定义日期</Radio>
        </RadioGroup>
        
        <span v-if="searchData.time == '4'">
          <DatePicker type="date" placeholder="开始时间" :value="searchData.sdate" @on-change="searchData.sdate = $event" style="width: 150px"></DatePicker>
          -
          <DatePicker type="date" placeholder="结束时间" :value="searchData.edate" @on-change="searchData.edate = $event" style="width: 150px"></DatePicker>
        </span>
      </p>
      <div>
        <Input v-model="searchData.keyword" @keyup.enter="getList" placeholder="请输入买家旺旺" class="wid"></Input>
        <Cascader :data="provincialLeagueData" v-model="checkClass" placeholder="所有地区" filterable class="cas"></Cascader>

        <Button type="primary" @click="getList">查询</Button>
        <Button type="success" @click="exportList"><Icon type="archive"></Icon>&nbsp; 导出</Button>
      </div>
    </Alert>
    <p style="padding:10px 15px;color:#f90;">可根据成交金额、跟踪金额、流失金额、询盘时间、采购次数、询盘次数、无效询盘次数进行排序</p>
    <table class="table table-bordered">
      <thead>
        <tr>
          <td>序号</td>
          <td>买家旺旺</td>
          <!-- <td>买家电话</td> -->
          <td>地区</td>
          <td class="click" @click="order(1)">询盘总金额<span v-if="searchData.sortStr === 1">{{arrow}}</span></td>
          <td class="click" @click="order(2)">成交金额<span v-if="searchData.sortStr === 2">{{arrow}}</span></td>
          <td class="click" @click="order(3)">跟踪金额 <span v-if="searchData.sortStr === 3">{{arrow}}</span></td>
          <td class="click" @click="order(4)">流失金额 <span v-if="searchData.sortStr === 4">{{arrow}}</span></td>
          <td class="click" @click="order(5)">询盘时间 <span v-if="searchData.sortStr === 5">{{arrow}}</span></td>
          <td class="click" @click="order(6)">采购次数 <span v-if="searchData.sortStr === 6">{{arrow}}</span></td>
          <td class="click" @click="order(7)">询盘次数 <span v-if="searchData.sortStr === 7">{{arrow}}</span></td>
          <!-- <td class="click" @click="order(8)">无效询盘次数 <span v-if="searchData.sortStr === 8">{{arrow}}</span></td> -->
          <td>操作</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in lists" :key="index">
          <td>{{index + 1}}</td>
          <td>{{item.alitm}}</td>
          <!-- <td>{{item.phone}}</td> -->
          <td>{{item.provinceName}} - {{item.cityName}}</td>
          <td>{{item.amount}}</td>
          <td>{{item.gmvAmount}}</td>
          <td>{{item.followAmount}}</td>
          <td>{{item.lossAmount}}</td>
          <td>{{moment(item.gmtCreate).format('YYYY-MM-DD')}}</td>
          <td>{{item.count}}</td>
          <td>{{item.countEnquiry}}</td>
          <!-- <td>{{item.countInvalid}}</td> -->
          <td>
            <Button type="info" size="small" @click="info(item)">详情</Button>
          </td>
        </tr>
      </tbody>
    </table>
    <Page show-total :total="searchData.total" :current.sync="searchData.pageIndex" :page-size.sync="searchData.pageSize" @on-change="getList" class="page"></Page>
  </oaui3-template1>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  components: {},
  data () {
    return {
      searchData: {
        aliAccountId: this.$route.query.aliAccountId || 0,
        customID: this.$route.query.customID || 0,
        customname: this.$route.query.customname || '',
        wwname: this.$route.query.wwname || '',
        sdate: this.$route.query.sdate || '',
        edate: this.$route.query.edate || '',
        keyword: this.$route.query.keyword || '',
        time: this.$route.query.time || '',
        cityId: this.$route.query.cityId || '',
        provinceId: this.$route.query.provinceId || '',
        sortStr: parseInt(this.$route.query.sortStr) || 5,
        sort: parseInt(this.$route.query.sort) || 1,
        pageIndex: parseInt(this.$route.query.pageIndex) || 1,
        pageSize: 20,
        total: 0,
        export: 0
      },
      arrow: '↓',
      checkClass: this.$route.query.cityId ? [parseInt(this.$route.query.provinceId), parseInt(this.$route.query.cityId)] : [],
      lists: []
    }
  },
  computed: {
    ...mapState({
      provincialLeagueData: state => state.Public.provincialLeagueData
    })
  },
  created () {
    this.$store.commit('setTitle', '地区询盘排名')
  },
  mounted () {
    this.getProvincialLeagueData()
    this.getList()
  },
  methods: {
    ...mapActions(['getProvincialLeagueData']),
    order (name) {
      // 触发函数排序，成功后改变箭头的指向
      this.arrow = this.arrow === '↓' ? '↑' : '↓'
      this.searchData.sortStr = name
      this.searchData.sort = this.searchData.sort === 1 ? 0 : 1
      this.getList()
    },
    info (item) {
      this.$router.push({
        name: 'queryRecordList',
        query: {
          aliAccountId: this.searchData.aliAccountId,
          customID: this.searchData.customID,
          customname: this.searchData.customname,
          wwname: this.searchData.wwname,
          keyword: item.alitm, // 当前买家旺旺
          cityId: item.cityId, // 当前城市id
          provinceId: item.provinceId, // 当前省份id
          gmtCreateS: this.searchData.sdate,
          gmtCreateE: this.searchData.edate
        }
      })
    },
    getList () {
      this.$router.push({
        name: 'areaRanking',
        query: {
          ...this.searchData
        }
      })
      this.oas.get('inquiry/record/listArea',
        {
          ...this.searchData
        }
      ).then((e) => {
        if (e.state === 200) {
          this.lists = (e.data && e.data.list) || []
          this.searchData.total = e.data && e.data.count
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    // 导出
    exportList () {
      this.searchData.export = 1
      window.open('/oas/inquiry/record/listArea?aliAccountId=' + this.searchData.aliAccountId + '&sdate=' + this.searchData.sdate + '&edate=' + this.searchData.edate + '&keyword=' + this.searchData.keyword + '&provinceId=' + this.searchData.provinceId + '&cityId=' + this.searchData.cityId + '&sortStr=' + this.searchData.sortStr + '&sort=' + this.searchData.sort + '&export=' + this.searchData.export)
    }
  },
  watch: {
    'searchData.time': function (val) {
      var currentTime = this.moment().format('YYYY-MM-DD')
      this.searchData.edate = currentTime
      if (val === '1') {
        this.searchData.sdate = this.moment(currentTime).subtract('day', 89).format('YYYY-MM-DD')
      } else if (val === '2') {
        this.searchData.sdate = this.moment(currentTime).subtract('day', 29).format('YYYY-MM-DD')
      } else if (val === '3') {
        this.searchData.sdate = this.moment(currentTime).subtract('day', 6).format('YYYY-MM-DD')
      } else {
        this.searchData.sdate = ''
        this.searchData.edate = ''
      }
    },
    'checkClass': function (val) {
      this.searchData.cityId = val[1] || ''
      this.searchData.provinceId = val[0] || ''
    }
    // 'searchData.sortStr': function (val) {
    //   this.arrow = '↓'
    //   this.searchData.sort = 'desc'
    // }
  }
}
</script>
<style>
.pad {
  padding: 10px 20px 20px 20px;
  margin: 15px;
}
.time {
  height: 60px;
  line-height: 60px;
}
.time-title {
  font-size: 14px;
  font-weight: bold;
}
.wid {
  width: 350px;
}
.click {
  cursor: pointer;
}
.click > span {
  font-size: 16px;
  color: #e46262;
  font-weight: bold;
}
.cas {
  width: 150px;
  margin: 0 auto;
  display: inline-block;
}
</style>
