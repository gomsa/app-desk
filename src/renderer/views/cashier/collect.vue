<template>
  <div 
    class="coliect-container"
    v-bind:class="[ status ? 'success' : 'danger']"
    @click="focus"
  >
    <heads
      ref="heads"
    />
    <goods
      ref="goods"
      :goods="goods"
    />
    <foots
      ref="foots"
      @input="handerInput"
      :status="status"
      :total="total"
    />
  </div>
</template>

<script>
const Mousetrap = require('mousetrap')
require('mousetrap/plugins/global-bind/mousetrap-global-bind')

import { mapGetters } from 'vuex'
import Heads from './components/heads.vue'
import Goods from './components/goods.vue'
import Foots from './components/foots.vue'

export default {
  components: { Heads, Goods, Foots },
  name: 'coliect',
  data() {
    return {
      status: true, // 销售状态 销货 退货
      goods: [],
      total: 0.00,
      good: {
        code: '0123456789123',
        name: '可乐果粒橙',
        // number: 13,
        price: 35.26,
        subtotal: 6000
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.initMousetrap()
    // 关闭打开头部
    this.toggleHeader(false)
    // 缩小侧栏
    this.closeSideBar()
  },
  mounted() {
    this.focus()
  },
  watch: {
    goods: {
      handler: function(val, oldVal) {
        this.total = 0
        val.forEach(goods => {
          if (!goods.subtotal) {
            goods.subtotal = goods.number * goods.price
          } else {
            goods.number = goods.subtotal / goods.price
          }
          this.total = this.total + goods.subtotal
        })
      },
      deep: true
    }
  },
  methods: {
    toggleHeader(turn) {
      this.$store.dispatch('settings/changeSetting', { key: 'isHeader', value: turn })
    },
    closeSideBar() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: true })
    },
    focus() {
      this.$refs.foots.focus()
    },
    initMousetrap() {
      Mousetrap.bindGlobal('f3', () => {
        this.focus()
      })
      Mousetrap.bindGlobal('up', () => {
        this.$refs.goods.handerCurrentRow(-1)
      })
      Mousetrap.bindGlobal('down', () => {
        this.$refs.goods.handerCurrentRow(+1)
      })
      // 修改指定商品数量
      Mousetrap.bindGlobal('a', () => {
        this.$refs.goods.setNumber(this.$refs.foots.input)
        this.$refs.foots.input = ''
      })
    },
    handerInput(value) {
      this.good.id = this.goods.length + 1
      this.goods.unshift(JSON.parse(JSON.stringify(this.good)))
      this.$refs.goods.resetCurrentRow() // 重置选中行
      this.$refs.foots.input = ''
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
.success{
  color: @syntax-text-color;
}
.danger{
  color: @el-danger;
}
</style>
