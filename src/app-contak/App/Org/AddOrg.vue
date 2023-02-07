<template>
    <div>
      <validation-observer v-slot="{handleSubmit}" ref="formValidator">
    <b-card class=" bg-greyish">
        <b-row align-v="center" slot="header">
          <b-col cols="8">
            <h3 class="mb-0">Organzation Details</h3>
          </b-col>
          <b-col cols="4" class="text-right" >
            <b-button to="/app"
              class="btn btn-sm btn-outline-oa-blue">
                Cancel
            </b-button>
          </b-col>
        </b-row>
        
        <b-row class="styler-height-fix">
            <b-col cols="6">
              <base-input name="Legal Business Name" v-model="company.legalBusinessName" 
                    alternative question feedback required  />
              <base-input name="Display Name" v-model="company.displayName" 
                alternative question feedback  required/>
              <base-input name="Website" v-model="company.websiteUrl" 
                    alternative question feedback  required/>
            </b-col>

            <b-col cols="6">
              <base-v-select name="Country of Operation" v-model="company.countryOfOperation" latest
                options="data:countries"
                alternative question required/>
              <base-input name="Address" v-model="company.address" 
                alternative question feedback  required/>
              <base-v-select name="Timezone" v-model="company.prefs.timeZone" latest searchable filterable
                options="getx:/pub/meta/options/timezone"
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
               <b-button href="https://www.otpalerts.com/docs/guide/quick/business_verification.html" variant="outline-oa-blue"
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
          timeZone : ''
        }
    };
}

export default {
  data() {
    return {
      company : defaultCmpany(),
      loading : false
    };
  },
  computed : {
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
                ... resp.results[i].company.prefs
              }
            }
            break;
          }
        }
    },
    uploaded(file){
      console.log("uploaded",file);
      this.company.logoUrl = file.url;
    }
  },
  components: {
    MyUpload
  },
};
</script>
