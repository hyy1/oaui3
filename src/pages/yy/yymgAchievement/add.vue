<template>
    <oaui3-template1>
        <div class="main">
            <Form ref="addForm" :model="addData" :label-width="100">
                <FormItem label="提单名称" prop="task_id">
                    <taskListFloat :rebackData="addData" :changeData="['ali_account','task_id','task_name','mg_id','mg_name','task_source_id']"></taskListFloat>
                </FormItem>
                <FormItem label="账号">
                     {{addData.ali_account}}
                </FormItem>
                <FormItem label="美工">
                     <personnelFloat :title="'美工人员列表'" :text="'美工'" :idItem="[4]" :rebackData="addData" :changeData="{name: 'mg_name', id: 'mg_id'}"></personnelFloat>
                </FormItem>
                <FormItem label="日期" prop="add_time">
                    {{addData.add_time}}
                </FormItem>
                <Form :label-width="100">
                    <FormItem label="分数统计">
                        <add-work :workRecord="addData.work_record"></add-work>
                    </FormItem>
                </Form>
                <FormItem style="text-align:right">
                    <Button type="primary" @click="sub" class="sub-btn">提交</Button>
                    <Button @click="clearData">重置</Button>
                </FormItem>
            </Form>
        </div>
    </oaui3-template1>
</template>

<script>
// 人员float
import personnelFloat from '@/components/public/personnelFloat'
// 提单float
import taskListFloat from '@/components/public/taskListFloat'
import addWork from '@/components/yy/yymg/addwork'
import moment from 'moment'

// 添加的数据
const _addData = {
  task_id: 0,
  task_name: '',
  mg_id: '',
  mg_name: '',
  add_time: moment().format('YYYY-MM-DD hh:mm:ss'),
  ali_account: '',
  task_source_id: 0,
  work_record: [{
    top_work_id: '',
    work_id: '',
    score: '',
    score_mode: 0,
    work_time: '',
    attachment: '',
    checkClass: []
  }]
}

export default {
  components: { personnelFloat, taskListFloat, addWork },
  data () {
    return {
      addData: JSON.parse(JSON.stringify(_addData)),
      classList: []
    }
  },
  created () {
    // 页面权限判断
    this.basejs.judgeQX('运营美工业绩提单_添加', 'page')
  },
  mounted () {
    this.$store.commit('setTitle', '添加运营美工业绩')
    this.getClassList()
  },
  methods: {
    getClassList () {
      this.oas.get('yymg/getAllWorkType').then((e) => {
        if (e.state === 200) {
          this.classList = e.data
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    addCol () {
      this.addData.work_record.push({
        top_work_id: '',
        work_id: '',
        score: '',
        score_mode: 0,
        work_time: '',
        attachment: '',
        checkClass: []
      })
    },
    delCol (index) {
      this.addData.work_record.splice(index, 1)
    },
    clearData () {
      this.addData = JSON.parse(JSON.stringify(_addData))
    },
    sub () {
      if (!this.addData.task_id) {
        this.$Message.error('请选择提单')
        return
      }
      if (this.addData.mg_id <= 0) {
        this.$Message.error('请选择美工')
        return
      }
      if (this.addData.add_time.length === 0) {
        this.$Message.error('请选择日期')
        return
      }
      for (let val of this.addData.work_record) {
        if (!val.checkClass[0]) {
          this.$Message.error('工作分类不能为空')
          return
        }
        val.top_work_id = val.checkClass[0]
        val.work_id = val.checkClass[1]

        if (!val.score) {
          this.$Message.error('分数不能为空')
          return
        }
        if (val.score_mode === 1 && !val.work_time) {
          this.$Message.error('请填写耗时')
          return
        }
        if (!val.attachment) {
          this.$Message.error('附件不能为空')
          return
        }
      }
      this.oas.post('yymg/addTask', { mgYjTaskJson: JSON.stringify(this.addData) }).then((e) => {
        if (e.state === 200) {
          this.$Message.success('添加成功！')
          this.clearData()
        } else {
          this.$Message.error(e.msg)
        }
      })
    }
  }
}
</script>

<style>
.score-title .ivu-col {
  line-height: 30px;
  text-align: center;
}

.row-border .ivu-col {
  border: 1px solid #dddee1;
  border-right: 0;
}

.row-border .ivu-col:last-child {
  border-right: 1px solid #dddee1;
}

.con-item .ivu-upload-list {
  margin: 0;
}

.con-item .ivu-input-wrapper {
  vertical-align: initial;
}

.con-item .ivu-col {
  text-align: center;
}

.con-item .ivu-cascader {
  line-height: inherit;
}
</style>

<style scoped>
.main {
  width: 70%;
  margin: 0 auto;
  padding: 20px 0;
}
.con-item {
  line-height: 50px;
}
.sub-btn {
  padding: 6px 30px;
}
</style>

