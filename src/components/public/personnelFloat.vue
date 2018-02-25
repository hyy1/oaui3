<template>
    <span>
        <Button type="primary" v-if="rebackData[changeData.name]" @click="showAddUser">{{rebackData[changeData.name]}}</Button>
        <Button type="primary" v-else @click="showAddUser">{{text}}</Button>
        <Modal
        v-model="floatShow"
        :title="title"
        @on-cancel="cancel"
        :mask-closable="false">
            <Input v-model="keyword" placeholder="请输入人员名称搜索..." style="width: 300px"></Input>

            <Button type="primary" size="large" @click="getAnswer(keyword)">搜索</Button>
            <Button type="warning" size="large" @click="clearData">清除选中</Button>
            <ul class="list">
                <li v-for="item in lists" :key="item.id" @click="selectPel(item)">{{item.name}}</li>
            </ul>
            <div slot="footer">
                <Button type="primary" size="large" @click="cancel">关闭</Button>
            </div>
        </Modal>
    </span>
</template>

<script>
/* global _ */
// 公用人员选择浮动层
export default {
  props: {
    // 按钮text
    text: {
      type: String,
      default: ''
    },
    // 浮动层标题
    title: {
      type: String,
      default: ''
    },
    // 一级部门id和二级部门id
    idItem: Array,
    // 返回数据
    rebackData: {
      type: Object,
      default: {}
    },
    changeData: {
      type: Object,
      default: function () {
        return {
          name: '',
          id: 0,
          class1_id: 0,
          class2_id: 0
        }
      }
    }
  },
  data () {
    return {
      keyword: '',
      lists: [],
      class1: this.idItem ? this.idItem[0] : '',
      class2: (this.idItem && this.idItem[1]) ? this.idItem[1] : '',
      floatShow: false
    }
  },
  watch: {
    keyword: 'getAnswer'
  },
  methods: {
    getAnswer: _.debounce(
      function (val) {
        this.basejs.getPersonnelList(this.class1, this.class2, val).then((e) => {
          this.lists = e.data
        })
      },
      500
    ),
    showAddUser () {
      this.keyword = ''
      this.floatShow = true
      this.getAnswer()
    },
    selectPel (item) {
      this.rebackData[this.changeData.name] = item.name
      this.rebackData[this.changeData.id] = item.id
      this.rebackData[this.changeData.class1_id] = item.class1
      this.rebackData[this.changeData.class2_id] = item.class2
      this.cancel()
    },
    clearData () {
      this.rebackData[this.changeData.name] = ''
      this.rebackData[this.changeData.id] = 0
      this.rebackData[this.changeData.class1_id] = 0
      this.rebackData[this.changeData.class2_id] = 0
      this.cancel()
    },
    cancel () {
      this.floatShow = false
    }
  }
}
</script>
<style scoped>
.list {
  margin-top: 20px;
  border: 1px solid #dddee1;
  border-bottom: 0;
}
.list li {
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-bottom: 1px solid #dddee1;
}
</style>
