<template>
    <div>
    <b-row>
      <b-col>

        <b-card header="Reset Key" class="styler-20-80">
        <b-row align-v="center" slot="header" v-if="iCompany">
            <b-col cols="4">
              <base-select v-model="iCompany.companyId"  size="sm"
                :options="companies.map((c)=> {
                  return {  id : c.companyId,  label : c.company.displayName}
                })" />
            </b-col>
          <b-col cols="8" class="text-right" >
            <b-button to="/app/"
              class="btn btn-sm btn-outline-oa-blue">
                Cancel
            </b-button>
          </b-col>
        </b-row>
        <validation-observer v-slot="{handleSubmit}" ref="formValidator">
            <base-input variant="outline-oa-blue" name="Client Id"  required
                  format-filter="alphanumlower" :format-value="api.clientId" format-live
                  v-model="api.clientId" layout="flushed" prelabel :readonly="!!company.clientId" />
            <base-input variant="outline-oa-blue" label="OrgId" 
                  v-model="company.companyId" layout="flushed" prelabel readonly />
            <base-input variant="outline-oa-blue" label="API Id" 
                  v-model="api.id" layout="flushed" prelabel readonly copy/>
            <base-input variant="outline-oa-blue" label="APIKey" 
                      v-model="visibleApiKey" prelabel copy readonly>
                  <template #actions>
                    <b-button class="w-20" @click="resetKey"
                        variant="outline-oa-blue">
                        Reset</b-button>
                </template> 
            </base-input>
        </validation-observer>
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
import basic from '../mixin/basic.js'

export default {
  mixins: [basic],
  data() {
    return {
      readonlyClientId : false,
      visibleApiKey : "*****************",
      navbarOpen: false,
      domain : 'demo', otp : '', title : 'Login', apiKey : '*****************',validity : 60, otp : 321654
    };
  },
  computed : {
    api(){
      return {
        id : "", key : '*****************',clientId : (this.iCompany?.displayName || ''),
        ...this.iCompany?.api,
      };  
    },
    company(){
      return this.iCompany || {
        apiKey : '*****************'
      }
    }
  },
  mounted(){
    // if(this.$route.params.orgId)
    //   this.loadCompany(this.$route.params.orgId);
    this.loadBasic(()=>this.refresh());
  },
  methods: {
    refresh(){
       this.$store.getters.local?.notp?.phone;
       //this.api.clientIds = this.company.clientId || "ss";
      // console.log("this.company.clientId,",this.company.clientId)
    },
    async resetKey(){
        if(await this.$refs.formValidator.validate()){
          let resp = await this.$service.submit('/panel/api/v1/company/key',{
            companyId : this.company.companyId,
            clientId : this.api.clientId
          });
          this.api.id = resp.results[0].id;
          this.visibleApiKey = resp.meta;
          this.loadBasicRefresh(()=>this.refresh());
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
