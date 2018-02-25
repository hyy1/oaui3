<template>
    <div>
        <Row class="row-border score-title">
            <Col span="5">分类</Col>
            <Col span="2">分数</Col>
            <Col span="8">得分模式</Col>
            <Col span="6">附件（设计图）</Col>
            <Col span="3">操作</Col>
        </Row>
        <Row v-for="(item,index) in workRecord" :key="index" class="row-border con-item">
            <Col span="5">
            <Cascader :data="classList" v-model="item.checkClass" style="width:150px;margin:0 auto;"></Cascader>
            </Col>
            <Col span="2">
            <Input :value="getScore(item.checkClass,index)" readonly placeholder="分数" style="width:60px"></Input>
            </Col>
            <Col span="8">
                <RadioGroup v-model="item.score_mode">
                    <Radio :label="0">
                        <span>固定分值</span>
                    </Radio>
                    <Radio :label="1">
                        <span>小时计分</span>
                    </Radio>
                </RadioGroup>
                <span v-if="item.score_mode == 1">
                    耗时：<Input v-model="item.work_time" :number="true" placeholder="单位/小时" style="width:80px;"></Input>
                </span>
            </Col>
            <Col span="6">
                <sx-upload :multiple="false" :uploadCallback="uploadCallback" :index="index"></sx-upload>
                <!-- <a v-if="item.attachment" target="_blank" :href="pathUpload + item.attachment">点击查看</a> -->
            </Col>
            <Col span="3">
                <Button @click="delCol(index)">-</Button>
            </Col>
        </Row>
        <Row>
            <Col class="add-btn">
            <Button @click="addCol()">+</Button>
            </Col>
        </Row>
    </div>
</template>

<script>
import sxUpload from '@/components/public/upload'

export default {
  props: {
    workRecord: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      classList: []
    }
  },
  mounted () {
    this.getClassList()
  },
  methods: {
    getScore (val, index) {
      if (val.length > 1) {
        for (let v of this.classList) {
          for (let v2 of v.children) {
            if (v2.id === val[1]) {
              if (this.workRecord[index].score_mode === 0) {
                this.workRecord[index].score = v2.score
              } else {
                this.workRecord[index].score = this.workRecord[index].work_time > 0 ? v2.score * this.workRecord[index].work_time : v2.score
              }
              return this.workRecord[index].score
            }
          }
        }
      } else {
        for (let v of this.classList) {
          if (v.id === val[0]) {
            if (this.workRecord[index].score_mode === 0) {
              this.workRecord[index].score = v.score
            } else {
              this.workRecord[index].score = this.workRecord[index].work_time > 0 ? v.score * this.workRecord[index].work_time : v.score
            }
            return this.workRecord[index].score
          }
        }
      }
    },
    getClassList () {
      this.oas.get('yymg/getAllWorkTypeFormat').then((e) => {
        if (e.state === 200) {
          this.classList = e.data
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    addCol () {
      this.workRecord.push({
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
      this.workRecord.splice(index, 1)
    },
    uploadCallback (name, url, index, list) {
      this.workRecord[index].attachment = url
    }
  },
  components: { sxUpload }
}
</script>

<style>
.row-border .ivu-upload-list {
  border-right: 1px solid #e5e5e5;
}
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
.add-btn {
  text-align: center;
  margin-top: 10px;
}
.con-item {
  line-height: 49px;
}
.sub-btn {
  padding: 6px 30px;
}
</style>