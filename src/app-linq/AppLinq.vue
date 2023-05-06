<template>
  <div id="app">
    <Index>
      <router-view/>
    </Index>  
  </div>
</template>
<script>
  import Vue from 'vue';
  import "@fortawesome/fontawesome-free/css/all.min.css";
  import DashboardPlugin from '@/@common/argon/plugins/dashboard-plugin';
  Vue.use(DashboardPlugin);
  import "@/assets/vendor/notus/styles/tailwind.css";
  import ReadMore from 'vue-read-more';
  import { ValidationProvider,ValidationObserver } from 'vee-validate';
  import mixin from './../services/mixin.js'
  mixin.init();

  import Index from './Index/Index.vue';

  Vue.use(ReadMore);
  Vue.component('ValidationProvider', ValidationProvider);
  Vue.component('ValidationObserver', ValidationObserver);
  Vue.component('BaseInput', () => import('@/@common/argon/components/Inputs/BaseInput.vue'));
  Vue.component('BaseTextArea', () => import('@/@common/argon/components/Inputs/BaseTextArea.vue'));

  Vue.component('SocialTile', () => import('./components/SocialTile.vue'));
  Vue.component('SocialIcon', () => import('./components/SocialIcon.vue'));

  
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
  console.log("Page App is loaded")
  export default {
    components : { Index }
  }

</script>
<style lang="scss">
    //@import "@/assets/base.scss";
    @import '@/assets/app-linq.scss';
    // @import "./../assets/fonts/openweb/css/openwebicons.css";
    // .v-input-error {
    //   color : red;
    // }
</style>