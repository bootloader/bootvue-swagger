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
           <b-col cols="8">
              <b-row>
                <b-col cols="6" v-if="companies">
                  <base-input name="Template Code" v-model="template.code" 
                    alternative question feedback  required :disabled="!editable"/>
                <base-input name="Header Label" v-model="template.header.label" :disabled="!editable || isOTP"
                    alternative question feedback  :required="!isOTP" clearable
                    :suggestions="headerLabels"  @change="loadDefault"/>
                </b-col>

                <b-col cols="6">
                  <base-v-select name="Message Type" v-model="template.type" 
                    :options="[ { code : 'OTP'} ,{ code : 'TRANSACTIONAL', label : 'Transactional' }]"
                    alternative question  required :disabled="!editable" @change="(template.category='') & loadDefault(true)">
                  </base-v-select>
                  <base-v-select name="Header Variant" v-model="template.header.variant" 
                    options="data:color_variant"
                    alternative question  required :disabled="!editable || isOTP">
                      <template #option="option">
                          <i v-if="option.value" :class="`text-oa-${option.value.toLowerCase()}`"
                              class="fa fa-circle" />&nbsp;<span>{{option.label}}</span>
                      </template> 
                      <template #selected-option="option">
                          <i v-if="option.value" :class="`text-oa-${option.value.toLowerCase()}`"
                              class="fa fa-circle"/>&nbsp;<span>{{option.label}}</span>
                      </template> 
                  </base-v-select>
                </b-col>
                
                <b-col cols="12">
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
             </b-col> 

              <b-col  cols="4">
                  <base-v-select name="Message Category" v-model="template.category" :disabled="!editable || isOTP"
                    options="json:hsm/message_categories_oa" ref="category" @change="loadDefault(true)"
                    alternative question required :filter="{
                      type : template.type
                    }">
                      <template #selected-option="option">
                          <i v-if="option.item.header" :class="`text-${option.item.header.toLowerCase()}`"
                              class="fa fa-circle"/>&nbsp;<span>{{option.label}}</span>
                      </template> 
                  </base-v-select>    

                  <div class="oa-message-preview-wrapper" v-if="template.model">
                    <div class="oa-message-preview-header">
                      <div class="oa-message-preview-header-body row">
                        <div class="col-6" >
                          <div class="oa-message-preview-cat">
                              <span class="oa-type-icon" v-if="messageCategory" :class="['my-oa-type-'+messageCategory.toLowerCase()]"></span>{{template.header.label}}
                          </div> 
                          <div class="text-black">{{template.model.text}}</div>
                            <div class="text-sm text-grey">{{template.model.subtext}}</div>
                        </div>  
                        <div class="col-6 oa-message-preview-header-value" :class="`text-oa-${template.header.variant.toLowerCase()}`">
                          <small class="oa-message-preview-header-prefix">{{template.model.prefix}}</small>
                          <span>{{template.model.value}}</span>
                          <small class="oa-message-preview-header-suffix">{{template.model.suffix}}</small>
                        </div> 
                      </div>  
                    </div>  
                  </div>
                   <div class="oa-message-preview-buttons" v-if="template.model">
                        <div class="oa-message-preview-button" v-for="(cta,i) in ctas" v-bind:key="i">
                         <i class="fa" :class="{
                          'fa-external-link' : cta.type == 'URL',
                          'fa-phone-alt' : cta.type == 'PHONE',
                         }"/>&nbsp;{{cta.label}}
                        </div>
                   </div>  

                  <div class="vgrid-wrapper w-100 bg-white mt-4" style="height: 200px; min-width:200px">
                    <VGrid theme="default" class="w-100 position-relative" 
                      :columns="sampleVar.columns"
                      :source="sampleVar.data"
                      @afteredit=afterEdit
                  ></VGrid>
                </div> 
              </b-col>  
              <b-col cols="8">
                <b-row class="bg-nightish m-0 button-detail">
                   <b-col cols="8" class="text-right">
                   </b-col>
                   <b-col cols="4" class="text-right">
                    <b-button  @click="addButton" variant="outline-oa-blue" :disabled="ctas.length>2" size="sm" class="m-2 mx-1">
                        Add Button <i class="fa fa-plus"/> 
                    </b-button>
                   </b-col>
                </b-row>  
                <b-row v-for="(cta,i) in ctas" v-bind:key="i" class="bg-nightish m-0 button-detail">
                  <b-col cols="5">
                        <base-v-select :name="`Button-${i+1} Type`" v-model="cta.type" clearable 
                          :options="[ { code : 'URL'} ,{ code : 'PHONE', label : 'Phone' }]"
                          alternative question required :disabled="!editable">
                        </base-v-select>
                  </b-col>
                  <b-col cols="5">
                    <base-input :name="`Button-${i+1} Title`" v-model="cta.label"  v-if="!!cta.type"
                      alternative question feedback :disabled="!editable" :required="!!cta.type"
                      rules="required|max:20" />
                  </b-col>
                  <b-col cols="2" class="text-right mx-auto">
                      <b-button  @click="ctas.splice(i,1)" variant="outline-danger" :title="`Delete Button-${i+1}`"
                           :disabled="!editable" size="sm" class="m-2">
                          <i class="fa fa-times"/>
                      </b-button>
                  </b-col>
                  <b-col cols="11" v-if="cta.type" >
                      <base-input v-if="cta.type=='URL'" :name="`Button-${i+1} URL`" v-model="cta.url"  
                      alternative question feedback required :disabled="!editable"
                      rules="required|URL" />
                      <base-input v-if="cta.type=='PHONE'" :name="`Button-${i+1} Phone No.`" v-model="cta.phone"  
                      alternative question feedback required :disabled="!editable"
                      rules="required|phone" />
                  </b-col>
                </b-row>
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
 import VGrid, { VGridVueTemplate } from "@revolist/vue-datagrid";
     import JsonXPath from "@/@common/utils/JsonXPath";

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
        cta : [],
        model : {
          prefix : "", value : '', suffix : '',
          text : "",  subtext : "",
          data : {
          },
        } 
      },
      sampleVar : {
        columns: [
          { name: 'Variable', prop: "variable", readonly : true},
          { name: 'Sample Value', prop: "value"}
          //,{ name: 'Description', prop: "desc",readonly : true}
        ] ,
        contact : [],
        data : [
          { variable : "prefix", desc : "eg: Rs,INR etc" }, 
          { variable : "value", desc : "eg: 10,240 , 25 Dec"  },
          { variable : "suffix" , desc : "eg: Rs,INR etc"  },
          { variable : "text", desc : "eg: Amount,CODE "},
          { variable : "subtext",  }
        ]
      } ,
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
    },
    isOTP(){
      return this.template.type == 'OTP';
    },
    messageCategory(){
      return this.template.category || "";
    },
    ctas(){
      return this.template.cta || [];
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
      this.headerLabels = Object.keys(cat?.item?.suggestion || {});
      
      if(this.template.type == "OTP"){
        this.template.category = 'OTP';
        this.template.header.label = 'OTP';
        this.template.header.variant  = 'MAJOR';
      } else if(cat && cat?.item && cat.item?.suggestion){
        let suggestion = cat?.item?.suggestion;
        if(suggestion && this.template.header.label
          && suggestion[this.template.header.label]
        ){
          this.template.header.variant = cat.item.header?.variant || suggestion[this.template.header.label]
        }
      } else  {
        this.headerLabels = [];
        this.template.header.label = '';
        this.template.header.variant  = 'MAJOR';
      }
    },
    async saveTemplate(){
       let resp = await this.$service.post("/panel/api/v1/hsm/tmpl",{
          ...this.template,
          cta : this.ctas,
          categoryTitle : this.$refs.category?.selected().item.label
        },{
         ref : this.$refs.formValidator
       });
       this.$router.push({
        name : "Templates"
       });
    },
    addButton(){
      if(this.ctas.length<3){
        this.ctas.push({
          type : "", url : "",label : "", phone : "", variant : ""
        });
      }
    },
    afterEdit(e){
      console.log("e.detail",e.detail);
      const rs = JsonXPath({
        path : '$.' +e.detail.model.variable,
        json: this.template.model,
        resultType: "all",
        value : e.detail.model.value
      });
      this.template.model.__ob__.dep.notify();
      console.log("this.template.model",this.template.model)
    }
  },
  components: { VGrid
  },
};
</script>
<style style="css" scoped>
  .template-body.basic-component .form-group .help-feedback{
      color: rgb(221, 137, 59);

  }
  .button-detail:hover, .button-detail:focus {
    border-right: 1px solid #3f3f95;
    border-left: 1px solid #3f3f95;
  }
