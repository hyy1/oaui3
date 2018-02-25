<template>
    <div>
        <Button v-if="rebackData.task_name" @click="showTask">{{rebackData.task_name}}</Button>
        <Button v-else @click="showTask">请选择提单名称</Button>
        <Modal 
            v-model="isShow"
            :mask-closable="false"
            @on-cancel="cancel"
            width="850"
            title="提单列表">
            <input v-model="keyword" @keyup.enter="getList" placeholder="请输入公司名称搜索" class="keyword"/>
            <Button type="primary" @click="getList" :loading="loading">搜索</Button>
            <Button type="warning" @click="clearData">清除选中</Button>
            <Table height="400" :columns="columns1" :data="lists" border @on-row-click="changeTask" class="marginTop15"></Table>

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
    // 返回数据
    rebackData: {
      type: Object,
      default: {
        isShowTask: false,
        ali_account: '',
        task_name: '',
        company_id: 0,
        task_id: 0,
        task_source: '',
        task_source_id: 0,
        mg_id: 0,
        mg_name: '',
        xinkai_id: 0,
        xinkai_name: '',
        xukai_id: 0,
        xukai_name: '',
        yy_id: 0,
        yy_name: ''
      }
    },
    changeData: Array
  },
  data () {
    return {
      isShow: false,
      keyword: '',
      lists: [],
      loading: false,
      columns1: [
        {
          title: '公司名称',
          key: 'task_name',
          width: 200,
          className: 'custom',
          align: 'center'
        },
        {
          title: '提单类型',
          key: 'task_source',
          align: 'center'
        },
        {
          title: '阿里账号',
          key: 'ali_account',
          width: 100,
          align: 'center'
        },
        {
          title: '新开',
          key: 'xinkai_name',
          width: 100,
          align: 'center'
        },
        {
          title: '续开',
          key: 'xukai_name',
          width: 100,
          align: 'center'
        },
        {
          title: '运营',
          key: 'yy_name',
          width: 100,
          align: 'center'
        },
        {
          title: '美工',
          key: 'mg_name',
          width: 100,
          align: 'center'
        }
      ]
    }
  },
  computed: {
    yymgTaskFloat: {
      get: function () {
        return this.$store.state.Float.yymgTaskFloat
      },
      set: function (newValue) {
        this.$store.state.Float.yymgTaskFloat = newValue
      }
    }
  },
  methods: {
    getList () {
      this.loading = true
      this.oas.get('yymg/taskSourceList', {
        key: this.keyword
      }).then((e) => {
        if (e.state === 200) {
          this.lists = e.data
          this.loading = false
        }
      })
    },
    showTask () {
      this.getList()
      this.isShow = true
    },
    changeTask (row) {
      for (var v of this.changeData) {
        this.rebackData[v] = row[v]
      }
      this.cancel()
    },
    clearData () {
      for (var v of this.changeData) {
        this.rebackData[v] = null
      }
      this.cancel()
    },
    cancel () {
      this.keyword = ''
      this.isShow = false
    }
  }
}
</script>

<style scoped>
.keyword {
  width: 300px;
  height: 34px;
  border-radius: 5px;
  border: 1px solid #e5e5e5;
  padding: 5px;
}
.marginTop15 {
  margin-top: 15px;
}
</style>
