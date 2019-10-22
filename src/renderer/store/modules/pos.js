
const Store = require('electron-store')
const store = new Store()
const getmac = require('getmac')

const state = {
  terminal: store.get('terminal'), // 终端号
  macAddress: '' // mac 地址
}

const mutations = {
  CHANGE_POS_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
      store.set(key, value)
    }
  }
}

const actions = {
  changePosSetting({ commit }, data) {
    commit('CHANGE_POS_SETTING', data)
  }
}

getmac.getMac((err, macAddress) => {
  if (err) throw err
  state.macAddress = macAddress
})
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
