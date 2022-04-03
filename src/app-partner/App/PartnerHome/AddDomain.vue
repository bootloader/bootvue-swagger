<template>
  <div>
    <button v-if="!isDomainSet && !isEditDetail" href="#" class="btn btn-info" @click="isEditDetail=true">Add domain</button>

    <b-row  v-if="isDomainSet && !isEditDetail" align-v="center" slot="header" >
      <b-col v-for="(model,index) in models" :key="'domain-'+index" cols="6">
      <stats-card :title="'@'+model.domain"
          types="gradient-red"
          :sub-title="model.company.businessName"
          icon="fa fa-arrow-right"
          class="mb-4"
          footer-classes="mt--1">
        <template slot="icon">
          <a class="btn btn-sm btn-primary" target="_blank"
            :href="`/partner/app/goto/${model.domain}/admin`" > Setup</a>
        </template>
        <template slot="footer">
          <a v-tooltip="`Open ${$config.PROP_SERVICE_NAME} page`" 
            :href="`https://${model.domain}.${$config.PROP_SERVICE_DOMAIN}`" target="_blank">
          <span class="text-success">https://</span>
          <span class="text-nowrap text-dark">{{model.domain}}.{{$config.PROP_SERVICE_DOMAIN}}</span>
          &nbsp; <span class="btn btn-sm btn-outline-primary fa fa-external-link-alt"> View</span>
          </a>
          <button class="btn btn-link btn-sm text-nowrap float-right" 
            @click="isEditDetail=true;selectedIndex=index">Edit</button>
        </template>
      </stats-card>
      </b-col>
    </b-row>


    <card v-if="isEditDetail" class="add-domain">
        <b-row align-v="center" slot="header" >
          <b-col cols="8">
            <h3 class="mb-0">Edit Details </h3>
          </b-col>
          <b-col cols="4" class="text-right" >
            <span target="_blank" @click="isEditDetail=false"
              class="btn btn-sm btn-primary">
                Cancel
            </span>
            
          </b-col>
        </b-row>
      <validation-observer v-slot="{handleSubmit}" ref="formValidator">
        <b-form @submit.prevent="handleSubmit(updateProfile)">
          <h6 class="heading-small text-muted mb-4">Company information</h6>

          <div class="pl-lg-4">
            <b-row>
              <b-col lg="6">
                <base-input alternative question feedback
                class="mb-3"
                  type="text"
                  helpMessage="Ex : Acme Pvt Ltd or Acme Co"
                  name="Company Full Name" 
                  vid="domain.domain"
                  rules="required" required
                  v-model="model.company.businessName"
                >
                </base-input>
              </b-col>
              <b-col lg="6">
                <base-select  alternative question feedback
                  type="text"
                  name="Business Type"
                  placeholder="Marketing, Service etc"
                  rules="required" required
                  v-model="model.company.businessType"
                  options="data:industries"
                >
                </base-select>
              </b-col>
            </b-row>
            <b-row >
              <b-col lg="6">
                <base-input alternative question feedback
                  type="text"
                  name="Website"
                  rules="required" required
                  v-model="model.company.websiteUrl"
                >
                </base-input>
              </b-col>
              <b-col lg="6">
                <base-input alternative question feedback
                  type="mobile"
                  name="Facebook BM ID"
                  v-model="model.company.facebookBMId"
                >
                </base-input>
              </b-col>

              <b-col lg="6">
                <base-input alternative question feedback
                  type="email"
                  name="Contact Email"
                  rules="required|email" required
                  v-model="model.company.email.email"
                  helpMessage="For business communications"
                >
                </base-input>
              </b-col>
              <b-col lg="6">
                <base-input alternative question feedback
                  type="mobile"
                  name="Contact Number"
                  rules="phone"
                  v-model="model.company.phone.phone"
                  helpMessage="For business communications"
                >
                </base-input>
              </b-col>
 
            </b-row>
          </div>
          <hr v-if="isDomainSet"  class="my-4">
          <h6 v-if="!isDomainSet"  class="heading-small text-muted mb-4">Domain information</h6>
          <div  class="pl-lg-4">
            <b-row class="justify-content-center">
                <b-col  v-if="!isDomainSet" lg="12" class="domain-wrapper text-center">   
                  <validation-provider rules="required|alphanum" name="name" v-bind="$attrs" v-slot="{errors}">             
                  <div class="domain-box d-inline-block input-group-alternative">
                    <input id="domain"
                      type="text" v-model="model.domain" autocomplete="off" @keypress="domainClean" @keyup="domainClean"
                      class="domain-input" :style="{
                        'width' : domainSize + 'px'
                      }"
                      :placeholder="domainPlaceholder" />
                      <label for="domain" class="font-bold">.{{$config.PROP_SERVICE_DOMAIN}}</label>
                      <div class="domain-width-wrapper">
                        <div class="domain-width" ref="domainWidth"><div>{{model.domain || domainPlaceholder}}</div></div>
                      </div> 
                  </div> 
                  <small class="d-block">
                    <span v-if="errors[0]" class="text-danger">
                        {{ errors[0] }}
                      </span>
                    Your internal users will use this to login</small>
                  </validation-provider>
               </b-col>
               <b-col v-if="isDomainSet" lg="6" class="text-center justify-content-center align-items-center d-flex">
                  <div class="domain-box d-inline-block input-group-alternative">
                    <a target="_blank" 
                      :href="'https://' + model.domain + '.' + $config.PROP_SERVICE_DOMAIN" 
                      class="">
                        {{model.domain}}.{{$config.PROP_SERVICE_DOMAIN}}
                    </a>
                  </div>
               </b-col>
               <b-col v-if="isDomainSet" lg="6" class="text-center ">
                  <div class="position-relative form-group col-md-12">
                        <vue-dropzone ref="myVueDropzone" class="myVueDropzone justify-content-center align-items-end d-flex"
                          :useCustomSlot="true"
                          id="dropzone" :options="dropzoneOptions"
                          v-on:vdropzone-sending="sendingEvent"
                          v-on:vdropzone-file-added="fileAdded" 
                          v-on:vdropzone-success="fileUploaded"
                          :data-logo="model.social.logo"
                          :style="{
                            'background-image' : 'url(\'' + model.social.logo + '\')'
                          }"
                          >
                            <div class="dropzone-custom-content">
                              <h3 class="dropzone-custom-title">Select new Logo</h3>
                            </div>
                          </vue-dropzone>
                    </div>
               </b-col>
            </b-row>
          </div>
          <hr class="my-4">
          <!-- Address -->
          <h6 class="heading-small text-muted mb-4" hidden>Address</h6>

          <div class="pl-lg-4" hidden>
            <b-row>
              <b-col md="12">
                <base-input alternative question feedback
                  type="text"
                  label="Address"
                  v-model="model.company.address.street"
                  placeholder="Ex : Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                >
                </base-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="4">
                <base-input alternative question feedback
                  type="text"
                  label="City"
                  v-model="model.company.address.city"
                  placeholder="Ex: New York"
                >
                </base-input>
              </b-col>
              <b-col lg="4">
                <base-select alternative question feedback
                  type="text"
                  label="Country"
                  v-model="model.company.address.country"
                  placeholder="Ex: USA"
                  options="data:countries"
                >
                </base-select>
              </b-col>
              <b-col lg="4">
                <base-input alternative question feedback
                  label="Postal Code"
                  placeholder="ZIP Code Ex : 144001"
                  v-model="model.company.address.zip"
                >
                </base-input>
              </b-col>
            </b-row>
          </div>

     <hr class="my-4"hidden>
          <!-- Address -->
          <h6 class="heading-small text-muted mb-4" hidden> Customer Contact</h6>

          <div class="pl-lg-4" hidden>
            <b-row>
              <b-col md="4">
                <base-input alternative question feedback
                  type="text"
                  label="Customer Support Number"
                  v-model="model.social.customerSupportPhone"
                  placeholder=""
                >
                </base-input>
              </b-col>
              <b-col md="4">
                <base-input alternative question feedback
                  type="text"
                  label="Customer Support Email"
                  v-model="model.social.customerSupportEmail"
                  placeholder=""
                >
                </base-input>
              </b-col>
              <b-col lg="4">
                <base-input alternative question feedback
                  type="text"
                  label="Facebook Page Id"
                  v-model="model.social.facebookPageId"
                  placeholder=""
                >
                </base-input>
              </b-col>
              <b-col lg="4">
               <base-input alternative question feedback
                  type="text"
                  label="Facebook Page"
                  v-model="model.social.facebookPage"
                  placeholder=""
                >
                </base-input>
              </b-col>
              <b-col lg="4">
               <base-input alternative question feedback
                  type="text"
                  label="Twitter Handler"
                  v-model="model.social.twitterHandler"
                  placeholder=""
                >
                </base-input>
              </b-col>
               <b-col lg="4">
               <base-input alternative question feedback
                  type="text"
                  label="Instagram Handler"
                  v-model="model.social.instagramHandler"
                  placeholder=""
                >
                </base-input>
              </b-col>
              <b-col lg="4">
               <base-input alternative question feedback
                  type="text"
                  label="WhatsApp Number"
                  v-model="model.social.whatsApp"
                  placeholder=""
                >
                </base-input>
              </b-col>
              <b-col lg="4">
               <base-input alternative question feedback
                  type="text"
                  label="Telegram"
                  v-model="model.social.telegram"
                  placeholder=""
                >
                </base-input>
              </b-col>
            </b-row>
          </div>

          <hr class="my-4" hidden>
          <!-- Description -->
          <h6 class="heading-small text-muted mb-4">About Company</h6>
          <div class="pl-lg-4">
            <base-text-area alternative question feedback
              rows="4" value="" id="about-form-textaria" placeholder="A few words about your company does ..."
              v-model="model.company.businessAbout"
            ></base-text-area>
            <b-row class="justify-content-center">
              <b-col class="text-center">
                <b-button type="submit" variant="primary" class="mt-4">Save</b-button>
              </b-col>
            </b-row>  
          </div>

        </b-form>
        </validation-observer>
    </card>

  </div>  
