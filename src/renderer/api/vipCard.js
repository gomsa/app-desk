import request from '@/utils/request'

export function Get(data) {
  return request({
    method: 'post',
    data: {
      service: 'old-sql-api',
      method: 'VipCard.Get',
      request: {
        pay: data
      }
    }
  })
}
