import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    userName: '',
    /* 导航菜单是否折叠 */
    isSidebarNavCollapse: false,
    /* 面包屑导航列表 */
    crumbList: ['房源管理', '日志管理'],
    // 管理员u_name
    adminName: ''
  },
  mutations: {
    setUserName(state, uname) {
      state.userName = uname
    },
    toggleNavCollapse(state) {
      state.isSidebarNavCollapse = !state.isSidebarNavCollapse
    },
    // 管理员u_name
    setAdminName(state, u_name) {
      state.adminName = u_name
    },
  },
  actions: {

  }
})