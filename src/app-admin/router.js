import AppRouter from './../services/router';

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
            component: () => import('./Modules/ImportChat/ModImportChat.vue'),
        },
        {
            path: '/app/moderate/imported-chat-logs',
            name: 'ModImportChatLogs',
            component: () => import('./Modules/ImportChat/ModImportChatLogs.vue'),
        },
        {
            path: '/app/moderate/contacts',
            name: 'ModContactMaster',
            component: () => import('./Modules/ModContactMaster.vue'),
        },

//Bulk Messaging
        {
            path: '/app/moderate/bulk-push-jobs',
            name: 'ModBulkJobs',
            component: () => import('./Modules/BulkMessages/ModBulkJobs.vue'),
        },
        {
            path: '/app/moderate/bulk-push-new',
            name: 'ModBulkSend',
            component: () => import('./Modules/BulkMessages/ModBulkSend.vue'),
        },
        {
            path: '/app/moderate/bulk-push-msgs/:bulkSessionId',
            name: 'ModBulkMessages',
            component: () => import('./Modules/BulkMessages/ModBulkMessages.vue'),
        },

//Agent Screens
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
            component: () => import('./Modules/Quick/TmplQuickReplies.vue'),    
        },
        {
            path : "/app/admins/tmpl/quickactions",
            name: 'quickactions',
            component: () => import('./Modules/Quick/TmplQuickActions.vue'),    
        },
        {
            path : "/app/admins/tmpl/quicklabels",
            name: 'quicklabels',
            component: () => import('./Modules/Quick/TmplQuickLabels.vue'),    
        },
        {
            path : "/app/admins/tmpl/quicktags",
            name: 'quicktags',
            component: () => import('./Modules/Quick/TmplQuickTags.vue'),    
        },
        {
            path : "/app/admins/tmpl/quickmedia",
            name: 'quickmedia',
            component: () => import('./Modules/Quick/TmplQuickMedia.vue'),    
        },
        {
            path : "/app/admins/tmpl/pushtemplate/:mode/:itemId",
            name: 'pushtemplate',
            component: () => import('./Modules/TmplHSM/TmplHSM.vue'),    
        },
        {
            path : "/app/admins/tmpl/wabatemplate/view/all",
            name: 'wabatemplates',
            component: () => import('./Modules/TmplHSM/TmplWaba.vue'),    
        },
        {
            path : "/app/admins/tmpl/wabatemplate/:channelId/:code/:lang",
            name: 'wabatemplate',
            component: () => import('./Modules/TmplHSM/TmplWaba.vue'),    
        },

        {
            path : "/app/setup/agent-panel",
            name: 'SetUpAgentPanel',
            component: () => import('./Modules/SetUp/SetUpConfiguration.vue'),    
        },
        {
            path : "/app/setup/client-api-keys",
            name: 'SetUpApiKeys',
            component: () => import('./Modules/SetUp/SetUpApiKeys.vue'),    
        },
        {
            path : "/app/setup/appscript/:appId",
            name: 'SetUpApiKeys',
            meta : { layout : 'scriptus'},
            component: () => import('./Modules/SetUp/ScriptusEditor.vue'),    
        },
        {
            path : "/app/setup/company-vars",
            name: 'SetUpCompanyVars',
            component: () => import('./Modules/SetUp/SetUpCompanyVars.vue'),    
        },
        {
            path : "/app/setup/channels",
            name: 'SetUpChannels',
            component: () => import('./Modules/SetUp/SetUpChannels.vue'),    
        },


        {
            path : "/app/console/logs",
            name: 'ErrorLogs',
            component: () => import('./Modules/Console/ErrorLogs.vue'),    
        },


        {
            path: 'app/admins/components/modals',
            name: 'modals',
            component: () => import('../Modules/Components/Modals.vue'),
        },
    ]
})
