<template>
    <Modal
    v-model="setMainBusinessFloat"
    title="设置主营行业"
    @on-cancel="cancel"
    :mask-closable="false">
        <Input v-model="query" placeholder="请输入行业名称搜索" style="width: 300px"></Input>
        <Button type="primary" size="large" @click="sub">提交</Button>
        <ul class="list">
            <li v-for="(item,index) in lists" :key="index" @click="selectPel(item)">{{item.text}}</li>
        </ul>
        <div slot="footer">
            <Button type="primary" size="large" @click="cancel">关闭</Button>
        </div>
    </Modal>
</template>

<script>
/* global _ */
// 公用人员选择浮动层
export default {
  props: {
    // 回调刷新页面
    getList: {
      type: Function,
      default: function () {
      }
    },
    // 阿里账号
    aliAccountId: {
      type: String,
      default: function () {
        return ''
      }
    }
    // 主营行业name
    // categoryName: {
    //   type: String,
    //   default: function () {
    //     return ''
    //   }
    // },
    // 主营行业id
    // categoryId: {
    //   type: Number,
    //   default: function () {
    //     return 0
    //   }
    // }
  },
  data () {
    return {
      query: '',
      id: 0,
      lists: []
    }
  },
  computed: {
    setMainBusinessFloat: {
      get: function () {
        return this.$store.state.Float.setMainBusinessFloat
      },
      set: function (newValue) {
        this.$store.state.Float.setMainBusinessFloat = newValue
      }
    }
  },
  methods: {
    getAnswer: _.debounce(
      function (val) {
        this.oas.get('inquiry/mobile/listBusiness', { query: this.query }).then(e => {
          if (e.state === 200) {
            this.lists = e.data
          } else {
            this.$Message.error(e.msg)
          }
        })
      },
      500
    ),
    sub () {
      if (!this.id) {
        this.$Message.error('请选择主营行业')
        return
      }
      this.oas.post('inquiry/mobile/addBusiness', {
        aliAccountId: this.aliAccountId,
        classify: this.id
      }).then(e => {
        if (e.state === 200) {
          this.$Message.success('设置主营行业成功！')
          this.getList()
          this.cancel()
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    selectPel (item) {
      this.query = item.text
      this.id = item.classify
    },
    cancel () {
      this.$store.commit('setMainBusinessFloat', false)
    }
  },
  watch: {
    query: 'getAnswer',
    setMainBusinessFloat: function (val) {
      if (val) {
        this.getAnswer()
      }
    }
  }
}
</script>
<style scoped>
.list {
  margin-top: 20px;
  border: 1px solid #dddee1;
  border-bottom: 0;
  overflow: scroll;
  height: 300px;
}
.list li {
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-bottom: 1px solid #dddee1;
}
</style>
