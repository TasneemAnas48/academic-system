import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isCollapsed: false,
    url: "http://127.0.0.1:8002",
    ass_url: "http://127.0.0.1:8001",
    ass_url_front: "http://192.168.43.244:8080",
    name: '',
    email:'',
    token: '1|axtrFl4GNdbAnlpCK4rHeOANKMgPlpIscXfX4SdU',
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
