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
  import DataStore from "./Service/DataStore";
  import tunnel from '../services/tunnel';
  import visibility from 'vue-visibility-change';
  import VueCookies from 'vue-cookies'
  Vue.use(VueCookies)

  import Loading from 'vue-loading-overlay';
  Vue.use(Loading);
  Vue.component("Loading",Loading);

  import 'viewerjs/dist/viewer.css'
  import Viewer from 'v-viewer'
  Vue.use(Viewer)

  const loadimage = __webpack_public_path__ + '/_common/static/loading-spin.svg';
  const errorimage = __webpack_public_path__ + '/_common/static/loading-spin.svg';
  import VueLazyload from 'vue-lazyload'
  Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: errorimage,
    loading: loadimage,
    attempt: 1,
    throttleWait : 1000
  })

  const default_layout = "plug";

  Vue.component('app-agent-layout', () => import('./Layout/DefaultAgentLayout.vue'));
  Vue.component('plug-agent-layout', () => import('./Layout/DefaultAgentLayoutPlug.vue'));


  Vue.component('MySource', () => import('@/@common/custom/components/MySource.vue'));
  Vue.component('MyText', () => import('@/@common/custom/components/MyText.vue'));

  var LOADED_JS = {};

  export default {
    name:"AppAgent",
    computed: {
      layout() {
        return (this.$route.meta.layout || this.$route.params.app) + '-agent-layout';
      }
    },
    data: () => ({
      refreshTimer :0 
    }),
    methods : {
      async refresh(){
        //return;
        window.clearTimeout(this.refreshTimer);
        if(!visibility.isSupported() || !visibility.hidden()){
          await this.$store.dispatch("RefeshSession");
        }
        let THIS = this;
        this.refreshTimer = window.setTimeout(function () {
           THIS.refresh();
        }, (tunnel.connected ? 10000 : 1000));
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

          visibility.change((evt, hidden) => {
              this.$store.dispatch('OnlineStatus', {
                type : "away",
                away : hidden
              });
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
    @import "@/assets/base.scss";
    @import '@/assets/utils/_popular.scss';
    @import "@/assets/demo-ui/_agent-panel.scss";
    @import "./../assets/fonts/openweb/css/openwebicons.css";
    .v-input-error {
      color : red;
    }
</style>
