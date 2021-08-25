<template>
  <div class="main-content bg-default">
    <base-nav
      v-model="showMenu"
      :transparent="true"
      menu-classes="justify-content-end"
      class="navbar-horizontal navbar-main navbar-top navbar-dark"
      expand="lg"
    >
      <div slot="brand" class="navbar-wrapper">
        <b-navbar-brand to="/">
          <img src="/logo/logo-long-o.png" />
        </b-navbar-brand>
      </div>

      <template>
        <div class="navbar-collapse-header">
          <b-row>
            <b-col cols="6" class="collapse-brand">
              <router-link to="/">
                <img src="/argon/img/brand/green.png" />
              </router-link>
            </b-col>
            <b-col cols="6" class="collapse-close">
              <button
                type="button"
                class="navbar-toggler"
                @click="showMenu = false"
              >
                <span></span>
                <span></span>
              </button>
            </b-col>
          </b-row>
        </div>
        <b-navbar-nav class="align-items-lg-center ml-lg-auto">
          <b-nav-item to="/register">
            <i class="ni ni-circle-08"></i>
            <span class="nav-link-inner--text">Register</span>
          </b-nav-item>
          <b-nav-item to="/login">
            <i class="ni ni-key-25"></i>
            <span class="nav-link-inner--text">Login</span>
          </b-nav-item>
        </b-navbar-nav>
      </template>
    </base-nav>

    <b-row class="min-vh-100 w-100 m-0 p-0">
      <b-col md="4">
        <div class="main-content min-vh-100 w-75 m-auto pt-7 pb-3">


<ul class="list-unstyled bg-transparent text-white">
  <li class="media bg-transparent mt-4">
    <span class="icon mr-3 ">
      <i class="far fa-user-circle"></i>
    </span> 
    <div class="clearfix" />
    <div class="media-body">  
      <h2 class="info-title text-white">Free account</h2>    
      <p class="description"> 
          Create free account and add multiple channles for free
      </p>
    </div>
  </li>
  <li class="media bg-transparent mt-4">
    <span class="icon mr-3">
      <i class="far fa-comments"></i>
    </span> 
    <div class="clearfix" />
    <div class="media-body">  
      <h2 class="info-title text-white">Multi channel</h2>    
      <p class="description"> 
        Connect with your custmers on popular social channles from single screen. 
        Focus on communication not the mode.
      </p>
    </div>
  </li>
  <li class="media bg-transparent mt-4">
    <span class="icon mr-3">
      <i class="fa fa-user-astronaut"></i>
    </span> 
    <div class="clearfix" />
    <div class="media-body">  
       <h2 class="info-title text-white">Smart communication</h2>    
      <p class="description"> 
        Define message formats, reply suggestions, manage your customer support action from agent panel
      </p>
    </div>
  </li>
  <li class="media bg-transparent mt-4">
    <span class="icon mr-3">
      <i class="fa fa-bolt"></i>
    </span> 
    <div class="clearfix" />
    <div class="media-body">  
       <h2 class="info-title text-white">Quick response</h2>    
      <p class="description"> 
        Quick replies, automated responses.
      </p>
    </div>
  </li>
</ul>






        </div>
      </b-col>
      <b-col md="8" class="bg-secondary">
        <div class="main-content min-vh-100 pt-7 pb-3 w-100">
          <zoom-center-transition
            :duration="pageTransitionDuration"
            mode="out-in"
          >
            <router-view></router-view>
          </zoom-center-transition>
        </div>
      </b-col>
    </b-row>

    <footer class="py-3 bg-secondary" id="footer-main">
      <b-container>
        <b-row align-v="center" class="justify-content-xl-between">
          <b-col xl="6">
            <div class="copyright text-center text-xl-left text-muted">
              © {{ year }}
              <a
                href="https://www.mehery.com"
                class="font-weight-bold ml-1"
                target="_blank"
                >MeherY</a
              >
            </div>
          </b-col>
          <b-col xl="6" class="col-xl-6">
            <b-nav
              class="nav-footer justify-content-center justify-content-xl-end"
            >
              <b-nav-item
                href="https://www.mehery.com/#aboutus"
                target="_blank"
              >
                About Us
              </b-nav-item>
              <b-nav-item href="https://www.mehery.com/privacy-policy/#page-content" target="_blank">
                Privacy Policy
              </b-nav-item>
              <b-nav-item
                href="https://www.mehery.com/terms-conditions/#page-content"
                target="_blank"
              >
                Terms of Service
              </b-nav-item>
            </b-nav>
          </b-col>
        </b-row>
      </b-container>
    </footer>
  </div>
</template>
<script>
import { BaseNav } from "@/@common/argon/components";
import { ZoomCenterTransition } from "vue2-transitions";

export default {
  components: {
    BaseNav,
    ZoomCenterTransition,
  },
  props: {
    backgroundColor: {
      type: String,
      default: "black",
    },
  },
  data() {
    return {
      showMenu: false,
      menuTransitionDuration: 250,
      pageTransitionDuration: 200,
      year: new Date().getFullYear(),
      pageClass: "login-page",
    };
  },
  computed: {
    title() {
      return `${this.$route.name} Page`;
    },
  },
  methods: {
    toggleNavbar() {
      document.body.classList.toggle("nav-open");
      this.showMenu = !this.showMenu;
    },
    closeMenu() {
      document.body.classList.remove("nav-open");
      this.showMenu = false;
    },
    setBackgroundColor() {
      document.body.classList.add("bg-default");
    },
    removeBackgroundColor() {
      document.body.classList.remove("bg-default");
    },
    updateBackground() {
      if (!this.$route.meta.noBodyBackground) {
        this.setBackgroundColor();
      } else {
        this.removeBackgroundColor();
      }
    },
  },
  beforeDestroy() {
    this.removeBackgroundColor();
  },
  beforeRouteUpdate(to, from, next) {
    // Close the mobile menu first then transition to next page
    if (this.showMenu) {
      this.closeMenu();
      setTimeout(() => {
        next();
      }, this.menuTransitionDuration);
    } else {
      next();
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler: function () {
        this.updateBackground();
      },
    },
  },
};
</script>
<style lang="scss">
$scaleSize: 0.8;
@keyframes zoomIn8 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  100% {
    opacity: 1;
  }
}

.main-content .zoomIn {
  animation-name: zoomIn8;
}

@keyframes zoomOut8 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}

.main-content .zoomOut {
  animation-name: zoomOut8;
}
#footer-main {
  border-top: 1px #e2e2e2 solid;
}
</style>
