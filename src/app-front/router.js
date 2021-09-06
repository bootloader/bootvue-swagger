import AppRouter from './../services/router';

console.log("front ROUTER")
export default AppRouter.route({
    app: 'front',
    base : "/front/",
    routes:  [
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
          path: "/auth",
          redirect: "/auth/login",
          component: () => import('./layouts/Auth.vue'),
          children: [
            {
              path: "/auth/login",
              component: () => import('./views/auth/Login.vue'),
            },
            {
              path: "/auth/register",
              component: () => import('./views/auth/Register.vue'),
            },
          ],
        },
        {
          path: "/landing",
          component: () => import('./views/Landing.vue'),
        },
        {
          path: "/profile",
          component: () => import('./views/Profile.vue'),
        },
        {
          path: "/",
          component: () => import('./index/Index.vue'),
        },
        { path: "/:pathMatch(.*)*", redirect: "/" },
      ]
})
