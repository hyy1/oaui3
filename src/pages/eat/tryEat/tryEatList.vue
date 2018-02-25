<template>
  <oaui3-template1>
      <div class="tryeatlist">
          <div class="header">
              <h2 style="float:left;height:30px;line-height:30px;">试吃产品列表</h2>
              <div style="float:left; margin-left:50px;">
                  <Button type="warning" icon="plus-round" @click="add">添加</Button>
              </div>
          </div>
          <div class="search">
              <label>
                  <span class="txt">产品名称：</span>
                  <Input v-model="search.name" placeholder="请输入产品名称" style="width: 150px"></Input>
              </label>
              <label>
                  <span class="txt">选择分组：</span>
                  <Select v-model="search.tasteGroupId" clearable style="width:150px">
                      <Option v-for="item in groupList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
              </label>
              <label>
                  <span class="txt">试吃时间：</span>
                  <DatePicker type="date" :value="search.tasteBeginTime" @on-change="search.tasteBeginTime=$event" placeholder="选择日期" style="width: 150px"></DatePicker>
              </label>
              <label>
                  <span class="txt" style="padding-right:10px;">至</span>
                  <DatePicker type="date" :value="search.tasteEndTime" @on-change="search.tasteEndTime=$event" placeholder="选择日期" style="width: 150px"></DatePicker>
              </label>
              <Button type="primary" icon="ios-search" style="margin-right:10px;" @click="searchList">查询</Button>
              <Button type="success" icon="document-text" @click="toexport">导出</Button>
          </div>
          <div class="tableList">
              <Table border :columns="columns" :data="productList"></Table>
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
                      <span>{{modelName}}试吃产品</span>
                  </p>
                  <div>
                      <Form :label-width="80" ref="form1" :model="product" :rules="formValidates">
                          <FormItem label="分组" prop="tasteGroupId">
                              <Select v-model="product.tasteGroupId" style="width:150px">
                                  <Option v-for="item in groupList" :value="item.id" :key="item.id">
                                      {{ item.name }}
                                      <a style="float:right" @click="delTasteGroupName(item.id)"><Icon type="close-round"></Icon></a>
                                  </Option>
                                  <div style="margin-top:5px;">
                                      <Input v-model="tasteGroupName" icon="ios-plus-outline" @on-click="addTasteGroupName" placeholder="添加分组"></Input>
                                  </div>
                              </Select>
                          </FormItem>
                          <FormItem label="产品名称" prop="name">
                              <Input placeholder="请输入产品名称" v-model="product.name" style="width: 300px"></Input>
                          </FormItem>
                          <FormItem label="销售价格" prop="price">
                              <InputNumber style="width: 150px" :min="0" :max="100000000" placeholder="请输入销售价格" :step="0.5" v-model="product.price"></InputNumber><span style="margin-left:5px;">元</span>
            
                          </FormItem>
                          <FormItem label="产品图片" prop="img">
                              <eat-upload :defaultList="defaultList" :multiple="false" :uploadCallback="uploadCallback"></eat-upload>
                          </FormItem>
                          <FormItem label="开始时间" prop="beginTasteTime">
                              <DatePicker type="date"  placeholder="请输入试吃开始时间" :value="product.beginTasteTime" @on-change="product.beginTasteTime = $event" style="width: 150px"></DatePicker>
                          </FormItem>
                          <FormItem label="结束时间" prop="endTasteTime">
                              <DatePicker type="date"  placeholder="请输入试吃结束时间" :value="product.endTasteTime" @on-change="product.endTasteTime = $event" style="width: 150px"></DatePicker>
                          </FormItem>
                      </Form>
                  </div>
                    <div slot="footer" style="text-align:center">
                        <Button type="primary" @click="showtodata('form1')">确定</Button>
                        <Button type="error" @click="modaltodata=false">取消</Button>
                    </div>
              </Modal>
          </div>
      </div>
  </oaui3-template1>
</template>
<script>
import eatUpload from '@/components/public/upload'
const _search = {
  name: '',
  tasteGroupId: '',
  tasteBeginTime: '',
  tasteEndTime: '',
  pageIndex: 1,
  pageSize: 10
}

