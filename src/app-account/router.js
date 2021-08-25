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
          path: '/',
          redirect: 'dashboard',
          component: () => import('./views/Layout/DashboardLayout.vue'),
          children: [
            {
              path: '/dashboard',
              name: 'dashboard',
              // route level code-splitting
              // this generates a separate chunk (about.[hash].js) for this route
              // which is lazy-loaded when the route is visited.
              component: () => import(/* webpackChunkName: "demo" */ './views/Dashboard.vue')
            },
            {
              path: '/icons',
              name: 'icons',
              component: () => import(/* webpackChunkName: "demo" */ './views/Icons.vue')
            },
            {
              path: '/profile',
              name: 'profile',
              component: () => import(/* webpackChunkName: "demo" */ './views/Pages/UserProfile.vue')
            },
            {
              path: '/maps',
              name: 'maps',
              component: () => import(/* webpackChunkName: "demo" */ './views/GoogleMaps.vue')
            },
            {
              path: '/tables',
              name: 'tables',
              component: () => import(/* webpackChunkName: "demo" */ './views/RegularTables.vue')
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
          path: '/',
          redirect: 'login',
          component: () => import('./views/Auth/AuthLayout.vue'),
          children: [
            {
              path: '/auth/login',
              name: 'login',
              component: () => import(/* webpackChunkName: "register" */ './views/Auth/Login.vue')
            },
            {
              path: '/auth/register',
              name: 'register',
              component: () => import(/* webpackChunkName: "register" */ './views/Auth/Register.vue')
            },
            {
              path: '/auth/register-done',
              name: 'register-done',
              component: () => import(/* webpackChunkName: "register" */ './views/Auth/RegisterDone.vue')
            },
            { 
                path: '*', 
                component: () => import('./views/NotFoundPage.vue'),
             }
          ]
        }
      ]
})
