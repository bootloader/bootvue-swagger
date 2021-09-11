import AppRouter from './../services/router';

console.log("front ROUTER")
export default AppRouter.route({
    app: 'front',
    base : "/",
    routes:  [
        {
          path: '/front',
          redirect: '/front/auth',
          name : "app"
        },
        {
          path: "/admin",
          redirect: "/admin/dashboard",
          component: () => import('./layouts/Admin.vue'),
          children: [
            {
              path: "/admin/dashboard",
              component: () => import('./views/admin/Dashboard.vue'),
            },
            {
              path: "/admin/settings",
              component: () => import('./views/admin/Settings.vue')      },
            {
              path: "/admin/tables",
              component: () => import('./views/admin/Tables.vue'),
            },
            {
              path: "/admin/maps",
              component: () => import('./views/admin/Maps.vue'),
            },
          ],
        },
        {
          path: "/front/auth",
          redirect: "/front/auth/login",
          component: () => import('./Auth/AuthLayout.vue'),
          children: [
            {
              path: "/front/auth/login",
              component: () => import('./Auth/Login.vue'),
            },
            {
              path: "/front/auth/register",
              component: () => import('./views/auth/Register.vue'),
            },
          ],
        },
        {
          path: "/front/more",
          component: () => import('./Index/IndexMore.vue'),
        },
        {
          path: "/:domain",
          component: () => import('./Index/Profile.vue'),
        },
        {
          path: "/",
          component: () => import('./Index/Index.vue'),
        },
        { path: "/:pathMatch(.*)*", redirect: "/" },
      ]
})
