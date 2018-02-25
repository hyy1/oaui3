<template>
    <div class="layout">
        <div class="layout-ceiling box space-between">
            <div class="layout-ceiling-left">
                <slot name="headerLeft"></slot>
            </div>
            <div class="layout-ceiling-title">
                {{pageTitle}}
            </div>
            <div class="layout-ceiling-right">
                <slot name="headerRight"></slot>
            </div>
        </div>
        <div class="layout-main">
            <slot></slot>
        </div>
        <div class="layout-copy">
            2017 &copy;杭州四喜
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      pageTitle: state => state.Public.pageTitle
    })
  }
}
</script>

<style scoped>
.layout {
  border: 1px solid #418bca;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  width: 99%;
  margin: 0 auto;
  margin-bottom: 20px;
}

.layout-main {
  background: #fff;
  min-height: 400px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.layout-copy {
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
}

.layout-ceiling {
  background: #418bca;
  padding: 10px 10px;
  overflow: hidden;
}

.layout-ceiling-title {
  text-align: center;
  color: #fff;
  font-size: 20px;
}

/*.layout-ceiling-main a{
        color: #9ba7b5;
    }*/
</style>
