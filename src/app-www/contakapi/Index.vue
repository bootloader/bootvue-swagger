<template>
<div>
  <b-row class="">
     <b-col cols="4">
     </b-col>   
      <b-col cols="4" class="pt-4">
            <base-input label="apiKey" id="apiKey"
             alternative question feedback v-model="message.apiKey"/>
            <base-input label="phone" id="phone" 
            alternative question feedback v-model="message.phone"/>
            <base-input label="otp" id="otp"
            alternative question feedback  v-model="message.otp" />
            <base-input label="template.code" id="template_code"
            alternative question feedback  v-model="message.template.code"/>
            <base-text-area label="template.data" id="template_code" 
            alternative question feedback   v-model="message.template.data"/>
            <base-input label="validity" id="validity"
            alternative question feedback  v-model="message.validity"/>
            <b-button @click="sendMessage" variant="primary" class="btn-block mb-4">Send Message</b-button>
      </b-col>  
    </b-row>
</div>
</template>
<script>
//import "@/assets/vendor/notus/styles/tailwind.css";
  import Vue from 'vue';
  import "@fortawesome/fontawesome-free/css/all.min.css";
  import DashboardPlugin from '@/@common/argon/plugins/dashboard-plugin';
  Vue.use(DashboardPlugin);
  //import "@/assets/vendor/notus/styles/tailwind.css";

  import VueClipboard from 'vue-clipboard2';
  VueClipboard.config.autoSetContainer = true // add this line
  Vue.use(VueClipboard)

  const loadimage = __webpack_public_path__ + '/_common/static/loading-spin.svg';
  const errorimage = __webpack_public_path__ + '/_common/static/loading-spin.svg';
  
  import { ValidationProvider, ValidationObserver } from 'vee-validate';
  Vue.component('ValidationProvider', ValidationProvider);
  Vue.component('ValidationObserver', ValidationObserver);

  Vue.component('BaseInput', () => import('@/@common/argon/components/Inputs/BaseInput.vue'));

export default {
  data() {
    return {
      message : {
        apiKey : '',  phone : '',  otp : "",value : '',  template : { code : '',  data : '' } , validity : ""
      },
      navbarOpen: false,
      STATIC : 'https://notiphyapp.github.io/twtb-app-landing-page/',
      css : [
        //"https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700",
        //'https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css'
      ]
    };
  },
  computed : {
  },
  mounted(){
      for(var i in this.css){
        let recaptchaScript = document.createElement('link')
        recaptchaScript.setAttribute('rel', 'stylesheet')
        recaptchaScript.setAttribute('href', this.css[i])
        document.head.appendChild(recaptchaScript);
      }
      // let recaptchaScript = document.createElement('script')
      // recaptchaScript.setAttribute('src', 'https://kit.fontawesome.com/1153462312.js')
      // document.head.appendChild(recaptchaScript);
  },
  methods: {
    setNavbarOpen: function () {
      this.navbarOpen = !this.navbarOpen;
    },
    sendMessage(){
      this.$service.post("/newComp/send",this.message);
    }
  },
  components: {
  },
};
</script>
<style lang="scss">
    @import "@/assets/app-contak.scss";
   // @import "./../assets/fonts/openweb/css/openwebicons.css";
    // .v-input-error {
    //   color : red;
    // }
</style>