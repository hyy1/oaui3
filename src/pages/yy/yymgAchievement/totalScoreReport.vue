<template>
    <oaui3-template1>
        <div class="search">
            <personnelFloat :title="'美工人员列表'" :text="'美工'" :idItem="[4]" :rebackData="searchData" :changeData="{name: 'mg_name', id: 'mg_id'}"></personnelFloat>
            <Select placeholder="请选择部门" v-model="searchData.class2_id" clearable style="width:150px">
                <Option v-for="item in class2List" :value="item.id" :key="item.id">{{item.classname}}</Option>
            </Select>

            <DatePicker type="month" placeholder="选择月份" transfer :value="searchData.month_start" @on-change="searchData.month_start = $event" style="width: 150px"></DatePicker>
            -
            <DatePicker type="month" placeholder="选择月份" transfer :value="searchData.month_end" @on-change="searchData.month_end = $event" style="width: 150px"></DatePicker>
            
            <Button type="primary" @click="getList">搜索</Button>
        </div>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>姓名</th>
                    <th>部门</th>
                    <th>入职时间</th>
                    <th>等级</th>
                    <th v-for="(item,index) in monthList" :key="index">{{item.ym_str}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in lists" :key="index">
                    <td>{{item.add_user}}</td>
                    <td>{{item.add_class1_name}} — {{item.add_class2_name}}</td>
                    <td>{{item.join_date}}</td>
                    <td>{{item.grade}}</td>
                    <td v-for="(item2, index2) in item.score_list" :key="index2">
                        <a target="_blank" 
                        :href="yymgUrl(item,item2)">
                        {{item2.score}}</a>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="page">
            <Page show-total :total="total" :current.sync="searchData.pageIndex" :page-size.sync="searchData.pageSize" @on-change="getList"></Page>
        </div>
    </oaui3-template1>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import personnelFloat from '@/components/public/personnelFloat'

export default {
  data () {
    return {
      searchData: {
        mg_id: parseInt(this.$route.query.mg_id) || 0,
        mg_name: this.$route.query.mg_name || '',
        class2_id: parseInt(this.$route.query.class2_id) || 0,
        month_end: this.$route.query.month_end || this.moment().add(1, 'month').format('YYYY-MM'),
        month_start: this.$route.query.month_start || this.moment().add(1, 'month').format('YYYY-MM'),
        pageSize: 30,
        pageIndex: parseInt(this.$route.query.pageIndex) || 1
      },
      lists: [],
      monthList: [],
      total: 0
    }
  },
  computed: {
    ...mapState({
      // 部门数据
      class2List: state => state.Public.class2List
    })
  },
  created () {
    this.basejs.judgeQX('运营美工总分报表_查看', 'page')
  },
  mounted () {
    // 设置标题
    this.$store.commit('setTitle', '运营美工总分报表')
    // 获取列表
    this.getList()
    // 获取美工二级部门
    this.getClass2(4)
  },
  methods: {
    ...mapActions(['getClass2']),
    // 跳转到运营美工页面
    yymgUrl (item, item2) {
      let sdate = item2.source_ym + '-01'
      let edate = this.moment(item2.source_ym).endOf('month').format('YYYY-MM-DD')
      return '/ui3/yymg?sdate=' + sdate + '&edate=' + edate + '&add_user_id=' + item.add_user_id + '&add_user_name=' + item.add_user + '&add_class2_id=' + item.add_class2_id + '&audit_schedule=2'
    },
    getList () {
      this.$router.push({
        name: 'yymgTotalScoreReport',
        query: this.searchData
      })
      this.oas.get('yymg/getScoreReport', this.searchData).then((e) => {
        if (e.state === 200) {
          this.lists = e.data.list
          this.monthList = e.data.list[0] ? e.data.list[0].score_list : []
          this.total = e.data.total
        } else {
          this.$Message.error(e.msg)
        }
      })
    }
  },
  components: { personnelFloat }
}
</script>
 <style scoped>
.search {
  padding: 10px 20px;
}
</style>
 