var zerorpc = require('zerorpc')
var client = new zerorpc.Client()
client.connect('tcp://127.0.0.1:1272')

export function Hello(params) {
  return new Promise((resolve, reject) => {
    client.invoke('Hello', params, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
}
