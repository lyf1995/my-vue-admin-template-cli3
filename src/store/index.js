import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'
import tagView from './modules/tagView'
import createLogger from 'vuex/dist/logger'

const modulesFiles = require.context('./modules', false, /.js$/)
const modules = {}
modulesFiles.keys().forEach(path => {
  const moduleName = path.split('/')[1]
  modules[moduleName] = modulesFiles(path).default
})
// console.log('modules', modules)

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission,
    tagView
  },
  getters
  // strict: debug
  // plugins: debug ? [createLogger()] : []
})

export default store
