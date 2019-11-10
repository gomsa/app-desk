import sequelize from './init'
import { trim } from '@/utils'

// // LIST_SQL_BAR  列表查询语句(状态启用商品) 返回 barcode
// const LIST_SQL_BAR = `
//     select top 10 a.*,
//     b.BarCode as b_BarCode ,b.PluCode as b_PluCode ,b.DepCode as b_DepCode ,b.PluName as b_PluName ,b.PluAbbrName as b_PluAbbrName ,b.ColorCode as b_ColorCode ,b.SizeCode as b_SizeCode ,b.Spec as b_Spec
//     from tBmPlu a LEFT JOIN tbmMulBar b ON a.PluCode = b.PluCode
//     WHERE a.XgDate>:XgDate AND (a.PluStatus=0 or a.PluStatus=1)
//     ORDER BY a.XgDate Asc
// `

// LIST_SQL  列表查询语句(状态启用商品)
const LIST_SQL = `
    select TOP :number *
    from tBmPlu 
    WHERE XgDate>:XgDate AND (PluStatus=0 or PluStatus=1)  
    ORDER BY XgDate Asc
`
// 获取商品列表
export function List(replacements) {
  return new Promise((resolve, reject) => {
    sequelize.query(LIST_SQL,
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
