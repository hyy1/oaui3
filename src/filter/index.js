import moment from 'moment'
import Vue from 'vue'

const format = (time, f) => {
  return time ? moment(time).format(f) : ''
}

const getValue = (key, obj) => {
  var val = ''
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].key === key) {
      val = obj[i].value
    }
  }
  return val
}

Vue.filter('format', format)
Vue.filter('getValue', getValue)
