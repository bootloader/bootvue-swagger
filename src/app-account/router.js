import AppRouter from './../services/router';

console.log("Account ROUTER")
export default AppRouter.route({
    app: 'account',
    base : "/account/",
    linkActiveClass: 'active',
    scrollBehavior: (to, from ,savedPosition) => {
        if (savedPosition) {
          return savedPosition;
        }
        if (to.hash) {
          return { selector: to.hash };
        }
        return { x: 0, y: 0 };
    },
    routes : [],
    noroutes:  [
        {
          path: '/app',
          redirect: '/app/home',
          name : "app"
        },
        {
          path: '/',
          redirect: '/app/home',
          //component: () => import('./Partner/PartnerHub.vue'),
          meta : {
            role : ["DOMAIN_ADMIN"]
          },
          children: [
            {
              path: '/app/dashboard',
              name: 'dashboard',
              // route level code-splitting
              // this generates a separate chunk (about.[hash].js) for this route
              // which is lazy-loaded when the route is visited.
              component: () => import(/* webpackChunkName: "demo" */ './views/Dashboard.vue'),
              meta : {
                role : ["DOMAIN_ADMIN"]
              }
            },
            {
              path: '/app/icons',
              name: 'icons',
              component: () => import(/* webpackChunkName: "demo" */ './views/Icons.vue'),
              meta : {
                role : ["DOMAIN_ADMIN"]
              }
            },
            {
              path: '/app/profile',
              name: 'profile',
              component: () => import(/* webpackChunkName: "demo" */ './views/Pages/UserProfile.vue'),
              meta : {
                role : ["DOMAIN_ADMIN"]
              }
            },
            {
              path: '/app/maps',
              name: 'maps',
              component: () => import(/* webpackChunkName: "demo" */ './views/GoogleMaps.vue'),
              meta : {
                role : ["DOMAIN_ADMIN"]
              }
            },
            {
              path: '/app/tables',
              name: 'tables',
              component: () => import(/* webpackChunkName: "demo" */ './views/RegularTables.vue'),
              meta : {
                role : ["DOMAIN_ADMIN"]
              }
            }
          ]
        },
        {
            path: '/',
            redirect: 'sample',
            component: () => import('./views/Starter/SampleLayout.vue'),
            children: [
              {
                path: '/sample',
                name: 'sample',
                component: () => import('./views/Starter/SamplePage.vue'),
                //components: { default: () => import('./views/Starter/SamplePage.vue') }
              }
            ]
        }
      ],
      beforeEach : function (to, from, next) {
        console.log("beforeEach",to.path, from);
        if(window.CONST.APP_USER && to.path.indexOf("/app")==-1){
            console.log("ToApp")
            next({
              path : "/app"
            });
        } else if(!window.CONST.APP_USER && to.path.indexOf("/auth")==-1){
          console.log("ToAuth")
          next({
            path : "/auth/"
          });
        } else next();
      }
})
