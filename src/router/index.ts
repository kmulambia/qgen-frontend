import { createRouter, createWebHistory } from 'vue-router'
import { Routes as AuthRoutes } from '@/router/authentication-routes'
import { Routes as AdminRoutes } from '@/router/admin-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/auth/login',
    },
    {
      path: '/auth',
      component: () => import('@/components/layouts/authentication/index-layout.vue'),
      children: AuthRoutes,
    },
    {
      path: '/admin',
      component: () => import('@/components/layouts/admin/index-layout.vue'),
      children: AdminRoutes,
    },
    // Public quotation view (no authentication required)
    {
      path: '/quotations/:id',
      name: 'public-quotation-view',
      component: () => import('@/views/quotations/public-view-page.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/403',
      name: 'forbidden',
      component: () => import('@/views/errors/403-error.vue'),
    },
    {
      path: '/500',
      name: 'server-error',
      component: () => import('@/views/errors/500-error.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/errors/404-error.vue'),
    },
  ],
})

export default router
