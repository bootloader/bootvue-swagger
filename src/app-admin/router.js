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
            name: 'AgentSessions',
            component: () => import('./Modules/AgentSessions.vue'),
        },
        {
            path: '/app/reports/taxonomy',
            name: 'ReportTaxonomy',
            component: () => import('./Modules/ReportTaxonomy.vue'),
        },

        {
            path: '/app/moderate/import-chat',
            name: 'ImportChat',
            component: () => import('./Modules/ModImportChat.vue'),
        },
        {
            path: '/app/moderate/imported-chat-logs',
            name: 'ModImportChatLogs',
            component: () => import('./Modules/ModImportChatLogs.vue'),
        },

        {
            path: '/app/admins/agents',
            name: 'AgentsUsers',
            component: () => import('./Modules/AgentsUsers.vue'),
        },
        {
            path: '/app/admins/agents/list',
            name: 'AgentsList',
            component: () => import('./Modules/AgentsList.vue'),
        },
        {
            path: '/app/admins/agents/add',
            name: 'AgentsAdd',
            component: () => import('./Modules/AgentsAdd.vue'),
        },

        {
            path: '/app/admins/agents/teams',
            name: 'AgentsTeams',
            component: () => import('./Modules/AgentsTeams.vue'),
        },
        {
            path: '/auth/login',
            name: 'LoginBoxed',
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
            path : "/app/setup/agent-panel",
            name: 'quickmedia',
            component: () => import('./Modules/SetUpAgentPanel.vue'),    
        },

        {
            path: 'app/admins/components/modals',
            name: 'modals',
            component: () => import('../Modules/Components/Modals.vue'),
        },
    ]
})
