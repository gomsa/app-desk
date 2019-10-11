import axios from './req'
var ping = require('ping')
/**
 * navigator 设备情况
 */
/**
 * onLine 路由器状态
 * @returns {bool}
 */
export function onLine() {
  return navigator.onLine
}
/**
 * isInternet 互联网状态
 * @returns {bool}
 */
export function isInternet() {
  return ping.promise.probe(process.env.PING_IP)
}

/**
 * isServer 服务器状态
 * @returns {Promise}
 */
export function isServer() {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      data: {
        service: 'user-api',
        method: 'Health.Health',
        request: {}
      }
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
