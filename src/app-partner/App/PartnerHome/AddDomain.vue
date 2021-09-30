<template>
  <div>
    <button v-if="!isDomainSet && !isEditDetail" href="#" class="btn btn-info" @click="isEditDetail=true">Add domain</button>

    <b-row  v-if="isDomainSet && !isEditDetail" align-v="center" slot="header" >
      <b-col cols="6">
      <stats-card :title="'@'+model.domain"
          types="gradient-red"
          :sub-title="model.company.businessName"
          icon="fa fa-arrow-right"
          class="mb-4"
          footer-classes="mt--1">
        <template slot="icon">
          <a class="btn btn-sm btn-primary" target="_blank"
            :href="`/partner/app/goto/${model.domain}/admin`" > Open</a>
        </template>
        <template slot="footer">
          <span class="text-success">https://</span>
          <span class="text-nowrap">{{model.domain}}.{{$config.PROP_SERVICE_DOMAIN}}</span>
          <button class="btn btn-link btn-sm text-nowrap float-right" @click="isEditDetail=true">Edit</button>
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
                  type="email"
                  name="Contact Email"
                  rules="required|email" required
                  v-model="model.company.conactEmail"
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
                  <validation-provider rules="required|alphanum" :name="name" v-bind="$attrs" v-slot="{errors}">             
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
               <b-col v-if="isDomainSet" lg="12" class="text-center">
                  <div class="domain-box d-inline-block input-group-alternative">
                    <a target="_blank" 
                      :href="'https://' + model.domain + '.' + $config.PROP_SERVICE_DOMAIN" 
                      class="">
                        {{model.domain}}.{{$config.PROP_SERVICE_DOMAIN}}
                    </a>
                  </div>
               </b-col>
            </b-row>
          </div>
          <hr class="my-4">
          <!-- Address -->
          <h6 class="heading-small text-muted mb-4">Contact information</h6>

          <div class="pl-lg-4">
            <b-row>
              <b-col md="12">
                <base-input alternative question feedback
                  type="text"
                  label="Address"
                  v-model="model.company.conactAddress"
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
                  v-model="model.company.conactCity"
                  placeholder="Ex: New York"
                >
                </base-input>
              </b-col>
              <b-col lg="4">
                <base-select alternative question feedback
                  type="text"
                  label="Country"
                  v-model="model.company.conactCountry"
                  placeholder="Ex: USA"
                  options="data:countries"
                >
                </base-select>
              </b-col>
              <b-col lg="4">
                <base-input alternative question feedback
                  label="Postal Code"
                  placeholder="ZIP Code Ex : 144001"
                  v-model="model.company.conactPostalCode"
                >
                </base-input>
              </b-col>
            </b-row>
          </div>

     <hr class="my-4">
          <!-- Address -->
          <h6 class="heading-small text-muted mb-4">Social information</h6>

          <div class="pl-lg-4">
            <b-row>
              <b-col md="12">
                <base-input alternative question feedback
                  type="text"
                  label="Facebook Business Manager ID"
                  v-model="model.social.facebookBMId"
                  placeholder=""
                >
                </base-input>
              </b-col>
            </b-row>
            <b-row>
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
            </b-row>
          </div>

          <hr class="my-4">
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
export default {
  data() {
    return {
      model :{
        domain: '',
        company : {
          businessName : "",
          businessType : "", 
          websiteUrl  : "", 
          conactEmail  : "", 
          conactAddress  : "", 
          conactCity  : "", 
          onactCountry  : "", 
          conactPostalCode  : "", 
        },
        social : {
          facebookBMId:  null,
          facebookPageId : null,
          facebookPage: null,
          twitterHandler: null,
          instagramHandler: null
        }
      },
      isDomainSet : false,
      isEditDetail : false,

      domainPlaceholder : "yourdomain",
      domainWidth : 0
    };
  },
  computed : {
    editDetailShow(){
      return this.model.company == null;
    },
    domainSize : function () {
        return Math.max(this.domainWidth || (this.model.domain || "").length || this.domainPlaceholder.length,22) +6;
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
      this.model.company = resp.results[0].company;
      this.model.social = resp.results[0].social || {};
      this.model.domain = resp.results[0].domain;
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
    getDomainWidth() {
      this.domainWidth = this.$refs.domainWidth ? this.$refs.domainWidth.clientWidth : 0;
    }
  }
};
</script>
<style scoped>
  .add-domain {
    background-color: #f7fafc;
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
</style>
