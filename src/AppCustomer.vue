<template>
  <div id="app">
    <component :is="layout">
        <transition name="fade" mode="out-in">
            <router-view>
            </router-view>
        </transition>
    </component>
  </div>
</template>

<script>
  import Vue from 'vue';
  import router from "./app-customer/router";
  
  import { MyFlags,MyDict,MyConst } from './services/global';
  import tunnel from './services/tunnel';
  import formatters from './services/formatters';  

  const loadimage = 'http://hilongjw.github.io/vue-lazyload/dist/loading-spin.svg';
  const errorimage = 'http://hilongjw.github.io/vue-lazyload/dist/loading-spin.svg';
  import VueLazyload from 'vue-lazyload'
  Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: errorimage,
    loading: loadimage,
    attempt: 1,
    throttleWait : 1000
  })

  const default_layout = "default";
  Vue.component('default-layout', () => import('./app-customer/Layout/DefaultLayout.vue'));
  var LOADED_JS = {};
  
  export default {
    name:"AppCustomer",
    computed: {
      layout() {
        return (this.$route.meta.layout || default_layout) + '-layout';
      }
    },
    data: () => ({
    }),
    methods : {
    },
    created (){
      //this.$store.registerModule("DataStore",DataStore);
    },
    mounted() {
        let recaptchaScript = document.createElement('script')
        recaptchaScript.setAttribute('src', 'https://kit.fontawesome.com/1153462312.js')
        document.head.appendChild(recaptchaScript);
    },
    beforeUnmount (){
    },
  }
</script>
<style type="text/css">
  body {
    /*background-color: #cc0da3!important;*/
    background-color: transparent!important; 
/*    background-color :  #000!important;
*/  }
</style>
