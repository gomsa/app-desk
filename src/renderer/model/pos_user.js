const Sequelize = require('sequelize')
import path from 'path'
import dataPath from './init'
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(dataPath, '/pos_user.sqlite'),
  logging: false
  // timezone: '+08:00'
})

sequelize.authenticate().then(() => {
  console.log('Connection pos_user successfully.')
}).catch(err => {
  console.error('Unable to connect to the pos_user database:', err)
})

// PosUser pos机本地用户
const PosUser = sequelize.define('pos_user', {
  code: { type: Sequelize.STRING, unique: true }, // 自编码
  name: Sequelize.STRING, // 终端编号
  password: Sequelize.STRING // 检查远程更新时间
}, {})
// 初始化数据模型
sequelize.sync({
  // force: true
})
export default PosUser
