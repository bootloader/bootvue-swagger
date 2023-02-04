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
                    format-filter="item_code" :format-value="template.code" format-live
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
                
                <b-col cols="12" v-if="iCompany">
                    <base-input name="Title" v-model="template.title" hidden
                      alternative question feedback :disabled="!editable"
                      rules="max:30" />
                    <base-text-area  name="Body" alternative question feedback required :disabled="!editable"
                          placeholder="Type here" v-model="template.body"  class="template-body"
                          rules="required|max:360" :rows="6" 
                          :textLimit="360" 
                          :textCompleteStrategies="strategies"
                        :helpMessage="bodyTextLimit">
                    </base-text-area>
                    <base-text-area name="Footer" v-model="template.footer"  :disabled="!editable" 
                      alternative question feedback  hidden
                      :textCompleteStrategies="strategies" :rows="1" nonewline
                      rules="max:60"/>
                    <MyUpload ref="myVueDropzone" autoProcessQueue disablePreviews  :readonly="!editable"
                        :type.sync="template.header.mediaType" 
                        :thumb.sync="template.header.mediaThumb"
                        v-model="template.header.mediaUrl"
                        :upload-url="`${$global.MyConst.context}/panel/api/v2/org/${iCompany.companyId}/hsm/tmpl/${templateCode}/media`"
                        placeholder="Select Media" add-remove-links @uploaded="uploaded"
                        class="mb-2">
                    </MyUpload>
                </b-col>

              <b-col cols="12">
                <b-row class="bg-nightish m-0 button-detail">
                   <b-col cols="8" class="text-right">
                   </b-col>
                   <b-col cols="4" class="text-right">
                    <b-button  @click="addButton" variant="outline-oa-blue" :disabled="(ctas.length>2) || !editable" size="sm" class="m-2 mx-1">
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
                    <base-text-area :name="`Button-${i+1} Title`" v-model="cta.label"  v-if="!!cta.type" @change="templateTextChange"
                      alternative question feedback :disabled="!editable" :required="!!cta.type"
                      :textCompleteStrategies="strategies" :rows="1" nonewline
                      rules="required|max:30" />
                  </b-col>
                  <b-col cols="2" class="text-right mx-auto">
                      <b-button  @click="ctas.splice(i,1)" variant="outline-danger" :title="`Delete Button-${i+1}`"
                           :disabled="!editable" size="sm" class="m-2">
                          <i class="fa fa-times"/>
                      </b-button>
                  </b-col>
                  <b-col cols="11" v-if="cta.type" >
                      <base-text-area v-if="cta.type=='URL'" :name="`Button-${i+1} URL`" v-model="cta.url"  @change="templateTextChange"
                      alternative question feedback required :disabled="!editable"
                      :textCompleteStrategies="strategies" :rows="1" nonewline
                      rules="required|URL" />
                      <base-text-area v-if="cta.type=='PHONE'" :name="`Button-${i+1} Phone No.`" v-model="cta.phone" @change="templateTextChange"
                      alternative question feedback required :disabled="!editable"
                      :textCompleteStrategies="strategies" :rows="1" nonewline
                      rules="required|phone" />
                  </b-col>
                </b-row>
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
                    <span v-if="template.header.mediaUrl">
                        <img v-if="template.header.mediaThumb" :src="template.header.mediaThumb" />
                        <img v-else-if="template.header.mediaType=='IMAGE'" :src="template.header.mediaUrl" />
                        <video v-else-if="template.header.mediaType=='VIDEO'" :src="template.header.mediaUrl"></video>
                    </span>  
                    <div class="oa-message-preview-header">
                      <div class="oa-message-preview-header-body row">
                        <div class="col-6" >
                          <div class="oa-message-preview-cat">
                              <span class="oa-type-icon" v-if="messageCategory" :class="['my my-oa-type-'+messageCategory.toLowerCase()]"></span>{{template.header.label}}
                          </div> 
                          <div class="text-black text-truncate">{{template.model.title}}</div>
                            <div class="text-sm text-grey text-truncate">{{template.model.subtitle}}</div>
                        </div>  
                        <div class="col-6 oa-message-preview-header-value" :class="`text-oa-${template.header.variant.toLowerCase()}`">
                          <small class="oa-message-preview-header-prefix">{{template.model.prefix}}</small>
                          <span>{{template.model.value}}</span>
                          <small class="oa-message-preview-header-suffix">{{template.model.suffix}}</small>
                        </div> 
                      </div>  
                    </div>
                    <div class="oa-message-preview-message">
                        <div class="oa-message-preview-message-icon">
                            <i class="my my-oa-chat text-white bg-grey bg-round-text"/>
                        </div> 
                        <div class="oa-message-preview-message-text">
                          {{template.body | hb(template.model)}}
                        </div>  
                    </div>    
                  </div>
                  <div class="oa-message-preview-buttons" v-if="template.model && ctas.length>0">
                        <div class="oa-message-preview-button" v-for="(cta,i) in ctas" v-bind:key="i">
                         <i class="fa" :class="{
                          'fa-external-link' : cta.type == 'URL',
                          'fa-phone-alt' : cta.type == 'PHONE',
                         }"/>&nbsp;{{cta.label | hb(template.model)}}
                        </div>
                   </div>  

                  <div class="vgrid-wrapper w-100 bg-white mt-4" style="height: 300px; min-width:200px">
                    <VGrid theme="default" class="w-100 position-relative" 
                      :columns="sampleVar.columns" :readonly="!editable"
                      :source="vars"
                      @afteredit=afterEdit
                    ></VGrid>
                   </div> 
                   <div hidden>{{template.header | json}}
                   </div> 
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
import JsonUtils from '@/@common/utils/JsonUtils';
import TmplUtils from "@/@common/utils/TmplUtils";
import MyUpload from '@/@common/custom/components/MyUpload.vue';


  function newTemplate(){
    return {
        templateId : '',
        companyId : '',
        code : "",
        type : "OTP", category : "",
        header :  {
          label : '', variant : "MAJOR",
          mediaUrl : "", mediaThumb : "", mediaType : "",
        }, 
        //title : '', 
        body : '',
        footer : '', 
        cta : [],
        model : {
          prefix : "", value : '', suffix : '',
          title : "",  subtitle : "",
          data : {
          },
        } 
      };
  }

