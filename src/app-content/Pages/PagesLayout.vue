<template>
  <div class="wrapper">
    <div class="main-content min-vh-100">
      <dashboard-navbar :type="$route.meta.navbarType"></dashboard-navbar>
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
      <content-footer class="content-footer"></content-footer>
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

  import DashboardNavbar from './PagesNavbar.vue';
  import ContentFooter from './PagesFooter.vue';
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
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;600&display=swap');
body,html{
    margin: 0;
    padding: 0;
    font-family: "Montserrat";
    background: #f9f9f9;
}
</style>
<style lang="scss">
.content-footer.footer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1030;
  background: transparent!important;
  .nav .nav-item .nav-link, .footer .footer-link{
    color: #fff!important;
  }
}

</style>
