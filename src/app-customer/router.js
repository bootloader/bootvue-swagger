import AppRouter from './../router';

export default AppRouter.route({
    app : "customer",
    base : window.CONST.WEBAPP_BASE,
    routes: [
        // Dashboards
        {
            path: '/app/chat',
            name: 'customer-chat',
            component: () => import('./Module/CustomerChat.vue'),
        }
    ]
})
