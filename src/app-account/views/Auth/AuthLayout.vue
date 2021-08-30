<template>
  <div class="main-content bg-default">

  <b-navbar v-if="defaultBar" fixed 
   toggleable="md" type="transparent" variant="faded"
   class="navbar-horizontal navbar-main navbar-top navbar-dark">

      <b-row class="w-100">
        
        <b-col cols=12 md="4" class="navbar-wrapper text-md-center">
          <b-navbar-brand to="/" class="pl-3">
            <img :src="$config.PROP_LOGO_BG_X_LOGO_W" />
          </b-navbar-brand>
          <b-navbar-toggle target="nav-text-collapse" class="float-right"></b-navbar-toggle>
        </b-col>

        <b-col cols="12" md="8">
          <b-collapse id="nav-text-collapse" is-nav>
            <b-navbar-nav class="align-items-lg-center ml-md-auto">

                <b-nav-item to="/auth/forgot-pass" v-if="$route.name !== 'forgot-pass'">
                  <i class="fa fa-unlock-alt text-primary"></i>
                  <span class="nav-link-inner--text text-primary">Forgot password</span>
                </b-nav-item>
                <b-nav-item to="/auth/register" v-if="$route.name !== 'register'">
                  <i class="fa fa-user  text-primary"></i>
                  <span class="nav-link-inner--text  text-primary">Register</span>
                </b-nav-item>
                <b-nav-item to="/auth/login" v-if="$route.name !== 'login'">
                  <i class="fa fa-key  text-primary"></i>
                  <span class="nav-link-inner--text  text-primary">Login</span>
                </b-nav-item>

            </b-navbar-nav>
          </b-collapse>
        </b-col>
      </b-row>

  </b-navbar>


    <base-nav v-if="!defaultBar"
      :transparent="true"
      menu-classes="justify-content-end"
      class="navbar-horizontal navbar-main navbar-top navbar-dark"
      expand="lg"
      @change="onToggleNavbar" >

      <div slot="brand" class="navbar-wrapper">
      </div>

      <template>
        <div class="navbar-collapse-header">
          <b-row>
            <b-col cols="6" class="collapse-brand">
              <router-link to="/">
                <img :src="$config.PROP_LOGO_BG_X_ICON" />
              </router-link>
            </b-col>
            <b-col cols="6" class="collapse-close">
              <button
                type="button"
                class="navbar-toggler" @click="closeMenu">
                <span></span>
                <span></span>
              </button>
            </b-col>
          </b-row>
        </div>
        <b-navbar-nav class="align-items-lg-center ml-lg-auto">
          <b-nav-item to="/auth/forgot-pass" v-if="$route.name !== 'forgot-pass'">
            <i class="fa fa-unlock-alt text-primary"></i>
            <span class="nav-link-inner--text text-primary">Forgot password</span>
          </b-nav-item>
          <b-nav-item to="/auth/register" v-if="$route.name !== 'register'">
            <i class="fa fa-user  text-primary"></i>
            <span class="nav-link-inner--text  text-primary">Register</span>
          </b-nav-item>
          <b-nav-item to="/auth/login" v-if="$route.name !== 'login'">
            <i class="fa fa-key  text-primary"></i>
            <span class="nav-link-inner--text  text-primary">Login</span>
          </b-nav-item>
        </b-navbar-nav>
      </template>
    </base-nav>

    <b-row class="main-content  min-vh-100 w-100 m-0 p-0">
      <b-col md="4">
        <div class="min-md-vh-100 w-75 m-auto pt-6 pb-3">


<ul class="list-unstyled bg-transparent text-white row">
  <li v-for="b in bulletin" class="media bg-transparent mt-4 col-12 col-md-12" :key="b.title">
    <span class="icon mr-3 text-center small">
      <i :class="b.icon" class=""></i>
    </span> 
    <small class="clearfix text-white d-inline d-md-none">{{b.title}}</small> 
    <div class="clearfix"/>
    <div class="media-body d-none d-md-inline">  
      <h2 class="info-title text-white">{{b.title}}</h2>    
      <p class="description d-none d-lg-inline"> 
          {{b.caption}}
      </p>
    </div>
    <div class="clearfix"/>
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
      defaultBar : true,
      menuTransitionDuration: 250,
      pageTransitionDuration: 200,
      year: new Date().getFullYear(),
      pageClass: "login-page",
      bulletin : [
        {icon : "far fa-user-circle",title : "Free account", caption : "Create free account and add multiple channles for free"},
        {icon: "far fa-comments", title : "Multi channel", caption : "Connect with your custmers on popular social channles from single screen. Focus on communication not the mode."},
        {icon : "fa fa-user-astronaut", title : "Smart communication", caption : "Define message formats, reply suggestions, manage your customer support action from agent panel."},
        {icon : "fa fa-bolt", title : "Quick response", caption : "Quick replies, automated responses."},
      ]
    };
  },
  computed: {
    title() {
      return `${this.$route.name} Page`;
    },
  },
  methods: {
    onToggleNavbar(showMenu) {
      console.log("onToggleNavbar",showMenu);
      this.showMenu = showMenu;
      if(this.showMenu){
          //document.body.classList.add("nav-open");
      } else {
          //document.body.classList.remove("nav-open");
      }
    },
    toggleNavbar() {
      document.body.classList.toggle("nav-open");
      this.showMenu = !this.showMenu;
      console.log("toggleNavbar",this.showMenu )
    },
    closeMenu() {
      console.log("closeMenu")
      document.body.classList.remove("nav-open");
      this.showMenu = false;
      console.log("toggleNavbar",this.showMenu )
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
    console.log("beforeRouteUpdate")
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
