<template style="background-color: black;">
  <div id="app"  style="background-color: black;">
    <component :is="layout" :class="layoutClass">
      <router-view/>
    </component>  
  </div>
</template>
<script >
  import Vue from 'vue';
  import "@fortawesome/fontawesome-free/css/all.min.css";
  import DashboardPlugin from '@/@common/argon/plugins/dashboard-plugin';
  Vue.use(DashboardPlugin);
  import "@/assets/vendor/notus/styles/tailwind.css";
  import 'bootstrap-vue/dist/bootstrap-vue.css';
  import ReadMore from 'vue-read-more';
  import { ValidationProvider,ValidationObserver } from 'vee-validate';

  import VueClipboard from 'vue-clipboard2';
  VueClipboard.config.autoSetContainer = true // add this line
  Vue.use(VueClipboard)

  import Index from './Index/Index.vue';

  Vue.use(ReadMore);
  Vue.component('ValidationProvider', ValidationProvider);
  Vue.component('ValidationObserver', ValidationObserver);
  Vue.component('BaseInput', () => import('@/@common/argon/components/Inputs/BaseInput.vue'));
  Vue.component('BaseTextArea', () => import('@/@common/argon/components/Inputs/BaseTextArea.vue'));
  Vue.component('BaseCopy', () => import('@/@common/argon/components/BaseCopy.vue'));

  Vue.component('SocialIcon', () => import('./components/SocialIcon.vue'));
  Vue.component('SocialTile', () => import('./components/SocialTile.vue'));
  Vue.component('SocialButton', () => import('./components/SocialButton.vue'));

  Vue.component('SectionWrapper', () => import('./components/SectionWrapper.vue'));
  Vue.component('SocialTileContainer', () => import('./components/SocialTileContainer.vue'));
  Vue.component('MyIcon', () => import('@/@common/custom/components/MyIcon.vue'));
  Vue.component('MyButton', () => import('@/@common/custom/components/MyButton.vue'));

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


  import customPlugin from '@/@common/custom'
  Vue.use(customPlugin,{
    imagekit : {
      imagekitId : 'duckberg',
      urlEndpoint: "https://ik.imagekit.io/duckberg", // Required. Default URL-endpoint is https://ik.imagekit.io/your_imagekit_id
      publicKey: "public_f69VQYB2yQqJGkWeZsYy2NidNO4=", // optional
      authenticationEndpoint: "/linq/api/signature/imagekit", // optional
      transformationPosition: "path" // optional
    }
  });
  

  console.log("Page App is loaded")
  export default {
    components : { Index },
    computed : {
      layout() {
        return this.$route.meta.layout || 'Index';
      },layoutClass(){
        return this.$route.meta.layoutClass;
      }
    },
    mounted : function (argument) {
        let recaptchaScript = document.createElement('script')
        recaptchaScript.setAttribute('src', 'https://kit.fontawesome.com/9cd48bc910.js')
        document.head.appendChild(recaptchaScript);

      // recaptchaScript = document.createElement('link')
      // recaptchaScript.setAttribute('rel', 'stylesheet')
      // recaptchaScript.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.2/font/bootstrap-icons.css')
      // document.head.appendChild(recaptchaScript);
      
    },
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