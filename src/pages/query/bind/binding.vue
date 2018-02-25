<template>
  <oaui3-template1>
    <div class="title">
      <h2>
        {{lists.name}}【账号：{{wwname}}】
        <!-- <Button type="primary" v-if="data.businessName" @click="showAddUser">主营行业（{{data.businessName}}）</Button> -->
        <Button type="primary" v-if="lists.categoryName" @click="setMainBusiness">主营行业（{{lists.categoryName}}）</Button>
        <Button type="primary" v-else @click="setMainBusiness">设置主营行业</Button>

        <setMainBusinessFloat :getList="getPhoneList" :aliAccountId="aliAccountId"></setMainBusinessFloat>
      </h2>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th width="200">手机</th>
            <th width="50">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Input v-model="phone"></Input>
            </td>
            <td>
              <Button @click="postBind" :loading="loading" type="primary">保存</Button>
            </td>
          </tr>
        </tbody>
      </table>

      <Table :columns="columns" :data="lists.phones" class="mar_t"></Table>
    </div>
  </oaui3-template1>
</template>

<script>
import setMainBusinessFloat from './setMainBusinessFloat.vue'
export default {
  components: { setMainBusinessFloat },
  data () {
    return {
      phone: '',
      aliAccountId: this.$route.query.aliAccountId,
      companyName: this.$route.query.customname,
      wwname: this.$route.query.wwname,
      errorInfo: '',
      loading: false,
      columns: [
        { title: '序号', width: '100', type: 'index', align: 'center', key: 'name' },
        {
          title: '手机',
          align: 'center',
          key: 'phone',
          render: (h, params) => {
            let wwzh = params.row.accounts == null ? '' : '【' + params.row.accounts + '】'
            return h('span', params.row.phone + wwzh)
          }
        },
        {
          title: '操作',
          width: '200',
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              domProps: {
                innerHTML: '删除'
              },
              props: {
                type: 'primary'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.del(params.row.phone)
                }
              }
            })
          }
        }
      ],
      lists: [],
      // 主营行业数据
      mainBusinessData: {
        businessId: 0,
        businessName: ''
      },
      isShow: false
    }
  },
  methods: {
    // 显示设置主营行业浮动层
    setMainBusiness () {
      this.$store.commit('setMainBusinessFloat', true)
    },
    /** 添加绑定 */
    postBind () {
      this.errorInfo = ''
      this.checkRule(this.phone, /^1\d{10}$/, '请输入正确的手机号')
      if (this.errorInfo !== '') {
        this.$Notice.error({ title: '错误提示', duration: 3, desc: this.errorInfo })
        return
      }
      this.oas.post('inquiry/mobile/insert', {
        aliAccountId: this.aliAccountId,
        companyName: this.companyName,
        aliAccount: this.wwname,
        phone: this.phone
      }).then(e => {
        if (e.state === 200) {
          this.$Message.success('您的手机号已经绑定成功！')
          this.loading = false
          this.phone = ''
          this.getPhoneList()
        } else {
          this.$Message.error(e.msg)
          this.loading = false
        }
      })
    },
    /**
      正则验证
      val 验证参数
      regu 验证规则
      error 错误提示
     */
    checkRule (val, regu, error) {
      let patt = new RegExp(regu)
      if (patt.test(val) === false) {
        this.errorInfo += error + '<br>'
      }
    },
    /** 列表删除 */
    del (val) {
      this.oas.get('inquiry/mobile/delete', {
        phone: val,
        aliAccount: this.wwname,
        companyName: this.companyName,
        aliAccountId: this.aliAccountId
      }).then(e => {
        if (e.state === 200) {
          this.$Message.success('删除成功！')
          this.getPhoneList()
        } else {
          this.$Message.error(e.msg)
        }
      })
    },
    /** 请求列表数据 */
    getPhoneList () {
      this.oas.get('inquiry/mobile/list', { aliAccountId: this.aliAccountId }).then(e => {
        if (e.state === 200) {
          this.lists = e.data
        } else {
          this.$Message.error(e.msg)
        }
      })
    }
  },
  created () {
    this.$store.commit('setTitle', '绑定手机')
    this.getPhoneList()
  }
}
</script>
<style>
.table {
  width: 300px;
  margin: 20px auto;
}
.title {
  text-align: center;
  padding: 20px 0px;
}

.mar_t {
  margin-top: 20px;
}
</style>
