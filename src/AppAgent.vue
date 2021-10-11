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
  import visibility from 'vue-visibility-change';

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

  Vue.component('default-agent-layout', () => import('./app-agent/Layout/DefaultAgentLayout.vue'));

  var LOADED_JS = {};

  export default {
    name:"AppAgent",
    computed: {
      layout() {
        return (this.$route.meta.layout || default_layout) + '-agent-layout';
      }
    },
    data: () => ({
      refreshTimer :0 
    }),
    methods : {
      async refresh(){
        window.clearTimeout(this.refreshTimer);
        if(!visibility.isSupported() || !visibility.hidden()){
          await this.$store.dispatch("RefeshSession");
        }
        let THIS = this;
        this.refreshTimer = window.setTimeout(function () {
          THIS.refresh();
        },5000);
      }
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
      console.log("TUNNEL")
      this.tunnel = tunnel.init().instance()
        .on("/message/sent/new", function(msg){
            console.log("/message/sent/new===",msg)
            THAT.$store.dispatch('ReadChatMessage', msg);
            THAT.$store.dispatch('RefeshTimer');
        }).on("/message/receive/new", function(msg){
            msg.version = 3;
            console.log("/message/receive/new:msg===",msg);
            THAT.$store.dispatch('ReadChatMessage', msg);
            THAT.$store.dispatch('RefeshTimer');
        }).on("/dept/onassign-"+window.CONST.APP_DEPT, function(testresponse){
            console.log("/dept/onassign-"+window.CONST.APP_DEPT,testresponse);
            THAT.$store.dispatch('AddChat', testresponse);
             THAT.$store.dispatch('RefeshTimer');
        }).on("/dept/onassign-__DEPT__", function(testresponse){
            console.log("/dept/onassign-__DEPT__",testresponse);
            THAT.$store.dispatch('AddChat', testresponse);
             THAT.$store.dispatch('RefeshTimer');
        }).on("/message/update/status", function(status){
            console.log("/message/update/status===",status)
            THAT.$store.dispatch('UpdateChatMessageStatus', status);
             THAT.$store.dispatch('RefeshTimer');
        }).on("/agent/session/update", function(status){
            console.log("/agent/session/update",status)
            THAT.$store.dispatch('SetAgentOptionsStatus', [status]);
             THAT.$store.dispatch('RefeshTimer');
        }).on("/chat/session/update", function(chatSession){
            console.log("/chat/session/update",status)
            THAT.$store.dispatch('ReadSession', [chatSession]);
             THAT.$store.dispatch('RefeshTimer');
        });
      this.refresh();
    },
    beforeUnmount (){
        this.tunnel.off();
        window.clearTimeout(this.refreshTimer);
    },
  }
</script>

<style lang="scss">
    @import "./assets/base.scss";
    @import '@/assets/utils/_popular.scss';
    @import "./assets/demo-ui/_agent-panel.scss";
</style>
