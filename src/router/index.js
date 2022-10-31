import {createRouter, createWebHistory} from 'vue-router';

const router = createRouter({
  // history: createWebHashHistory(),  // hash模式，
  history: createWebHistory(),  //h5模式createWebHistory
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      children: [
        {
          path: "",
          redirect: "/index"
        },
        {
          path: 'index',
          name: 'Index',
          component: () => import('@/views/Index.vue'),
          meta: {
            title: '系统主页',
            location: ['系统主页','测试路由'],
          },
        }]
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
