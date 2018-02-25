
  <template>
    <oaui3-template2>
      <p class="date">
        <span style="font-size:14px;font-weight:bold">选择月份：</span><Date-picker type="month" placeholder="选择月份" style="width: 200px"></Date-picker>
      </p>
      <h2 class="title2">一、基本运营数据：</h2>
      <Row>
          <i-col span="3" class="col">总金额：<span class="num">2131231元</span></i-col>
          <i-col span="4" class="col">成交金额：<span class="num">2131231元</span></i-col>
          <i-col span="4" class="col">跟单金额：<span class="num">2131231元</span></i-col>
          <i-col span="4" class="col">流失金额：<span class="num">2131231元</span></i-col>
          <i-col span="3" class="col">总笔数：<span class="num">2131231元</span></i-col>
          <i-col span="4" class="col">成交笔数：<span class="num">2131231元</span></i-col>
      </Row>
      <Row>
          <i-col span="3" class="col">跟单笔数：<span class="num">2131231元</span></i-col>
          <i-col span="4" class="col">流失笔数：<span class="num">2131231元</span></i-col>
          <i-col span="4" class="col">成交金额占比：<span class="num">2131231元</span></i-col>
          <i-col span="4" class="col">询盘总次数：<span class="num">2131231元</span></i-col>
          <i-col span="3" class="col">垃圾询盘：<span class="num">2131231元</span></i-col>
          <i-col span="3" class="col">有效询盘：<span class="num">2131231元</span></i-col>
          <i-col span="3" class="col">有效询盘占比：<span class="num">31%</span></i-col>
      </Row>
      <h2 class="title2">二、询盘数据分析：</h2>
      <inquiryDataAnalysis></inquiryDataAnalysis>
      <h2 class="title2">三、标王数据分析：</h2>
      <biddingDataAnalysis></biddingDataAnalysis>
      <h2 class="title2">四、运营建议：</h2>
      <div class="yyjy-con">
        <i-form ref="form1" :model="yyjyData" :rules="yyjyRule" :label-width="100" inline>
          <Form-item label="流失主要产品：" prop="name"></Form-item>
          <Form-item label="友商产品：" prop=""></Form-item><br />
          <Form-item label="买家反馈：" prop="buyerFeedback">
            <i-input type="textarea" v-model="yyjyData.buyerFeedback" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入..."></i-input>
          </Form-item>
          <Form-item label="建议：" prop="advice">
            <i-input type="textarea" v-model="yyjyData.advice" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入..."></i-input>
          </Form-item>
          <i-button type="primary" @click="sub">提交</i-button>
        </i-form>
      </div>
    </oaui3-template2>
  </template>
  
<script>
import inquiryDataAnalysis from '@/components/query/inquiryAnalysisReport/inquiryDataAnalysis'
import biddingDataAnalysis from '@/components/query/inquiryAnalysisReport/biddingDataAnalysis'

export default {
  data () {
    return {
      aliAccountId: this.$route.query.aliAccountId || 0,
      customID: this.$route.query.customID || 0,
      customname: this.$route.query.customname || '',
      wwname: this.$route.query.wwname || '',
      yyjyData: {
        advice: '',
        buyerFeedback: ''
      },
      yyjyRule: {}
    }
  },
  mounted () {
    // 设置页面标题
    this.$store.commit('setTitle', this.customname + '【账号：' + this.wwname + '】' + '询盘分析报告')
  },
  methods: {
    sub () {
      this.oas.post()
    }
  },
  components: { inquiryDataAnalysis, biddingDataAnalysis }
}
</script>
  
<style scoped>
.date {
  padding: 10px 0;
  text-align: center;
}
.title2 {
  padding: 10px;
}
.col {
  height: 35px;
  line-height: 35px;
  font-size: 12px;
  font-weight: bold;
  padding: 0 10px;
}
.num {
  font-size: 14px;
}
.yyjy-con {
  padding: 0 10px;
}
</style>
  