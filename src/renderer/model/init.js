const Sequelize = require('sequelize')
import path from 'path'
import { remote } from 'electron'
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(remote.app.getPath('userData'), '/database.sqlite'),
  logging: false
  // timezone: '+08:00'
})

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.')
}).catch(err => {
  console.error('Unable to connect to the database:', err)
})
// 初始化数据模型
sequelize.sync({
  // force: true
})
export default sequelize
