import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    }, {
        path: '/Home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        redirect: '/main/dashboard',
        children: [
            {
                path: '/main/dashboard',
                name: 'main_dashboard',
                component: () => import('@/views/main/Dashboard.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
