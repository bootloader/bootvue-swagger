<template>
    <div>
    <b-row>
      <b-col>

        <b-card header="Reset Key" class="styler-20-80">
          <base-input variant="outline-oa-blue" label="From" 
                v-model="company.displayName" layout="flushed" prelabel readonly />
          <base-input variant="outline-oa-blue" label="OrgId" 
                v-model="company.companyId" layout="flushed" prelabel readonly />
          <base-input variant="outline-oa-blue" label="API Id" 
                v-model="api.id" layout="flushed" prelabel readonly copy/>
          <base-input variant="outline-oa-blue" label="APIKey" 
                    v-model="api.key" prelabel copy readonly>
                <template #actions>
                  <b-button class="w-20" @click="resetKey"
                      variant="outline-oa-blue">
                      Reset</b-button>
              </template> 
          </base-input>
        </b-card>  

      </b-col>
      <b-col hidden>
      </b-col>  
    </b-row>  
  </div>
</template>
<script>
import BaseInput from '@/@common/argon/components/Inputs/BaseInput.vue';
import BaseButton from '@/@common/argon/components/BaseButton.vue';
import DemoReciever from './DemoReciever.vue';
export default {
  data() {
    return {
      navbarOpen: false,
      company : {
        apiKey : '*****************'
      },
      api : {
        id : "", key : '*****************'
      },
      domain : 'demo', otp : '', title : 'Login', apiKey : '*****************',validity : 60, otp : 321654
    };
  },
  computed : {
  },
  mounted(){
    if(this.$route.params.orgId)
      this.loadCompany(this.$route.params.orgId);
  },
  methods: {
    refresh(){
       this.$store.getters.local?.notp?.phone;
    },
    async resetKey(){
        let resp = await this.$service.submit('/panel/api/v1/company/key',{
          companyId : this.company.companyId
        });
        this.api.id = resp.results[0].id;
        this.api.key = resp.meta;
    },
    async loadCompany(orgId){
      this.loading = true;
        let resp = await this.$service.get("/panel/api/v1/companys");
        for(var i in resp.results){
          if(resp.results[i].company.companyId == orgId){
             this.api.id = resp.results[i]?.company?.api?.id;
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
    BaseInput,
    BaseButton,
    DemoReciever
  },
};
</script>
