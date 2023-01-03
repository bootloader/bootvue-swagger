<template>
<div>
          <validation-observer v-slot="{}" ref="login">
    <b-row class="styler-height-fix">
      <b-col cols="4" class="pt-4" v-if="!isLoggedIn">
            <base-input name="Api Key" id="apiKey"   helpMessage="Get your Api Key from OA Panel"
             alternative question feedback v-model="message.apiKey" required/>
            <b-button @click="login" variant="primary" class="btn-block mb-4">Login</b-button>
      </b-col>   
      <b-col cols="4" class="pt-4" v-if="isLoggedIn">
            <base-input name="Api Key" id="apiKey" readonly 
             alternative question feedback required v-model="apiKeySecret"/>
          <base-input name="Phone" id="phone"
            helpMessage="Field:phone -Destination Phone number with ISD code"
            alternative question feedback required v-model="message.phone"/>
      <base-input name="Validity" id="validity"
            helpMessage="Field:validity - validity of message in Seconds"
            alternative question feedback  v-model="message.validity"/>
          <base-input name="Header Prefix" id="value"
             helpMessage="Field:template.model.prefix - OTP prefix, Currency Code etc "
            alternative question feedback  v-model="message.template.model.prefix" />
            <base-input name="Header Value" id="value"
            helpMessage="Field:template.model.value - OTP, Amount, Points, Credits etc"
            alternative question feedback  v-model="message.template.model.value" />
      </b-col> 
      <b-col cols="4" class="pt-4" v-if="isLoggedIn">
            <base-input name="TemplateCode" id="template_code"
              helpMessage="Field:template.code - Template created for this message"
            alternative question feedback required v-model="message.template.code" />
            <!-- <base-text-area name="Model Data" id="model_data" 
               rows="5" @change="validateModelData" @blur="validateModelData"
              helpMessage="Field:template.model.data - Additonal template data in json format to replace custom variables"
              alternative question feedback required v-model="modelData"
              formatFilter="json" :formatValue="message.template.model.data" /> -->
            <div class="vgrid-wrapper w-100 bg-white" style="height: 200px">
              <VGrid theme="default" class="w-100 position-relative" 
                  :columns="sampleVar.columns"
                  :source="sampleVar.data"
                  @afteredit=afterEdit
              ></VGrid>
            </div> 

            <b-button @click="sendMessage" variant="primary" class="btn-block mb-4">Send Message</b-button>
      </b-col> 
      <b-col cols="4" class="pt-4" v-if="isLoggedIn">
        <pre class="text-sm">
curl -X POST /api.mehery.io/xms/api/v1/message/send \
-H 'Content-Type: application/json' \
-H 'x-api-key: {{apiRequest.apiKey}}'
-d {{apiRequest|json}}
        </pre>
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
  import VGrid, { VGridVueTemplate } from "@revolist/vue-datagrid";


  const loadimage = __webpack_public_path__ + '/_common/static/loading-spin.svg';
  const errorimage = __webpack_public_path__ + '/_common/static/loading-spin.svg';
  
  import { ValidationProvider, ValidationObserver } from 'vee-validate';
  Vue.component('ValidationProvider', ValidationProvider);
  Vue.component('ValidationObserver', ValidationObserver);

  Vue.component('BaseInput', () => import('@/@common/argon/components/Inputs/BaseInput.vue'));
  import debounce from "debounce";

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
      sample : {},
      sampleVar : {
        columns: [
          { name: 'Variable', prop: "variable"},
          { name: 'Value', prop: "value"}] ,
        contact : [],
        data : [{},{},{}]
      } ,
      isLoggedIn : false,
      errorMessage : null,
      navbarOpen: false,
      STATIC : 'https://notiphyapp.github.io/twtb-app-landing-page/',
      css : [
        //"https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700",
        //'https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css'
      ],
    };
  },
  watch : {
    // 'modelData' : function(){
    //   //this.validateModelData();
    // }
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
    },
    apiRequest(){
      return {
        ...this.message,
        apiKey : this.apiKeySecret
      }
    }
  },
  mounted(){
    this.validateModelData = debounce(validateModelData,1000);
    this.formatModelData = debounce(formatModelData,2000)
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
          'Model Data' : "Invalid JSON format",
          'TemplateCode' : "TemplateCode"
        });
    },
    async sendMessage(){
      await this.$service.post("/entoc/send",{
        ...this.message,
          otp : this.message?.header?.otp || this.message?.header?.value,
        });
    },
    validateModelData(){
      try {
        this.message.template.model.data = JSON.parse(this.modelData);
        //this.formatModelData();
      } catch(e){
        setTimeout(()=>{
            this.$refs.login.setErrors({
                'Model Data' : e.toString()
            });
        })
 
      }
    },
    formatModelData(){
      this.modelData = this.$options.filters.json(this.modelData);
    },
    afterEdit(){
      this.sampleVar.data  = [...this.sampleVar.data.filter((r)=>{
        if(!!r.variable || !!r.value){
          this.message.template.model.data[r.variable] = r.value;
          return true;
        }
        return false
      }),{},{},{}];
    }
  },
  components: {
    VGrid
  },
};
</script>
<style lang="scss">
    @import "@/assets/app-contak.scss";
    .vgrid-wrapper {
      height: 50px;
      min-height: 50px;
    }
   // @import "./../assets/fonts/openweb/css/openwebicons.css";
    // .v-input-error {
    //   color : red;
    // }
</style>