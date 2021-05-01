import AppRouter from './../router';

export default AppRouter.route({
    app : "admin",
    base : "/admin/",
    routes: [
        // Dashboards
        {
            path: '/',
            alias: '/app/home',
            name: 'myanalytics',
            component: () => import('./Modules/MyAnalytics.vue'),
        },
        {
            path: '/app/reports/sessions',
            name: 'dept',
            component: () => import('./Modules/AgentSessions.vue'),
        },

        {
            path: '/app/admins/agents/list',
            name: 'agents_list',
            component: () => import('./Modules/AgentsList.vue'),
        },
        {
            path: '/app/admins/agents/add',
            name: 'agents_add',
            component: () => import('./Modules/AgentsAdd.vue'),
        },

        {
            path: '/app/admins/agents/teams',
            name: 'dept',
            component: () => import('./Modules/AgentsTeams.vue'),
        },
        {
            path: '/auth/login',
            name: 'login',
            meta: {layout: 'userpages'},
            component: () => import('./Modules/LoginBoxed.vue'),
        },
        {
            path : "/app/admins/tmpl/quickreplies",
            name: 'quickreplies',
            component: () => import('./Modules/TmplQuickReplies.vue'),    
        },
        {
            path : "/app/admins/tmpl/quickactions",
            name: 'quickactions',
            component: () => import('./Modules/TmplQuickActions.vue'),    
        },
        {
            path : "/app/admins/tmpl/quicklabels",
            name: 'quicklabels',
            component: () => import('./Modules/TmplQuickLabels.vue'),    
        },
        {
            path : "/app/admins/tmpl/quickmedia",
            name: 'quickmedia',
            component: () => import('./Modules/TmplQuickMedia.vue'),    
        },
        {
            path: 'app/admins/components/modals',
            name: 'modals',
            component: () => import('../Modules/Components/Modals.vue'),
        },
    ]
})
