<template>
  <div class="wrapper bg-oa-grey">
    <notifications></notifications>
    <side-bar class="bg-oa-blue text-white"
      :logo="$config.PROP_STATIC_SERVER + `/bg-x-icon-w.png`"
    >
      <template slot="links">

        <sidebar-item nav-link-class="text-oa-grey text-bold"
                  :link="{
                    name: 'Dashboard',
                    path: '/app/home',
                    icon: 'ni ni-planet'
                  }">
        </sidebar-item>

        <sidebar-item nav-link-class="text-oa-grey text-bold"
                  :link="{
                    name: 'Demo',
                    path: '/app/demo',
                    icon: 'fa fa-whatsapp'
                  }">
        </sidebar-item>

        <sidebar-item hidden nav-link-class="text-white"
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
        <h6 class="navbar-heading p-0 text-muted">Links</h6>

        <b-nav class="navbar-nav mb-md-3">
          <b-nav-item class="text-white text-bold"
             :href="'https://mehery.atlassian.net/servicedesk/customer/portals'" target="_blank">
              <i class="ni ni-support-16 text-white"></i>
              <b-nav-text class="p-0 text-white">Support</b-nav-text>
          </b-nav-item>
        </b-nav>
      </template>
    </side-bar>
    <div class="main-content min-vh-100">
      <dashboard-navbar :type="$route.meta.navbarType"></dashboard-navbar>
      <div @click="$sidebar.displaySidebar(false)" class="min-vh-100">
        <b-container fluid>
          <div style="min-height: 85px;"></div>
          <fade-transition :duration="200" origin="center top" mode="out-in">
            <!-- your content here -->
            <router-view></router-view>
          </fade-transition>
          <div style="min-height: 4rem;"></div>
        </b-container>
      </div>
      <content-footer v-if="!$route.meta.hideFooter" class="content-footer bg-white"></content-footer>
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

  import DashboardNavbar from './Navbar.vue';
  import ContentFooter from './Footer.vue';
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
      },
      showLink(role){
        return window.CONST.APP_USER_ROLE.indexOf(role) > -1
      }
    },
    mounted() {
      this.initScrollbar()
    }
  };
</script>
<style lang="scss">
.content-footer.footer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1030;
  //background: transparent!important;
  padding: .75rem 0;
  border-top: 1px rgba(106, 106, 106, 0.153) solid;
  .nav .nav-item .nav-link, .footer .footer-link{
    color: #fff!important;
  }
}
</style>
