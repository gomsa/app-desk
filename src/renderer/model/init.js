const Sequelize = require('sequelize')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
})

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.')
}).catch(err => {
  console.error('Unable to connect to the database:', err)
})
// 初始化数据模型
sequelize.sync({
  force: true
})
export default sequelize
