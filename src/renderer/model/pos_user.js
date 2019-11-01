const Sequelize = require('sequelize')
import sequelize from './init'

// PosUser pos机本地用户
const PosUser = sequelize.define('pos_user', {
  code: { type: Sequelize.STRING, unique: true }, // 自编码
  name: Sequelize.STRING, // 终端编号
  password: Sequelize.STRING // 检查远程更新时间
}, {})
export default PosUser
