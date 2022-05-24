import AppRouter from './../services/router';

export default AppRouter.route({
    app : "agent",
    base : "/agent/",
    routes: [
        // Dashboards
        {
            path: '/',
            redirect: '/app/home/CHATBOX',
            name : "app"
        },
        {
            path: '/:app/chat',
            redirect: '/app/home/CHATBOX',
            name: 'agent-home',
            //component: () => import('./Module/Home.vue'),
        },
        {
            path: '/:app/home',
            redirect: '/app/home/CHATBOX',
            name: 'agent-home',
            //component: () => import('./Module/Home.vue'),
        },
        {
            path: '/:app/home/:mvu',
            name: 'agent-action',
            component: () => import('./Module/Home.vue'),
        },
        {
            path: '/:app/chat/:contactId/:sessionId',
            name: 'agent-chat',
            component: () => import('./Module/Home.vue'),
        },
        {
            path: '/:app/chat/:contactId/:sessionId/:profileId',
            name: 'agent-chat-profile',
            component: () => import('./Module/Home.vue'),
        },
        {
            path: '/:app/chat/:contactId/:sessionId/:profileId/:profileView',
            name: 'agent-chat-profile-view',
            component: () => import('./Module/Home.vue'),
        },
        {
            path: '/:app/chat/:contactId/:sessionId/:profileId/:profileView/:mvu',
            name: 'defAgentView',
            component: () => import('./Module/Home.vue'),
        },
        {
            path: '/:app/chat/:contactId/:sessionId/:profileId/:profileView/:mvu/:mash',
            name: 'defAgentViewLong',
            component: () => import('./Module/Home.vue'),
        },
        {
            path: '/:app/chistory/:contactId/:sessionId',
            name: 'agent-chat-session',
            component: () => import('./Module/Home.vue'),
        },
    ]
})
