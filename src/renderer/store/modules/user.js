import { Login, Logout } from '@/api/auth'
import { Info } from '@/api/user'

import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  username: '',
  name: '未设置别名',
  avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  roles: [],
  front_permits: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERNAME: (state, username) => {
    if (username) {
      state.username = username
    }
  },
  SET_NAME: (state, name) => {
    if (name) {
      state.name = name
    }
  },
  SET_AVATAR: (state, avatar) => {
    if (avatar) {
      state.avatar = avatar
    }
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_FRONT_PEIMITS: (state, front_permits) => {
    state.front_permits = front_permits
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      Login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      Info().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }
        // 用户相关信息设置
        const { username, name, avatar } = data.user
        commit('SET_NAME', name)
        commit('SET_USERNAME', username)
        commit('SET_AVATAR', avatar)
        // 角色相关信息设置
        let roles = ['user']
        if ('roles' in data) {
          roles = data.roles
        }
        commit('SET_ROLES', roles)
        // 前端权限相关设置
        let front_permits = []
        if ('front_permits' in data) {
          front_permits = data.front_permits
        }
        commit('SET_FRONT_PEIMITS', front_permits)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      Logout().then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
