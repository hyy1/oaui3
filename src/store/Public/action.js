import oas from '@/api/oas.js'
import cws from '@/api/cws.js'

export default {
  // 一级部门
  getClass1 ({ commit, state }, idStr) {
    oas.get('common/class1/list', { idStr }).then((e) => {
      commit('setClass1List', e.data)
    })
  },
  // 二级部门
  getClass2 ({ commit, state }, class1Str, class2Str) {
    oas.get('common/class2/list', { class1Str, class2Str }).then((e) => {
      commit('setClass2List', e.data)
    })
  },
  // 部门级联
  getClassListFormat ({ commit, state }, class1) {
    cws.get('common/classCascade', class1).then((e) => {
      commit('setClassListFormat', e.data)
    })
  },
  // 人员list
  getPersonnelList ({ commit, state }, class1, class2) {
    oas.get('common/manage/list', { class1, class2 }).then((e) => {
      commit('setPersonnelList', e.data)
    })
  },
  // 运营区域部门级联,参数对应部门id
  getAreaDepartmentFormatYY ({ commit, state }, area) {
    oas.get('common/class2/yyarea', { area }).then((e) => {
      commit('setAreaDepartmentFormatYY', e.data)
    })
  },
  // 获取省市级联数据
  getProvincialLeagueData ({ commit, state }) {
    oas.get('inquiry/area/list').then((e) => {
      commit('setProvincialLeagueData', e.data)
    })
  }
}
