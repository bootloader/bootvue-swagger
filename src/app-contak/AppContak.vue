<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
  import Vue from 'vue';
  import "@fortawesome/fontawesome-free/css/all.min.css";
  import DashboardPlugin from '@/@common/argon/plugins/dashboard-plugin';
  Vue.use(DashboardPlugin);
  //import "@/assets/vendor/notus/styles/tailwind.css";

  import VueClipboard from 'vue-clipboard2';
  VueClipboard.config.autoSetContainer = true // add this line
  Vue.use(VueClipboard)

  const loadimage = __webpack_public_path__ + '/_common/static/loading-spin.svg';
  const errorimage = __webpack_public_path__ + '/_common/static/loading-spin.svg';
  import VueLazyload from 'vue-lazyload'
  Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: errorimage,
    loading: loadimage,
    attempt: 1,
    throttleWait : 200
  });
  
  import { ValidationProvider, ValidationObserver } from 'vee-validate';
  Vue.component('ValidationProvider', ValidationProvider);
  Vue.component('ValidationObserver', ValidationObserver);

  Vue.component('MyIcon', () => import('@/@common/custom/components/MyIcon.vue'));
  Vue.component('BaseVSelect', () => import('@/@common/custom/components/base/BaseVSelect.vue'));

  console.log("ConTak App is loaded")
  export default {
    mounted : function (argument) {
        let recaptchaScript = document.createElement('script')
        recaptchaScript.setAttribute('src', 'https://kit.fontawesome.com/1153462312.js')
        document.head.appendChild(recaptchaScript);

      // recaptchaScript = document.createElement('link')
      // recaptchaScript.setAttribute('rel', 'stylesheet')
      // recaptchaScript.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.2/font/bootstrap-icons.css')
      // document.head.appendChild(recaptchaScript);
      
    },
  }

</script>
<style lang="scss">
    @import "@/assets/app-contak.scss";
    @import "./../assets/fonts/my-icon/my-icon.css";
   // @import "./../assets/fonts/openweb/css/openwebicons.css";
    // .v-input-error {
    //   color : red;
    // }
</style>