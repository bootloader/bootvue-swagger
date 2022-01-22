import AppRouter from './../services/router'

console.log('Partner ROUTER')
export default AppRouter.route({
    app: 'content',
    base: '/',
    linkActiveClass: 'active',
    scrollBehavior: (to, from, savedPosition) => {
        if (savedPosition) {
            return savedPosition
        }
        if (to.hash) {
            return { selector: to.hash }
        }
        return { x: 0, y: 0 }
    },
    routes: [
        {
            path: '/',
            redirect: '/pricing',
            name: 'app',
        },
        {
            path: '/pricing',
            name: 'pricing',
            component: () => import('./Pages/Index/Index.vue'),
            // children: [
            //     {
            //         path: '/pricing/smart-conversations',
            //         name: 'smart-conversations',
            //         component: () =>
            //             import(
            //                 /* webpackChunkName: "smart-conversations" */ './Pages/Pricing/SmartConversations.vue'
            //             ),
            //         meta: {
            //             role: ['GUEST'],
            //         },
            //     },
            //     {
            //         path: '/pricing/api',
            //         name: 'api',
            //         component: () =>
            //             import(
            //                 /* webpackChunkName: "api" */ './Pages/Pricing/Api.vue'
            //             ),
            //         meta: {
            //             role: ['GUEST'],
            //         },
            //     },
            //     {
            //         path: '*',
            //         component: () => import('./Pages/NotFoundPage.vue'),
            //     },
            // ],
        },
    ],
    //   beforeEach : function (to, from, next) {
    //     console.log("beforeEach",to.path, from);
    //     if(window.CONST.APP_USER && to.path.indexOf("/app")==-1){
    //         console.log("ToApp")
    //         next({
    //           path : "/app"
    //         });
    //     } else if(!window.CONST.APP_USER && to.path.indexOf("/auth")==-1){
    //       console.log("ToAuth")
    //       next({
    //         path : "/auth/"
    //       });
    //     } else next();
    //   },
    //   accessDenied : function (to, from, next) {
    //     if(!window.CONST.APP_USER && to.path.indexOf("/auth")==-1){
    //       console.log("ToAuth")
    //       next({
    //         path : "/auth"
    //       });
    //     } else next();
    //   }
})
