import AppRouter from '../services/router';

console.log("front ROUTER")
export default AppRouter.route({
    app: 'www',
    base : "/",
    routes : (function(){
      return [
        {
          path: '/',
          redirect: '/'+window.CONST.BASE,
          name : "base",
          meta : {
          },
        },
        {
          path: "/notpapi",
          name : "notpapi",
          component: () => import('./contakapi/NotpApiTest.vue'),
        },
        {
          path: "/entoc",
          name : "entoc",
          component: () => import('./contakapi/NotpApiTest.vue'),
        },
        {
          path: "/manifest",
          name : "entoc",
          component: () => import('./manifest/Manifest.vue'),
        }
      ];
    })()
})
