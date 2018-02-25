<template>
  <div>
    <Tooltip :placement="placement" v-if="isShow">
      <span style="cursor: pointer;">{{con}}</span>
      <div slot="content" style="white-space: normal;">
          {{content}}
      </div>
    </Tooltip>
    <span v-else>{{con}}</span>
  </div>
</template>

<script>

export default {
  props: {
    content: {
      type: String,
      default: function () {
        return ''
      }
    },
    length: {
      type: Number,
      default: function () {
        return 0
      }
    },
    placement: {
      type: String,
      default: function () {
        return 'top'
      }
    }
  },
  data () {
    return {
      isShow: false
    }
  },
  computed: {
    con () {
      if (this.content.length < this.length) {
        return this.content
      } else {
        this.isShow = true
        return this.content.substr(0, this.length) + '...'
      }
    }
  }
}
</script>

<style scoped>

</style>
