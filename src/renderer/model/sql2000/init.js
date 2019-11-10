const Sequelize = require('sequelize')

const sequelize = new Sequelize('stmis1', 'sa', '123456', {
  dialect: 'mssql',
  host: '192.168.20.10',
  port: '1433',
  dialectOptions: {
    options: {
      tdsVersion: '7_1'
    }
  },
  logging: false
})

sequelize.authenticate().then((err) => {
  console.log('Connection sql2000 successful', err)
}).catch((err) => {
  console.log('Unable to connect to sql2000 database', err)
})

export default sequelize