</template>
<script>
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import formatters from '@/services/formatters';

export default {
  data() {
    return {
      defModel :{
        domain: '',
        company : {
          businessName : "",
          businessType : "", 
          websiteUrl  : "", 
          email  : {}, 
          phone  : {},  
          address : {},
          conactCity  : "", 
          onactCountry  : "", 
          conactPostalCode  : "", 
        },
        social : {
          logo : null,
          facebookBMId:  null,
          facebookPageId : null,
          facebookPage: null,
          twitterHandler: null,
          instagramHandler: null,
          customerSupportEmail : null,
          customerSupportPhone : null
        }
      },
      models : [],
      isDomainSet : false,
      isEditDetail : false,
      selectedIndex : 0,

      domainPlaceholder : "yourdomain",
      domainWidth : 0,

      dropzoneOptions: {
        url: formatters.clean_url(this.$global.MyConst.context + '/partner/api/domain/logo'),
        thumbnailWidth: 150,
        thumbnailHeight : 150,
        maxFilesize: 5,
        autoProcessQueue: true,
        disablePreviews :true,
        //clickable : ".change_image",
        addRemoveLinks : false
      },

    };
  },
  computed : {
    editDetailShow(){
      return this.model.company == null;
    },
    domainSize : function () {
        return Math.max(this.domainWidth || (this.model.domain || "").length || this.domainPlaceholder.length,22) +6;
    },
    model(){
      return this.models[this.selectedIndex] || this.defModel;
    }
  },
  created() {
    this.loadDetails();
  },
  mounted () {
    const that = this
    that.$nextTick(function () {
      that.getDomainWidth()
    });
  },
  updated(){
    const that = this
    that.$nextTick(function () {
      that.getDomainWidth()
    });
  },
  methods: {
    async loadDetails(){
      let resp = await this.$service.get("/partner/api/domain");
      this.models = resp.results.map(function(result){
        return {
          company : result.company,
          social : result.social || {},
          domain : result.domain
        }
      });
      this.isDomainSet = !!this.model.domain;
    },
    async updateProfile() {
       let resp = await this.$service.post("/partner/api/domain",this.model,{
         ref : this.$refs.formValidator
       });
       window.location.reload();
    },
    domainClean(){
      this.model.domain = (this.model.domain || "").replace(/[^0-9a-zA-Z]/g,"").toLowerCase();
    },
    fileAdded(){
      console.log("fileAdded")
    },
    sendingEvent(file, xhr, formData){
      formData.append('tnt', this.model.domain);
    },
    async fileUploaded (file, response) {
      this.model.social.logo = response.results[0];
      this.$refs.myVueDropzone.removeFile(file);
      console.log("fileUploaded",response)
    },
    getDomainWidth() {
      this.domainWidth = this.$refs.domainWidth ? this.$refs.domainWidth.clientWidth : 0;
    }
  },
  components : {
    vueDropzone : vue2Dropzone
  }
};
</script>
<style scoped>
  .add-domain {
    background-color: #fff;
  }
  .domain-wrapper, .domain-box,.domain-box input {
    font-size: 20px;
  }
  .domain-wrapper small {
    font-size: 60%;
    color : #a3a3a3;
  }
  .domain-input, .domain-input:focus {
    outline-style: none;
    box-shadow: none;
    border-color: transparent;
    padding-left: 0px;
    padding-right: 0px;
    padding-bottom :0px;
    text-align: right;
    background: transparent;
  }
  .domain-width {
    background-color: #a3a3a3;
    float: left;
  }
  .domain-width-wrapper {
    height: 1px;
    overflow: hidden;
  }
  .domain-box input::-webkit-input-placeholder{
    font-size: 20px;
    color : #a3a3a3;
  }
  .domain-box {
    padding: 5px 20px;
    background-color:white;
  }
  .myVueDropzone {
    height: 180px;
    width: 180px;
    background-color: rgb(235, 235, 235);
    margin: 0px;
    padding: 0px;
    background-image: url("~@/assets/vendor/notus/img/company-profile-1.png");
    background-size: 100% 100%;
    background-position: center;
  }
  .dropzone-custom-title {
    color: #717171;
    background-color: rgba(209, 209, 209, 0.616);
    border-radius: 5%;
    padding: 3px;
    cursor: pointer;
    opacity: 0;
  }
   .myVueDropzone:hover .dropzone-custom-title {
     opacity: 1;
   }
</style>
