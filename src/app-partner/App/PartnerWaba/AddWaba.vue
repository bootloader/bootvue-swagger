<template>
  <div>

  <b-row  v-if="$global.User.isDuperUser" slot="header"  class="my-normalize-v2">
    <b-col  cols="6">
      <base-v-select options="getx:/partner/pub/waba/clients"  class="d-block" 
          layout="default" size="sm"
          v-model="search.user" clearable searchable filterable
          optionKey="id"
          :filter="{
            '!!client' :  true
          }"
          :search="clientFilter"
       >
        <template #option="option">
          <my-icon type="waba" :value="option.item.client.status"/>&nbsp;<b>{{option.item.client.name}}</b> &nbsp;-&nbsp; <small>{{option.item.client.contact_info.email}}</small>
        </template>
        <template #selected-option="option">
            <my-icon type="waba" :value="option.item.client.status"/>&nbsp;<b>{{option.item.client.name}}</b> &nbsp;-&nbsp; <small>{{option.item.client.contact_info.email}}</small>
        </template> 
       </base-v-select>
    </b-col> 
     <b-col  cols="4">
      <base-input  class="" layout="default" size="sm"
          placeholder="Search..."
          v-model="search.domain"
       ></base-input>
     </b-col> 
      <b-col cols="2">
           <button class="btn btn-sm btn-whatsapp" 
           @click="loadDetails(true)"
           target="_blank"> <i class="fa fa-refresh"/> Refresh</button>
     </b-col> 
  </b-row>


    <b-row  v-if="!isEditDetail" align-v="center" slot="header" >
        <b-col v-for="(model,index) in modelValid" :key="'domain-'+index" cols="6">
          <stats-card :title="model.channel.client.name"
              types="gradient-red"
              :sub-title="model.channel.setup_info.phone_name"
              icon="fa fa-arrow-right"
              class="mb-4 txt-sm"
              footer-classes="mt--1">
            <template slot="icon">
              <button class="btn btn-sm btn-whatsapp" @click="editDomain(model)"> 
                <i class="fa fa-cog"/></button>
            </template>
            <template slot="footer">
              <a v-tooltip="`Click to Send Message`" 
                :href="`https://api.whatsapp.com/send/?phone=${model.channel.setup_info.phone_number}`" target="_blank">
              <span class="btn btn-sm btn-outline-whatsapp fa fa-whatsapp"> +{{model.channel.setup_info.phone_number}}</span>
              </a>
              <hr style="margin:0.5em 0;"/>
              <span class="text-xs">
                <my-icon type="waba" :value="model.channel.account_mode" v-tooltip="'Account Mode'">&nbsp;{{model.channel.account_mode}}</my-icon>
                | <my-icon type="waba" :value="model.channel.hub_status" v-tooltip="'Current Status'">&nbsp;{{model.channel.hub_status}}</my-icon>
                | <my-icon type="waba" :value="model.channel.status" v-tooltip="'Status'">&nbsp;{{model.channel.status}}</my-icon>
                | <my-icon type="waba" v-if="model.channel.integration" :value="model.channel.integration.state" v-tooltip="'Integration State'">&nbsp;{{model.channel.integration.state}}</my-icon>
                  <my-icon type="waba" v-else value="-" v-tooltip="'Integration State'">&nbsp;-</my-icon>
                | <my-icon type="waba" v-if="model.channel.waba_account" :value="model.channel.waba_account.fb_account_status" v-tooltip="'FB account status'">&nbsp;{{model.channel.waba_account.fb_account_status}}</my-icon>
              </span>
            </template>
          </stats-card>
        </b-col>
        <b-col cols="12">
            <a v-if="$global.User.canAddWaba" 
              href="/partner/app/waba/register" class="btn btn-whatsapp">
              <span class="fa fa-whatsapp"/>
              Add WABA</a>
        </b-col>  
    </b-row>

    <card v-if="isEditDetail" class="add-domain">
        <b-row align-v="center" slot="header" >
          <b-col cols="8">
            <h3 class="mb-0"> 
              <b-breadcrumb  class="text-sm bg-white" :items="[
                { text : model.channel.client.name},
                { text : model.channel.setup_info.phone_name},
                { text : model.channel.setup_info.phone_number},
              ]"></b-breadcrumb>
               </h3>
          </b-col>
          <b-col cols="4" class="text-right" >
            <span target="_blank" @click="isEditDetail=false"
              class="btn btn-sm btn-primary">
                Back
            </span>
          </b-col>
        </b-row>

      <h6 class="heading-small text-muted">Channel Information</h6>
      <div class="pl-lg-4">
       <b-row>
          <b-col cols="6">
            <SummaryTile header="Client information">
              <summary-tile-detail label="Name" :text="model.channel.client.name" />
              <summary-tile-detail label="Email" :text="model.channel.client.contact_info.email" />
            </SummaryTile>
          </b-col>
          <b-col cols="6">
            <SummaryTile header="Setup info">
              <summary-tile-detail label="Phone Name" :text="model.channel.setup_info.phone_name" />
              <summary-tile-detail label="Phone Number" :text="model.channel.setup_info.phone_number" />
            </SummaryTile>
          </b-col>

          <b-col cols="6">
            <SummaryTile header="Waba Account">
              <summary-tile-detail label="FB Account" :text="model.channel.waba_account.fb_account_status" no-label-capitalize />
              <summary-tile-detail v-if="model.channel.waba_account.on_behalf_of_business_info">
                  <summary-tile-detail label="On Behalf" :text="model.channel.waba_account.on_behalf_of_business_info.type" />
                  <summary-tile-detail label="Id" :text="model.channel.waba_account.on_behalf_of_business_info.id" />
                  <summary-tile-detail label="Name" :text="model.channel.waba_account.on_behalf_of_business_info.name" />
                  <summary-tile-detail label="Status" :text="model.channel.waba_account.on_behalf_of_business_info.status" />
              </summary-tile-detail>  
            </SummaryTile>
          </b-col>


          <b-col cols="6">
            <SummaryTile header="Detais">
              <summary-tile-detail label="account_mode" :text="model.channel.account_mode" />
              <summary-tile-detail label="current_limit" 
                v-if="model.channel.current_limit"
                :text="model.channel.current_limit" />
              <summary-tile-detail label="current_quality_rating"
                  v-if="model.channel.current_quality_rating"
                  :text="model.channel.current_quality_rating" />
               <summary-tile-detail label="hub_status"
                  v-if="model.channel.hub_status"
                  :text="model.channel.hub_status" />
                <summary-tile-detail label="status"
                  v-if="model.channel.status"
                  :text="model.channel.status" />
            </SummaryTile>
          </b-col>
          <b-col cols="6">
            <SummaryTile header="Integration">
              <summary-tile-detail label="AppId" :text="model.channel.integration.app_id" />
              <summary-tile-detail label="State" :text="model.channel.integration.state" />
              <summary-tile-detail label="Enabled" :text="model.channel.integration.enabled" />
            </SummaryTile>
          </b-col>
          <b-col cols="6" >
            <SummaryTile header="Audits">
              <summary-tile-detail label="Created on" :text="model.channel.created_at" />
              <summary-tile-detail label="Billing Started on" :text="model.channel.billing_started_at" />
              <summary-tile-detail v-if="model.channel.cancelled_at" label="Cancelled" :text="model.channel.cancelled_at" />
              <summary-tile-detail v-if="model.channel.terminated_at" label="Terminated" :text="model.channel.terminated_at" />
            </SummaryTile>
          </b-col> 
        </b-row>
      </div>

      <h6 class="heading-small text-muted mb-4" hidden>API</h6>
      <div  class="pl-lg-4" hidden>
        <b-row class="justify-content-center">
            <b-col>   
            </b-col>
            <b-col>
            </b-col>
        </b-row>
      </div>

    </card>

  </div>  
