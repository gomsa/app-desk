// renderer.js
var zerorpc = require('zerorpc')
var client = new zerorpc.Client()
client.connect('tcp://127.0.0.1:4242')

export function Parallel(params) {
  return new Promise((resolve, reject) => {
    client.invoke('Parallel', params, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
}
