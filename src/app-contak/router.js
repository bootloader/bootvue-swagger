import AppRouter from '../services/router';

console.log("contak ROUTER")
export default AppRouter.route({
    app: 'contak',
    base : "/",
    routes:  [
        {
          path: '/contak',
          redirect: '/contak/demo',
          name : "demo"
        },
        {
          path: "/contak/demo",
          component: () => import('./Demo.vue'),
        },
      ]
})
