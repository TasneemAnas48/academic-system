import Vue from 'vue'
import VueRouter from 'vue-router'

import welcome from "@/views/Welcome.vue"
import SideView from "@/views/SideView.vue"
import DelistingList from "@/views/DelistingList.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: welcome
  },
  {
    path: '/side-view',
    name: 'side-view',
    component: SideView
  },
  {
    path: '/delisting-list',
    name: 'delisting-list',
    component: DelistingList
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
