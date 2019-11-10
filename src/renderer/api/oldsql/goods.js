
import { List } from '@/model/sql2000/goods'
import { GetBarcodes } from '@/model/sql2000/barcode'
import { parseTime } from '@/utils'
import { Goods, BarCodes } from '@/model/goods'

export async function Sync() {
  // 整理查询时间
  let check_at = '2000-10-20 00:00:00'
  const number = 100// 每次同步商品数量
  const t = await getLastTime()
  if (t) {
    check_at = parseTime(t, '{y}-{m}-{d} {h}:{i}:{s}.{n}')
  }
  // check_at = '2000-10-20 00:00:00'
  List({ XgDate: check_at, number: number }).then(response => {
    if (response) {
      syncGoods(response)
    }
  })

  return check_at
}
// syncGoods 同步商品
async function syncGoods(items) {
  for (let index = 0; index < items.length; index++) {
    // 创建或更新
    Goods.upsert({
      plucode: items[index].PluCode,
      barcode: items[index].BarCode,
      check_at: items[index].XgDate,
      json: items[index]
    })
    // 获取条码信息准备同步
    GetBarcodes({ PluCode: items[index].PluCode }).then(response => {
      response.forEach(barcode => {
        BarCodes.upsert({
          plucode: barcode.PluCode,
          barcode: barcode.BarCode,
          json: barcode
        })
      })
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
