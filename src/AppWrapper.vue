<template>
  <div id="app" class="app-wrapper">
    <component :is="app">

    </component>
  </div>
</template>

<script>
  import Vue from 'vue';


  Vue.component('app-admin', () => import('./AppAdmin.vue'));
  Vue.component('app-agent', () => import('./AppAgent.vue'));
  Vue.component('app-customer', () => import('./AppCustomer.vue'));
  Vue.component('app-dev', () => import('./AppDev.vue'));

  export default {
    name : "AppWrapper",
    computed: {
      app() {
        return 'app-'+window.CONST.APP;
      }
    }
  }
</script>

<style lang="scss">
  //@import "./assets/base.scss";
</style>
