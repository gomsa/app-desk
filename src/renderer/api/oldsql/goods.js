import request from '@/utils/req'
import { parseTime } from '@/utils'
import { Goods, BarCodes } from '@/model/goods'
const number = 100// 每次同步商品数量

export async function Sync() {
  // 整理查询时间
  let check_at = '2000-10-20 00:00:00'
  const t = await getLastTime()
  if (t) {
    check_at = parseTime(t, '{y}-{m}-{d} {h}:{i}:{s}.{n}')
  }
  getGoods(check_at).then(goods => {
    if (goods) {
      syncGoods(goods)
    }
  })
  return check_at
}
// 远程数据库获取商品
function getGoods(check_at) {
  // 异步请求
  return new Promise((resolve, reject) => {
    return request({
      method: 'post',
      data: {
        service: 'old-sql',
        method: 'SQLS.Query',
        request: {
          'SQL': `select TOP ` + number + ` a.*,
          b.BarCode as b_BarCode ,b.PluCode as b_PluCode ,b.DepCode as b_DepCode ,b.PluName as b_PluName ,b.PluAbbrName as b_PluAbbrName ,b.ColorCode as b_ColorCode ,b.SizeCode as b_SizeCode ,b.Spec as b_Spec 
          from tBmPlu a LEFT JOIN tbmMulBar b ON a.PluCode = b.PluCode WHERE a.XgDate>'` + check_at + `' AND (a.PluStatus=0 or a.PluStatus=1)  ORDER BY a.XgDate Asc`
        }
      }
    }).then(response => {
      if (response.data.results) {
        const goods = JSON.parse(response.data.results)
        resolve(goods)
      }
    }).catch(error => {
      reject(error)
    })
  })
}
// syncGoods 同步商品
async function syncGoods(items) {
  for (let index = 0; index < items.length; index++) {
    const item = items[index]
    let include = []
    let bar_codes = []
    if (item.b_BarCode) {
      bar_codes = {
        code: item.b_PluCode,
        barcode: item.b_BarCode,
        json: {
          BarCode: item.b_BarCode,
          PluCode: item.b_PluCode,
          DepCode: item.b_DepCode,
          PluName: item.b_PluName,
          PluAbbrName: item.b_PluAbbrName,
          ColorCode: item.b_ColorCode,
          SizeCode: item.b_SizeCode,
          Spec: item.b_Spec
        }
      }
      // 使用关联数据库
      include = [Goods.BarCodes]
    }

    const goods = {
      code: item.PluCode,
      barcode: item.BarCode,
      check_at: item.XgDate,
      json: item,
      bar_codes: [bar_codes]
    }
    // 查询更新插入商品
    await Goods.findOne({ where: { code: item.PluCode }}).then(async project => {
      if (project) {
        // 如果商品存更新商品
        project.update(goods)
        // 是否插入更新条码
        if (item.b_BarCode) {
          BarCodes.findOne({ where: { barcode: item.b_BarCode }}).then(barcode => {
            if (barcode) {
              // 如果条码存在更新条码
              bar_codes.goodId = project.id
              barcode.update(bar_codes)
            } else {
              // 常见条码商品
              bar_codes.goodId = project.id
              BarCodes.create(bar_codes)
            }
          })
        }
      } else {
        // 创建商品 [等待商品常见完成在进入下个循环项目]
        await Goods.create(goods, {
          include: include
        })
      }
    })
  }
}
// getLastTime 获取商品最后的更新时间
async function getLastTime() {
  let check_at
  await Goods.findOne({
    attributes: ['check_at'],
    order: [
      // 时间倒序 然后 id 倒序
      ['check_at', 'DESC'],
      ['id', 'DESC']
    ]
  }).then(goods => {
    if (goods) {
      check_at = goods.get('check_at')
    }
  })
  return check_at
}
