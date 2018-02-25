<template>
  <ul class="yymg-ul">
      <li v-for="(item,index) in liData" :key="item.work_id">{{item[text]}}</li>
  </ul>
</template>
<script>
export default {
  props: {
    liData: {
      type: Array,
      default: {}
    },
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped>
.yymg-ul li {
  height: 35px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
