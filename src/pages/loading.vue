<template>
    <div class="loading">
      <Spin class="img">
        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
        <div>正在加载...</div>
      </Spin>
    </div>
</template>

<style scoped>
  .loading{
    position: fixed;
    top:0;
    left:45%;
    z-index:121;
    width: 10%;
    height: 10%;
    margin:10rem auto;
    background: rgba(0,0,0,0.3);
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }
  .loading .img{
    margin:1.5rem auto;
    color:#fff;
  }
</style>