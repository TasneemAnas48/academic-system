import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isCollapsed: false,
    url: "http://192.168.137.91:8000",
    name: '',
    email:'',
    token: '1|PE7OPkRqCfyO6Ws5AbQMLfDOcSiIOE9I8cDxEhRA',
    user_id: '1'
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
