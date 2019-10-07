<template>
  <div class="coliect-container">
    <goods
      ref="goods"
    />
    <div class="floor">
      123
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Goods from './components/goods.vue'
export default {
  components: { Goods },
  name: 'coliect',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    // 关闭打开头部
    this.toggleHeader(false)
    // 缩小侧栏
    this.closeSideBar()
  },
  methods: {
    toggleHeader(turn) {
      this.$store.dispatch('settings/changeSetting', { key: 'isHeader', value: turn })
    },
    closeSideBar() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: true })
    }
  },
  destroyed() {
    // 重新打开头部
    this.toggleHeader(true)
  }
}
</script>

<style lang="less" scoped>
@import "../../css/atom/syntax-variables.less";

// 定义相关样式
.coliect-container{
  background-color: @syntax-background-color;
  color: @syntax-text-color;
  height:100vh;
  padding: 1vw;
}
// 内容样式
.floor{
  width: 100%;
  bottom: 0;
  margin: 1vw;
}
</style>
