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
          path: "/app/settings",
          component: () => import('./Index/Settings.vue'),
        },
        {
          path: "/app/verification/create",
          component: () => import('./Index/VerificationEdit.vue'),
        },
        {
          path: "/app/verifications",
          component: () => import('./Index/Verifications.vue'),
        },
        {
          path: "/app/v/:verificationId/edit",
          component: () => import('./Index/VerificationEdit.vue'),
        },
        {
          path: "/app/v/:verificationId",
          component: () => import('./Index/VerificationView.vue'),
        },
        {
          path: "/pub/v/:verificationId",
          component: () => import('./Index/VerificationView.vue'),
        },
        {
          path: "/app/v/:verificationId/m/:membershipId",
          component: () => import('./Index/Membership.vue'),
        },
        {
          path: "/app/v/:verificationId/m/:membershipId/members",
          component: () => import('./Index/Memberships.vue'),
        },
        {
          path: "/app/v/:verificationId/m/:membershipId/card",
          component: () => import('./Index/MembershipCard.vue'),
        },
        {
          path: "/pub/v/:verificationId/m/:membershipId/card",
          meta : { layout : "div", layoutClass:"h-100 my-auto" },
          component: () => import('./Index/MembershipCard.vue'),
        },
        {
          name : "trueCallerPage",
          path: "/pub/v1/connect/truecaller/mobile",
          component: () => import('./Index/VerifyMobileTrueCaller.vue'),
        },
        {
          name : "fireBasePage",
          path: "/pub/v1/connect/firebase/mobile",
          component: () => import('./Index/VerifyMobile.vue'),
        },
        {
          path: "/pub/v1/connect/telegram",
          component: () => import('./Index/VerifyTelegram.vue'),
        },
        {
          path: "/pub/v1/connect/whatsapp",
          component: () => import('./Index/VerifyWhatsApp.vue'),
        },
        {
          name : "reload",
          path: "/pub/reload/:reload",
          component: () => import('./Index/Reloadify.vue'),
        },
        {
          path: "/pub/manifest",
          meta : { layout : "div"},
          component: () => import('../app-www/manifest/Manifest.vue'),
        },
        {
          path: "/pub/dev",
          meta : { layout : "div" },
          component: () => import('./Index/Dev.vue'),
        },
        { path: "/:pathMatch(.*)*", redirect: "/" },
      ],
      matchNotFound(to, from, next){
        console.log("matchNotFound",to, from, next);
        next();
      }
})
