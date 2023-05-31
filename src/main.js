import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './scss/main.scss'

import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

Vue.use(VueSidebarMenu)

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'



// Import Bootstrap and BootstrapVue CSS files 
import 'bootstrap/dist/css/bootstrap.min.css'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)



import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

import i18n from './i18n';





Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
