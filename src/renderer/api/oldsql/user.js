import request from '@/utils/req'
import { bcrypt } from '@/utils/crypto'
import PosUser from '@/model/pos_user'

export function Sync() {
  getPosUser().then(users => {
    if (users) {
      syncPosUser(users)
    }
  })
}
// 远程数据库POS用户
function getPosUser() {
  // 异步请求
  return new Promise((resolve, reject) => {
    return request({
      method: 'post',
      data: {
        service: 'old-sql',
        method: 'SQLS.Query',
        request: {
          'SQL': `select UserCode, UserName, PassWd from tXsUser`
        }
      }
    }).then(response => {
      if (response.data.results) {
        const user = JSON.parse(response.data.results)
        resolve(user)
      }
    }).catch(error => {
      reject(error)
    })
  })
}

// syncPosUser 写入本地 posuser 数据库
async function syncPosUser(items) {
  for (let index = 0; index < items.length; index++) {
    const item = items[index]
    const user = {
      code: item.UserCode,
      name: item.UserName,
      password: bcrypt.hashSync(item.PassWd)
    }
    // 查询更新插入用户
    await PosUser.findOne({ where: { code: user.code }}).then(async project => {
      if (project) {
        // 如果用户存更新用户
        project.update(user)
      } else {
        // 创建用户 [等待用户常见完成在进入下个循环项目]
        await PosUser.create(user)
      }
    })
  }
}
