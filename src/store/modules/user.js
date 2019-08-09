import { login, logout, selectUser } from '@/api/user.js'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  roles: [],
  permissions: [],
  userInfo: {},
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}
const actions = {
  // /** *********************************** 当登录接口仅返回token，且需要使用token来获取登录用户信息时 *********************************** **/
  // // user login
  // login({ commit }, loginInfo) {
  //   return new Promise((resolve, reject) => {
  //     login({
  //       userName: loginInfo.username.trim(),
  //       password: loginInfo.password
  //     })
  //       .then(response => {
  //         const { value } = response
  //         // commit('SET_TOKEN', data.token)
  //         // setToken(data)
  //         commit('SET_TOKEN', value.userName)
  //         setToken(value.userName)
  //         resolve()
  //       })
  //       .catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
  // // get user info by token
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     const params = {
  //       userName: state.token,
  //       name: '',
  //       roleName: '',
  //       curent: 1,
  //       size: 10000
  //     }
  //     selectUser(params)
  //       .then(data => {
  //         const { value } = data
  //         if (value.length === 0) {
  //           reject('Verification failed, please Login again.')
  //         }
  //         commit('SET_PERMISSIONS', ['测试'])
  //         commit('SET_USERINFO', value[0])
  //         resolve(value)
  //       })
  //       .catch(error => {
  //         reject(error)
  //       })
  //   })
  // },

  /** *********************************** end ********************************* **/

  /** *********************************** 当登录接口返回所有用户信息时 *********************************** **/
  // user login
  login({ commit }, loginInfo) {
    // return new Promise((resolve, reject) => {
    //   login({
    //     userName: loginInfo.username.trim(),
    //     password: loginInfo.password
    //   })
    //     .then(response => {
    //       const { value } = response
    //       commit('SET_TOKEN', JSON.stringify(value))
    //       setToken(JSON.stringify(value))
    //       resolve()
    //     })
    //     .catch(error => {
    //       reject(error)
    //     })
    // })
    // 测试用
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', JSON.stringify({ permissionList: [] }))
      setToken(JSON.stringify({ permissionList: [] }))
      resolve()
    })
  },
  // get user info by token
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const token = JSON.parse(state.token)
      // 测试用（因为现在的用户都还没有权限）
      token.permissionList = ['测试']
      if (token.permissionList.length > 0) {
        commit('SET_PERMISSIONS', token.permissionList)
        commit('SET_USERINFO', token)
        resolve(token)
      } else {
        reject('用户未登录或者用户无权限')
      }
    })
  },
  /** *********************************** end ********************************* **/

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({})
        .then(() => {
          commit('SET_TOKEN', '')
          removeToken()
          // resetRouter()
          resolve()
        })
        .catch(error => {
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
