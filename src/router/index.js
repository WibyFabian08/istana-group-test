import { createRouter, createWebHistory } from 'vue-router'

const LoginView = import('../views/Auth/Login.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
  ],
})

export default router
