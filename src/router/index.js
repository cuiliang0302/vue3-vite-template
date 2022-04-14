import {createRouter, createWebHistory} from 'vue-router';
import store from '@/store/index'
const router = createRouter({
	// history: createWebHashHistory(),  // hash模式，
	history: createWebHistory(),  //h5模式createWebHistory
	routes: [
		{
			path: '/',
			component: () => import('@/views/Home.vue'),
			meta: {
				title: '首页',
			}
		},
		{
			path: '/test',
			component: () => import('@/views/Test.vue'),
			meta: {
				title: '测试',
			}
		}
	]
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
	document.title = to.meta.title
	next()
})
export default router;
