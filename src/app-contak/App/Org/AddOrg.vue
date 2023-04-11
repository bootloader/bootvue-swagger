<template>
    <div>
      <validation-observer v-slot="{handleSubmit}" ref="formValidator">
    <b-card class=" bg-greyish">
        <b-row align-v="center" slot="header">
          <b-col cols="4">
            <h3 class="mb-0">Organzation </h3>
          </b-col>
          <b-col cols="4">
              <ButtonRadioGroup buttonVariant="outline-grey"
                  v-model="tab"
                  size="sm"
                  :options="tabs"
              />
          </b-col>
          <b-col cols="4" class="text-right" >
            <b-button to="/app"
              class="btn btn-sm btn-outline-oa-blue">
                Cancel
            </b-button>
          </b-col>
        </b-row>
        <b-row v-if="tab=='Security'" class="styler-height-fix">
            <b-col cols="12">
              <base-input name="IP Address" :value="company.prefs.allowedIPAddresses.join(',')" 
                    @input="allowedIPAddresses" rules="listof:ipaddress"
                    alternative question feedback
                    helpMessage="Add Comma Sperated list of IP Addresses to whitelist for API requests"/>
            </b-col>
        </b-row> 
        <b-row v-else-if="tab=='Support'" class="styler-height-fix">
            <b-col cols="12">
              <base-input name="Customer Support Email" v-model="company.profile.supportEmail" rules="email"
                    alternative question feedback/>
              <base-input name="Customer Support Phone" v-model="company.profile.supportPhone" rules="phone"
                    alternative question feedback/>
              <base-input name="Customer Support Link" v-model="company.profile.supportLink" rules="URL"
                    alternative question feedback/>
            </b-col>
        </b-row> 
        <b-row v-else class="styler-height-fix">
            <b-col cols="6">
              <base-input name="Legal Business Name" v-model="company.legalBusinessName" 
                    alternative question feedback required  
                    :disabled="isVerfied && !!company.legalBusinessName" />
              <base-input name="Display Name" v-model="company.displayName" 
                :disabled="isVerfied && !!company.displayName"
                alternative question feedback  required/>
              <base-input name="Website" v-model="company.websiteUrl" 
                    alternative question feedback  required/>
            </b-col>

            <b-col cols="6">
              <base-v-select name="Country of Operation" v-model="company.countryOfOperation" latest
                options="data:countries"  :disabled="isVerfied && !!company.countryOfOperation"
                alternative question required/>
              <base-input name="Address" v-model="company.address" 
                alternative question feedback  required/>
              <base-v-select name="Timezone" v-model="company.prefs.timeZone" latest searchable filterable
                options="getx:/pub/meta/options/timezone"
                 :disabled="isVerfied && !!company.prefs.timeZone"
                alternative question required/>
            </b-col> 

            <b-col cols="6">
                <base-input name="Contact Person Name" v-model="company.contactPersonName" 
                    alternative question feedback required  />
                <base-input name="Contact Person Phone" v-model="company.contactPhoneNumber" 
                    alternative question feedback required  />
                <base-input name="Contact Person Email" v-model="company.contactPersonEmailId" 
                    alternative question feedback required  />
            </b-col>                          
 
              <b-col cols="6">

                  <MyUpload ref="myVueDropzone" autoProcessQueue disablePreviews v-model="company.logoUrl"
                      @uploaded="uploaded"
                      :upload-url="$global.MyConst.context + '/panel/api/v1/logo'"
                      placeholder="Upload new Logo"
                      class="myVueDropzone">
                    </MyUpload>
              </b-col>
              
            </b-row>

        <b-row align-v="center" slot="footer">
          <b-col cols="4">
               <b-button :disabled="isVerfied" 
                href="https://www.otpalerts.com/docs/guide/quick/business_verification.html" variant="outline-oa-blue"
               target="_blank">
                Verify your Business
            </b-button>
          </b-col>
          <b-col cols="4">
          </b-col>
          <b-col cols="4" class="text-right" >
            <b-button @click="handleSubmit(saveCompany)" variant="oa-blue">
                Save
            </b-button>
          </b-col>
        </b-row>

    </b-card> 
    </validation-observer>
  </div>
</template>
<script>
import MyUpload from '@/@common/custom/components/MyUpload.vue';
import ButtonRadioGroup from '@/@common/argon/components/ButtonRadioGroup.vue';

function defaultCmpany(){
  return  {
        legalBusinessName : '', 
        displayName : '', 
        number : '',
        countryOfOperation : '', 
        address : '',
        coiFileUrl : '',
        gstFileUrl : '',
        panFileUrl : '',
        contactPersonName : '',
        contactPhoneNumber : '',
        contactPersonEmailId : '',
        companyTimeZone : '',
        websiteUrl : '', 
        logoUrl : '',
        prefs : {
          allowedIPAddresses : [
          ],
          timeZone : ''
        },
        profile : {
          supportEmail : '',supportPhone : '',supportLink : '',
        },
        meta: {
          updateStamp : 0,
          verified : false,
          verifiedStamp : 0
        },
    };
}

export default {
  data() {
    return {
      company : defaultCmpany(),
      loading : false,
      tab : 'Details',
    };
  },
  computed : {
    isVerfied(){
      return this.company?.meta?.verified || false;
    },
    tabs() {
        return this.company.companyId ? ['Details','Security','Support'] : ['Details'];
    }
  },
  mounted(){
    if(this.$route.params.orgId)
      this.loadCompany(this.$route.params.orgId);
  },
  methods: {
    async saveCompany(){
       let resp = await this.$service.post("/panel/api/v1/company",{
          ...this.company
        },{
         ref : this.$refs.formValidator
       });
       this.$router.push({
        name : "Home"
       })
       //window.location.reload();
    },
    async loadCompany(orgId){
      this.loading = true;
        let resp = await this.$service.get("/panel/api/v1/companys");
        for(var i in resp.results){
          if(resp.results[i].company.companyId == orgId){
            let comp = defaultCmpany();
            this.company = {
              ...  comp,
              ... resp.results[i].company,
              prefs : {
                ... comp.prefs,
                ... resp.results[i].company.prefs,
                allowedIPAddresses : resp.results[i].company?.prefs?.allowedIPAddresses || []
              },
              profile : {
                ... comp.profile,
                ... resp.results[i].company.profile,
              }
            }
            break;
          }
        }
    },
    uploaded(file){
      this.company.logoUrl = file.url;
    },
    allowedIPAddresses(e){
      this.company.prefs.allowedIPAddresses = e.split(',').map((ip)=>ip.trim());
    }
  },
  components: {
    MyUpload, ButtonRadioGroup
  },
};
</script>
