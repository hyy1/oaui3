<script>
export default {
  created () {
    this.oas.post('alinewcustomer2/getInfo', {
      id: this.$route.params.id
    }).then((e) => {
      if (e.state === 200) {
        (!e.data) ? window.history.go(-1) : window.location.href = e.data.aliUrl
      }
    })
  }
}
</script>