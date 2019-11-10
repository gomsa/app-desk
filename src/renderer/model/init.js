
import path from 'path'
const fs = require('fs')
import { remote } from 'electron'

const dataPath = path.join(remote.app.getPath('exe'), '../database')
mkdirsSync(dataPath, 777)
// 递归创建目录 同步方法
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}
export default dataPath
