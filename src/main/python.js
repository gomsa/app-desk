'use strict'
import { app } from 'electron'
// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。

const path = require('path')

let pyProc = null

const createPyProc = () => {
  const port = '1272'

  const script = path.resolve('src/python', 'api.py')
  console.log(script)

  pyProc = require('child_process').spawn('python', [script, port])
  if (pyProc != null) {
    console.log('child process success')
  }
}

const exitPyProc = () => {
  pyProc.kill()
  pyProc = null
}

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)
