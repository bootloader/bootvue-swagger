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
    routes:  [
        {
          path: '/app',
          redirect: '/app/home',
          name : "app"
        },
        {
          path: '/',
          redirect: '/app/home',
          component: () => import('./views/Layout/DashboardLayout.vue'),
          meta : {
            role : ["DOMAIN_ADMIN"]
          },
          children: [
            {
              path: '/app/home',
              name: 'domains',
              component: () => import(/* webpackChunkName: "demo" */ './views/Pages/UserHome.vue'),
              meta : {
                role : ["DOMAIN_ADMIN"]
              }
            },
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
        },
        {
          path: '/auth',
          name : "auth",
          redirect: 'login',
          component: () => import('./views/Auth/AuthLayout.vue'),
          children: [
            {
              path: '/auth/login',
              name: 'login',
              component: () => import(/* webpackChunkName: "register" */ './views/Auth/Login.vue'),
              meta : {
                role : ["GUEST"]
              }
            },
            {
              path: '/auth/register',
              name: 'register',
              component: () => import(/* webpackChunkName: "register" */ './views/Auth/Register.vue'),
              meta : {
                role : ["GUEST"]
              }
            },
            {
              path: '/auth/forgot-pass',
              name: 'forgot-pass',
              component: () => import(/* webpackChunkName: "register" */ './views/Auth/ForgotPassword.vue'),
              meta : {
                role : ["GUEST"]
              }
            },
            {
              path: '/auth/reset-pass',
              name: 'reset-pass',
              component: () => import(/* webpackChunkName: "register" */ './views/Auth/ResetPassword.vue'),
              meta : {
                role : ["GUEST"]
              }
            },
            {
              path: '/auth/verify-link',
              name: 'verify-link',
              component: () => import(/* webpackChunkName: "register" */ './views/Auth/ResetPassword.vue'),
              meta : {
                role : ["GUEST"]
              }
            },
            { 
                path: '*', 
                component: () => import('./views/NotFoundPage.vue'),
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
