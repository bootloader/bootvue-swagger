import AppRouter from '../services/router';

console.log("contak ROUTER")
export default AppRouter.route({
    app: 'contak',
    base : "/contak/",
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
        path: '/',
        redirect: '/app/home',
        name : "root",
        meta : {
          role : ["DOMAIN_ADMIN","GUEST"]
        },
      },
      {
        path: '/app',
        name : "app",
        redirect: '/app/home',
        component: () => import('./App/Layout.vue'),
        meta : {
          role : ["DOMAIN_ADMIN"]
        },
        children: [
          {
            path: '/app/home',
            name: 'Domains',
            component: () => import(/* webpackChunkName: "demo" */ './App/Home/Home.vue'),
            meta : {
             // role : ["DOMAIN_ADMIN"]
            }
          },
          {
            path: "/app/demo",
            component: () => import('./App/Demo/Demo.vue'),
          },
        ]
      },
      {
        path: '/auth',
        name : "auth",
        redirect: '/auth/login',
        component: () => import('./Auth/AuthLayout.vue'),
        children: [
          {
            path: '/auth/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "register" */ './Auth/Login.vue'),
            meta : {
              role : ["GUEST"]
            }
          },
          {
            path: '/auth/register',
            name: 'register',
            component: () => import(/* webpackChunkName: "register" */ './Auth/Register.vue'),
            meta : {
              role : ["GUEST"]
            }
          },
          {
            path: '/auth/forgot-pass',
            name: 'forgot-pass',
            component: () => import(/* webpackChunkName: "register" */ './Auth/ForgotPassword.vue'),
            meta : {
              role : ["GUEST"]
            }
          },
          {
            path: '/auth/reset-pass',
            name: 'reset-pass',
            component: () => import(/* webpackChunkName: "register" */ './Auth/ResetPassword.vue'),
            meta : {
              role : ["GUEST"]
            }
          },
          {
            path: '/auth/verify-link',
            name: 'verify-link',
            component: () => import(/* webpackChunkName: "register" */ './Auth/ResetPassword.vue'),
            meta : {
              role : ["GUEST"]
            }
          },
          { 
              path: '*', 
              component: () => import('./Pages/NotFoundPage.vue'),
           }
        ]
      }
    ],
    // beforeEach : function (to, from, next) {
    //   console.log("beforeEach",to.path, from);
    //   if(window.CONST.APP_USER && to.path.indexOf("/app")==-1){
    //       console.log("ToApp")
    //       next({
    //         path : "/app"
    //       });
    //   } else if(!window.CONST.APP_USER && to.path.indexOf("/auth")==-1){
    //     console.log("ToAuth")
    //     next({
    //       path : "/auth/"
    //     });
    //   } else next();
    // },
    // accessDenied : function (to, from, next) {
    //   if(!window.CONST.APP_USER && to.path.indexOf("/auth")==-1){
    //     console.log("ToAuth")
    //     next({
    //       path : "/auth"
    //     });
    //   } else next();
    // }
})
