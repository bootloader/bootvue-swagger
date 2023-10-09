<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
  import Vue from 'vue';
  import mixin from './../services/mixin.js'
  mixin.init();

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

 // Vue.component('MyIcon', () => import('@/@common/custom/components/MyIcon.vue'));
  //Vue.component('BaseVSelect', () => import('@/@common/custom/components/base/BaseInput.vue'));

  console.log("WWW App is loaded")
  export default {

  }
</script>
<style lang="scss">
    //@import "@/assets/base.scss";
   // @import "./../assets/fonts/openweb/css/openwebicons.css";
    // .v-input-error {
    //   color : red;
    // }
</style>