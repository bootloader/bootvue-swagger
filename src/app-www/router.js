import AppRouter from '../services/router';

console.log("front ROUTER")
export default AppRouter.route({
    app: 'www',
    base : "/w",
    routes:  [
        {
          path: "/",
          component: () => import('./twtbapp/Index.vue'),
        }
      ]
})
