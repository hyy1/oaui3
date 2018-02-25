<template>
    <Modal 
        v-model="yymgEditFloat"
        :mask-closable="false"
        title="修改分类">
        <Form :label-width="100">
            <FormItem label="分类：">
                <Cascader :data="classList" v-model="checkClass" @on-change="changeClass" style="display:inline-block"></Cascader>
            </FormItem>
            <FormItem label="分数：">
                <Input :value="info.score" readonly placeholder="分数" style="width:60px"></Input>
            </FormItem>
            <FormItem label="得分模式：">
                <RadioGroup v-model="info.score_mode">
                    <Radio label="0">
                        <span>固定分值</span>
                    </Radio>
                    <Radio label="1">
                        <span>小时计分</span>
                    </Radio>
                </RadioGroup>
                <span v-if="info.score_mode == 1">
                    耗时：<Input v-model="info.work_time" :number="true" placeholder="单位/小时" style="width:80px"></Input>
                </span>
            </FormItem>
            <FormItem label="附件：">
                <sx-upload :defaultList="defaultList" :multiple="false" :uploadCallback="uploadCallback"></sx-upload>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="primary" size="large" @click="ok">确定</Button>
            <Button type="text" size="large" @click="cancel">取消</button> 
        </div>
    </Modal>
</template>

<script>
import sxUpload from '@/components/public/upload'

export default {
  props: {
    info: {
      type: Object,
      default: {}
    },
    getInfo: {
      type: Function,
      default: function () { }
    },
    cancelTop: {
      type: Function,
      default: function () { }
    }
  },
  data () {
    return {
      classList: [],
      scoreChoose: 0,
      defaultList: [{ name: this.info.attachment, url: this.info.attachment }]
    }
  },
  computed: {
    yymgEditFloat: {
      get: function () {
        return this.$store.state.Float.yymgEditFloat
      },
      set: function (newValue) {
        this.$store.state.Float.yymgEditFloat = newValue
      }
    },
    checkClass: {
      get: function () {
        return [this.info.top_work_id, this.info.work_id]
      },
      set: function (newValue) {
        this.info.top_work_id = newValue[0]
        this.info.work_id = newValue[1]
      }
    }
  },
  watch: {
    'info.work_time': function (val) {
      this.info.score = val > 0 ? val * this.scoreChoose : this.scoreChoose
    },
    'info.score_mode': function (val) {
      if (val === 0) {
        this.info.work_time = 0
        this.info.score = this.scoreChoose
      } else {
        this.info.score = this.info.work_time > 0 ? this.info.work_time * this.scoreChoose : this.scoreChoose
      }
    }
  },
  mounted () {
    this.getClassList()
  },
  methods: {
    changeClass (value, selectedData) {
      var index = selectedData.length - 1
      this.scoreChoose = selectedData[index].score
      if (this.info.score_mode === 0) {
        this.info.score = selectedData[index].score
      } else {
        this.info.score = this.info.work_time > 0 ? selectedData[0].score * this.info.work_time : selectedData[0].score
      }
    },
    getClassList () {
      this.oas.get('yymg/getAllWorkTypeFormat').then((e) => {
        if (e.state === 200) {
          this.classList = e.data
          // 获取当前选中分类对应的分数，如果是二级分类则循环两遍classList取到分数，一级分类则循环一遍classList取到分数
          if (this.info.work_id > 0) {
            for (let v of this.classList) {
              for (let v2 of v.children) {
                if (v2.id === this.info.work_id) {
                  // 设置当前选中分类对应分数
                  this.scoreChoose = v2.score
                }
              }
            }
          } else {
            for (let v of this.classList) {
              if (v.id === this.info.top_work_id) {
                // 设置当前选中分类对应分数
                this.scoreChoose = v.score
              }
            }
          }
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    ok () {
      if (!this.info.top_work_id) {
        this.$Message.error('分类不能为空！')
        return
      }
      if (!this.info.score) {
        this.$Message.error('分数不能为空！')
        return
      }
      if (this.info.score_mode === 1 && !this.info.work_time) {
        this.$Message.error('耗时不能为空！')
        return
      }
      if (!this.info.attachment) {
        this.$Message.error('附件不能为空')
        return
      }
      this.oas.post('yymg/updateWorkRecord', {
        work_record_id: this.info.id,
        attachment: this.info.attachment,
        score: this.info.score,
        score_mode: this.info.score_mode,
        work_time: this.info.work_time,
        task_id: this.info.task_id,
        top_work_id: this.info.top_work_id,
        work_id: this.info.work_id
      }).then((e) => {
        if (e.state === 200) {
          this.$Message.success('修改成功!')
          this.getInfo()
        } else {
          this.$Message.error(e.msg)
        }
      })
      this.$store.commit('yymgEditFloatSet', false)
    },
    cancel () {
      this.$store.commit('yymgEditFloatSet', false)
      this.cancelTop()
    },
    // 上传成功回调
    uploadCallback (name, url) {
      this.info.attachment = url
      // this.uploadList = [ {name, url}]
    }
  },
  components: { sxUpload }
}
</script>
