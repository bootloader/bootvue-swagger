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
  import visibility from 'vue-visibility-change';
  import VueCookies from 'vue-cookies'
  Vue.use(VueCookies)

  import Loading from 'vue-loading-overlay';
  Vue.use(Loading);
  Vue.component("Loading",Loading);

  import 'viewerjs/dist/viewer.css'
  import Viewer from 'v-viewer'
  Vue.use(Viewer)
  import notyAudioUrl from "@/assets/sound/alert.mp3";
  import VueScrollTo from 'vue-scrollto';
  Vue.use(VueScrollTo);

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

  import { ValidationProvider, ValidationObserver } from 'vee-validate';
  Vue.component('ValidationProvider', ValidationProvider);
  Vue.component('ValidationObserver', ValidationObserver);

  Vue.component('BaseInput', () => import('@/@common/argon/components/Inputs/BaseInput.vue'));

  Vue.component('MySource', () => import('@/@common/custom/components/MySource.vue'));
  Vue.component('MyText', () => import('@/@common/custom/components/MyText.vue'));
  Vue.component('MyIcon', () => import('@/@common/custom/components/MyIcon.vue'));
  

  var LOADED_JS = {};

  export default {
    name:"AppAgent",
    computed: {
      layout() {
        if(this.$route.params.app == 'plug'){
            return 'plug-agent-layout';
        }
        if(this.$route.params.app == 'plug_mitel' || window.CONST.APP_PLUG == 'mitel'){
          return 'plug-agent-layout';
        }
        return 'app-agent-layout';
      }
    },
    data: () => ({
      refreshTimer :0 ,
      notyAudio: new Audio(notyAudioUrl),
      enableAudioNotification:(localStorage.getItem("AUDIO_NOTIFICATION") == 'true')
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
        }, (this.$tunnel.connected ? 10000 : 1000));
      },
      playNotification(){
        const promise = this.notyAudio.play();

        if (promise !== undefined) {
            promise.then(() => {}).catch(error => console.error);
        }
      },
      storageListener(){
        console.log("storageListener");
        this.enableAudioNotification = (localStorage.getItem("AUDIO_NOTIFICATION") == 'true')
      }
    },
    beforeDestroy() {
        document.removeEventListener("soundNotification", this.storageListener);
    },
    created (){
      this.$store.registerModule("DataStore",DataStore);
    },
    mounted() {
      let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', 'https://kit.fontawesome.com/1153462312.js')
      document.head.appendChild(recaptchaScript);
      
      recaptchaScript = document.createElement('link')
      recaptchaScript.setAttribute('rel', 'stylesheet')
      recaptchaScript.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.2/font/bootstrap-icons.css')
      document.head.appendChild(recaptchaScript);



  
      // let css = document.createElement('link');
      // css.setAttribute('rel', 'stylesheet');
      // css.setAttribute('type', 'text/css');
      // css.setAttribute('href', '//www.w3schools.com/w3css/4/w3.css')
      // document.head.appendChild(css);

      var THAT =  this;
      console.log("TUNNEL")
      this.tunnel = this.$tunnel.pipe()
        .on("/message/sent/new", function(msg){
            console.info("/message/sent/new===",msg)
            THAT.$store.dispatch('ReadChatMessage', msg);
            THAT.$store.dispatch('RefeshTimer');
        }).on("/message/receive/new", function(msg){
            msg.version = 3;
            console.info("/message/receive/new:msg===",msg);
            THAT.$store.dispatch('ReadChatMessage', msg);
            THAT.$store.dispatch('RefeshTimer');
            THAT.enableAudioNotification ? THAT.playNotification() : "";
        }).on("/dept/onassign-"+window.CONST.APP_DEPT, function(testresponse){
            console.debug("/dept/onassign-"+window.CONST.APP_DEPT,testresponse);
             THAT.$store.dispatch('AddChat', testresponse);
             THAT.$store.dispatch('RefeshTimer');
        }).on("/dept/onassign-__DEPT__", function(testresponse){
            console.debug("/dept/onassign-__DEPT__",testresponse);
            THAT.$store.dispatch('AddChat', testresponse);
             THAT.$store.dispatch('RefeshTimer');
        }).on("/message/update/status", function(status){
            console.debug("/message/update/status===",status)
            THAT.$store.dispatch('UpdateChatMessageStatus', status);
             THAT.$store.dispatch('RefeshTimer');
        }).on("/agent/session/update", function(status){
            console.debug("/agent/session/update",status)
            THAT.$store.dispatch('SetAgentOptionsStatus', [status]);
             THAT.$store.dispatch('RefeshTimer');
        }).on("/chat/session/update", function(chatSession){
            console.debug("/chat/session/update",chatSession)
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
      document.addEventListener("soundNotification", this.storageListener);
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
    @import "./../assets/fonts/my-icon/my-icon.css";
    .v-input-error {
      color : red;
    }
</style>
