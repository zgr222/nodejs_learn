import { createRouter, createWebHistory } from 'vue-router';

let routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home.vue')
  },
  {
    path: '/stu/list',
    name: 'stuList',
    component: () => import('@/views/stu/list.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/login/register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router