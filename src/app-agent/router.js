import AppRouter from './../services/router';

export default AppRouter.route({
    app : "agent",
    base : "/agent/",
    routes: [
        // Dashboards
        {
            path: '/app/home',
            name: 'agent-home',
            component: () => import('./Module/Home.vue'),
        },
        {
            path: '/app/chat/:contactId/:sessionId',
            name: 'agent-chat',
            component: () => import('./Module/Home.vue'),
        },
        {
            path: '/app/chat/:contactId/:sessionId/:profileId',
            name: 'agent-chat-profile',
            component: () => import('./Module/Home.vue'),
        },
        {
            path: '/app/chat/:contactId/:sessionId/:profileId/:profileView',
            name: 'agent-chat-profile-view',
            component: () => import('./Module/Home.vue'),
        },
        {
            path: '/app/chat/:contactId/:sessionId/:profileId/:profileView/:mvu',
            name: 'defAgentView',
            component: () => import('./Module/Home.vue'),
        },
        {
            path: '/app/chistory/:contactId/:sessionId',
            name: 'agent-chat-session',
            component: () => import('./Module/Home.vue'),
        },
    ]
})
