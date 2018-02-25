<template>
  <oaui3-template2>
    <p class='title'><span>买家信息：</span></p>
      <table class='table table-bordered'>
        <thead>
          <tr>
            <th class='red_mark'>买家旺旺</th>
            <th class='red_mark'>买家身份</th>
            <th>买家职位</th>
            <th>买家电话</th>
            <th>地区</th>
            <th class='wid_fixed red_mark'>是否加微信</th>
            <th>订单号</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class='searchBox'>
                <Input v-model='buyer.alitm' readonly class='wid_250 srarchInput' placeholder='请输入...'></Input>
            </td>
            <td>
            <RadioGroup v-model="buyer.type" v-for="(item,index) in buyersType" :key="index" class="lineTd">
              <Radio :label="item.label">{{item.text}}</Radio>
            </RadioGroup>
            </td>
            <td><Input v-model='buyer.position' class='wid' placeholder='请输入...'></Input></td>
            <td><Input v-model='buyer.phone' class='wid' placeholder='请输入...'></Input></td>
            <td><Cascader :data='provincialLeagueData' change-on-select class='wid' v-model='city'></Cascader></td>
            <td>
              <RadioGroup v-model='buyer.isWechat'>
                <Radio :label='1'>是</Radio>
                <Radio :label='2'>否</Radio>
              </RadioGroup>
              <Input v-if='buyer.isWechat==1' v-model='buyer.wechat' class='wid' placeholder='请输入...'></Input>
            </td>
            <td>
              <span v-if="!isShowOrder">
                <Input ref="aliOrderId" :value='order.aliOrderId' style='width:160px' placeholder='请输入...'></Input>
                <Button type='primary' @click='synchro'>同步</Button>
              </span>
              <!-- 117786715324614565 -->
              <span v-else>{{order.aliOrderId}}</span>
            </td>
          </tr>
        </tbody>
      </table>

    <p class='title'><span>跟进信息：</span></p>
    <table class='table table-bordered set_height'>
      <thead>
        <tr>
          <th width='160' class='red_mark'>产品名称</th>
          <th width="100">产品规格</th>
          <th width='160'>产品链接</th>
          <th width='100'>数量</th>
          <th width="100">单位</th>
          <th width='100'>报价</th>
          <th width='80' class='red_mark'>购买意向</th>
          <th width='80' class='red_mark'>是否成交</th>
          <th width='100'>跟踪金额</th>
          <th width='100'>成交金额</th>
          <th width='100'>流失金额</th>
          <th>未成交原因</th>
          <th width='100'>是否同行购买</th>
          <th width='160'>同行名称</th>
          <th width='100'>同行报价</th>
          <th width='100'>附件</th>
          <th width='125' class='red_mark'>下次跟进日期</th>
          <th width='160' class='red_mark'>备注</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='(el,index) in enquiries' :key='index'>
          <td>
            <Input v-model='el.name' type='textarea' :autosize='{minRows: 4,maxRows: 4}' placeholder='请输入...'></Input>
          </td>
          <td>
            <Input v-model="el.specification" placeholder="请输入..."></Input>
          </td>
          <td>
            <Input v-model='el.productUrl' type='textarea' :autosize='{minRows: 4,maxRows: 4}' placeholder='请输入...'></Input>
          </td>
          <td>
            <input v-model='el.num' @focus='focAll($event)' placeholder='请输入...' class='ivu-input'></input>
          </td>
          <td>
            <Input v-model="el.unit" placeholder="请输入..."></Input>
          </td>
          <td>
            <input v-model='el.price' @focus='focAll($event)' class='ivu-input'></input>
          </td>
          <td>
            <RadioGroup v-model='el.buyerIntention' size='small' vertical>
              <Radio :label='1'>低</Radio>
              <Radio :label='2'>中</Radio>
              <Radio :label='3'>高</Radio>
            </RadioGroup>
          </td>
          <td>
            <i-select v-model='el.saleStatus' style='width:80px'>
                <i-option v-for='(item,index) in saleStatusList' :key='index' :value='item.value'>{{ item.label }}</i-option>
            </i-select>
          </td>
          <td :class="el.saleStatus == 2 ? 'red_mark':''">
            <input v-model='el.followAmount' @focus='focAll($event)' class='ivu-input'></input>
          </td>
          <td :class="el.saleStatus ==1 ?'red_mark':''">
            <input v-model='el.gmvAmount' @focus='focAll($event)' class='ivu-input'></input>
          </td>
          <td :class="el.saleStatus ==3||el.saleStatus ==4 ?'red_mark':''">
            <input v-model='el.lossAmount' @focus='focAll($event)' class='ivu-input'></input>
          </td>
          <td class='pull_left'>
            <CheckboxGroup v-model='el.noDealReason1'>
              <Checkbox v-for="(el,index) in noDealReasonList" :label="el.name" :key="index"></Checkbox>
            </CheckboxGroup>
          </td>
          <td>
            <div>
              <RadioGroup v-model='el.peerBuy' size='small' vertical :class="el.saleStatus ==3||el.saleStatus ==4 ?'red_mark':''">
                <Radio :label='1'>是</Radio>
                <Radio :label='2'>否</Radio>
              </RadioGroup>
            </div>
          </td>
          <td>
            <Input v-model='el.peerName' :autosize='{minRows: 4,maxRows: 4}' placeholder='请输入...'></Input>
          </td>
          <td>
            <input v-model='el.peerPrice' @focus='focAll($event)' class='ivu-input'></input>
          </td>
          <td>
            <sx-upload :multiple='true' :uploadCallback='uploadCallback' :defaultList="defaultList(index)" :index='index'></sx-upload>
          </td>
          <td>
            <DatePicker :value='el.nextFollowTime' @on-change='el.nextFollowTime = $event' type='datetime' placeholder='年/月/日' transfer></DatePicker>
          </td>
          <td>
            <Input v-model='el.remark' type='textarea' :autosize='{minRows: 4,maxRows: 4}' placeholder='请输入...'></Input>
          </td>
          <!--删除行-->
          <td>
            <Button @click='delCol(index)' type='error' size='small'><Icon type='minus-round'></Icon></Button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <!--增加行-->
        <tr>
          <td colspan='19'>
            <Button @click='addCol' type='primary' size='small'><Icon type='plus-round'></Icon></Button>
          </td>
        </tr>
      </tfoot>
    </table>
    <div class='v_center'>
      <Button @click='postQueryRecord' type='primary' :loading='loading'>保存</Button>
      <Button @click='closePage'>取消</Button>
    </div>
    <!-- 最近三条询盘 -->
    <lastThreeEnquiries></lastThreeEnquiries>
  </oaui3-template2>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import sxUpload from '@/components/public/upload'
