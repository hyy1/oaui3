<template>
  <ul class="yymg-ul">
      <li v-for="(item,index) in liData" :key="item.work_id"><a target="_blank" src="javascript:" @click="goPath(item[text])">附件{{index+1}}</a></li>
  </ul>
</template>
<script>
export default {
  props: {
    liData: {
      type: Array,
      default: []
    },
    text: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      pathUpload: this.oas.pathUpload
    }
  },
  methods: {
    goPath (path) {
      window.open(this.pathUpload + path)
    }
  }

}
</script>
<style scoped>
.yymg-ul li {
  height: 40px;
  line-height: 40px;
}
</style>
