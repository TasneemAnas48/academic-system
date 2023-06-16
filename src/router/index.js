import Vue from 'vue'
import VueRouter from 'vue-router'

import welcome from "@/views/Welcome.vue"
import SideView from "@/views/SideView.vue"
import DelistingList from "@/views/DelistingList.vue"

import Login from "@/views/Login/Login.vue"
import FirstRegister from "@/views/Login/FirstRegister.vue"
import SecondRegister from "@/views/Login/SecondRegister.vue"

import Dashboard from "@/views/Dashboard.vue"

import AddChild from "@/views/Child/Add.vue"
import ListChild from "@/views/Child/List.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: welcome
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
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
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/first-register',
    name: 'first-register',
    component: FirstRegister
  },
  {
    path: '/second-register',
    name: 'second-register',
    component: SecondRegister
  },
  {
    path: '/child/add',
    name: 'add-child',
    component: AddChild
  },
  {
    path: '/child/list',
    name: 'list-child',
    component: ListChild
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

router.beforeEach((to, from, next) => {
  const auth = localStorage.getItem("auth")
  console.log(auth)
  if ( (to.path != '/login' && to.path != '/first-register' && to.path != '/second-register' && auth == "false") || 
      (to.path != '/login' && to.path != '/first-register' && to.path != '/second-register'  && auth == null)) 
      next({ name: 'login' })
  else 
      next()
})