import { createRouter, createWebHistory } from 'vue-router'
import layout from '@/views/layout'

const BaseRoute = () => import('@/components/BaseRoute')

const routes = [
  {
    path: '/',
    component: layout,
    name: 'layout',
    children: [
      {
        path: '/',
        component: BaseRoute,
        meta: {
          navName: '首页',
          isMenu: true,
          id: 'fda3fdas'
        },
        children: [
          {
            name: 'Index',
            path: '/',
            component: () => import('@/views/index/index')
          },
          {
            name: 'Package',
            path: '/package/:name',
            component: () => import('@/views/package/package')
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
