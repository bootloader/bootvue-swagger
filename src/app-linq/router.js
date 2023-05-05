import AppRouter from './../services/router';

export default AppRouter.route({
    app: 'linq',
    base : "/linq",
    routes:  [
        {
          path: '/app',
          redirect: '/app/home',
          name : "app"
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