</template>
<script>
import formatters from '@/services/formatters';
import BaseVSelect from '../../../@common/custom/components/base/BaseVSelect.vue';
import MyIcon from '../../../@common/custom/components/MyIcon.vue';
import SummaryTile from '@/@common/custom/components/SummaryTile.vue';
import SummaryTileDetail from '@/@common/custom/components/SummaryTileDetail.vue';
import debounce from "debounce";

export default {
  data() {
    return {
      defModel :{
        domain: '', id : null,
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
      isEditDetail : false,
      selectedIndex : 0,
      domainUsersIndex : -1,


      search : {
        user : "", 
        domain : ''
      }
    };
  },
  computed : {
    model(){
      return this.defModel;
    },
    modelValid(){
      let user = this.search.user; let domain = (this.search.domain || '').toLowerCase();
      return this.models.filter(function(model){
        return (!user || (user == model.clientId)) && 
          (!domain || (
            (model?.channel?.client?.name || '').toLowerCase().indexOf(domain) > -1
            || (model?.channel?.setup_info?.phone_name || '').toLowerCase().indexOf(domain) > -1
            || (model?.channel?.setup_info?.phone_number || '').toLowerCase().indexOf(domain) > -1
          )) 
      });
    },
  },
  created() {
    this.loadDetails();
  },
  mounted () {
    this.loadDetailsAsync = debounce(this.loadDetailsAsync);
  },
  updated(){
  },
  methods: {
    editDomain(model){
        this.isEditDetail=true;
        this.defModel = model;
        //this.selectedIndex=index;
    },
    async loadDetails(refresh){
      let resp = await this.$service.get("/partner/pub/waba/channels",{
        refresh : refresh
      });
      this.models = resp.results.map(function(result){
        return {
          id : result.id,
          channel : result.channel || {},
          clientId : result.clientId,
          syncdStamp : result.syncdStamp
        }
      });
    },
    async loadDetailsAsync(){
      return this.loadDetails();
    },
    clientFilter(options,search){
      let _search = (search || "").toLowerCase()
      return options.filter(function(option){
        return option.item.client.name.toLowerCase().indexOf(_search) > -1
        || option.item.client.contact_info.email.toLowerCase().replace('@mehery.com','').indexOf(_search) > -1
      });
    },
  },
  components : {
    BaseVSelect,MyIcon,SummaryTile,
    SummaryTileDetail
  }
};
</script>,
<style scoped>
  .add-domain {
    background-color: #fff;
  }
</style>
