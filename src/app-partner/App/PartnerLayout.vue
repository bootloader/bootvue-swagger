<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar
      :logo="$config.PROP_LOGO_BG_X_LOGO_B"
    >
      <template slot="links">

        <sidebar-item
                  :link="{
                    name: 'Domains',
                    path: '/app/home',
                    icon: 'ni ni-planet text-blue'
                  }">
        </sidebar-item>

        <sidebar-item hidden
          :link="{
            name: 'Dashboard',
            path: '/app/dashboard',
            icon: 'ni ni-tv-2 text-primary',
          }"
        >
        </sidebar-item>

        <sidebar-item hidden
            :link="{
              name: 'Icons',
              path: '/app/icons',
              icon: 'ni ni-planet text-blue'
              }"
            >
        </sidebar-item>

        <sidebar-item hidden
              :link="{
                name: 'Maps',
                path: '/app/maps',
                icon: 'ni ni-pin-3 text-orange'
              }">
        </sidebar-item>

        <sidebar-item hidden
              :link="{
                name: 'User Profile',
                path: '/app/profile',
                icon: 'ni ni-single-02 text-yellow'
                }">
        </sidebar-item>

        <sidebar-item hidden
                :link="{
                  name: 'Tables',
                  path: '/app/tables',
                  icon: 'ni ni-bullet-list-67 text-red'
                }">
        </sidebar-item>

        <sidebar-item hidden
                  :link="{
                    name: 'Login',
                    path: '/app/login',
                    icon: 'ni ni-key-25 text-info'
                  }">
        </sidebar-item>
        <sidebar-item hidden
                  :link="{
                    name: 'Register',
                    path: '/app/register',
                    icon: 'ni ni-circle-08 text-pink'
                  }">
        </sidebar-item>
      </template>

      <template slot="links-after">
        <hr class="my-3">
        <h6 class="navbar-heading p-0 text-muted">Documentation</h6>

        <b-nav class="navbar-nav mb-md-3">
          <b-nav-item :href="$config.PROP_SERVICE_DOCS_API_LINK">
              <i class="ni ni-spaceship"></i>
              <b-nav-text class="p-0">API Docs</b-nav-text>
          </b-nav-item>
          <b-nav-item :href="$config.PROP_SERVICE_DOCS_CHAT_LINK">
              <i class="ni ni-palette"></i>
              <b-nav-text class="p-0">Chat Plugin</b-nav-text>
          </b-nav-item>
        </b-nav>
      </template>
    </side-bar>
    <div class="main-content">
      <dashboard-navbar :type="$route.meta.navbarType"></dashboard-navbar>

      <div @click="$sidebar.displaySidebar(false)">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-new */
  import PerfectScrollbar from 'perfect-scrollbar';
  import 'perfect-scrollbar/css/perfect-scrollbar.css';

console.log("This is AppPartnerAuth")

  function hasElement(className) {
    return document.getElementsByClassName(className).length > 0;
  }

  function initScrollbar(className) {
    if (hasElement(className)) {
      new PerfectScrollbar(`.${className}`);
    } else {
      // try to init it later in case this component is loaded async
      setTimeout(() => {
        initScrollbar(className);
      }, 100);
    }
  }

  import DashboardNavbar from './PartnerNavbar.vue';
  import ContentFooter from './PartnerFooter.vue';
  //import DashboardContent from '../Layout/Content.vue';
  import { FadeTransition } from 'vue2-transitions';

  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      //DashboardContent,
      FadeTransition
    },
    methods: {
      initScrollbar() {
        let isWindows = navigator.platform.startsWith('Win');
        if (isWindows) {
          initScrollbar('sidenav');
        }
      }
    },
    mounted() {
      this.initScrollbar()
    }
  };
</script>
<style lang="scss">
</style>
