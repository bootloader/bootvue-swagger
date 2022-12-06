<template>
    <div>
      <validation-observer v-slot="{handleSubmit}" ref="formValidator">
    <b-card class=" bg-greyish">
        <b-row align-v="center" slot="header" v-if="iCompany">
            <b-col cols="4">
              <base-select v-model="iCompany.companyId"  size="sm" :readonly="!editable"
                :options="companies.map((c)=> {
                  return {  id : c.companyId,  label : c.company.displayName}
                })" />
            </b-col>
          <b-col cols="8" class="text-right" >
            <b-button to="/app/org/0/tmpl"
              class="btn btn-sm btn-outline-oa-blue">
                Cancel
            </b-button>
          </b-col>
        </b-row>
        
        <b-row class="styler-height-fix">
            <b-col cols="4" v-if="companies">
               <base-input name="Template Code" v-model="template.code" 
                alternative question feedback  required :disabled="!editable"/>
             <base-input name="Header Label" v-model="template.header.label" 
                alternative question feedback  required :disabled="!editable"/>
            </b-col>

            <b-col cols="4">
                   <base-select name="Message Type" v-model="template.type" 
                :options="['OTP','TRANSACTIONAL','PROMOTIONAL']"
                alternative question feedback  required :disabled="!editable"/>
              <base-select name="Header Variant" v-model="template.header.variant" 
                :options="['PRIMARY','SECONDARY','DANGER','SUCCESS','WARNING','INFO']"
                alternative question feedback  required :disabled="!editable"/>
            </b-col> 

            <b-col cols="4">
          
            </b-col>                          
 
              <b-col cols="8">
                  <base-input name="Title" v-model="template.title" 
                    alternative question feedback required :disabled="!editable"
                    rules="required|max:30" />
                  <base-text-area  name="Body" alternative question feedback required :disabled="!editable"
                        placeholder="Type here" v-model="template.body" 
                        rules="required|max:60" :rows="6" 
                        :textLimit="60">
                  </base-text-area>
                  <base-input name="Footer" v-model="template.footer"  :disabled="!editable"
                    alternative question feedback
                    rules="max:20"/>
              </b-col>
              
            </b-row>

        <b-row align-v="center" slot="footer">
          <b-col cols="8">
          </b-col>
          <b-col cols="4" class="text-right" >
            <b-button @click="handleSubmit(saveTemplate)" variant="oa-blue" :disabled="!editable">
                Save
            </b-button>
          </b-col>
        </b-row>

    </b-card> 
    </validation-observer>
  </div>
</template>
<script>
import basic from '../mixin/basic.js'

export default {
  mixins : [basic],
  data() {
    return {
      template : {
        templateId : '',
        companyId : '',
        code : "",
        type : "OTP",
        header :  {
          label : '', variant : "PRIMARY"
        }, 
        title : '', 
        body : '',
        footer : '', 
        cta : []
      },
      loading : false
    };
  },
  computed : {
    editable(){
      return !this.template.templateId
    }
  },
  mounted(){
    this.load();
  },
  methods: {
    async load(){
      await this.loadBasic();
      console.log("this.iCompany",this.iCompany)
      this.template.companyId = this.iCompany.companyId;
      if(this.$route.params.templateId){
        let resp = await this.$service.get('/panel/api/v1/hsm/tmpl',{
          companyId : this.iCompany.companyId
         });
         for(var i in resp.results){
          if(resp.results[i].templateId == this.$route.params.templateId){
            this.template = resp.results[i];
            break;
          }
         }
      }
    },
    async saveTemplate(){
       let resp = await this.$service.post("/panel/api/v1/hsm/tmpl",{
          ...this.template
        },{
         ref : this.$refs.formValidator
       });
       this.$router.push({
        name : "Templates"
       });
    }
  },
  components: {
  },
};
</script>
