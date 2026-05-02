import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/home.vue'
import NotFound from './views/not-found.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/:notFound(.*)', name: 'not-found', component: NotFound },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})
