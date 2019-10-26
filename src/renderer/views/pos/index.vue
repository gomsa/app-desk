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
      :goods="order.goods"
      @currentGoods="handerCurrentGoods"
    />
    <foots
      ref="foots"
      @input="handerInput"
      :status="status"
      :goods="currentGoods"
      :order="order"
      :cacheAmount="cacheAmount"
    />
    <fixed
      ref="fixed"
      v-show="!orderStatus"
      :pays="order.pays"
    />
  </div>
</template>

<script>
import Mousetrap from './mousetrap'

import { mapGetters } from 'vuex'
import Heads from './components/heads.vue'
import Goods from './components/goods.vue'
import Foots from './components/foots.vue'
import Fixed from './components/fixed.vue'

import { Pay, Refund } from '@/api/pay'
import { Get as VipCardGet } from '@/api/vipCard'

import { Sync as SyncGoods } from '@/api/goods'

import Order from '@/model/order'

export default {
  components: { Heads, Goods, Foots, Fixed },
  name: 'coliect',
  data() {
    return {
      status: true, // 销售状态 销货 退货
      order: {
        userId: '0001',
        terminal: '0010',
        order_no: '00101910060289',
        goods: [],
        pays: [],
        type: 1,
        publish: false
      },
      orderStatus: true, // 允许下单
      pay: {
        type: 'vipCard', // 支付方式
        code: '', // 付款码、会员卡
        amount: 0.00, // 支付金额
        getCash: 0.00, // 收款
        order_no: '', // 微信支付指定订单单号
        status: false // 是否支付成功
      },
      cacheAmount: 0.00, // 缓存付款金额 会员卡、微信、支付宝
      currentGoods: {},
      // 当前选择商品
      good11: {
        code: '0123456789123',
        barcode: '6123412345123',
        name: '可乐果粒橙',
        dep: '1024',
        // number: 100,
        price: 3526,
        total: 1826
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
    SyncGoods()
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
    // 初始化 启用按键监听
    initMousetrap() {
      Mousetrap(this)
    },
    initOrder() {
      this.orderStatus = true
      this.order = {
        userId: '0001',
        terminal: '0010',
        order_no: '00101910060289',
        goods: [],
        pays: [],
        type: 1,
        publish: false
      }
    },
    initPay() {
      this.pay = {
        type: 'vipCard', // 支付方式
        code: '', // 付款码、会员卡
        amount: 0.00, // 支付金额
        getCash: 0.00, // 收款
        order_no: '', // 微信支付指定订单单号
        status: false // 是否支付成功
      }
    },
    handerVipCard(code) {
      console.log(VipCardGet)

      // 先查询余额
      // VipCardGet({ code, password }).then(() => {
      // }).catch(error => {
      //   console.log(error)
      // })
      const total = this.$refs.foots.total
      if (total) {
        // 进入 会员卡付款
        const amount = this.cacheAmount ? this.cacheAmount : total
        this.pay.code = code
        this.pay.type = 'vipCard'
        this.pay.amount = amount
        this.order.pays.push(this.pay)
        this.initPay()
        this.cacheAmount = 0
        if (total === 0) {
          this.endOrder()
        }
      } else {
        // 进入会员卡查询
      }
    },
    endOrder() {
      Order.create(this.order, {
        include: [Order.Goods, Order.Pays]
      }).then(jane => {
        console.log("Jane's auto-generated ID:", jane)
      }).catch(error => {
        console.error("Jane's auto-generated ERROR:", error)
      })

      console.log('打印', this.order)
      this.orderStatus = false // 改为订单完成状态
      // this.initOrder()
    },
    handerOrderPay(code) {
      // axios 远程请求付款
      const total = this.$refs.foots.total
      const amount = this.cacheAmount ? this.cacheAmount : total
      if (amount && total) {
        // 生成商户订单号 前面是订单流水id _ 后面是付款序号 (退款后面再加T)
        const order_no = this.order.order_no + '_' + this.order.pays.length
        // Pay({ code, amount, order_no }).then(() => {
        // }).catch(error => {
        //   console.log(error)
        // })
        console.log(Pay, order_no)
        const res = {}
        res.Valid = true
        res.Type = 'alipay'
        if (res.Valid) {
          this.pay.type = res.Type
          this.pay.amount = amount
          this.pay.order_no = order_no
          this.order.pays.push(this.pay)
          this.initPay()
          this.cacheAmount = 0
          if (total === 0) {
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
          message: '待付款金额不能为0'
        })
      }
    },
    // 第三方支付退款
    async payRefund() {
      this.order.pays.forEach((pay, index) => {
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
      this.order.pays = []
    },
    handerInput(value) {
      // 完成订单状态清空订单
      if (!this.orderStatus) {
        this.initOrder()
      }
      // 储值卡正则
      var regVipCard = /^((;)\d{20})$/
      // 16-30 进入付款流程
      var reg = /^(\d{16,30})$/
      if (regVipCard.test(value)) {
        this.handerVipCard(value)
        this.$refs.foots.input = ''
      } else if (reg.test(value)) {
        this.handerOrderPay(value)
        this.$refs.foots.input = ''
      } else if (value) {
        this.order.goods.unshift(JSON.parse(JSON.stringify(this.good11)))
        this.$refs.goods.resetCurrentRow() // 重置选中行
        this.$refs.foots.input = ''
      }
    },
    // 当前选择商品
    handerCurrentGoods(goods) {
      this.currentGoods = goods
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
