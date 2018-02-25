<template>
    <oaui3-template1>
        <div class="tryeatlist">
            <div class="header">
                <h2 style="float:left;height:30px;line-height:30px;">想吃产品列表</h2>
                <div style="float:left; margin-left:50px;">
                    <Button type="warning" icon="plus-round" @click="add">添加</Button>
                </div>
            </div>
            <div class="search">
                <label>
                    <span class="txt">关键词：</span>
                    <Input v-model="search.name" placeholder="请输入产品名称或关键词" style="width: 150px"></Input>
                </label>
                <label>
                    <span class="txt">添加人：</span>
                    <personnelFloat :text="'选择人员'" :title="'人员列表'"  :rebackData="personel" :changeData="{name: 'pname', id: 'pid'}"></personnelFloat>
                </label>
                <div style="display:inline-block;margin-right:5px;">
                    <span class="txt">所在部门：</span>
                    <Cascader :data="classListFormat" v-model="search.classname" style="width:150px;display:inline-block"></Cascader>
                </div>
                <label>
                    <span class="txt">添加时间：</span>
                    <DatePicker type="date" :value="search.beginAddtime" @on-change="search.beginAddtime=$event" placeholder="选择日期" style="width: 150px"></DatePicker>
                </label>
                <label>
                    <span class="txt" style="padding-right:10px;">-</span>
                    <DatePicker type="date" :value="search.endAddtime" @on-change="search.endAddtime=$event" placeholder="选择日期" style="width: 150px"></DatePicker>
                </label>
                <Button type="primary" icon="ios-search" style="margin-right:10px;" @click="searchList">查询</Button>
                <Button type="success" icon="document-text" v-on:click="toexport">导出</Button>
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
                <Modal v-model="modaltodata" width="700">
                    <p slot="header" style="color:#f60;text-align:center;font-size:18px">
                        <Icon type="information-circled"></Icon>
                        <span>{{modelName}}想吃产品</span>
                    </p>
                    <div class="product_table">
                        <Form :label-width="100" ref="form1" :model="wanttoeat" :rules="formValidates">
                            <FormItem label="产品信息：" prop="products">
                                <table>
                                    <thead>
                                        <tr>
                                            <th >序号</th>
                                            <th>产品名称</th>
                                            <th style="width:150px;">产品图片</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,index) in wanttoeat.products" :key="index">
                                            <td>{{index+1}}</td>
                                            <td>
                                                <Input v-model="item.name" placeholder="产品名称" style="width: 100px"></Input>
                                            </td>
                                            <td width="180px" style="line-height:40px;"><eat-upload :defaultList="item.defaultList" :multiple="false" :uploadCallback="uploadCallback" :index="index"></eat-upload></td>
                                            <td width="100px" ><Button @click="deltr(index)">-</Button></td>
                                        </tr>
                                        <tr>
                                            <td colspan="4"><Button @click="addtr()">+</Button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </FormItem>
                            <FormItem label="备注：" prop="remark">
                                <Input placeholder="请输入产品名称" v-model="wanttoeat.remark" type="textarea" :autosize="{minRows: 5}"></Input>
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
import { mapState, mapActions } from 'vuex'
import personnelFloat from '@/components/public/personnelFloat'
const _search = {
  name: '',
  beginAddtime: '',
  endAddtime: '',
  classname: [],
  class1Id: '',
  class2Id: '',
  userId: '',
  pageIndex: 1,
  pageSize: 10
}

const _wanttoeat = {
  products: [
    {
      name: '',
      file: '',
      defaultList: []
    }
  ],
  remark: ''
}

