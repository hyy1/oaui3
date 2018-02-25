<template>
    <!--<Table :columns="columns1" :data="data" class="teble2"></Table>-->
    <div>
    <table class="teble2" v-if="data.length > 0">
        <tr v-for="(item,index) in data" :key="index">
            <td>-</td>
            <td class="wn">{{item.work_name}}</td>
            <td>{{item.score}}</td>
            <td>{{item.sort}}</td>
            <td>
                <Button type="primary" size="small" @click="editFn(item.id)">修改</Button>
                <Button type="error" size="small" @click="delFn(item)">删除</Button>
            </td>
        </tr>
    </table>
    <p v-else style="text-align:center">暂无二级分类数据</p>
    </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: []
    },
    editFn: {
      type: Function,
      default: function () { }
    },
    delFn: {
      type: Function,
      default: function () { }
    }
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style>
.teble2 td {
  background: #f8f8f9;
}
</style>

<style scoped>
.teble2 {
  width: 100%;
}
.teble2 tr td {
  border: 0;
  text-align: center;
}
.wn {
  width: 150px;
}
</style>
