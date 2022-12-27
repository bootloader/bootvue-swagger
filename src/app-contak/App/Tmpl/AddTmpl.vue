<template>
    <div>
      <validation-observer v-slot="{handleSubmit}" ref="formValidator">
    <b-card class=" bg-greyish">
        <b-row align-v="center" slot="header" v-if="iCompany">
            <b-col cols="4">
              <base-v-select v-model="iCompany.companyId"  size="sm" disabled
                :options="companies.map((c)=> {
                  return {  id : c.companyId,  label : c.company.displayName}
                })" alternative question  />
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
                alternative question feedback  required :disabled="!editable" clearable
                :suggestions="headerLabels"  @change="loadDefault"/>
            </b-col>

            <b-col cols="4">
              <base-v-select name="Message Type" v-model="template.type" 
                :options="[ { code : 'OTP'} ,{ code : 'TRANSACTIONAL', label : 'Transactional' }]"
                alternative question  required :disabled="!editable">
              
              </base-v-select>
              <base-v-select name="Header Variant" v-model="template.header.variant" 
                options="data:color_variant"
                alternative question  required :disabled="!editable">
                  <template #option="option">
                      <i v-if="option.value" :class="`text-${option.value.toLowerCase()}`"
                          class="fa fa-circle" />&nbsp;<span>{{option.label}}</span>
                  </template> 
                  <template #selected-option="option">
                      <i v-if="option.value" :class="`text-${option.value.toLowerCase()}`"
                          class="fa fa-circle"/>&nbsp;<span>{{option.label}}</span>
                  </template> 
              </base-v-select>
            </b-col> 

            <b-col cols="4">
              <base-v-select name="Message Category" v-model="template.category" :disabled="!editable"
                 options="data:hsm/message_categories_oa" ref="category" @change="loadDefault(true)"
                 alternative question required 
                 />
                  <template #selected-option="option">
                      <i v-if="option.item.header" :class="`text-${option.item.header.toLowerCase()}`"
                          class="fa fa-circle"/>&nbsp;<span>{{option.label}}</span>
                  </template> 
            </b-col>                          
 
              <b-col cols="8">
                  <base-input name="Title" v-model="template.title"  
                    alternative question feedback required :disabled="!editable"
                    rules="required|max:30" />
                  <base-text-area  name="Body" alternative question feedback required :disabled="!editable"
                        placeholder="Type here" v-model="template.body"  class="template-body"
                        rules="required|max:360" :rows="6" 
                        :textLimit="360" 
                       :helpMessage="bodyTextLimit">
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
        type : "OTP", category : "",
        header :  {
          label : '', variant : "MAJOR"
        }, 
        title : '', 
        body : '',
        footer : '', 
        cta : []
      },
      isTemplateLoding : false,
      headerLabels : []
    };
  },
  computed : {
    editable(){
      return  !this.basic.isLoding && !this.isTemplateLoding && !this.template.templateId
    },
    bodyTextLimit(){
      return this.template.body.length>180 ? `SMS with length greater than 180 characters will usually split
            into multiple parts in case of fallback` : '';
    }
  },
  mounted(){
    this.load();
  },
  methods: {
    async load(){
      await this.loadBasic();
      this.template.companyId = this.iCompany.companyId;
      if(this.$route.params.templateId){
        this.isTemplateLoding = true;
        let resp = await this.$service.get('/panel/api/v1/hsm/tmpl',{
          companyId : this.iCompany.companyId
         });
         for(var i in resp.results){
          if(resp.results[i].templateId == this.$route.params.templateId){
            this.template = resp.results[i];
            break;
          }
         }
         this.isTemplateLoding = false;
      } else {
        this.loadDefault();
      }
    },
    async loadDefault(catChanged){
      if(catChanged === true){
        this.template.header.label = '';
      }
      let cat = this.$refs.category?.selected();
      if(cat && cat?.item && cat.item?.suggestion){
       this.headerLabels = Object.keys(cat?.item?.suggestion || {});
       let suggestion = cat?.item?.suggestion;
       if(suggestion && this.template.header.label
        && suggestion[this.template.header.label]
       ){
         this.template.header.variant = cat.item.header?.variant || suggestion[this.template.header.label]
       }
      }
    },
    async saveTemplate(){
       let resp = await this.$service.post("/panel/api/v1/hsm/tmpl",{
          ...this.template,
          categoryTitle : this.$refs.category?.selected().item.label
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
<style style="css" sscoped>
  .template-body.basic-component .form-group .help-feedback{
      color: rgb(221, 137, 59);

  }
</style>