const validateProductsCheck = (rule, value, callback) => {
  if (value.length === 0) {
    callback(new Error('产品信息不能为空！'))
  }
  for (let i = 0; i < value.length; i++) {
    var fileName = value[i].name
    for (let j = 0; j < value.length; j++) {
      if (i !== j && (fileName === value[j].name)) {
        callback(new Error('第' + (i + 1) + '条和第' + (j + 1) + '条产品名称相同！'))
      }
    }

    if (!value[i].name && !value[i].file) {
      callback(new Error('请添加第' + (i + 1) + '条产品信息！'))
    } else if (!value[i].file) {
      callback(new Error('请添加第' + (i + 1) + '条产品图片！'))
    } else if (!value[i].name) {
      callback(new Error('请添加第' + (i + 1) + '条产品名称！'))
    } else {
      callback()
    }
  }
}

export default {
  data () {
    return {
      modaltodata: false,
      total: 0,
      search: JSON.parse(JSON.stringify(_search)),
      wanttoeat: JSON.parse(JSON.stringify(_wanttoeat)),
      modelName: '',
      modalwttryEatName: '',
      modelNameS: ['添加', '修改'],
      personel: { name: 'pname', id: 'pid' },
      formValidates: {
        products: [{ required: true, validator: validateProductsCheck, trigger: 'blur' }],
        remark: [{ max: 200, message: '备注不能超过200字', trigger: 'blur' }]
      },
      columns: [
        {
          title: '序号',
          align: 'center',
          width: 70,
          type: 'index'
        },
        {
          title: '添加人',
          align: 'center',
          key: 'username'
        },
        {
          title: '添加时间',
          align: 'center',
          key: 'addDatetime'
        },
        {
          title: '产品名称',
          align: 'center',
          render: (h, params) => {
            var eatInfo = params.row.eatInfo
            var arr = []
            for (var i = 0; i < eatInfo.length; i++) {
              arr.push(h('div', { style: { height: '60px', lineHeight: '60px' } }, eatInfo[i].name))
            }
            return h('div', arr)
          }
        },
        {
          title: '产品图片',
          align: 'center',
          width: 130,
          render: (h, params) => {
            var eatInfo = params.row.eatInfo
            var arr = []
            for (var i = 0; i < eatInfo.length; i++) {
              arr.push(h('a', { style: { height: '60px', display: 'block', padding: '3px' }, domProps: { target: '_blank', href: this.oas.pathUpload + eatInfo[i].img } }, [h('img', { style: { maxWidth: '100%', height: '54px', display: 'block', margin: '0 auto' }, domProps: { src: this.oas.pathUpload + eatInfo[i].img } })]))
            }
            return h('div', arr)
          }
        },
        {
          title: '备注',
          align: 'center',
          render: (h, params) => {
            var isopen = 0
            var remark = params.row.remark
            if (remark.length <= 10) {
              return h('div', remark)
            } else {
              return h('div', { style: { position: 'relative' } }, [
                h('span', remark.slice(0, 10)),
                h('a', {
                  style: { marginLeft: '5px' },
                  on: {
                    click: () => {
                      if (isopen) {
                        isopen = 0
                        document.getElementById('more' + params.index).style.display = 'none'
                      } else {
                        isopen = 1
                        document.getElementById('more' + params.index).style.display = 'block'
                      }
                    }
                  }
                }, '更多'), h('span', { domProps: { id: 'more' + params.index }, style: { position: 'absolute', bottom: '20px', right: '30px', display: 'none', border: '1px solid #ddd', textAlign: 'left', background: '#fff', borderRadius: '5px', padding: '5px' } }, remark)])
            }
          }
        },
        {
          title: '操作',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              params.row.canModify === 1 && h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
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
                on: {
                  click: () => {
                    this.delfei(params.row.id)
                  }
                }
              }, '作废')
            ])
          }
        }
      ],
      productList: []
    }
  },
  mounted () {
    this.$store.commit('setTitle', '想吃产品列表')
    this.ajaxlist()
    this.getClassListFormat()
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
      this.oas.post('eat/want/list', this.search).then((e) => {
        if (e.state === 200) {
          this.total = e.data.total
          this.productList = e.data.list
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    getlist (pageindex) {
      this.search.pageIndex = pageindex
      this.ajaxlist()
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
      window.open('/oas/eat/want/export?' + arr.join('&'))
    },
    addajax () {
      this.oas.post('eat/want/add', this.search).then((e) => {
        if (e.state === 200) {
          this.productList = e.data.list
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    searchList () {
      this.search.pageIndex = 1
      this.ajaxlist()
    },
    delfei (id) {
      // this.$Modal.confirm({
      //     content:'确定作废这条数据吗？此操作无法恢复！',
      //     onOk:()=>{
      // this.oas.get('eat/want/delete',{wantEatId:id}).then((e) => {
      //     if (e.state == 200) {
      //         this.$Message.success('已作废')
      //         this.searchList()
      //     } else {
      //         this.$Message.error(e.msg)
      //     }
      // })
      //     }
      // })
      this.hrConfirm(
        '提示',
        '确定作废这条数据吗？此操作无法恢复！',
        () => {
          this.oas.get('eat/want/delete', { wantEatId: id }).then((e) => {
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
      this.wanttoeat.products.push({
        name: '',
        file: ''
      })
    },
    deltr (index) {
      var id = this.wanttoeat.products[index].id
      if (id) {
        // this.$Modal.confirm({
        //     content:'确定删除该产品吗？此操作无法恢复！',
        //     onOk:()=>{this.delproduct(id,index)}
        //     })
        this.hrConfirm(
          '提示',
          '确定删除该产品吗？此操作无法恢复！',
          () => {
            this.delproduct(id, index)
          }
        )
      } else {
        this.wanttoeat.products.splice(index, 1)
      }
    },
    delproduct (id, index) {
      this.oas.get('eat/want/deleteInfo', { wantEatInfoId: id }).then((e) => {
        if (e.state === 200) {
          this.wanttoeat.products.splice(index, 1)
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    add () {
      this.wanttoeat = { products: [{ name: '', file: '', defaultList: [] }], remark: '' }
      this.modelName = this.modelNameS[0]
      this.modaltodata = true
    },
    edit (id) {
      this.numid = id
      this.wanttoeat = { products: [], remark: '' }
      this.modelName = this.modelNameS[1]
      this.oas.get('eat/want/modify', { wantEatId: id }).then((e) => {
        if (e.state === 200) {
          this.wanttoeat.remark = e.data.remark
          for (var i = 0; i < e.data.eatInfo.length; i++) {
            this.wanttoeat.products.push(
              { name: e.data.eatInfo[i].name, file: e.data.eatInfo[i].img, id: e.data.eatInfo[i].wantEatInfoId, defaultList: [{ name: e.data.eatInfo[i].img.slice(e.data.eatInfo[i].img.lastIndexOf('/') + 1), url: e.data.eatInfo[i].img }] }
            )
          }
          this.modaltodata = true
        } else {
          this.$Message.error(e.msg)
        }
      })
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
    addData () {
      this.oas.post('eat/want/add', { remark: this.wanttoeat.remark, products: JSON.stringify(this.wanttoeat.products) }).then((e) => {
        if (e.state === 200) {
          this.$Message.success('添加成功')
          this.modaltodata = false
          this.searchList()
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    editData (id) {
      this.oas.post('eat/want/modify', { wantEatId: id, remark: this.wanttoeat.remark, products: JSON.stringify(this.wanttoeat.products) }).then((e) => {
        if (e.state === 200) {
          this.$Message.success('修改成功')
          this.modaltodata = false
          this.ajaxlist()
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    wttryEat (name, id) {
      this.modalwttryEat = true
      this.modalwttryEatName = name
    },
    uploadCallback (name, url, index, list) {
      this.wanttoeat.products[index].file = url
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
<style>
.tryeatlist .tableList .ivu-table-cell,
.tryeatlist .tableList .ivu-table,
.tryeatlist .tableList .ivu-table-body {
  overflow: visible;
}
</style>
