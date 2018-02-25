<template>
  <oaui3-template1>
    <div class="search">

      <Input placeholder="可输入公司名称、阿里账号搜索" v-model="searchData.keyword" @on-keyup.13="getList" style="width: 250px"></Input>

      <personnelFloat :title="'运营人员'" :text="'运营主管'" :idItem="[9]" :rebackData="searchData" :changeData="{name: 'operatorChiefName', id: 'operatorChiefId'}"></personnelFloat>
      <personnelFloat :title="'运营人员'" :text="'运营'" :idItem="[3]" :rebackData="searchData" :changeData="{name: 'operatorName', id: 'operatorId'}"></personnelFloat>

      <Cascader :data="areaDepartmentFormatYY" v-model="searchData.checkClass" placeholder="运营部门" class="width150 cas"></Cascader>
      <!-- <Select placeholder="运营部门" v-model="searchData.operatorDepartmentId" clearable class="width150">
        <Option v-for="item in yyClass2List" :value="item.id" :key="item.id">{{item.classname}}</Option>
      </Select> -->

      <personnelFloat :title="'美工人员'" :text="'美工'" :idItem="[4]" :rebackData="searchData" :changeData="{name: 'designerName', id: 'designerId'}"></personnelFloat>
      <Select placeholder="美工部门" v-model="searchData.designerDepartmentId" clearable class="width150">
        <Option v-for="item in class2List" :value="item.id" :key="item.id">{{item.classname}}</Option>
      </Select>

      <Select placeholder="查询状态" v-model="searchData.result" clearable class="search-status width200">
        <Option v-for="item in typeList" :key="item" :value="item">{{item}}</Option>
      </Select>

      查询时间：
      <DatePicker type="date" placeholder="年/月/日" :value="searchData.sdate" @on-change="searchData.sdate = $event" class="width150"></DatePicker>
      -
      <DatePicker type="date" placeholder="年/月/日" :value="searchData.edate" @on-change="searchData.edate = $event" class="width150"></DatePicker>

      <Button type="primary" @click="getList">搜索</Button>
      <Button @click="clear">清除选中</Button>
      <a target="_blank" 
      :href="'/oas/alipass/aliUserRecording/getPageList?export=1&keyword='+ searchData.keyword 
      + '&operatorChiefId='+ searchData.operatorChiefId +'&operatorId=' + searchData.operatorId + '&operatorDepartmentId=' + searchData.operatorDepartmentId 
      + '&designerId=' + searchData.designerId + '&designerDepartmentId=' + searchData.designerDepartmentId + '&result=' + searchData.result
      + '&sdate=' + searchData.sdate + '&edate=' + searchData.edate"
      class="exprot-btn">导出报表</a>
    </div>

    <Button v-if="del_qx" type="error" @click="del" size="small" style="margin:0 0 10px 10px">批量删除选中</Button>
    <Table :columns="columns" :data="lists" @on-selection-change="chkChange"></Table>
    <div class="page">
      <Page show-total :total="total" :current.sync="searchData.pageIndex" :page-size.sync="searchData.pageSize" @on-change="getList"></Page>
    </div>
  </oaui3-template1>
</template>

