import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
console.log('printer')
const escpos = require('escpos')
console.log(escpos)
// Select the adapter based on your printer type
// const device = new escpos.USB()
// const device  = new escpos.Network('localhost');
const device = new escpos.Serial('LTP1')
console.log(device)
const options = { encoding: 'GB18030' /* default */ }
// encoding is optional
console.log(options)
const printer = new escpos.Printer(device, options)
console.log(printer)

device.open(function() {
  printer
    .font('a')
    .align('ct')
    .style('bu')
    .size(1, 1)
    .text('The quick brown fox jumps over the lazy dog')
    .text('敏捷的棕色狐狸跳过懒狗')
    .barcode('1234567', 'EAN8')
    .table(['One', 'Two', 'Three'])
    .tableCustom([
      { text: 'Left', align: 'LEFT', width: 0.33 },
      { text: 'Center', align: 'CENTER', width: 0.33 },
      { text: 'Right', align: 'RIGHT', width: 0.33 }
    ])
    .qrimage('https://github.com/song940/node-escpos', function(err) {
      console.log(err)
    })
})
