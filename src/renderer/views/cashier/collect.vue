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
      :total="order.total"
      :number="number"
      :good="good"
      :order="order"
      :cacheAmount="cacheAmount"
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

import { Pay, Refund } from '@/api/pay'
import { Get as VipCardGet } from '@/api/vipCard'

export default {
  components: { Heads, Goods, Foots },
  name: 'coliect',
  data() {
    return {
      status: true, // 销售状态 销货 退货
      order: {
        id: '00101910060289',
        goods: [],
        pay: [],
        total: 0.00
      },
      goods: [],
      number: 0,
      cacheAmount: 0.00, // 缓存付款金额 会员卡、微信、支付宝
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
        this.order.total = 0
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
          this.order.total = this.order.total + goods.subtotal
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
        this.setGoodsNumber()
      })
      // 删除指定商品
      Mousetrap.bindGlobal('w', () => {
        this.deleteGoods()
      })
      // 清空商品
      Mousetrap.bindGlobal('q', () => {
        this.emptyOrder()
      })
      // 退货
      Mousetrap.bindGlobal('t', () => {
        this.status = !this.status
      })
      // 现金结算
      Mousetrap.bindGlobal('x', () => {
        this.cashPay()
      })
      // 云付缓存 会员卡、微信、支付宝
      Mousetrap.bindGlobal('c', () => {
        this.cloudCache()
      })
    },
    handerVipCard(code) {
      console.log(VipCardGet)
      // 先查询余额
      // VipCardGet({ code, password }).then(() => {
      // }).catch(error => {
      //   console.log(error)
      // })
      if (this.order.total) {
        // 进入 会员卡付款
        const amount = this.cacheAmount ? this.cacheAmount : this.order.total
        this.order.total = this.order.total - amount
        this.order.pay.push({
          code,
          amount
        })
        this.cacheAmount = 0
        if (this.order.total === 0) {
          this.endOrder()
        }
      } else {
        // 进入会员卡查询
      }
    },
    endOrder() {
      this.order.goods = this.goods

      console.log(this.order)
    },
    // 现金结算
    cashPay() {
      // this.actualPay = Math.floor(this.$refs.foots.input * 100)
      // if (this.actualPay >= this.total || this.actualPay === 0) {
      //   this.orderEnd()
      // } else {
      //   this.$notify.error({
      //     title: '结算失败',
      //     message: '请输入足够的现金'
      //   })
      // }
    },
    handerOrderPay(code) {
      // axios 远程请求付款
      const amount = this.cacheAmount ? this.cacheAmount : this.order.total
      if (amount && this.order.total) {
        // 生成商户订单号 前面是订单流水id _ 后面是付款序号 (退款后面再加T)
        const order_id = this.order.id + '_' + this.order.pay.length
        // Pay({ code, amount,this.order.id }).then(() => {
        // }).catch(error => {
        //   console.log(error)
        // })
        console.log(Pay, order_id)
        const res = {}
        res.Valid = true
        if (res.Valid) {
          this.order.total = this.order.total - amount
          this.order.pay.push({
            code,
            amount,
            order_id
          })
          this.cacheAmount = 0
          if (this.order.total === 0) {
            this.endOrder()
          }
        } else {
          this.$message({
            type: 'error',
            message: '付款失败请重试'
          })
        }
      } else {
        this.$message({
          type: 'error',
          message: '付款金额不能为0'
        })
      }
    },
    // 云付缓存 会员卡、微信、支付宝
    cloudCache() {
      const amount = Math.floor(this.$refs.foots.input * 100)
      if (amount > this.order.total) {
        this.$refs.foots.input = ''
        this.$message({
          type: 'error',
          message: '缓存金额大于付款金额'
        })
      } else {
        if (amount) {
          this.cacheAmount = amount
          this.$message({
            type: 'success',
            message: '缓存金额:' + amount / 100 + '元'
          })
          this.$refs.foots.input = ''
        } else {
          this.$message({
            type: 'warning',
            message: '请输入缓存金额'
          })
        }
      }
    },
    // 设置商品数量
    setGoodsNumber() {
      const number = this.$refs.foots.input
      if (number && this.goods.length > 0) {
        this.$refs.goods.setNumber(number)
        this.$refs.foots.input = ''
        this.$message({
          type: 'success',
          message: '修改商品数量成功'
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请输入修改数量'
        })
      }
    },
    deleteGoods() {
      if (this.goods.length > 0) {
        this.goods.splice(this.$refs.goods.currentRow, 1)
        const currentRow = this.$refs.goods.currentRow > 0 ? this.$refs.goods.currentRow - 1 : 0
        this.$refs.goods.resetCurrentRow(currentRow)
        this.$message({
          type: 'success',
          message: '删除指定商品成功'
        })
      }
    },
    // 清空商品
    emptyOrder() {
      this.$confirm('此操作将情况全部商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.payRefund()
        if (this.order.pay.length === 0) {
          this.goods = []
          this.order.goods = []
          console.log(this.order)
          this.$message({
            type: 'success',
            message: '清空商品成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: '清空失败请重试'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消清空商品'
        })
      })
    },
    // 第三方支付退款
    async payRefund() {
      this.order.pay.forEach((pay, index) => {
        // 发起退款
        // await Refund({ pay.order_id }).then(() => {
        const res = {}
        res.Valid = true
        if (res.Valid) {
          console.log(Refund, pay, index)
        }
        // }).catch(error => {
        //   this.$message({
        //   type: 'error',
        //   message: '退款失败请重试'
        // })
        // })
        // refund(pay)
      })
      this.order.pay = []
    },
    orderEnd() {
      console.log('结算完成打印', this.order)
    },
    handerInput(value) {
      // 16-30 进入付款流程
      var reg = /^(\d{16,30})$/
      var regVipCard = /^((;)\d{20})$/
      if (regVipCard.test(value)) {
        this.handerVipCard(value)
        this.$refs.foots.input = ''
      } else if (reg.test(value)) {
        this.handerOrderPay(value)
        this.$refs.foots.input = ''
      } else if (value) {
        this.goods.unshift(JSON.parse(JSON.stringify(this.good11)))
        this.$refs.goods.resetCurrentRow() // 重置选中行
        this.$refs.foots.input = ''
      }
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
