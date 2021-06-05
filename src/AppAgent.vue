<template>
  <div id="app">
 
      <link rel="stylesheet" type="text/css" 
        href="https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.min.css">

    <component :is="layout">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </component>
  </div>
</template>

<script>
  import Vue from 'vue';
  import router from "./app-agent/router";
  import DataStore from "./app-agent/Service/DataStore";
  import { MyFlags,MyDict,MyConst } from './services/global';
  import tunnel from './services/tunnel';
  import formatters from './services/formatters';  

  import 'viewerjs/dist/viewer.css'
  import Viewer from 'v-viewer'
   Vue.use(Viewer)


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

  Vue.component('default-layout', () => import('./app-agent/Layout/DefaultLayout.vue'));

  var LOADED_JS = {};

  export default {
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
      this.$store.registerModule("DataStore",DataStore);
    },
    mounted() {
      let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', 'https://kit.fontawesome.com/1153462312.js')
      document.head.appendChild(recaptchaScript);
      
  
      // let css = document.createElement('link');
      // css.setAttribute('rel', 'stylesheet');
      // css.setAttribute('type', 'text/css');
      // css.setAttribute('href', '//www.w3schools.com/w3css/4/w3.css')
      // document.head.appendChild(css);

      var THAT =  this;
      this.tunnel = tunnel.init().instance()
        .on("/agent/onmessage", function(msg){
            msg.version = 3;
            console.log("/agent/onmessage===",msg)
            THAT.$store.dispatch('ReadChat', msg);
        }).on("/message/receive/new", function(msg){
            msg.version = 3;
            console.log("/message/receive/new:msg===",msg);
            THAT.$store.dispatch('ReadChat', msg);
        }).on("/dept/onassign-"+window.CONST.APP_DEPT, function(testresponse){
            THAT.$store.dispatch('AddChat', testresponse);
        }).on("/dept/onassign-__DEPT__", function(testresponse){
            THAT.$store.dispatch('AddChat', testresponse);
        }).on("/message/update/status", function(status){
            console.log("/message/update/status===",status)
            THAT.$store.dispatch('UpdateChatMessageStatus', status);
        }).on("/agent/session/update", function(status){
            console.log("/agent/session/update",status)
            THAT.$store.dispatch('SetAgentOptionsStatus', [status]);
        }).on("/chat/session/update", function(chatSession){
            console.log("/chat/session/update",status)
            THAT.$store.dispatch('ReadSession', [chatSession]);
        });
    },
    beforeUnmount (){
        this.tunnel.off();
    },
  }
</script>
