import oas from '../api/oas.js'
import cws from '../api/cws.js'
import store from '../store'

export default {
  // 判断权限
  judgeQX (name, action) {
    var promise = new Promise(function (resolve, reject) {
      oas.post('common/qx/isqx', {
        funStr: name
      }).then((e) => {
        if (e.state === 200) {
          if (action === 'page' && e.data === false) {
            // 跳到没有权限页面
            store.commit('setNoPermission', true)
          } else {
            resolve(e)
          }
        }
      })
    })
    return promise
  },
  // 获取人员列表
  getPersonnelList (class1, class2, keyword) {
    var promise = new Promise(function (resolve, reject) {
      oas.get('common/manage/list', { class1, class2, keyword }).then((e) => {
        if (e.state === 200) {
          resolve(e)
        }
      })
    })
    return promise
  },
  // 获取一级部门
  getClass1 (idStr) {
    var promise = new Promise(function (resolve, reject) {
      oas.get('common/class1/list', { idStr }).then((e) => {
        if (e.state === 200) {
          resolve(e)
        }
      })
    })
    return promise
  },
  // 获取二级部门列表
  getClass2 (class1Str, class2Str) {
    var promise = new Promise(function (resolve, reject) {
      oas.get('common/class2/list', { class1Str, class2Str }).then((e) => {
        if (e.state === 200) {
          resolve(e)
        }
      })
    })
    return promise
  },
  // 部门级联
  getClassListFormat (class1) {
    var promise = new Promise(function (resolve, reject) {
      cws.get('common/classCascade', class1).then((e) => {
        if (e.state === 200) {
          resolve(e)
        }
      })
    })
    return promise
  }
}
