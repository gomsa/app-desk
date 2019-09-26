// renderer.js
var zerorpc = require('zerorpc')
var client = new zerorpc.Client()
client.connect('tcp://127.0.0.1:7272')

const name = document.querySelector('#name')
const result = document.querySelector('#result')
name.addEventListener('input', () => {
  client.invoke('hello', name.value, (error, res) => {
    if (error) {
      console.error(error)
    } else {
      result.textContent = res
    }
  })
})
name.dispatchEvent(new Event('input'))
