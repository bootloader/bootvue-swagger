<template>
    <div
        class="app-sidebar sidebar-shadow"
        @mouseover="toggleSidebarHover('add', 'closed-sidebar-open')"
        @mouseleave="toggleSidebarHover('remove', 'closed-sidebar-open')">
        <div class="app-header__logo">
            <div class="logo-src"/>
            <div class="header__pane ml-auto">
                <button
                    class="hamburger close-sidebar-btn hamburger--elastic"
                    type="button"
                    v-bind:class="{ 'is-active': isOpen }"
                    @click="toggleBodyClass('closed-sidebar')">
                    <span class="hamburger-box">
                        <span class="hamburger-inner"></span>
                    </span>
                </button>
            </div>
        </div>
        <div class="app-sidebar-content">
            <VuePerfectScrollbar class="app-sidebar-scroll" v-once>
                <sidebar-menu showOneChild rtl :menu="menu" 
                hideToggle="true"
                 />
            </VuePerfectScrollbar>
        </div>

        <component :is="'style'" v-html="style">
        </component>

    </div>
</template>

<script>
    import { SidebarMenu } from 'vue-sidebar-menu'
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import { MyConst, User } from '@/services/global';

    function menuFilter(menu) {
        var header = null
        return menu
            .filter(function (item) {
                if (item.header == true) {
                    header = item
                    return true
                }
                if (item.child) {
                    item.child = menuFilter(item.child)
                    item.enabled = item.child.length > 0
                }
                if (item.disabled === false || item.enabled === true) {
                    if (header) header.enabled = true
                    return true
                }
                return false
            })
            .filter(function (item) {
                return (item.disabled === false || item.enabled === true) && (
                    !item.perm || MyConst.config?.PERMS[item.perm]
                )
            })
    }
    export default {
        components: {
            SidebarMenu,
            VuePerfectScrollbar,
        },
        data() {
            return {
                isOpen: false,
                sidebarActive: false,
                logo : {
                    short : './../../assets/images/logo-short.png',
                    long : './../../assets/images/logo-long.png'
                },
                menu: menuFilter([
                    {
                        header: true,
                        title: 'Reports',
                    },
                    {
                        title: 'Dashboard',
                        icon: 'pe-7s-graph3 fa fa-chart-bar',
                        href: '/',
                        enabled: true,
                        child: [
                            {
                                enabled: true,
                                href: '/app/analytics',
                                title: 'Analytics',
                            }
                        ],
                    },
                    {
                        title: 'Taxonomy',
                        icon: 'fa fa-tags',
                        href: '/app/reports/taxonomy',
                        enabled: true,
                    },
                    {
                        header: true,
                        title: 'Manage',
                    },
                    {
                        title: 'Sessions',
                        icon: 'pe-7s-chat fa fa-chalkboard-teacher',
                        href: '/app/reports/sessions',
                        enabled: true,
                    },
                    {
                        title: 'Contacts',
                        icon: 'pe-7s-chat fa fa-address-book',
                        enabled: true,
                        href: '/app/moderate/contacts',
                    },
                    {
                        enabled: true, perm : "CONTACT_CENTER",
                        href: '/app/master/contact/profiles',
                        title: 'Contact Profiles',
                        icon: 'pe-7s-network fas fa-address-card',
                    },
                    {
                        title: 'Import Chat',
                        icon: 'pe-7s-chat fa fa-file-import',
                        enabled: true,
                        href: '/app/moderate/import-chat',
                    },
                    {
                        title: 'Bulk Messaging',
                        icon: 'pe-7s-chat fa fa-mail-bulk',
                        enabled: true,
                        child: [
                            {
                                enabled: true,
                                href: '/app/moderate/bulk-push-jobs',
                                title: 'View Jobs',
                            },
                            {
                                enabled: true,
                                href: '/app/moderate/bulk-push-new',
                                title: 'Send New',
                            },
                        ],
                    },
                    {
                        header: true,
                        title: 'Admin',
                    },
                    {
                        title: 'Users',
                        icon: 'pe-7s-users fa fa-user-friends',
                        enabled: true,
                        href: '/app/admins/agents',
                    },
                    {
                        title: 'Agents',
                        icon: 'pe-7s-users fa fa-user-friends',
                        enabled: false,
                        href: '/app/admins/agents/list',
                    },
                    {
                        enabled: false,
                        icon: 'pe-7s-add-user',
                        href: '/app/admins/agents/add',
                        title: 'Add Agent',
                    },
                    {
                        enabled: true,
                        href: '/app/admins/agents/teams',
                        title: 'Teams',
                        icon: 'pe-7s-network fa fa-users',
                    },
                    {
                        title: 'Quick Response',
                        icon: 'pe-7s-browser fa fa-comment-dots',
                        enabled: true,
                        child: [
                            {
                                enabled: true,
                                href: '/app/admins/tmpl/quickreplies',
                                title: 'Quick Replies',
                            },
                            {
                                enabled: true,
                                href: '/app/admins/tmpl/quickactions',
                                title: 'Quick Actions',
                            },
                            {
                                enabled: true,
                                href: '/app/admins/tmpl/quicklabels',
                                title: 'Customer Labels',
                            },
                            {   
                                enabled : true,
                                href: '/app/admins/tmpl/quicktags',
                                title: 'Session Tags',
                            },
                            {   
                                enabled : true,
                                href: '/app/admins/tmpl/quickmedia',
                                title: 'Quick Media',
                            },
                            {   
                                enabled : true,
                                href: '/app/admins/tmpl/quickskill',
                                title: 'Agent Skills',
                            },
                        ],
                    },
                    {
                        title: 'Templates',
                        icon: 'pe-7s-browser fa fa-comment-alt',
                        enabled: true,
                        child: [
                            {
                                enabled: true,
                                href: '/app/admins/tmpl/pushtemplate/view/all',
                                title: 'HSM Templates',
                            },
                            {
                                enabled: true,
                                href: '/app/admins/tmpl/wabatemplate/view/all',
                                title: 'WABA Approved',
                            },
                            {
                                href: '/pages/register-boxed',
                                title: 'Register Boxed',
                            },
                            {
                                href: '/pages/forgot-password-boxed',
                                title: 'Forgot Password Boxed',
                            },
                        ],
                    },
                    {
                        header: true,
                        title: 'Setup',
                    },
                    {
                        enabled: true,
                        href: '/app/setup/channels',
                        title: 'Channels',
                        icon: 'pe-7s-key fa fa-plug',
                    },
                    {
                        enabled: true,
                        href: '/app/setup/client-api-keys',
                        title: 'Client Apps',
                        icon: 'pe-7s-key fa fa-th-large',
                    },
                    {
                        enabled: true,
                        href: '/app/setup/company-vars',
                        title: 'Variable Setup',
                        icon: 'pe-7s-key fa fa-code',
                    },
                    {
                        enabled: true,
                        href: '/app/setup/token-keys',
                        title: 'Token & Keys',
                        icon: 'pe-7s-key fa fa-code',
                    },
                    {
                        enabled: true,
                        href: '/app/setup/agent-panel',
                        title: 'Config Setup',
                        icon: 'pe-7s-network fa fa-tools',
                    },
                    {
                        enabled: User.canDebugDomain,
                        title: 'Console',
                        icon: 'pe-7s-network fa fa-tools',
                        child: [
                            {
                                enabled: User.canDebugDomain,
                                href: '/app/console/logs',
                                title: 'Logs',
                            },
                            {
                                enabled: User.canDebugDomain,
                                href: '/app/console/activities',
                                title: 'ActivityLogs',
                            },
                            {
                                enabled: User.canDebugDomain,
                                href: '/app/console/change_logs',
                                title: 'Change Logs',
                            },
                        ]
                    },
                    {
                        title: 'Dashboards',
                        icon: 'pe-7s-rocket',
                        child: [
                            {
                                enabled: false,
                                href: '/demo/dashboard/analytics',
                                title: 'Analytics',
                            },
                        ],
                    },
                    {
                        title: 'Pages',
                        icon: 'pe-7s-browser',
                        child: [
                            {
                                enabled: false,
                                href: '/pages/login-boxed',
                                title: 'Login Boxed',
                            },
                            {
                                href: '/pages/register-boxed',
                                title: 'Register Boxed',
                            },
                            {
                                href: '/pages/forgot-password-boxed',
                                title: 'Forgot Password Boxed',
                            },
                        ],
                    },
                    {
                        header: true,
                        title: 'UI Components',
                    },
                    {
                        icon: 'pe-7s-diamond',
                        title: 'Elements',
                        child: [
                            {
                                title: 'Buttons',
                                child: [
                                    {
                                        title: 'Standard',
                                        href: '/elements/buttons-standard',
                                    },
                                ],
                            },
                            {
                                enabled: false,
                                title: 'Dropdowns',
                                href: '/elements/dropdowns',
                            },
                            {
                                title: 'Icons',
                                href: '/elements/icons',
                            },
                            {
                                title: 'Badges',
                                href: '/elements/badges-labels',
                            },
                            {
                                title: 'Cards',
                                href: '/elements/cards',
                            },
                            {
                                title: 'List Groups',
                                href: '/elements/list-group',
                            },
                            {
                                title: 'Timeline',
                                enabled: false,
                                href: '/elements/timelines',
                            },
                            {
                                title: 'Utilities',
                                href: '/elements/utilities',
                            },
                        ],
                    },
                    {
                        icon: 'pe-7s-car',
                        title: 'Components',
                        child: [
                            {
                                title: 'Tabs',
                                href: '/components/tabs',
                            },
                            {
                                title: 'Accordions',
                                href: '/components/accordions',
                            },
                            {
                                enabled: false,
                                title: 'Modals',
                                href: '/app/admins/components/modals',
                            },
                            {
                                title: 'Progress Bar',
                                href: '/components/progress-bar',
                            },
                            {
                                title: 'Tooltips & Popovers',
                                href: '/components/tooltips-popovers',
                            },
                            {
                                title: 'Carousel',
                                href: '/components/carousel',
                            },
                            {
                                title: 'Pagination',
                                href: '/components/pagination',
                            },
                            {
                                title: 'Maps',
                                href: '/components/maps',
                            },
                        ],
                    },
                    {
                        icon: 'pe-7s-display2',
                        title: 'Tables',
                        child: [
                            {
                                title: 'Regular Tables',
                                href: '/tables/regular-tables',
                            },
                        ],
                    },
                    {
                        header: true,
                        title: 'Dashboard Boxes',
                    },
                    {
                        icon: 'pe-7s-graph2',
                        title: 'Chart Boxes',
                        enabled: false,
                        href: '/widgets/chart-boxes-3',
                    },
                    {
                        header: true,
                        title: 'Forms',
                    },
                    {
                        icon: 'pe-7s-light',
                        title: 'Elements',
                        child: [
                            {
                                enabled: false,
                                title: 'Controls',
                                href: '/forms/controls',
                            },
                            {
                                title: 'Layouts',
                                href: '/forms/layouts',
                            },
                        ],
                    },
                    {
                        header: true,
                        title: 'Charts',
                    },
                    {
                        enabled: false,
                        icon: 'pe-7s-graph2',
                        title: 'ChartJS',
                        href: '/charts/chartjs',
                    },
                ]),
                collapsed: true,

                windowWidth: 0,

            }
        },
        props: {
            sidebarbg: String,
        },
        computed: {
            style() {
                return `
                    .closed-sidebar .app-sidebar .logo-src {
                        background : url('${this.$config.PROP_LOGO_BG_X_ICON}');
                    }
                    .closed-sidebar-open.closed-sidebar .app-sidebar .logo-src {
                        background : url('${this.$config.PROP_LOGO_BG_X_LOGO}');
                    }
                    `;
            }
        },
        methods: {

            toggleBodyClass(className) {
                const el = document.body
                this.isOpen = true //!this.isOpen;

                if (this.isOpen) {
                    el.classList.add(className)
                } else {
                    el.classList.remove(className)
                }
            },
            toggleSidebarHover(add, className) {
                const el = document.body
                this.sidebarActive = !this.sidebarActive

                this.windowWidth = document.documentElement.clientWidth

                if (this.windowWidth > '992') {
                    if (add === 'add') {
                        el.classList.add(className)
                    } else {
                        el.classList.remove(className)
                    }
                }
            },
            getWindowWidth() {
                const el = document.body
                this.windowWidth = document.documentElement.clientWidth
                el.classList.add('closed-sidebar', 'closed-sidebar-md')
            },
        },
        mounted() {
            this.$nextTick(function () {
                window.addEventListener('resize', this.getWindowWidth)

                //Init
                this.getWindowWidth()
            })
        },

        beforeDestroy() {
            window.removeEventListener('resize', this.getWindowWidth)
        },
    }
</script>

<style scoped>
    .logo-src {
        height: 45px;
        width: 165px;
        background-size: 140px auto;
        background-repeat: no-repeat;
    }
    .closed-sidebar .app-sidebar .logo-src {
        width: 40px;
        height: 35px;
        background-size: 40px auto;
        background-repeat: no-repeat;
    }
    .closed-sidebar-open.closed-sidebar .app-sidebar .logo-src {
        width: 165px;
        height: 45px;
        background-size: 140px auto;
        background-repeat: no-repeat;
    }

</style>
<style type="text/css">
    .v-sidebar-menu .vsm-icon.far,
    .v-sidebar-menu .vsm-icon.fab,
    .v-sidebar-menu .vsm-icon.fas,
    .v-sidebar-menu .vsm-icon.fa {
        font-size: 15px !important;
        opacity: 0.3;
    }
    .v-sidebar-menu .vsm-item {
        line-height: 1.6rem!important;
    }
    .v-sidebar-menu .vsm-link {
        height: 1.6rem!important;
        line-height: 1.6rem!important;
    }
    .v-sidebar-menu .vsm-title {
        font-size: 14px !important;
        line-height: 1.6rem;
        height: 1.6rem;
    }
</style>
