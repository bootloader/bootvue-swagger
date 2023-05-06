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
          path: "/",
          component: () => import('./Index/MyProfile.vue'),
        },
        {
          path: "/app/verification/create",
          component: () => import('./Index/VerificationDetails.vue'),
        },
        {
          path: "/app/v/:verificationId/edit",
          component: () => import('./Index/VerificationDetails.vue'),
        },
        {
          path: "/app/v/:verificationId/m/:membershipId",
          component: () => import('./Index/Membership.vue'),
        },
        {
          path: "/app/v/:verificationId/members",
          component: () => import('./Index/Memberships.vue'),
        },
        { path: "/:pathMatch(.*)*", redirect: "/" },
      ]
})
