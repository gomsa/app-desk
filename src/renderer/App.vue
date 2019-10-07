<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang="less">
@import "css/atom/syntax-variables.less";
//自动移滚动条样式
::-webkit-scrollbar{
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-thumb{
  border-radius: 1em;
  background-color: @syntax-wrap-guide-color;
}
::-webkit-scrollbar-track{
  border-radius: 1em;
  background-color: @syntax-background-color;
}
</style>
