
const Mousetrap = require('mousetrap')
require('mousetrap/plugins/global-bind/mousetrap-global-bind')

const hander = {
  // 输入框聚焦
  inputFoots(self) {
    self.focus()
  },
  // 选择行向上
  currentRowUp(self) {
    self.$refs.goods.handerCurrentRow(-1)
  },
  // 选择行向下
  currentRowDown(self) {
    self.$refs.goods.handerCurrentRow(+1)
  },
  // 设置商品数量
  goodsNumber(self) {
    const number = self.$refs.foots.input
    if (number) {
      if (self.order.goods.length > 0) {
        self.$refs.goods.setNumber(number)
        self.$refs.foots.input = ''
        self.$message({
          type: 'success',
          message: '修改商品数量成功'
        })
      } else {
        self.$message({
          type: 'error',
          message: '修改商品不存在'
        })
      }
    } else {
      self.$message({
        type: 'warning',
        message: '请输入修改数量'
      })
    }
  },
  // 删除指定商品
  deleteGoods(self) {
    self.$refs.goods.deleteGoods()
    self.$message({
      type: 'success',
      message: '删除指定商品成功'
    })
  },
  // 清空订单
  emptyOrder(self) {
    self.$confirm('此操作将情况全部商品, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 退款
      self.payRefund()
      if (self.order.pays.length === 0) {
        // 初始化订单数据
        self.initOrder()
        self.$message({
          type: 'success',
          message: '清空商品成功!'
        })
      } else {
        self.$message({
          type: 'error',
          message: '清空失败请重试'
        })
      }
    }).catch(() => {
      self.$message({
        type: 'info',
        message: '已取消清空商品'
      })
    })
  },
  // 销售状态 销货|退货
  salesStatus(self) {
    self.status = !self.status
  },
  // 支付缓存
  payCache(self) {
    if (!self.orderStatus) {
      self.$notify.warning({
        title: '订单已完结',
        message: '请录入新的商品再试'
      })
      return
    }
    let amount = Math.floor(self.$refs.foots.input * 100)
    const total = self.$refs.foots.total
    amount = (amount > total) ? total : amount
    if (amount) {
      self.cacheAmount = amount
      self.$message({
        type: 'success',
        message: '缓存金额:' + amount / 100 + '元'
      })
      self.$refs.foots.input = ''
    } else {
      self.$message({
        type: 'warning',
        message: '请输入缓存金额'
      })
    }
  },
  // 现金支付
  cashPay(self) {
    if (!self.orderStatus) {
      self.$notify.warning({
        title: '订单已完结',
        message: '请录入新的商品再试'
      })
      return
    }
    const input = Math.floor(self.$refs.foots.input * 100)
    const total = self.$refs.foots.total
    const getCash = input > 0 ? input : total
    self.$refs.foots.input = ''
    if (getCash >= total && total) {
      self.pay.type = 'cash'
      self.pay.amount = total
      self.pay.status = true
      self.pay.getCash = getCash
      self.order.pays.push(self.pay)
      self.initPay()
      self.endOrder()
    } else {
      self.$notify.error({
        title: '结算失败',
        message: '请输入足够的现金'
      })
    }
  }
}
// 按键配置 方法名:按键
const config = {
  inputFoots: 'f3',
  currentRowUp: 'up',
  currentRowDown: 'down',
  goodsNumber: 'a',
  deleteGoods: 'w',
  emptyOrder: 'q',
  salesStatus: 't',
  payCache: 'c',
  cashPay: 'x'

}
// 初始化 启用按键监听
function Init(self) {
  Object.keys(config).map(key => {
    Mousetrap.bindGlobal(config[key], () => {
      hander[key](self)
    })
  })
}
export default Init
