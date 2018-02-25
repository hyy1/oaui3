<template>
    <oaui3-template1>
        <div class="tryeatlist">
            <div class="header">
                <h2 style="float:left;height:30px;line-height:30px;">试吃人员列表</h2>
                <div style="float:left; margin-left:50px;">
                    <router-link class="ivu-btn ivu-btn-warning" to="/tryEatList"><i class="ivu-icon ivu-icon-fork"></i><span>试吃产品</span></router-link>
                </div>
            </div>
            <div class="search">
                <label>
                    <span class="txt">关键词：</span>
                    <Input v-model="search.name" placeholder="请输入产品名称或关键词" style="width: 150px"></Input>
                </label>
                
                <div style="display:inline-block;margin-right:5px;">
                    <span class="txt">所在部门：</span>
                    <Cascader :data="classListFormat" v-model="search.classname" style="width:150px;display:inline-block"></Cascader>
                </div>
                <label>
                    <span class="txt">选择分组：</span>
                    <Select v-model="search.tasteGroupId" clearable style="width:120px">
                        <Option v-for="item in groupList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </label>
                <label>
                        <span class="txt">试吃时间：</span>
                        <DatePicker type="date" :value="search.tasteBeginTime" @on-change="search.tasteBeginTime=$event" placeholder="选择日期" style="width: 120px"></DatePicker>
                    </label>
                    <label>
                        <span class="txt" style="padding-right:10px;">-</span>
                        <DatePicker type="date" :value="search.tasteEndTime" @on-change="search.tasteEndTime=$event" placeholder="选择日期" style="width: 120px"></DatePicker>
                    </label>
                    <label>
                        <span class="txt">添加人：</span>
                        <personnelFloat :text="'选择人员'" :title="'人员列表'"  :rebackData="personel" :changeData="{name: 'pname', id: 'pid'}"></personnelFloat>
                    </label>
                    <Button type="primary" icon="ios-search" style="margin-right:10px;" @click="searchList">查询</Button>
                    <Button type="success" icon="document-text" @click="toexport">导出</Button>
            </div>
            <h1 style="margin-top:20px;">
                <p>当前试吃报名人数:<span style="margin:0 10px;color:red;">{{peopleTotal}}</span>人</p>
            </h1>
            <div class="tableList">
                <Table border ref="selection" @on-selection-change='allselected' :columns="columns" :data="productList"></Table>
                <div style="margin-top:20px;">
                    <Button type="error" @click="handleSelectAll(true)">全选</Button>
                    <Button type="success" icon="social-reddit-outline" @click="informpeople">一键通知试吃</Button>
                </div>
            </div>
            <div class="pages">
                <div>
                    <Page :total="total" show-elevator @on-change="getlist" :current="search.pageIndex" :page-size="search.pageSize" ></Page>
                </div>
            </div>
            <div class="todata">
                <Modal v-model="modaltodata" width="600">
                    <p slot="header" style="color:#f60;text-align:center;font-size:18px">
                        <Icon type="information-circled"></Icon>
                        <span>试吃感受</span>
                    </p>
                    <div class="product_table">
                        <Input v-model="eatlist.feel" type="textarea" :autosize="{minRows: 5,maxRows: 7}" placeholder="试吃感受"></Input>
                    </div>
                    <div slot="footer" style="text-align:center">
                        <Button type="primary" @click="addData('form1')">确定</Button>
                        <Button type="error" @click="modaltodata=false">取消</Button>
                    </div>
                </Modal>
            </div>
        </div>
    </oaui3-template1>