let sampleJsonKeys = JsonUtils.paths(newTemplate().model);

export default {
  mixins : [basic],
  data() {
    return {
      template : newTemplate(),
      sampleVar : {
        columns: [
          { name: 'Variable', prop: "variable", readonly : true},
          { name: 'Sample Value', prop: "sample", readonly : false}
          //,{ name: 'Description', prop: "desc",readonly : true}
        ] ,
        contact : [],
        model : [
          { variable : "{{prefix}}", path : "prefix", desc : "eg: Rs,INR etc" }, 
          { variable : "{{value}}", path : "value" ,desc : "eg: 10,240 , 25 Dec"  },
          { variable : "{{suffix}}" , path : "suffix" , desc : "eg: Rs,INR etc"  },
          { variable : "{{title}}",path : "title",  desc : "eg: Amount,CODE "},
          { variable : "{{subtitle}}", path : "subtitle" }
        ],
        data : [
        ]
      } ,
      strategies: [{
        match: /(^|\s|\w|[\/\=\?])\{+([a-z0-9+\-\_\.]*)$/,
        search(term, callback) {
          let data = "data.".startsWith(term) ? "data." : null;
          let global = "global.".startsWith(term) ? "global." : null;
          callback([...sampleJsonKeys,data].filter(function (name) {
            return name && name.startsWith(term);
          }).slice(0, 10))
        },
        template(name) {
          return name;
        },
        replace(start,end) {
          let suffix = end.trim().startsWith("}}") ? '' : '}}';
          if(/^(data|global)\.$/.test(start)){
            return ['$1{{' + start, suffix];
          }
          return '$1{{' + start + suffix
        },
      }],
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
    },
    vars(){
      return [...this.sampleVar.model,...this.sampleVar.data]
    },
    templateCode(){
      return this.template?.code || "new"
    }
  },
  watch : {
    "template.header.variant" : function(neVal){
        this.templateTextChange(neVal)
    },
    "template.body" : function(neVal){
        this.templateTextChange(neVal)
    },
    "template.footer" : function(neVal){
        this.templateTextChange(neVal)
    },
    "template.cta" : function(neVal){
        this.templateTextChange(neVal)
    },
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
            this.template.model = { ...newTemplate().model || {}, ...this.template.model };
            break;
          }
         }
         this.isTemplateLoding = false;
      } else {
        await this.loadDefault();
      }
      this.sampleVar.columns[1].readonly = !this.editable
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
      console.log("Saving...")
       let resp = await this.$service.post("/panel/api/v1/hsm/tmpl",{
          ...this.template,
          cta : this.ctas,
          categoryTitle : this.$refs.category?.selected().item.label
        },{
         ref : this.$refs.formValidator
       });
       console.log("Saving...")       
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
        path : '$.' +e.detail.model.path,
        json: this.template.model,
        resultType: "all",
        value : e.detail.model.sample
      });
      console.log("this.template.model",this.template.model)
      this.template.model.__ob__.dep.notify();
    },
    templateTextChange(){
      let neVal = ( JSON.stringify([
        this.template.header, this.template.body, this.template.title, this.template.footer, this.template.cta])
      )
      let newItem = this.template;
      this.sampleVar.data = TmplUtils.getVars(
          neVal,/({{((data|global)\.[\w\d\.]+)}})/g).map(function(v,i){
          return {
              variable : v.variable,
              path : v.path,
              sample : JsonXPath({path : '$.' +v.path,json : newItem.model})[0]
          }
      });
      this.template.model.__ob__.dep.notify();
    },
    uploaded(file){
      console.log("uploaded",file);
      this.template.header.mediaUrl = file.url;
      this.template.header.mediaType = file.fileType;
    }
  },
  components: { VGrid,MyUpload
  },
};
</script>
<style style="css" scoped>
  .template-body.basic-component .form-group .help-feedback{
      color: rgb(221, 137, 59);

  }
  .button-detail{
      border-right: 1px solid #3f3f9500;
      border-left: 1px solid #3f3f9500;
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

      img,video {
        width :100%;
        padding-bottom: 5px;
        max-height: 150px;
      }
      
      .oa-message-preview-header {
        border-radius: 2px;
        opacity: 1;
        background-color: rgba(255,255,255, 1);
        background-image: url('~@/assets/images/oa/bg-oa-message.png');
        background-repeat: repeat;
        background-color: #cccccc;
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
      .oa-message-preview-message {
        display: flex;
        .oa-message-preview-message-icon {
          width: 20px;
          margin-right: 4px;
        }
        .oa-message-preview-message-text {
          font-size: 14px;
        }
      }
  }
</style>>

