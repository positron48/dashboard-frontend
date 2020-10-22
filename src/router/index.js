import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue')
  },
  {
    path: '/project/:id',
    name: 'Project',
    component: () => import('../views/Project.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
