import { createRouter, createWebHistory } from 'vue-router'
// 1. 定义一些路由
// 每个路由都需要映射到一个组件。
const routes = [
    { path: '/', component: () => import('../components/login.vue') },
    { path: '/enroll', component: () => import('../components/enroll.vue') },
    { path: '/home/:id', component: () => import('../pages/home.vue') ,props:true,
        meta: {isAuth: true,infor: true},//用于判断是否需要鉴权
        children:[
            { path: '/review/:id', component: () => import('../pages/Review/review.vue'),props:true },
            { path: '/reviewed1/:id', component: () => import('../pages/Review/reviewed.vue') ,props:true},
            { path: '/unreviewed1/:id', component: () => import('../pages/Review/unreviewed.vue'),props:true },
            { path: '/unreviewed2/:id', component: () => import('../pages/Review/unreviewed2.vue'),props:true },

            { path: '/submission/:id', component: () => import('../pages/Submission/submission.vue'),props:true },
            { path: '', component: () => import('../pages/Submission/notice.vue') ,props:true},
            { path: '/manuscript/:id', component: () => import('../pages/Submission/manuscript.vue'),props:true },
            { path: '/thesis/:id', component: () => import('../pages/Submission/thesis.vue'),props:true },

            { path: '/Editorial/:id', component: () => import('../pages/manage/Editorial.vue'),props:true },
            { path: '/Reviewed0/:id', component: () => import('../pages/manage/Reviewed0.vue'),props:true },
            { path: '/Unreviewed/:id', component: () => import('../pages/manage/Unreviewed.vue') ,props:true},
            { path: '/Reviewed/:id', component: () => import('../pages/manage/Reviewed.vue'),props:true },

            { path: '/information/:id', component: () => import('../pages/Information/information.vue') ,props:true,meta: {infor: false}},
            { path: '/password/:id', component: () => import('../pages/Information/password.vue'),props:true },
        ]},
]

// 3. 创建路由实例并传递 `routes` 配置
const router = createRouter({
    // 4. 我们在这里使用 hash 模式。
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
})
export default router