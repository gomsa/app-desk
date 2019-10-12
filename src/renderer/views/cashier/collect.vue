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
      @good="handerGood"
    />
    <foots
      ref="foots"
      @input="handerInput"
      :status="status"
      :total="total"
      :number="number"
      :good="good"
      :order="order"
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
      order: {
        id: '00101910060289'
      },
      goods: [],
      number: 0,
      total: 0.00,
      good: {},
      good11: {
        code: '0123456789123',
        barcode: '6123412345123',
        name: '可乐果粒橙',
        dep: '1024',
        // number: 100,
        price: 3526,
        subtotal: 1826
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
        this.number = 0
        let id = this.goods.length
        val.forEach(goods => {
          // 重新计算id
          goods.id = id
          id--
          // 计算总价或者数量
          if (!goods.subtotal) {
            goods.subtotal = goods.number * goods.price
          } else {
            goods.number = Math.round(goods.subtotal / goods.price * 100) / 100
          }
          // 计算总数量
          this.number = this.number + goods.number
          // 计算订单总价
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
      // 删除指定商品
      Mousetrap.bindGlobal('w', () => {
        if (this.goods.length > 0) {
          this.goods.splice(this.$refs.goods.currentRow, 1)
          const currentRow = this.$refs.goods.currentRow > 0 ? this.$refs.goods.currentRow - 1 : 0
          this.$refs.goods.resetCurrentRow(currentRow)
        }
      })
      // 清空商品
      Mousetrap.bindGlobal('q', () => {
        this.goods = []
      })
      // 退货
      Mousetrap.bindGlobal('t', () => {
        this.status = !this.status
      })
      // 现金结算
      Mousetrap.bindGlobal('x', () => {
        this.orderEnd()
      })
    },
    orderEnd() {
      console.log(this.order)
    },
    handerInput(value) {
      this.goods.unshift(JSON.parse(JSON.stringify(this.good11)))
      this.$refs.goods.resetCurrentRow() // 重置选中行
      this.$refs.foots.input = ''
    },
    handerGood(good) {
      this.good = good
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
