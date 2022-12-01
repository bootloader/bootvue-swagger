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
            </b-col>

            <b-col cols="6">
              <base-input name="Country of Operation" v-model="company.countryOfOperation" 
                alternative question feedback  required/>
              <base-input name="Address" v-model="company.address" 
                alternative question feedback  required/>
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
                  <base-input name="Website" v-model="company.websiteUrl" 
                    alternative question feedback  required/>
                  <MyUpload ref="myVueDropzone" autoProcessQueue disablePreviews
                      :upload-url="$global.MyConst.context + '/panel/api/v1/logo'"
                      class="myVueDropzone justify-content-center align-items-end d-flex">
                      <div class="dropzone-custom-content">
                        <h3 class="dropzone-custom-title">Select new Logos</h3>
                      </div>
                    </MyUpload>
              </b-col>
              
            </b-row>

        <b-row align-v="center" slot="footer">
          <b-col cols="8">
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

export default {
  data() {
    return {
      company : {
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
      },
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
            this.company = {
              ... this.company,
              ... resp.results[i].company
            }
            break;
          }
        }
    }
  },
  components: {
    MyUpload
  },
};
</script>
