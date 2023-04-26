<template>
<div>
          <validation-observer v-slot="{}" ref="login">
    <b-row class="styler-height-fix" align-content="center"  v-if="!isLoggedIn">
      <b-col xs="12"  sm="12" md="4"  class="pt-4"></b-col>
      <b-col xs="12"  sm="12" md="4"   class="pt-4 px-4 text-center">
            <img class="mb-4 mw-100" :src="loginImage" alt="">
            <base-input name="Api Key" id="apiKey"   helpMessage="Get your Api Key from OA Panel"
             alternative question feedback v-model="message.apiKey" required/>
            <b-button @click="login" variant="primary" class="btn-block mb-4">Login</b-button>
      </b-col>   
    </b-row>  
    <b-row class="styler-height-fix" v-if="isLoggedIn">
      <b-col cols="4" class="pt-4">
        <base-input name="Api Key" id="apiKey" readonly 
             alternative question feedback required v-model="apiKeySecret"/>
        <base-input name="TemplateCode" id="template_code"
              helpMessage="Field:template.code - Template created for this message"
            alternative question feedback required v-model="message.template.code" />
        <base-input name="Phone" id="phone"
            helpMessage="Field:phone -Destination Phone number with ISD code"
            alternative question feedback required v-model="message.phone"/>
      <base-input name="Validity" id="validity"
            helpMessage="Field:validity - validity of message in Seconds"
            alternative question feedback  v-model="message.validity"/>
          <!-- <base-input name="Header Prefix" id="value"
             helpMessage="Field:template.model.prefix - OTP prefix, Currency Code etc "
            alternative question feedback  v-model="message.template.model.prefix" />
            <base-input name="Header Value" id="value"
            helpMessage="Field:template.model.value - OTP, Amount, Points, Credits etc"
            alternative question feedback  v-model="message.template.model.value" /> -->
      </b-col> 
      <b-col cols="4" class="pt-4 px-0">
            <!-- <base-text-area name="Model Data" id="model_data" 
               rows="5" @change="validateModelData" @blur="validateModelData"
              helpMessage="Field:template.model.data - Additonal template data in json format to replace custom variables"
              alternative question feedback required v-model="modelData"
              formatFilter="json" :formatValue="message.template.model.data" /> -->
             <div> <b-badge variant="primary">Header Inputs</b-badge></div>
            <div class="vgrid-wrapper w-100" style="height: 200px" >
              <VGrid theme="default" class="w-100 position-relative bg-white" v-if="showGrid"
                  :autoSizeColumn="true"
                  :columns="sampleVar.modelColumns"
                  :source="sampleVar.model"
                  @afteredit=afterEditModel
              ></VGrid>
            </div> 
            <div> <b-badge variant="primary">Data Variables</b-badge></div>
            <div class="vgrid-wrapper w-100" style="height: 200px"  v-if="showGrid">
              <VGrid theme="default" class="w-100 position-relative bg-white" 
                  :autoSizeColumn="true"
                  :columns="sampleVar.dataColumns"
                  :source="sampleVar.data"
                  @afteredit=afterEditData
              ></VGrid>
            </div> 
            <b-button @click="sendMessage" variant="primary" class="btn-block mb-4">Send Message</b-button>
      </b-col> 
      <b-col cols="4" class="pt-4" v-if="isLoggedIn">
        <pre class="text-sm">
curl -X POST <b>{{apiEndPoint}}</b> \
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
  const loginImage = __webpack_public_path__ + '/_common/static/xms-logo.png';
  
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
            title : "", subtitle : '',
            data : {
            },
          }  
        } , validity : ""
      },
      modelData : "{}",
      sample : {},
      apiEndPoint : document.location.origin + '/entoc/send',
      sampleVar : {
        modelColumns: [
          { name: 'Key', prop: "path", readonly : true, autoSize: true},
          { name: 'Variable', prop: "variable",readonly : true, autoSize: true},
          { name: 'Value', prop: "value", autoSize: true}] ,
        dataColumns: [
          { name: 'Key', prop: "path", autoSize: true},
          { name: 'Variable', prop: "variable",readonly : true,  autoSize: true},
          { name: 'Value', prop: "value",  autoSize: true}] ,
        contact : [],
        model : [
          { variable : "{{prefix}}", path : "prefix", desc : "eg: Rs,INR etc", readonly : true }, 
          { variable : "{{value}}", path : "value" ,desc : "eg: 10,240 , 25 Dec"  },
          { variable : "{{suffix}}" , path : "suffix" , desc : "eg: Rs,INR etc"  },
          { variable : "{{title}}",path : "title",  desc : "eg: Amount,CODE "},
          { variable : "{{subtitle}}", path : "subtitle" }
        ],
        data : [{},{},{}]
      } ,
      showGrid  : false,
      isLoggedIn : false,
      errorMessage : null,
      navbarOpen: false,
      STATIC : 'https://notiphyapp.github.io/twtb-app-landing-page/',
      loginImage,
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
        // let resp = await this.$service.post("/entoc/login",{
        let resp = await this.$service.post("/entoc/api/v1/e2ee/login",{
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
      setTimeout(()=>this.showGrid=true,500)
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
      // await this.$service.post("/entoc/send",{
      await this.$service.post("/entoc/api/v1/e2ee/send",{
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
    afterEditModel(){
     this.sampleVar.model.filter((r)=>{
        if(!!r.path || !!r.value){
          this.message.template.model[r.path] = r.value;
          return true;
        }
        return false
      });
    },
    afterEditData(){
      this.sampleVar.data  = [...this.sampleVar.data.filter((r)=>{
        if(!!r.path || !!r.value){
          r.variable = "{{data."+r.path+"}}";
          this.message.template.model.data[r.path] = r.value;
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