import lastThreeEnquiries from '@/components/query/queryRecord/lastThreeEnquiries'

export default {
  /* global _ */
  components: { sxUpload, lastThreeEnquiries },
  data () {
    return {
      /** 获取基本信息 */
      aliAccountId: this.$route.query.aliAccountId,
      customname: this.$route.query.customname,
      wwname: this.$route.query.wwname,
      customID: this.$route.query.customID,
      enquiryid: this.$route.query.enquiryid,
      id: this.$route.query.id,
      buyerInfo: [],
      // 是否成交状态
      saleStatusList: [
        {
          value: 1,
          label: '是'
        },
        {
          value: 2,
          label: '跟进中'
        },
        {
          value: 3,
          label: '否'
        },
        {
          value: 4,
          label: '退款中'
        }
      ],
      // 买家身份
      buyersType: [
        {
          text: '淘宝',
          label: 1
        },
        {
          text: '经销商',
          label: 2
        },
        {
          text: '微商',
          label: 3
        },
        {
          text: '外贸',
          label: 4
        },
        {
          text: '其他',
          label: 5
        }
      ],
      // 买家信息
      buyer: {},
      // 跟进信息
      enquiries: [
        {
          name: '',
          specification: '',
          productUrl: '',
          num: 0,
          unit: '',
          price: 0,
          buyerIntention: 2,
          saleStatus: 2,
          gmvAmount: 0,
          followAmount: 0,
          lossAmount: 0,
          peerBuy: 0,
          noDealReason1: [],
          noDealReason: '',
          peerName: '',
          peerPrice: 0,
          nextFollowTime: this.moment().format('YYYY-MM-DD'),
          remark: '',
          attachUrl: ''
        }
      ],
      // 订单信息
      order: {},
      isShowOrder: '',
      /** 错误提示 */
      errorInfo: '',
      loading: false,
      /** 样式控制 */
      // isActive: true,
      queryId: 0,
      // 未成交原因
      noDealReasonList: []
    }
  },
  computed: {
    ...mapState({
      provincialLeagueData: state => state.Public.provincialLeagueData
    }),
    // 省市信息
    city: {
      get: function () {
        return [this.buyer.provinceId || 0, this.buyer.cityId || 0]
      },
      set: function (val) {
        // 用户单选省份时, 城市id赋值为省份id，因为后端只保存城市id
        if (!val[1]) {
          this.buyer.cityId = val[0]
        } else {
          this.buyer.cityId = val[1]
        }
        this.buyer.provinceId = val[0]
      }
    }
  },
  created () {
    this.$store.commit(
      'setTitle',
      this.customname + '【账号：' + this.wwname + '】修改询盘记录'
    )
  },
  mounted () {
    // 获取修改详情
    this.getEditInfo()
    // 获取省市集合
    this.getProvincialLeagueData()
    // 未成交原因列表
    this.getDealNoReason()
  },
  methods: {
    ...mapActions(['getProvincialLeagueData']),
    // 默认上传附件list
    defaultList (index) {
      if (this.enquiries[index].attachUrl) {
        let pathAry = this.enquiries[index].attachUrl.split('|')
        let returnAry = []
        for (let i in pathAry) {
          returnAry.push({
            name: '附件' + (Number(i) + 1),
            url: pathAry[i]
          })
        }
        return returnAry
      } else {
        return []
      }
    },
    // 同步订单
    synchro () {
      let pattern = /^[0-9]*$/g
      let aliOrderId = this.$refs['aliOrderId'].currentValue
      if (!aliOrderId || aliOrderId === 0 || pattern.test(aliOrderId) === false) {
        this.$Message.error('请输入正确的订单号！')
        return
      }
      this.oas
        .post('inquiry/record/synchronousOrder', {
          aliAccountId: this.aliAccountId,
          aliOrderId,
          enquiryOrderId: this.id
        })
        .then(e => {
          if (e.state !== 200) {
            this.$Message.error(e.msg)
            return
          }
          // 赋值
          this.buyer = e.data.buyer
          this.enquiries = e.data.enquiryVos
          this.order = e.data.order
          // 处理未成交原因
          for (let item of this.enquiries) {
            // item = Object.assign({}, item, { noDealReason1: (item.noDealReason && item.noDealReason.split(',')) || [] })
            this.$set(item, 'noDealReason1', (item.noDealReason && item.noDealReason.split(',')) || [])
          }
        })
    },
    // 获取未成交原因
    getDealNoReason () {
      this.oas.get('inquiry/nodealreason/list')
        .then(e => {
          if (e.state === 200) {
            this.noDealReasonList = e.data
          } else {
            this.$Message.success(e.msg)
          }
        })
    },
    /** 添加一列 */
    addCol () {
      this.enquiries.push({
        name: '',
        productUrl: '',
        num: 0,
        price: 0,
        buyerIntention: 2,
        saleStatus: 2,
        gmvAmount: 0,
        followAmount: 0,
        lossAmount: 0,
        peerBuy: 0,
        noDealReason1: [],
        noDealReason: '',
        peerName: '',
        peerPrice: 0,
        nextFollowTime: this.moment().format('YYYY-MM-DD'),
        remark: '',
        attachUrl: ''
      })
    },
    /** 删除一列 */
    delCol (indexVal) {
      if (this.enquiries.length === 1) {
        this.$Message.error('已经是最后一行啦')
        return
      }
      this.enquiries.splice(indexVal, 1)
    },
    // 内容全选
    focAll (e) {
      e.target.select()
    },
    /** 提交数据 */
    postQueryRecord () {
      // 验证数据
      this.md_check()
      // 错误消息统一提醒
      if (this.errorInfo !== '') {
        this.$Notice.error({
          title: '错误提示',
          duration: 10,
          desc: this.errorInfo
        })
        return
      }
      /** 后端需要的默认值(0) */
      for (let i = 0, j = this.enquiries.length; i < j; i++) {
        if (this.enquiries[i]['peerPrice'] === '') {
          this.enquiries[i]['peerPrice'] = 0
        }
        if (this.enquiries[i]['gmvAmount'] === '') {
          this.enquiries[i]['gmvAmount'] = 0
        }
        if (this.enquiries[i]['followAmount'] === '') {
          this.enquiries[i]['followAmount'] = 0
        }
        if (this.enquiries[i]['lossAmount'] === '') {
          this.enquiries[i]['lossAmount'] = 0
        }
        if (this.enquiries[i]['price'] === '') {
          this.enquiries[i]['price'] = 0
        }
      }
      this.loading = true

      // 处理数据
      this.order.id = this.id
      let addData = JSON.stringify({
        buyer: this.buyer,
        enquiryVos: this.enquiries,
        order: this.order,
        aliAccountId: this.aliAccountId
      })
      this.oas.jsonPost('inquiry/record/update', addData).then(e => {
        if (e.state === 200) {
          this.$Message.success('您的询盘已修改成功！')
          this.loading = false
          this.$router.push({
            name: 'queryRecordList',
            query: {
              aliAccountId: this.aliAccountId,
              customID: this.customID,
              customname: this.customname,
              wwname: this.wwname
            }
          })
        } else {
          this.$Message.error(e.msg)
          this.loading = false
        }
      })
    },
    /** 数据验证与设置 */
    md_check () {
      // 初始化错误信息容器
      this.errorInfo = ''
      // 买家信息验证
      this.checkRule(this.buyer.alitm, /\S/, '买家旺旺：请填写买家旺旺')
      this.checkRule(this.buyer.type, /^[1-5]{1}$/, '买家身份：请选择买家身份')
      if (this.buyer.phone) {
        this.checkRule(this.buyer.phone, /^\d{5,20}$/, '买家电话：请填写正确的电话')
      }
      this.checkRule(this.buyer.isWechat, /\S/, '请填写是否加微信')
      if (Number(this.buyer.isWechat) === 1) {
        this.checkRule(this.buyer.wechat, /\S/, '是否加微信：选择是请填写微信号')
      } else {
        this.buyer.wechat = ''
      }
      // 跟进信息验证
      for (let i = 0, j = this.enquiries.length; i < j; i++) {
        this.checkRule(
          this.enquiries[i]['name'],
          /\S/,
          '产品名称(第' + (i + 1) + '行)：请填写产品名称'
        )
        this.checkLength(
          this.enquiries[i]['unit'],
          10,
          '单位(第' + (i + 1) + '行)：单位过长'
        )
        this.checkRule(
          this.enquiries[i]['buyerIntention'],
          /\S/,
          '购买意向(第' + (i + 1) + '行)：请选择购买意向'
        )
        this.checkRule(
          this.enquiries[i]['saleStatus'],
          /\S/,
          '是否成交(第' + (i + 1) + '行)：请选择是否成交'
        )
        // 验证小数格式
        this.checkPlusFiveNum(
          this.enquiries[i]['price'],
          '报价(第' + (i + 1) + '行)'
        )
        /** 未成交原因数组赋值给未成交原因字符串 */
        this.enquiries[i]['noDealReason'] = (this.enquiries[i]['noDealReason1'] && this.enquiries[i]['noDealReason1'].join(',')) || ''

        /** 是否成交判断，成交，跟进,流失金额 */
        if (Number(this.enquiries[i]['saleStatus']) === 1) {
          // 成交,验证成交金额是否为空
          this.checkRule(
            this.enquiries[i]['gmvAmount'],
            /\S/,
            '成交金额(第' + (i + 1) + '行)：选择成交时为必填项'
          )
        } else if (Number(this.enquiries[i]['saleStatus']) === 2) {
          /** 跟进中，验证跟踪金额是否为空 */
          this.checkRule(
            this.enquiries[i]['followAmount'],
            /\S/,
            '跟踪金额(第' + (i + 1) + '行)：选择跟进中为必填项'
          )
        } else if (Number(this.enquiries[i]['saleStatus']) === 3 || Number(this.enquiries[i]['saleStatus']) === 4) {
          /** 未成交或者退款中，验证流失金额、是否同行购买 */
          this.checkRule(
            this.enquiries[i]['lossAmount'],
            /\S/,
            '流失金额(第' + (i + 1) + '行)：选择未成交或退款中为必填项'
          )
          if (Number(this.enquiries[i]['saleStatus']) === 3) {
            this.checkRule(this.enquiries[i]['noDealReason'], /\S/, '未成交原因(第' + (i + 1) + '行)：未成交时必填')
          }
          this.checkRule(
            this.enquiries[i]['peerBuy'],
            /^[1-2]{1}$/,
            '是否同行购买(第' + (i + 1) + '行)：未成交或退款中为必填项'
          )
        }
        // 成交金额验证小数格式
        this.checkPlusNum(
          this.enquiries[i]['gmvAmount'],
          '成交金额(第' + (i + 1) + '行)'
        )
        // 跟踪金额验证小数格式
        this.checkPlusNum(
          this.enquiries[i]['followAmount'],
          '跟踪金额(第' + (i + 1) + '行)'
        )
        // 流失金额验证小数格式
        this.checkPlusNum(
          this.enquiries[i]['lossAmount'],
          '流失金额(第' + (i + 1) + '行)'
        )
        /** 是否同行购买 */
        if (Number(this.enquiries[i]['peerBuy']) === 1) {
          this.checkRule(
            this.enquiries[i]['peerName'],
            /\S/,
            '同行名称(第' + (i + 1) + '行)：是否同行购买选择是时请填写同行名称'
          )
          this.checkRule(
            this.enquiries[i]['peerPrice'],
            /\S/,
            '同行报价(第' + (i + 1) + '行)：是否同行购买选择是时请填写同行报价'
          )
        }
        // 验证小数格式
        this.checkPlusFiveNum(
          this.enquiries[i]['peerPrice'],
          '同行报价(第' + (i + 1) + '行)'
        )
        this.checkRule(
          this.enquiries[i]['nextFollowTime'],
          /\S/,
          '下次跟进日期(第' + (i + 1) + '行)：请选择下次跟进日期'
        )
        this.checkRule(
          this.enquiries[i]['remark'],
          /\S/,
          '备注(第' + (i + 1) + '行)：请填写备注'
        )
      }
    },
    /**
      验证
      val 验证参数
      regu 验证规则
      error 错误提示
     */
    checkRule (val, regu, error) {
      if (!val || val === '0') {
        this.errorInfo += error + '<br>'
        return
      }
      let patt = new RegExp(regu)
      if (patt.test(val) === false) {
        this.errorInfo += error + '<br>'
      }
    },
    /* 验证是否是正数或正确的小数格式 */
    checkPlusNum (val, error) {
      let pattern = /^([0-9][0-9]*)+(.[0-9]{1,2})?$/g
      if (!val) {
        return
      }
      if (pattern.test(val) === false) {
        this.errorInfo +=
          error + '：请输入正确的数字格式，最多输入两位小数' + '<br>'
      }
    },
    /*
    五位小数格式
    */
    checkPlusFiveNum (val, error) {
      if (!val) {
        return
      }
      let pattern = /^([0-9][0-9]*)+(.[0-9]{1,5})?$/g
      if (pattern.test(val) === false) {
        this.errorInfo +=
          error + '：请输入正确的数字格式，最多输入五位小数' + '<br>'
      }
    },
    // 验证长度
    checkLength (val, l, error) {
      if (val.length > l) {
        this.errorInfo += error + '<br>'
      }
    },
    /** 关闭页面 */
    closePage () {
      window.opener = null
      history.go(-1)
    },
    /** 检索买家旺旺 */
    searchSet (val) {
      /** 设置所有的信息 */
      this.buyer.alitm = val.alitm
      this.buyer.type = val.type
      this.buyer.phone = val.phone
      this.buyer.isWechat = val.isWechat
      this.buyer.wechat = val.wechat
      this.buyer.position = val.position
      /** 设置城市 */
      this.city = [val.provinceId, val.cityId]
    },
    search: _.debounce(function (val) {
      this.oas
        .get('inquiry/buyer/list', {
          aliAccount: val,
          aliAccountId: this.aliAccountId
        })
        .then(e => {
          if (e.state === 200) {
            // 设置列表值
            this.buyerInfo = e.data.list
          }
        })
    }, 700),
    /** 获取修改信息 */
    getEditInfo () {
      this.oas.get('inquiry/record/detail', { id: this.id }).then(e => {
        if (e.state !== 200) {
          this.$Message.error(e.msg)
          return
        }
        this.buyer = e.data.buyer // 买家信息
        this.enquiries = e.data.enquiryVos // 跟踪信息
        this.order = e.data.order // 订单信息
        this.isShowOrder = e.data.order.aliOrderId // aliOrderId有值，则禁用同步订单
        // 处理未成交原因
        for (let item of this.enquiries) {
          console.log(111)
          // item = Object.assign({}, item, { noDealReason1: (item.noDealReason && item.noDealReason.split(',')) || [] })
          this.$set(item, 'noDealReason1', (item.noDealReason && item.noDealReason.split(',')) || [])
        }
      })
    },
    // 上传成功回调
    uploadCallback (name, path, index) {
      this.enquiries[index].attachUrl = path
    }
  },
  watch: {
    'buyer.alitm': 'search'
  }
}
</script>
<style>
.title {
  background: #d9ebfd;
  border-bottom: #d6eaff 1px solid;
  padding: 8px 20px;
  font-size: 15px;
  font-weight: bold;
  color: #495060;
  font-family: "微软雅黑";
  letter-spacing: 2px;
}
.table > tbody td {
  vertical-align: middle !important;
}
.set_height > tbody td {
  height: 160px;
}
.wid_fixed {
  min-width: 350px;
  max-width: 350px;
  width: 350px;
}
.wid {
  width: 200px;
  margin-right: 20px;
  margin: auto;
}
.wid_250 {
  width: 250px;
  margin-right: 20px;
}
.pull_left {
  text-align: left;
  width: 102px;
}
.red_mark:before {
  content: "* ";
  color: red;
}
.v_center {
  padding-bottom: 20px;
  text-align: center;
}
.wid_143 {
  width: 143px;
  min-width: 143px;
  max-width: 143px;
}
.searchBox {
  width: 250px;
  margin: auto;
  position: relative;
}
/**
.searchBox:hover .searchWW {
  height: 176px
  border-bottom: solid 1px #57a3f3
}
*/
.searchWW {
  position: absolute;
  width: 247px;
  height: 0px;
  overflow-y: scroll;
  /**display: block*/
  transition: height 0.5s;
  background: #f7f7f7;
  border-left: solid 1px #57a3f3;
  border-right: solid 1px #57a3f3;
  box-sizing: content-box;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  top: 33px;
  z-index: 1;
}
.searchWW > li {
  border-left: solid 1px #dedede;
  border-right: solid 1px #dedede;
  border-bottom: 1px solid #e8e8e8;
  padding: 6px;
  text-align: left;
}
.searchWW > li > .wwname {
  padding-left: 10px;
  display: inline-block;
  width: 70%;
}
.searchWW > li > .wwcity {
  font-weight: bold;
  padding-left: 10px;
  display: inline-block;
  width: 30%;
}
.searchWW > li:hover {
  background: #53b0ff;
  transition: background 1.5s;
  cursor: pointer;
}
.queryRecordTable .ivu-table-cell {
  padding: 0 8px;
}
.queryRecordTable tr > td:nth-child(n + 10):nth-child(-n + 25) .ivu-table-cell {
  padding: 0;
}
.queryRecordTable
  tr
  > td:nth-child(n + 10):nth-child(-n + 25)
  .ivu-table-cell
  > div
  > div {
  padding: 0 8px;
  height: 60px;
  /* line-height: 60px */
  border-bottom: 1px solid #e9eaec;
  display: -webkit-box;
  -webkit-box-orient: horizontal;
  -webkit-box-pack: center;
  -webkit-box-align: center;

  display: -moz-box;
  -moz-box-orient: horizontal;
  -moz-box-pack: center;
  -moz-box-align: center;

  display: -o-box;
  -o-box-orient: horizontal;
  -o-box-pack: center;
  -o-box-align: center;

  display: -ms-box;
  -ms-box-orient: horizontal;
  -ms-box-pack: center;
  -ms-box-align: center;

  display: box;
  box-orient: horizontal;
  box-pack: center;
  box-align: center;
}
.queryRecordTable
  tr
  > td:nth-child(n + 10):nth-child(-n + 25)
  .ivu-table-cell
  > div
  > div:last-child {
  border: 0;
}
</style>
