<template>
<div>
  <validation-observer v-slot="{}" ref="login">
    <b-row class="">
      <b-col cols="4">
      </b-col> 
      <b-col cols="4" class="pt-4" v-if="!isLoggedIn">
            <base-input name="Api Key" id="apiKey"   helpMessage="Get your Api Key from OA Panel"
             alternative question feedback v-model="message.apiKey" required/>
            <b-button @click="login" variant="primary" class="btn-block mb-4">Login</b-button>
      </b-col>   
      <b-col cols="4" class="pt-4" v-else>
            <base-input name="Api Key" id="apiKey" readonly
             alternative question feedback required v-model="apiKeySecret"/>
            <base-input name="Phone" id="phone"  helpMessage="Field:phone -Destination Phone number with ISD code"
            alternative question feedback required v-model="message.phone"/>
            <base-input name="Header Prefix" id="value" helpMessage="Field:template.model.prefix - OTP prefix, Currency Code etc "
            alternative question feedback  v-model="message.template.model.prefix" />
            <base-input name="Header Value" id="value" helpMessage="Field:template.model.value - OTP, Amount, Points, Credits etc"
            alternative question feedback  v-model="message.template.model.value" />
            <base-input name="TemplateCode" id="template_code" helpMessage="Field:template.code - Template created for this message"
            alternative question feedback required v-model="message.template.code"/>
            <base-text-area name="modelData" id="TemplateData"  rows="5"  :textLimit="10" rules="required|max:10"
              helpMessage="Field:template.model.data - Additonal template data in json format to replace custom variables"
              alternative question feedback required v-model="modelData"/>
            <base-input name="Validity" id="validity"
            helpMessage="Field:validity - validity of message in Seconds"
            alternative question feedback  v-model="message.validity"/>
            <b-button @click="sendMessage" variant="primary" class="btn-block mb-4">Send Message</b-button>
      </b-col>  
    </b-row>
  </validation-observer>    
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
        apiKey : '',  phone : '', 
        template : { 
          code : '',  
          model : {
            prefix : "", value : '', suffix : '',
            data : {
            },
          }  
        } , validity : ""
      },
      modelData : "{}",
      modalDataValid : true,
      isLoggedIn : false,
      errorMessage : null,
      navbarOpen: false,
      STATIC : 'https://notiphyapp.github.io/twtb-app-landing-page/',
      css : [
        //"https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700",
        //'https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css'
      ]
    };
  },
  watch : {
    'modelData' : function(){
      this.validateModelData();
    }
  },
  computed : {
    apiKeySecret(){
      return this.message.apiKey.split("-").map(function(v,i){
        if(i==0 || i==4){
          return v
        } else {
          return v.replace(/(.)/g,"*");
        }
        return ""
      }).join("-")
    }
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
    async login(){
      try{
        let resp = await this.$service.post("/entoc/login",{
          apiKey : this.apiKey
        });
          this.setError(resp);
        if(!this.errorMessage){
          this.isLoggedIn = true;
        }
      } catch(e){
        this.setError(e.response?.data?.error);
      }
      this.isLoggedIn = true;
    },
    setError(resp){
        this.errorMessage = resp?.error?.message || resp?.error ||  resp?.message;
        this.$refs.login.setErrors({
          'Api Key' : this.errorMessage,
          modelData : "Invalid JSON format"
        })
    },
    async sendMessage(){
      await this.$service.post("/entoc/send",{
        ...this.message,
          otp : this.message?.header?.otp || this.message?.header?.value,
        });
    },
    async validateModelData(){
      try {
        this.message.template.model.data = JSON.parse(this.modelData);
        this.modelDataValid = true;
      } catch(e){
        console.log("JSON",e)
        this.modelDataValid = false;
        this.$refs.login.setErrors({
          modelData : "Invalid JSON format"
        });
      }
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