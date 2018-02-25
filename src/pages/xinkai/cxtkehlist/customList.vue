<style scoped>
.userlist {
  min-height: 300px;
}

.userlist .title {
  border: 1px solid #ddd;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  font-size: 16px;
}

.userlist .title > span {
  color: #ed3f14;
  padding-left: 5px;
  font-weight: bold;
}

.userlist .title > a {
  float: right;
  color: #495060;
  padding-right: 5px;
}

.userlist .search {
  padding: 6px 5px;
  font-size: 14px;
  line-height: 40px;
}

.userlisttable {
  width: 100%;
}

.userlisttable table {
  width: 100%;
  color: #495060;
  font-size: 12px;
  border-collapse: collapse;
}

.userlisttable tr {
  width: 100%;
}

.userlisttable th {
  min-width: 0;
  max-width: 300px;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  border-bottom: 1px solid #e9eaec;
  height: 40px;
  white-space: nowrap;
  background-color: #f8f8f9;
  text-align: center;
}

.userlisttable td {
  min-width: 0;
  box-sizing: border-box;
  vertical-align: middle;
  border-bottom: 1px solid #e9eaec;
  height: 40px;
  background-color: #fff;
  text-align: center;
  padding: 4 18px;
}

.userlisttable a:visited {
  color: #ed3f14;
}
</style>

<template>
	<oaui3-template1>
		<div class="userlist">
			<div class="title">
				首页 >>
				<span>诚信通客户列表</span>
			</div>
			<div class="search">
				选择日期查看数据：
				<DatePicker name="StartTime" :value="searchData.Time" type="date" placeholder="选择日期" format="yyyy-MM-dd" style="width: 150px" @on-change="searchData.Time = $event"></DatePicker>
				<input type="button" value="查询" class="ivu-btn ivu-btn-primary" @click="getLists">
				<input type="button" value="按认证日期排序" class="ivu-btn ivu-btn-primary" @click="sortfun">
			</div>
			<div class="userlisttable">
				<table border="0">
					<tr>
						<th width="80">序号</th>
						<th width="350">公司名</th>
						<th width="120">百度公司信息</th>
						<th width="100">认证日期</th>
						<th width="350">公司所在地</th>
						<th>所处行业</th>
						<th>主营业务</th>
					</tr>
					<tr v-for="(com,index) in data1" :key="index">
						<td v-html="index+1"></td>
						<td>
							<a v-bind:href="'/ui3/getCustom'+com.id" v-html="(com.company)?com.company:'(请点击)'" target="_blank"></a>
						</td>
						<td>
							<a v-bind:href="'https://www.baidu.com/s?wd='+com.company" target="_blank">百度一下</a>
						</td>
						<td v-html="com.gmtIdentification"></td>
						<td v-html="com.address"></td>
						<td v-html="com.industry"></td>
						<td v-html="com.mianbusiness"></td>
					</tr>
				</table>
			</div>
		</div>
	</oaui3-template1>
</template>

<script>
const _searchData = {
  Time: '',
  sort: 0
}
export default {
  data () {
    return {
      searchData: JSON.parse(JSON.stringify(_searchData)),
      data1: []
    }
  },
  mounted () {
    this.$store.commit('setTitle', '诚信通客户列表')
    this.nowtime()
    this.ajax(this.searchData.Time, this.searchData.sort)
  },
  methods: {
    nowtime () {
      var now = new Date().toLocaleDateString()
      var arr = now.split('/')
      if (arr[arr.length - 1] < 10) {
        arr[arr.length - 1] = '0' + arr[arr.length - 1]
      }
      if (arr[arr.length - 2] < 10) {
        arr[arr.length - 2] = '0' + arr[arr.length - 2]
      }
      this.searchData.Time = arr.join('-')
    },
    ajax (time, sort) {
      this.oas.post('alinewcustomer2/get', {
        'gmtGet': time,
        'isSortByGmtIdentification': sort
      }).then((e) => {
        if (e.state === 200) {
          this.data1 = e.data
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    getLists () {
      this.ajax(this.searchData.Time, this.searchData.sort)
    },
    sortfun: function () {
      this.searchData.sort = 1
      this.ajax(this.searchData.Time, this.searchData.sort)
    }
  }
}
</script>

<style scoped>
.userlist {
  min-height: 300px;
}

.userlist .title {
  border: 1px solid #ddd;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  font-size: 16px;
}

.userlist .title > span {
  color: #ed3f14;
  padding-left: 5px;
  font-weight: bold;
}

.userlist .title > a {
  float: right;
  color: #495060;
  padding-right: 5px;
}

.userlist .search {
  padding: 6px 5px;
  font-size: 14px;
  line-height: 40px;
}

.userlisttable {
  width: 100%;
}

.userlisttable table {
  width: 100%;
  color: #495060;
  font-size: 12px;
  border-collapse: collapse;
}

.userlisttable tr {
  width: 100%;
}

.userlisttable th {
  min-width: 0;
  max-width: 300px;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  border-bottom: 1px solid #e9eaec;
  height: 40px;
  white-space: nowrap;
  background-color: #f8f8f9;
  text-align: center;
}

.userlisttable td {
  min-width: 0;
  box-sizing: border-box;
  vertical-align: middle;
  border-bottom: 1px solid #e9eaec;
  height: 40px;
  background-color: #fff;
  text-align: center;
  padding: 4 18px;
}

.userlisttable a:visited {
  color: #ed3f14;
}
</style>