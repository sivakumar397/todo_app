import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
//import Profile from '../views/Profile.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'

const routes = [
  //   { path: "/", redirect: "/login" },
  {
    path: '/homepage',
    name: 'HomePage',
    component: HomePage, // This is your home page component
  },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