</style>
<style lang="scss">

  .oa-message-preview-buttons {
    display: flex;
    flex-wrap: wrap;
    min-width: 33%;
    max-width: 100%;
    justify-content: space-between;
      .oa-message-preview-button {
        border-radius: 2px;
        border: 1px solid rgba(41,45,120, 0.16);
        opacity: 1;
        background-color: rgba(255,255,255, 1);
        padding: 7px;
        font-family: sans-serif;
        flex: auto;
        text-align: center;
        cursor: pointer;
        color: rgb(0, 122, 255);
        font-size: 14px;
        font-weight: bold;
      }
  }

  .oa-message-preview-wrapper {
      border-radius: 2px;
      border: 1px solid rgba(41,45,120, 0.16);
      opacity: 1;
      background-color: rgba(255,255,255, 1);
      padding: 4px;
      font-family: sans-serif;
      
      .oa-message-preview-header {
        border-radius: 2px;
        opacity: 1;
        background-color: rgba(255,255,255, 1);
        background-size: 59.73159999999999%;
        padding: 16px;
          .oa-message-preview-cat {
            opacity: 1;
            color: #666;
            font-size: 12px;
            letter-spacing: 1px;
            text-align: left;
            line-height: 16px;
            text-transform: uppercase;
            .oa-type-icon {
              margin-right: 5px;
              font-size: 1.2em;
            }
          }
          .oa-message-preview-header-body {
              color: rgba(0,0,0,0.87);
              font-size: 14px;
              font-weight: 800;
              font-style: normal;
              letter-spacing: 0px;
              text-align: left;
              line-height: 20px;
                  .oa-message-preview-header-value {
                    padding: 10px;
                    margin: auto;
                    font-size: 20px;
                    font-weight: 800;
                    font-style: normal;
                    letter-spacing: 0px;
                    text-align: right!important;
                    line-height: 28px;
                  }
                   .oa-message-preview-header-prefix {
                      font-size: .6em;
                      vertical-align: text-bottom;
                      padding-inline-end: 3px;
                   }
                  .oa-message-preview-header-suffix {
                      font-size: .6em;
                      vertical-align: text-top;
                      padding-inline-start:3px;
                  }   
            }
      }
  }
</style>>

