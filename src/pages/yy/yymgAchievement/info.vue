<template>
    <oaui3-template1>
        <div class="add-btn" slot="headerRight">
            <addModal v-if="add_qx" :taskId="id" :getInfo="getInfo"></addModal>
        </div>
        <Table :columns="columns1" :data="infoData"></Table>
        <div v-if="yymgEditFloat">
            <editModal :info="info" :cancelTop="cancel" :getInfo="getInfo"></editModal>
        </div>
    </oaui3-template1>
</template>

<script>
import editModal from '@/components/yy/yymg/editInfo'
import addModal from '@/components/yy/yymg/addInfo'
import ula from '@/components/yy/yymg/ula'

export default {
  components: { editModal, addModal, ula },
  data () {
    return {
      yymgEditFloat: false,
      id: this.$route.params.id,
      info: {
        score: 0,
        top_work_id: 0,
        work_id: 0,
        attachment: ''
      },
      columns1: [
        {
          title: '分类',
          key: 'top_work_name'
        },
        {
          title: '二级分类',
          key: 'work_name'
        },
        {
          title: '分数',
          key: 'score'
        },
        {
          title: '附件',
          render: (h, params) => {
            return h(ula, {
              props: {
                liData: [{ 'attachment': params.row.attachment, 'work_id': params.row.work_id }],
                text: 'attachment',
                index: params.index
              }
            })
          }
        },
        {
          title: '操作',
          render: (h, params) => {
            let conDOM = []
            let editDOM = h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.info = params.row
                  this.yymgEditFloat = true
                  this.$store.commit('yymgEditFloatSet', true)
                }
              }
            }, '修改')
            let delDOM = h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  if (!confirm('确认删除吗？')) {
                    return
                  }
                  this.oas.post('yymg/delWorkRecord', { work_record_ids: params.row.id }).then((e) => {
                    if (e.state === 200) {
                      this.$Message.success('删除成功！')
                      this.getInfo()
                    } else {
                      this.$Message.error(e.msg)
                    }
                  })
                }
              }
            }, '删除')
            if (this.edit_qx) {
              conDOM.push(editDOM)
            }
            if (this.del_qx) {
              conDOM.push(delDOM)
            }
            return h('div', conDOM)
          }
        }
      ],
      infoData: [],
      add_qx: false,
      edit_qx: false,
      del_qx: false
    }
  },
  created () {
    this.basejs.judgeQX('运营美工业绩提单_添加').then((e) => {
      if (e.state === 200) {
        this.add_qx = e.data
      }
    })
    this.basejs.judgeQX('运营美工业绩提单列表_修改').then((e) => {
      if (e.state === 200) {
        this.edit_qx = e.data
      }
    })
    this.basejs.judgeQX('运营美工业绩提单列表_删除').then((e) => {
      if (e.state === 200) {
        this.del_qx = e.data
      }
    })
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    cancel () {
      this.yymgEditFloat = false
    },
    getInfo () {
      this.oas.get('yymg/getTaskInfoById', { task_id: this.id }).then((e) => {
        if (e.state !== 200) { return }
        this.infoData = e.data.work_record
        this.$store.commit('setTitle', e.data.task_name)
      })
    }
  }
}
</script>

<style scoped>
.add-btn {
  text-align: center;
}
</style>
