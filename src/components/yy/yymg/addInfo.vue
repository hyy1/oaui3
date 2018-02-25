<template>
    <div>
        <Button type="info" @click="showModal = true">添加</Button>
        <Modal :mask-closable="false" v-model="showModal" title="添加工作记录" width="1000">
            <add-work :workRecord="workRecord" :uploadList="uploadList"></add-work>
            
            <div slot="footer">
                <Button type="primary" size="large" @click="ok">确定</Button>
                <Button type="text" size="large" @click="cancel">取消</button> 
            </div>
        </Modal>
    </div>
</template>

<script>
import addWork from '@/components/yy/yymg/addwork'
// 定义常量
const _workRecord = [{
  top_work_id: '',
  work_id: '',
  score: '',
  score_mode: 0,
  work_time: '',
  attachment: '',
  checkClass: []
}]
export default {
  components: { addWork },
  props: ['taskId', 'getInfo'],
  data () {
    return {
      workRecord: JSON.parse(JSON.stringify(_workRecord)),
      showModal: false,
      uploadList: []
    }
  },
  methods: {
    ok () {
      for (let val of this.workRecord) {
        val.top_work_id = val.checkClass[0]
        val.work_id = val.checkClass[1]
        if (!val.top_work_id) {
          this.$Message.error('分类不能为空！')
          return
        }
        if (!val.score) {
          this.$Message.error('分数不能为空！')
          return
        }
        if (val.score_mode === 1 && !val.work_time) {
          this.$Message.error('耗时不能为空！')
          return
        }
        if (!val.attachment) {
          this.$Message.error('附件不能为空！')
          return
        }
      }
      this.oas.post('yymg/addWorkRecord', {
        task_id: this.taskId,
        workRecordJson: JSON.stringify(this.workRecord)
      }).then((e) => {
        if (e.state === 200) {
          this.$Message.success('添加成功!')
          this.showModal = false
          this.uploadList = []
          this.getInfo()
        } else {
          this.$Message.error(e.msg)
        }
      })
      this.clearData()
      this.showModal = false
    },
    cancel () {
      this.clearData()
      this.showModal = false
    },
    clearData () {
      this.workRecord = JSON.parse(JSON.stringify(_workRecord))
    }
  }
}
</script>

