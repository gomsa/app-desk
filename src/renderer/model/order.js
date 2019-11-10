const Sequelize = require('sequelize')
import path from 'path'
import dataPath from './init'
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(dataPath, '/order.sqlite'),
  logging: false
  // timezone: '+08:00'
})

sequelize.authenticate().then(() => {
  console.log('Connection order successfully.')
}).catch(err => {
  console.error('Unable to connect to the order database:', err)
})

// 订单
const Order = sequelize.define('order', {
  order_no: { type: Sequelize.STRING }, // 订单编号
  terminal: Sequelize.STRING, // 终端编号
  userId: Sequelize.STRING, // 用户ID
  type: Sequelize.STRING, // 订单样式 付款 退款等等
  //   should_money: DataTypes.STRING, // 应收金额
  //   pay_money: DataTypes.STRING, // 支付金额 一般指实付金额找零之前 比如 付款100 找零20  这里字段记录100
  total: Sequelize.STRING, // 成交金额
  publish: Sequelize.BOOLEAN // 是否发布到服务器
}, {})
// 订单商品
const Goods = sequelize.define('good', {
  code: Sequelize.STRING, // 订单编号
  barcode: Sequelize.STRING, // 终端编号
  name: Sequelize.STRING, // 用户ID
  dep: Sequelize.STRING, // 订单样式 付款 退款等等
  number: Sequelize.DECIMAL,
  price: Sequelize.INTEGER,
  total: Sequelize.INTEGER
}, {})
// 订单支付详情
const Pays = sequelize.define('pay', {
  type: Sequelize.STRING, // 支付方式
  code: Sequelize.STRING, // 会员卡号
  amount: Sequelize.INTEGER, // 支付金额
  getCash: Sequelize.INTEGER, // 收款金额
  order_no: Sequelize.STRING, // 第三方订单号
  status: Sequelize.BOOLEAN // 是否支付成功
}, {})
Order.Goods = Order.hasMany(Goods)
Order.Pays = Order.hasMany(Pays)
// 初始化数据模型
sequelize.sync({
  // force: true
})
export default Order