const _product = {
  beginTasteTime: '',
  endTasteTime: '',
  id: '',
  img: '',
  name: '',
  price: 0,
  tasteGroupId: ''
}

const validatePriceCheck = (rule, value, callback) => {
  var stringValue = value.toString()
  if (!value || value === 0) {
    callback(new Error('请输入价格！'))
  } else if (stringValue.indexOf('.') > 0 && stringValue.slice(stringValue.indexOf('.') + 1) > 100) {
    callback(new Error('最多输入两位小数！'))
  } else {
    callback()
  }
}

const validatetasteGroupIdCheck = (rule, value, callback) => {
  if (!value || value === 0) {
    callback(new Error('请选择分组！'))
  } else {
    callback()
  }
}

export default {
  data () {
    return {
      numid: 0,
      total: 0,
      isshow: false,
      modaltodata: false,
      search: JSON.parse(JSON.stringify(_search)),
      product: JSON.parse(JSON.stringify(_product)),
      tasteGroupName: '',
      modelName: '',
      modelNameS: ['添加', '修改'],
      groupList: [],
      productList: [],
      defaultList: [],
      formValidates: {
        tasteGroupId: [{ required: true, validator: validatetasteGroupIdCheck, trigger: 'change' }],
        name: [{ required: true, min: 1, max: 50, message: '产品名称输入有误', trigger: 'blur' }],
        price: [{ required: true, validator: validatePriceCheck, trigger: 'blur' }],
        img: [{ required: true, message: '上传图片不能为空', trigger: 'blur' }],
        beginTasteTime: [{ required: true, message: '试吃开始时间不能为空', trigger: 'blur' }],
        endTasteTime: [{ required: true, message: '试吃结束时间不能为空', trigger: 'blur' }]
      },
      columns: [
        {
          title: '序号',
          align: 'center',
          width: 70,
          type: 'index'
        },
        {
          title: '分组',
          align: 'center',
          width: 150,
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
          width: 150,
          render: (h, params) => {
            return h('span', params.row.price + '元')
          }
        },
        {
          title: '试吃人数',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.$router.push({
                    name: 'tryEatPeople',
                    params: {
                      keyword: params.row.name
                    }
                  })
                }
              }
            }, params.row.tastePersonNum + '人')
          }
        },
        {
          title: '产品图片',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('a', { style: { height: '60px', display: 'block', padding: '3px' }, domProps: { target: '_blank', href: this.oas.pathUpload + params.row.img } }, [h('img', { style: { maxWidth: '100%', height: '54px', display: 'block', margin: '0 auto' }, domProps: { src: this.oas.pathUpload + params.row.img } })])
          }
        },
        {
          title: '试吃时间',
          align: 'center',
          width: 180,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.beginTasteTime),
              h('span', ' - '),
              h('span', params.row.endTasteTime)
            ])
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              params.row.canTaste === 1 && h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    this.wttryEat(params.row.name, params.row.id)
                  }
                }
              }, '试吃'),
              params.row.canModify === 1 && h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  margin: '5px'
                },
                on: {
                  click: () => {
                    this.edit(params.row.id)
                  }
                }
              }, '修改'),
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
                    this.delfei(params.row.id)
                  }
                }
              }, '作废')
            ])
          }
        }
      ]
    }
  },
  mounted () {
    this.$store.commit('setTitle', '试吃产品列表')
    this.tasteGroupList()
    this.ajaxlist()
  },
  methods: {
    //   试吃产品录入
    add () {
      this.product = { beginTasteTime: '', endTasteTime: '', id: '', img: '', name: '', price: 0, tasteGroupId: '' }
      this.modelName = this.modelNameS[0]
      this.defaultList = []
      this.modaltodata = true
      this.isshow = false
    },
    //   查询
    searchList () {
      this.search.pageIndex = 1
      this.ajaxlist()
    },
    //   获取试吃产品列表
    ajaxlist () {
      this.oas.post('eat/foretaste/list', this.search).then((e) => {
        if (e.state === 200) {
          this.total = e.data.total
          this.productList = e.data.list
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    //   获取分组列表
    tasteGroupList () {
      this.oas.get('eat/tasteGroup/list', {}).then((e) => {
        if (e.state === 200) {
          this.groupList = e.data
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    //   添加分组选项
    addTasteGroupName () {
      this.oas.get('eat/tasteGroup/add', { name: this.tasteGroupName }).then((e) => {
        if (e.state === 200) {
          this.tasteGroupName = ''
          this.tasteGroupList()
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    delTasteGroupName (id) {
      this.oas.get('eat/tasteGroup/delete', { id: id }).then((e) => {
        if (e.state === 200) {
          this.tasteGroupList()
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    //   分页请求
    getlist (pageindex) {
      this.search.pageIndex = pageindex
      this.ajaxlist()
    },
    showtodata (name) {
      this.$refs[name].validate((valid) => {
        if (!valid) { return }
        if (this.modelName === this.modelNameS[0]) {
          this.addData()
        }
        if (this.modelName === this.modelNameS[1]) {
          this.editData(this.numid)
        }
      })
    },
    //   试吃
    wttryEat (name, id) {
      //   this.$Modal.confirm({
      //       content:'是否确定试吃此产品？<span style='color:red'>['+name+']</span>',
      //       onOk:()=>{
      //           this.oas.get('eat/foretaste/wangTaste',{tasteId:id}).then((e) => {
      //               if (e.state == 200) {
      //                   this.$Message.success('试吃申请成功！')
      //                   this.ajaxlist()
      //               } else {
      //                   this.$Message.error(e.msg)
      //               }
      //           })
      //       }
      //   })
      this.hrConfirm(
        '提示',
        '是否确定试吃此产品？<span style="color:red">[' + name + ']</span>',
        () => {
          this.oas.get('eat/foretaste/wangTaste', { tasteId: id }).then((e) => {
            if (e.state === 200) {
              this.$Message.success('试吃申请成功！')
              this.ajaxlist()
            } else {
              this.$Message.error(e.msg)
            }
          })
        }
      )
    },
    //   修改
    edit (id) {
      this.numid = id
      this.product = { beginTasteTime: '', endTasteTime: '', id: '', img: '', name: '', price: 0, tasteGroupId: '' }
      this.oas.get('eat/foretaste/modify', { tasteId: id }).then((e) => {
        if (e.state === 200) {
          this.product = e.data
          this.modelName = this.modelNameS[1]
          this.modaltodata = true
          this.defaultList = [{ name: e.data.img, url: e.data.img }]
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    //   作废
    delfei (id) {
      //   this.$Modal.confirm({
      //       content:'确定作废这条数据吗？此操作无法恢复！',
      //       onOk:()=>{
      //           this.oas.get('eat/foretaste/delete',{tasteId:id}).then((e) => {
      //               if (e.state == 200) {
      //                   this.$Message.success('已作废')
      //                   this.searchList()
      //               } else {
      //                   this.$Message.error(e.msg)
      //               }
      //           })
      //       }
      //   })
      this.hrConfirm(
        '提示',
        '确定作废这条数据吗？此操作无法恢复！',
        () => {
          this.oas.get('eat/foretaste/delete', { tasteId: id }).then((e) => {
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
    //   添加产品
    addData () {
      this.oas.post('eat/foretaste/add', this.product).then((e) => {
        if (e.state === 200) {
          this.$Message.success('试吃产品录入成功！')
          this.modaltodata = false
          this.ajaxlist()
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    //   修改产品
    editData (id) {
      this.oas.post('eat/foretaste/modify', this.product).then((e) => {
        if (e.state === 200) {
          this.$Message.success('试吃产品修改成功')
          this.modaltodata = false
          this.ajaxlist()
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    //   导出
    toexport () {
      var url = '/oas/eat/foretaste/export?'
      var arr = []
      var object = this.search
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          arr.push(key + '=' + object[key])
        }
      }
      window.open(url + arr.join('&'))
    },
    //   上传成功时的回调
    uploadCallback (name, url, index, list) {
      this.product.img = url
    }
  },
  components: { eatUpload }
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
</style>
