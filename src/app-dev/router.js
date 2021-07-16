import AppRouter from './../services/router';

export default AppRouter.route({
    app: 'dev',
    base : "/dev/",
    routes: [

        // Samples Below

        {
            path: '/demo/dashboard/analytics',
            name: 'analytics',
            component: () => import('../Modules/Dashboards/Analytics.vue'),
        },

        // Pages
        {
            path: '/pages/register-boxed',
            name: 'register-boxed',
            meta: {layout: 'userpages'},
            component: () => import('../Modules/UserPages/RegisterBoxed.vue'),
        },
        {
            path: '/pages/forgot-password-boxed',
            name: 'forgot-password-boxed',
            meta: {layout: 'userpages'},
            component: () => import('../Modules/UserPages/ForgotPasswordBoxed.vue'),
        },

        // Elements

        {
            path: '/elements/buttons-standard',
            name: 'buttons-standard',
            component: () => import('../Modules/Elements/Buttons/Standard.vue'),
        },
        {
            path: '/elements/dropdowns',
            name: 'dropdowns',
            component: () => import('../Modules/Elements/Dropdowns.vue'),
        },
        {
            path: '/elements/icons',
            name: 'icons',
            component: () => import('../Modules/Elements/Icons.vue'),
        },
        {
            path: '/elements/badges-labels',
            name: 'badges',
            component: () => import('../Modules/Elements/Badges.vue'),
        },
        {
            path: '/elements/cards',
            name: 'cards',
            component: () => import('../Modules/Elements/Cards.vue'),
        },
        {
            path: '/elements/list-group',
            name: 'list-group',
            component: () => import('../Modules/Elements/ListGroups.vue'),
        },
        {
            path: '/elements/timelines',
            name: 'timeline',
            component: () => import('../Modules/Elements/Timeline.vue'),
        },
        {
            path: '/elements/utilities',
            name: 'utilities',
            component: () => import('../Modules/Elements/Utilities.vue'),
        },

        // Components

        {
            path: '/components/tabs',
            name: 'tabs',
            component: () => import('../Modules/Components/Tabs.vue'),
        },
        {
            path: '/components/accordions',
            name: 'accordions',
            component: () => import('../Modules/Components/Accordions.vue'),
        },
        {
            path: '/components/modals',
            name: 'modals',
            component: () => import('../Modules/Components/Modals.vue'),
        },
        {
            path: '/components/progress-bar',
            name: 'progress-bar',
            component: () => import('../Modules/Components/ProgressBar.vue'),
        },
        {
            path: '/components/tooltips-popovers',
            name: 'tooltips-popovers',
            component: () => import('../Modules/Components/TooltipsPopovers.vue'),
        },
        {
            path: '/components/carousel',
            name: 'carousel',
            component: () => import('../Modules/Components/Carousel.vue'),
        },
        {
            path: '/components/pagination',
            name: 'pagination',
            component: () => import('../Modules/Components/Pagination.vue'),
        },
        {
            path: '/components/maps',
            name: 'maps',
            component: () => import('../Modules/Components/Maps.vue'),
        },

        // Tables

        {
            path: '/tables/regular-tables',
            name: 'regular-tables',
            component: () => import('../Modules/Tables/RegularTables.vue'),
        },

        // Dashboard Widgets

        {
            path: '/widgets/chart-boxes-3',
            name: 'chart-boxes-3',
            component: () => import('../Modules/Widgets/ChartBoxes3.vue'),
        },

        // Forms

        {
            path: '/forms/controls',
            name: 'controls',
            component: () => import('../Modules/Forms/Elements/Controls.vue'),
        },
        {
            path: '/forms/layouts',
            name: 'layouts',
            component: () => import('../Modules/Forms/Elements/Layouts.vue'),
        },
        // Charts

        {
            path: '/charts/chartjs',
            name: 'chartjs',
            component: () => import('../Modules/Charts/Chartjs.vue'),
        },
    ]
})
