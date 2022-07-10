import AppRouter from './../services/router';

console.log("front ROUTER")
export default AppRouter.route({
    app: 'page',
    base : "/",
    routes:  [
        {
          path: '/page',
          redirect: '/page/auth',
          name : "app"
        },
        {
          path: "/page/pub/read/:content",
          component: () => import('./Index/ReadGuide.vue'),
        },
        {
          path: "/@:domain",
          component: () => import('./Index/Index.vue'),
        },
        {
          path: "/",
          component: () => import('./Index/Index.vue'),
        },
        { path: "/:pathMatch(.*)*", redirect: "/" },
      ]
})
