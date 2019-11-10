import sequelize from './init'
import { trim } from '@/utils'

// 获取商品列表
export function GetBarcodes(replacements) {
  return new Promise((resolve, reject) => {
    sequelize.query(`select * from tbmMulBar  WHERE PluCode=:PluCode`,
      { replacements: replacements, type: sequelize.QueryTypes.SELECT }
    ).then(response => {
      response.forEach(items => {
        handerItem(items)
      })
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
// 删除字符串两边空格
function handerItem(items) {
  Object.keys(items).forEach(key => {
    if (typeof items[key] === 'string') {
      items[key] = trim(items[key])
    }
  })
}
