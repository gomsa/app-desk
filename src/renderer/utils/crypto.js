/**
 * crypto.js 加密类
 */
const Bcrypt = require('bcrypt')
const bcrypt = {
  saltRounds: 10, // 生成salt的迭代次数
  hashSync: (password) => {
    const salt = Bcrypt.genSaltSync(bcrypt.saltRounds) // 随机生成salt
    return Bcrypt.hashSync(password, salt)
  },
  compareSync: (password, hash) => {
    return Bcrypt.compareSync(password, hash)
  }
}
export { bcrypt }
