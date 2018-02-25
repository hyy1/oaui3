<template>
    <div id="app">
        <router-view v-show="!noPermission"></router-view>
        <loading v-show="fetchLoading"></loading>
        <noPermission v-show="noPermission"></noPermission>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import loading from '@/pages/loading'
import noPermission from '@/pages/noPermission'
export default {
  name: 'app',
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      fetchLoading: state => state.Public.fetchLoading,
      noPermission: state => state.Public.noPermission
    })
  },
  components: { loading, noPermission }
}
</script>
<style>
body {
  background: #e0e0e0;
}
/*横向排列*/
.box {
  display: flex;
}
/*换行*/
.flex-wrap {
  flex-wrap: wrap;
}
/*横向排列、换行*/
.flex-flow {
  flex-flow: row wrap;
}
/*右对齐*/
.flex-end {
  justify-content: flex-end;
}
/*水平居中*/
.justify-center {
  justify-content: center;
}
/*两端对齐*/
.space-between {
  justify-content: space-between;
}
/*每项两侧的间隔相等*/
.space-around {
  justify-content: space-around;
}
/*垂直居中*/
.align-center {
  align-items: center;
}
/*定义项目的比例*/
.flex-grow1 {
  flex-grow: 1;
}
.flex-grow2 {
  flex-grow: 2;
}

.row-txt {
  text-align: right;
  font-weight: bold;
  min-height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.row-con {
  padding-left: 15px;
  min-height: 50px;
  line-height: 50px;
}
.page {
  text-align: right;
  padding: 10px;
}
.text-center {
  text-align: center;
}
.font16 {
  font-size: 16px;
}
/* table样式 */
.table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid #ddd;
  border-spacing: 0;
  border-collapse: collapse;
}
.table-bordered > thead > tr > th,
.table-bordered > tbody > tr > th,
.table-bordered > tfoot > tr > th,
.table-bordered > thead > tr > td,
.table-bordered > tbody > tr > td,
.table-bordered > tfoot > tr > td {
  border: 1px solid #ddd;
}
.table > thead > tr > th,
.table > tbody > tr > th,
.table > tfoot > tr > th,
.table > thead > tr > td,
.table > tbody > tr > td,
.table > tfoot > tr > td {
  padding: 8px;
  line-height: 1.42857143;
  vertical-align: top;
}
/*加载中icon样式*/
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

