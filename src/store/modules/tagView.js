const state = {
  visitedViews: []
}
const mutations = {
  addVisitedView(state, view) {
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-title'
      })
    )
  },
  deleteView(state, view) {
    for (const [index, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(index, 1)
      }
    }
  },
  updateView(state, view) {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations
}
