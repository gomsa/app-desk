const Sequelize = require('sequelize')
import sequelize from './init'

// 商品
const Goods = sequelize.define('good', {
  plucode: { type: Sequelize.STRING, unique: true }, // PLU码 自编码
  barcode: { type: Sequelize.STRING }, // 终端编号
  check_at: Sequelize.DATE, // 检查远程更新时间
  json: Sequelize.JSON // 商品 json 数据集
}, {})
// barcode 多条码
const BarCodes = sequelize.define('bar_code', {
  plucode: { type: Sequelize.STRING }, // 自编码
  barcode: { type: Sequelize.STRING, unique: true }, // 终端编号
  json: Sequelize.JSON // 商品 json 数据集
}, {})
Goods.BarCodes = Goods.hasMany(BarCodes)
BarCodes.Goods = BarCodes.belongsTo(Goods)
export { Goods, BarCodes }
