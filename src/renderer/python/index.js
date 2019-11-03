// renderer.js
var zerorpc = require('zerorpc')
var client = new zerorpc.Client()
client.connect('tcp://127.0.0.1:7272')

export function api(method, value) {
  client.invoke(method, value, (error, res) => {
    if (error) {
      console.error(error)
    } else {
      console.log(res)
    }
  })
}
