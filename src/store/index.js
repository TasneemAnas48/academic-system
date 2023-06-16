import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isCollapsed: false,
    url: "http://192.168.43.244:8000",
    name: '',
    email:'',
    token: '1|8D0SofUCrMi0KxBmlKkiHqy9P3xdNXgfmhjuJ1h8',
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