<script>
import personnelFloat from '@/components/public/personnelFloat'
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      chkid: [],
      searchData: {
        keyword: this.$route.query.keyword || '',
        // 运营主管id
        operatorChiefId: this.$route.query.operatorChiefId || 0,
        // 运营主管名称
        operatorChiefName: this.$route.query.operatorChiefName || '',
        // 运营id
        operatorId: this.$route.query.operatorId || 0,
        // 运营名称
        operatorName: this.$route.query.operatorName || '',
        checkClass: [parseInt(this.$route.query.operatorAreaId) || 0, parseInt(this.$route.query.operatorDepartmentId) || 0],
        // 运营区域
        operatorAreaId: parseInt(this.$route.query.operatorAreaId) || 0,
        // 运营部门
        operatorDepartmentId: parseInt(this.$route.query.operatorDepartmentId) || 0,
        // 美工人员id
        designerId: this.$route.query.designerId || 0,
        // 美工人员
        designerName: this.$route.query.designerName || '',
        // 美工部门id
        designerDepartmentId: parseInt(this.$route.query.designerDepartmentId) || 0,
        result: this.$route.query.result || '',
        sdate: this.$route.query.sdate || '',
        edate: this.$route.query.edate || '',
        pageSize: 30,
        pageIndex: parseInt(this.$route.query.pageIndex) || 1
      },
      total: 0,
      del_qx: false,
      lists: [],
      // yyClass2List: [],
      typeList: [],
      columns: [
        {
          type: 'selection',
          width: 120
        },
        {
          title: '公司名称',
          key: 'companyName'
        },
        {
          title: '阿里账号',
          key: 'username'
        },
        {
          title: '运营主管',
          key: 'operatorChief'
        },
        {
          title: '运营',
          key: 'operator'
        },
        {
          title: '美工',
          key: 'designer'
        },
        {
          title: '查询时间',
          key: 'lastQueryText'
        },
        {
          title: '备注',
          key: 'result'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      // 部门数据
      class2List: state => state.Public.class2List,
      areaDepartmentFormatYY: state => state.Public.areaDepartmentFormatYY
    })
  },
  watch: {
    'searchData.checkClass': function (val) {
      this.searchData.operatorAreaId = val[0]
      this.searchData.operatorDepartmentId = val[1]
    }
  },
  created () {
    // 权限判断
    this.basejs.judgeQX('软件密码查询结果_查看', 'page')
    this.basejs.judgeQX('软件密码查询结果_删除').then((e) => {
      if (e.state === 200) {
        this.del_qx = e.data
      }
    })
  },
  mounted () {
    this.$store.commit('setTitle', '软件密码查询结果')
    // 获取美工二级部门
    this.getClass2(4)
    // 运营二级部门
    // this.basejs.getClass2(3).then((e)=>{
    //   if (e.state == 200) {
    //     this.yyClass2List = e.data
    //   }
    // })
    this.getList()
    this.getType()
    // 获取运营区域部门级联数据
    this.getAreaDepartmentFormatYY()
  },
  methods: {
    // 导入工作分类数据源加载方法
    ...mapActions(['getAreaDepartmentFormatYY', 'getClass2']),

    getType () {
      this.oas.get('alipass/aliUserRecording/getResultOptions').then((e) => {
        if (e.state === 200) {
          this.typeList = e.data
        }
      })
    },
    getList () {
      this.$router.push({
        name: 'pwdQuery',
        query: {
          keyword: this.searchData.keyword,
          operatorChiefId: this.searchData.operatorChiefId,
          operatorChiefName: this.searchData.operatorChiefName,
          operatorId: this.searchData.operatorId,
          operatorName: this.searchData.operatorName,
          checkClass: this.searchData.checkClass,
          operatorAreaId: this.searchData.operatorAreaId,
          operatorDepartmentId: this.searchData.operatorDepartmentId,
          designerId: this.searchData.designerId,
          designerName: this.searchData.designerName,
          designerDepartmentId: this.searchData.designerDepartmentId,
          result: this.searchData.result,
          sdate: this.searchData.sdate,
          edate: this.searchData.edate,
          pageIndex: this.searchData.pageIndex
        }
      })
      this.oas.get('alipass/aliUserRecording/getPageList', this.searchData).then((e) => {
        if (e.state === 200) {
          this.lists = e.data.list
          this.total = e.data.total
        }
      })
    },
    chkChange (selection) {
      this.chkid = []
      selection.map((item) => {
        this.chkid.push(item.id)
      })
      this.chkid = this.chkid.join(',')
    },
    del () {
      this.oas.get('alipass/aliUserRecording/delete', { ids: this.chkid }).then((e) => {
        if (e.state === 200) {
          this.$Message.success('删除成功！')
          this.getList()
        } else {
          this.$Message.error('删除失败！')
        }
      })
    },
    clear () {
      this.searchData.keyword = ''
      this.searchData.operatorChiefId = ''
      this.searchData.operatorChiefName = ''
      this.searchData.operatorId = 0
      this.searchData.operatorName = ''
      this.searchData.operatorDepartmentId = ''
      this.searchData.designerId = 0
      this.searchData.designerName = ''
      this.searchData.designerDepartmentId = ''
      this.searchData.result = ''
      this.searchData.sdate = ''
      this.searchData.edate = ''
      this.searchData.pageSize = 30
      this.searchData.pageIndex = 1
      this.getList()
    }
  },
  components: { personnelFloat }
}
</script>

<style scoped>
.search {
  padding: 10px;
  line-height: 45px;
}

.width150 {
  width: 150px;
}
.width200 {
  width: 200px;
}
.search-status {
  margin-right: 10px;
}
.cas {
  margin: 0 auto;
  display: inline-block;
}
.exprot-btn {
  display: block;
  background: #2d8cf0;
  color: #fff;
  width: 80px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  border-radius: 5px;
}
</style>
