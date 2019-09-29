'use strict'

import { app } from 'electron'
const path = require('path')
let pyProc = null

const createPyProc = () => {
  const port = '4242'
  const script = path.join(__dirname, '../python', 'api.py')
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