</template>
<script>
import eatUpload from '@/components/public/upload'
import { mapState, mapActions } from 'vuex'
import personnelFloat from '@/components/public/personnelFloat'
var _search = {
  name: '',
  tasteGroupId: '',
  tasteBeginTime: '',
  tasteEndTime: '',
  classname: [],
  class1Id: '',
  class2Id: '',
  userId: '',
  pageIndex: 1,
  pageSize: 10
}
var _product = {
  beginTasteTime: '',
  endTasteTime: '',
  id: '',
  img: '',
  name: '',
  price: '',
  tasteGroupId: ''
}
export default {
  props: {
    keyword: {
      type: String,
      default: function () {
        return ''
      }
    },
    userId: {
      type: Number,
      default: function () {
        return 0
      }
    },
    userName: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {
      modaltodata: false,
      modalwttryEat: false,
      modaldelTryeat: false,
      total: 0,
      peopleTotal: 0,
      personel: { name: 'pname', id: 'pid' },
      search: JSON.parse(JSON.stringify(_search)),
      product: JSON.parse(JSON.stringify(_product)),
      modelName: '',
      modalwttryEatName: '',
      modelNameS: ['添加', '修改'],
      products: [],
      eatlist: {
        feel: '',
        tastePersonId: 0,
        eatfeelstatus: 0
      },
      groupList: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          title: '全选'
        },
        {
          title: '添加人',
          align: 'center',
          key: 'username'
        },
        {
          title: '分组',
          align: 'center',
          key: 'groupName'
        },
        {
          title: '产品名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '销售价格',
          align: 'center',
          key: 'price'
        },
        {
          title: '产品图片',
          align: 'center',
          render: (h, params) => {
            return h('a', { style: { height: '60px', display: 'block', padding: '3px' }, domProps: { target: '_blank', href: this.oas.pathUpload + params.row.img } }, [h('img', { style: { maxWidth: '100%', height: '54px', display: 'block', margin: '0 auto' }, domProps: { src: this.oas.pathUpload + params.row.img } })])
          }
        },
        {
          title: '试吃时间',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.beginTasteTime),
              h('span', '-'),
              h('span', params.row.endTasteTime)
            ])
          }
        },
        {
          title: '试吃感受',
          align: 'center',
          key: 'feel'
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              params.row.canInfo === 1 && h('Button', {
                props: {
                  type: (params.row.infoStatus === 1) ? 'dashed' : 'primary',
                  size: 'small'
                },
                domProps: {
                  disabled: (params.row.infoStatus === 1)
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    this.notice(params.row.tastePersonId)
                  }
                }
              }, (params.row.infoStatus === 1) ? '已通知' : '通知'),
              params.row.canDelete === 1 && h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    this.delfei(params.row.tasteId, params.row.tastePersonId)
                  }
                }
              }, '作废'),
              params.row.canFell === 1 && h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    this.edit(params.row.tastePersonId, params.row.feel)
                  }
                }
              }, '试吃感受')
            ])
          }
        }
      ],
      productList: []
    }
  },
  mounted () {
    this.$store.commit('setTitle', '试吃人员列表')
    this.getClassListFormat()
    this.tasteGroupList()
    if (this.$route.params.keyword) {
      this.search.name = this.$route.params.keyword
    }
    if (this.$route.query.userId && this.$route.query.userName) {
      this.personel.pid = this.$route.query.userId
      this.personel.pname = this.$route.query.userName
    }
    this.ajaxlist()
  },
  computed: {
    ...mapState({
      classListFormat: state => state.Public.classListFormat
    })
  },
  methods: {
    ...mapActions(['getClass1', 'getClass2', 'getClassListFormat']),
    ajaxlist () {
      this.search.userId = (!this.personel.pid) ? '' : this.personel.pid
      this.search.class1Id = (!this.search.classname[0]) ? '' : this.search.classname[0]
      this.search.class2Id = (!this.search.classname[1]) ? '' : this.search.classname[1]
      this.oas.post('eat/tastePerson/list', this.search).then((e) => {
        if (e.state === 200) {
          this.total = e.data.total
          this.productList = e.data.list
        } else {
          this.$Message.error(e.msg)
        }
      })
      this.oas.post('eat/tastePerson/getTastePersonNum', this.search).then((e) => {
        if (e.state === 200) {
          this.peopleTotal = e.data
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    toexport () {
      var arr = []
      this.search.userId = (!this.personel.pid) ? '' : this.personel.pid
      this.search.class1Id = (!this.search.classname[0]) ? '' : this.search.classname[0]
      this.search.class2Id = (!this.search.classname[1]) ? '' : this.search.classname[1]
      var object = this.search
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          arr.push(key + '=' + object[key])
        }
      }
      window.open('/oas/eat/tastePerson/export?' + arr.join('&'))
    },
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    allselected (data) {
      this.ids = []
      for (var i = 0; i < data.length; i++) {
        this.ids.push(
          { 'id': data[i].tastePersonId }
        )
      }
    },
    searchList () {
      this.search.pageIndex = 1
      this.ajaxlist()
    },
    getlist (pageindex) {
      this.search.pageIndex = pageindex
      this.ajaxlist()
    },
    // 获取分组列表
    tasteGroupList () {
      this.oas.get('eat/tasteGroup/list', {}).then((e) => {
        if (e.state === 200) {
          this.groupList = e.data
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    delfei (tasteId, tastePersonId) {
      // this.$Modal.confirm({
      //     content:'确定作废这条数据吗？此操作无法恢复！',
      //     onOk:()=>{
      //         this.oas.get('eat/tastePerson/delete',{tasteId:tasteId,tastePersonId:tastePersonId}).then((e) => {
      //             if (e.state == 200) {
      //                 this.$Message.success('已作废');
      //                 this.searchList();
      //             } else {
      //                 this.$Message.error(e.msg);
      //             }
      //         })
      //     }
      // })
      this.hrConfirm(
        '提示',
        '确定作废这条数据吗？此操作无法恢复！',
        () => {
          this.oas.get('eat/tastePerson/delete', { tasteId: tasteId, tastePersonId: tastePersonId }).then((e) => {
            if (e.state === 200) {
              this.$Message.success('已作废')
              this.searchList()
            } else {
              this.$Message.error(e.msg)
            }
          })
        }
      )
    },
    addtr () {
      this.products.push({
        name: '',
        file: '',
        remark: ''
      })
    },
    deltr (index) {
      this.products.splice(index, 1)
    },
    add () {
      this.modelName = this.modelNameS[0]
      this.modaltodata = true
    },
    notice (id) {
      this.ids = [{ 'id': id }]
      this.informpeople()
    },
    informpeople () {
      this.oas.post('eat/tastePerson/inform', { ids: JSON.stringify(this.ids) }).then((e) => {
        if (e.state === 200) {
          this.$Message.success('已通知！')
          this.ajaxlist()
          this.ids = []
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    edit (id, feel) {
      this.modelName = this.modelNameS[1]
      this.eatlist = {}
      this.eatlist.feel = feel
      this.eatlist.tastePersonId = id
      if (!this.eatlist.feel) {
        this.eatlist.eatfeelstatus = 0
      } else {
        this.eatlist.eatfeelstatus = 1
      }
      this.modaltodata = true
    },
    del () {
      this.modaldelTryeat = true
    },
    addData () {
      this.oas.post('eat/tastePerson/feel', this.eatlist).then((e) => {
        if (e.state === 200) {
          this.modaltodata = false
          if (this.eatlist.eatfeelstatus === 0) {
            this.$Message.success('试吃感受添加成功！')
          } else {
            this.$Message.success('试吃感受修改成功！')
          }
          this.ajaxlist()
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    editData () {

    },
    wttryEat (name, id) {
      this.modalwttryEat = true
      this.modalwttryEatName = name
    },
    uploadCallback (name, url, index, list) {
      this.product.attachment = url
    }
  },
  components: { eatUpload, personnelFloat }
}
</script>
<style scoped>
.tryeatlist {
  padding: 10px;
}
.header {
  height: 50px;
  margin-bottom: 10px;
}
.txt {
  font-size: 1rem;
}
.search label {
  margin-right: 10px;
}
.tableList {
  margin: 20px auto;
}
.pages {
  padding-right: 10px;
  padding-bottom: 10px;
  min-height: 30px;
}
.pages > div {
  float: right;
}
.product_table {
  padding: 10px;
}
.product_table table {
  width: 100%;
  color: #495060;
  font-size: 12px;

  border-collapse: collapse;
}

.product_table tr {
  width: 100%;
}

.product_table th {
  min-width: 0;
  max-width: 300px;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  border: 1px solid #e9eaec;
  height: 40px;
  white-space: nowrap;
  background-color: #f8f8f9;
  text-align: center;
}

.product_table td {
  min-width: 0;
  box-sizing: border-box;
  vertical-align: middle;
  border: 1px solid #e9eaec;
  height: 40px;
  background-color: #fff;
  text-align: center;
  padding: 4 18px;
}
</style>

