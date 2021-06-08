<template>
  <div id="app">
    <component :is="layout">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </component>
  </div>
</template>

<script>
  import Vue from 'vue';
  import router from "./app-admin/router";
  import DataStore from "./app-admin/Service/DataStore";
  import { ValidationProvider, ValidationObserver } from 'vee-validate';
  import { extend } from 'vee-validate';
  import { required, email,regex } from 'vee-validate/dist/rules';
  import formatters from './services/formatters';  

  Vue.component('admin-default-layout', () => import('./app-admin/Layout/baseLayout.vue'));
  Vue.component('admin-userpages-layout', () => import('./app-admin/Layout/pagesLayout.vue'));
  Vue.component('ValidationProvider', ValidationProvider);
  Vue.component('ValidationObserver', ValidationObserver);

  const default_layout = "default";


  // No message specified.
  extend('email', email);
  extend("regex", regex);
  // Override the default message.
  extend('required', {
    ...required,
    message: 'This field is required'
  });

formatters.validators.forEach(ruleName => {
  if(formatters[ruleName]){
    extend(ruleName, formatters[ruleName]);
  }
});


  export default {
    name:"AppAdmin",
    computed: {
      layout() {
        return 'admin-' +(this.$route.meta.layout || default_layout) + '-layout';
      }
    },
    mounted : function (argument) {
        let recaptchaScript = document.createElement('script')
        recaptchaScript.setAttribute('src', 'https://kit.fontawesome.com/1153462312.js')
        document.head.appendChild(recaptchaScript);
    },
    created (){
      this.$store.registerModule("DataStore",DataStore);
    },
  }
</script>

<style lang="scss">
  @import "./assets/base.scss";
  .v-input-error {
    color : red;
  }
</style>
