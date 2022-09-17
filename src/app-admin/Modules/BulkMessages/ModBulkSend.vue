<template>
    <div class="m-mod-bulk-send">
        <page-title :heading=heading :subheading=subheading :icon=icon :actions=actions
        @action="onAction"></page-title>

        <ValidationObserver ref="session_form" v-slot="{ invalid }" >
          <div class="row">
          
              <b-card class="col-md-4" >
              
                      <ValidationProvider v-slot="v" rules="required" tag="div" class="form-row">
                        <label>Account Details</label>
                         <v-select :options="input.lane.values"  class="w-100"
                                  v-model="input.lane.selected"
                                  :searchable="false" :clearable="false"
                                  placeholder="Select Account"
                                  >
                                  <template #selected-option="option">
                                    <div class="user_assignment-selected">
                                       <span class="contact_type fab fac-bg"
                                              v-bind:class="MyDict.social[option.contactType]"></span>&nbsp;&nbsp;{{ option.lane }}</div>
                                  </template>
                                  <template #open-indicator="{ attributes }">
                                    <span v-bind="attributes" class="fa fa-caret-down"></span>
                                  </template>
                                  <template #option="{ contactType, lane }">
                                       <span class="contact_type fab fac-bg"
                                              v-bind:class="MyDict.social[contactType]"></span>  {{ lane }}
                                  </template>
                          </v-select>
                      </ValidationProvider>
                      <br>
                      <label>Template</label>
                        <base-v-select class="w-100" ref="selectedTemplate"
                          :options="input.templates.values"
                           optionKey="code" optionLabel="title"
                          v-model="input.templates.selected"
                          :searchable="false" :clearable="false"
                          placeholder="Select Account">
                             <template #selected-option="{ item }">
                                  <span class="">
                                    <div> <my-icon type="messageType" :value="item.formatType"></my-icon>&nbsp;{{ item.desc}}</div>
                                    <small class="btn btn-xs btn-outline-grey text-whites text-xxs mg-1">{{item.category}}</small>
                                    <small class="btn btn-xs btn-outline-dark text-xxs  mg-1">{{item.lang}}</small>
                                    <small class="text-md mg-2 btn-xs" 
                                      v-for="link in item.approved" v-bind:key="link.templateId"
                                      v-show="link.channelId == input.lane.selected.channelId"
                                      >
                                      <my-icon type="channel" :value="link.channelId" :status="link.status"
                                        v-tooltip="`This template is ${link.status} for channel ${link.channelId}`"
                                      ></my-icon>  
                                    </small>
                                  </span>  
                              </template>
                              <template #open-indicator="{ attributes }">
                                <span v-bind="attributes" class="fa fa-caret-down"></span>
                              </template>
                              <template #option="{ item }">
                                  <div class="text-bold"><my-icon type="messageType" :value="item.formatType"></my-icon>&nbsp;{{ item.desc}}</div>
                                  <i class="d-block text-xs">{{ item.name }}</i>
                                  <small class="btn btn-xs btn-outline-grey text-whites text-xxs mg-1">{{item.category}}</small>
                                  <small class="btn btn-xs btn-outline-dark text-xxs  mg-1">{{item.lang}}</small>
                                  <small class="text-md mg-2 btn-xs float-right" 
                                    v-for="link in item.approved" v-bind:key="link.templateId"
                                    v-show="link.channelId == input.lane.selected.channelId"
                                    >
                                    <my-icon type="channel" :value="link.channelId" :status="link.status"
                                      v-tooltip="`This template is ${link.status} for channel ${link.channelId}`"
                                    ></my-icon>  
                                  </small>
                              </template>
                        </base-v-select>
                      <br>
                      <ValidationProvider v-slot="v" 
                          rules="required|phone"  class="form-row" vid="input_contact_number" 
                           name="Contact Number">
                          <label>Message Preview</label>
                          <div class="w-100">
                            <TemplatePreview v-if="input.templates.selected" 
                                :template="selectedTemplate"
                                :model="input.templates.vars" />
                          </div>  
                           <span class="v-input-error">{{ v.errors[0] }}</span>
                      </ValidationProvider> 
            </b-card>
            

          <b-card class="col-md-4 session-list" >
                <label>Placeholder</label>
                <base-v-select class="w-100" ref="attachment"
                  options="getx:/api/tmpl/quickmedia"
                  optionKey="code" optionLabel="title"
                  v-model="input.templates.attachment"
                ></base-v-select>
                <br/>
                <div class="vgrid-wrapper">
                  <VGrid theme="default" class="w-100 position-relative"
                      :columns="sampleVar.columns"
                      :source="sampleVarData"
                      @afteredit=afterEdit
                  ></VGrid>
                </div>  
          </b-card>
        <b-card class="col-md-4 session-list contact-list" >
            <b-tabs card>
                <b-tab title="Copy/Paste" active>
                    <ValidationProvider    v-slot="v" :rules="input.contactCSV == '' ? 'required|phoneML':''"  class="form-row" vid="input_contact_number" 
                        name="Contact Number" mode="lazy">
                        <label>Contacts</label>
                        <textarea class="form-control" rows="10" v-model="input.contacts" >

                        </textarea>
                        <span class="v-input-error">{{ v.errors[0] }}</span>
                    </ValidationProvider> 
                </b-tab>
                <b-tab title="Upload CSV">
                    <b-card-text>
                        
                        <b-form-row>
                            <button @click="downloadCSVtemplate"
                                class="form-control btn btn-primary">Download CSV Template​</button>
                                <br/> <br/><i>This will download a cvs file with all the variables associated with the chosen template​</i><br/>
                        </b-form-row>

                            <ValidationProvider :rules="input.contacts == '' ? 'required':''" persist="true"  class="form-row" vid="input_contact_csv" 
                        name="Contact Number" mode="lazy" v-slot="{ validate, errors }">
                                <b-form-file placeholder="Upload CSV file​" accept=".csv" v-model="input.contactCSV" @change="validate($event)"></b-form-file>
                                <span class="v-input-error">{{ errors[0] }}</span>
                            </ValidationProvider>
                            <div v-if="input.csvUploadError.length">
                                <div class="v-input-error">Error:</div>
                                <ol>
                                    <li class="v-input-error" v-for="error in input.csvUploadError">{{error}}</li>
                                </ol>
                            </div>
                            <i>Upload csv file with all the variables associated with each contact. Incomplete files, will not be accepted.​​</i>
                    </b-card-text>
                </b-tab>
            </b-tabs>
                        
            <br/>
            <b-form-row>
                <button @click="sendBulk"
                    name="password" id="examplePassword" :disabled="invalid"
                    class="form-control btn btn-primary">Send</button>
            </b-form-row>
           </b-card>
           
          </div>
         
        </ValidationObserver> 
    </div>
</template>

<script>

    import TemplatePreview from "@/@common/custom/components/TemplatePreview.vue";
    import { MyFlags,MyDict,MyConst } from '../../../services/global';
    import formatters from '../../../services/formatters';
    import TmplUtils from "@/@common/utils/TmplUtils";
    import JsonXPath from "@/@common/utils/JsonXPath";
    import PageTitle from "../../Components/PageTitle.vue";
    import mustache from 'mustache';
    import {Parser} from 'json2csv';
    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faUsersSlash,faUsers,faStar
    } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

    library.add(
        faUsersSlash,faUsers,faStar
    );

    import VGrid, { VGridVueTemplate } from "@revolist/vue-datagrid";
    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';
    import BaseVSelect from '../../../@common/custom/components/base/BaseVSelect.vue';
    import SmartConversations from '../../../app-content/Pages/Pricing/SmartConversations.vue';

    function newItem() {
      return {
              "code": "",
              "dept_email": "",
              "id" : null,
              "name": ""
            };
    }

    var sampleJson = {
        contact : {
          name : "John Doe", phone : "919876543210", email : "John.Doe@company.com"
        }
    };

    export default {
        components: {
            PageTitle, 'font-awesome-icon': FontAwesomeIcon,vSelect,TemplatePreview,
                BaseVSelect,VGrid,
                SmartConversations
        },
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            heading: 'Send Bulk',
            subheading: 'Send bulk Messages to conatcts',
            icon: 'pe-7s-chat icon-gradient bg-tempting-azure fa fa-file-import',
            actions : [{
              label : "View Past Jobs", name : "BULK_PUSH_JOBS", link : "/app/moderate/bulk-push-jobs",
              type : "link"
            }],
            input : {
                lane : {
                  values : [],
                  selected : [],
                  sender : ""
                },
                templates : {
                  values : [],
                  selected : null,
                  sender : "",
                  attachment : null,
                  vars : {}
                },
                contacts : "",
                contactCSV:"",
                csvUploadError:[]
            },
            table : {
              fields: [ 
                  //{ key : 'assignedToAgent', label : "Assigned" },
                  //{ key : 'contactId', label : "Contact" },
                  { key : 'actions', label : "Action" },
                  { key : 'startSessionStamp', label : "Start@" },
                  //{ key : 'fistResponseStamp', label : "Agent@" },
                  //{ key : 'lastInComingStamp', label : "lastInComingStamp" },
                  //{ key : 'lastResponseStamp', label : "lastResponseStamp" },
                  { key : 'closeSessionStamp', label : "Closed@" },
                  //{ key : 'actions', label : "Action" }
              ],
              items : [],
              perPage: 25,
              currentPage: 1,
              rows : 0
            },
            meta : { sender : null, contact :  null, contactMobile : null, contactName : null, lane : null },
            newItem : newItem(),
            modelName :  "MODAL_ADD_TEAM",
            sample : sampleJson,
            sampleVar : {
              columns: [
                { name: 'Variable', prop: "variable", readonly : true},
                { name: 'Value', prop: "value"}] ,
              contact : [],
              data : []
            } 
        }),
        computed : {
            attachments(){
              if(this.input.templates.attachment ){
                let attachment = this.$refs.attachment.selected().item;
                return [{
                        mediaType : attachment.type,
                        mediaURL : attachment.url
                  }];
              }
              return null;
            },
            selectedTemplate(){
              if(this.input.templates.selected){
                return {
                    ...this.$refs.selectedTemplate?.selected().item,
                    attachments : this.attachments 
                }
              }
              return null;  
            },
            sampleVarData(){
              if(this.input.templates.selected){
                let neVal = (this.selectedTemplate.header + this.selectedTemplate.template + this.selectedTemplate.footer
                + (this.selectedTemplate?.options?.buttons || []).map(function(btn){
                    return btn.code + " " + btn.url;
                  }).join(" ")
                )
                 let THAT = this;
                  return TmplUtils.getVars(neVal,/({{((data|global)\.[\w\d\.]+)}})/g
                  ).map(function(v,i){
                    return {
                        variable : v.variable,
                        path : v.path,
                        value : JsonXPath({path : '$.' +v.path,json : THAT.input.templates.vars})[0]
                    }
                });
              }
            },
           preview : function (argument) {
              if(!this.selectedTemplate)
                return { preview : "", text : ""};
              var content = this.selectedTemplate.template.split('---options---');
              return  { 
                text : mustache.render(content[0], this.sample),
                options : formatters.message_form_options(formatters.map_from_string(content[1]))
              };
            },
        },
        created : function (argument) {
          this.loadLanes();
          this.loadTemplates();
          
        },
        methods : {
            async uploadCsv(){
                let bodyFormData = new FormData();
                bodyFormData.append("file",this.input.contactCSV);
                bodyFormData.append("templateId",this.selectedTemplate.id);
                let resp = await this.$service.post('/pub/message/bulk/push/csv/read',bodyFormData)
                console.log("resp",resp);
                if(resp.results[0].referenceKey){
                    return resp.results[0].referenceKey;
                } else{
                    this.input.csvUploadError = resp.results[0].lstErrors
                }
                return false;
            },
          async loadLanes (){
            let resp = await this.$service.get('/api/options/channels');
            this.input.lane.values = resp.results.filter(function (lane) {
                return lane.contactType == "WHATSAPP";
            });
          },
          async loadTemplates (){
            let resp = await this.$service.get('/api/tmpl/hsm');
            this.input.templates.values = resp.results;
          },
          onAction : function (argument) {
            switch(argument.name){
              case "IMPORT_CHAT" :
                this.$refs.file.click();
                break;
              case "EDIT_ITEM" :
              this.oldHash = JSON.stringify(this.newItem);
                this.$bvModal.show(this.modelName)
                console.log("ADD_ITEM",argument);
                break;
              case "CANCEL" :
                this.$bvModal.hide(this.modelName)
                break;
              default:
                console.log("NoMapping",argument) 
            }
          },
          afterEdit(e){
              const rs = JsonXPath({
                path : '$.' +e.detail.model.path,
                json: this.input.templates.vars,
                resultType: "all",
                value : e.detail.model.value
              });
              this.input.templates.vars.__ob__.dep.notify()
          },
          async sendBulk (argument) {
            let success = await this.$refs.session_form.validate();
            console.log("success",success, this.input.contactCSV);
            if(!success) return;
            let referenceKey;
            if(this.input.contactCSV){
                referenceKey = await this.uploadCsv();
            }
            if(this.input.contactCSV && !referenceKey) return;
            let resp = await this.$service.post('/api/message/bulk/push/send',{
              "message": this.preview.text,
              "subject": this.input.lane.selected.title,
              "referenceKey":referenceKey,
              hsm : {
                id: this.selectedTemplate.id,
                data : this.input.templates.vars.data
              },
              attachments : this.attachments,
              "contact" : {
                "contactType": this.input.lane.selected.contactType,
                "lane" : this.input.lane.selected.lane,
                "channel" : this.input.lane.selected.channel
              },
              "to": this.input.contacts!= "" ? this.input.contacts.match(/[^\r\n\,]+/g).map(function(item) {
                  return item.trim()
              }).filter(function (argument) {
                return !!argument
              }) : []
            });
            this.$router.push("/app/moderate/bulk-push-jobs");
          },
          downloadCSVtemplate(){
            if(this.sampleVarData && typeof this.sampleVarData == "object"){
                let csvData = {contacts:""};
                this.sampleVarData.map(v=>{
                    let newKay = v.path;
                    csvData[newKay] = ""
                })

                if(Object.keys(csvData).length){
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(csvData);
                    console.log("csv",csv);
                    let csvContent = "data:text/csv;charset=utf-8,"+csv;
                    var encodedUri = encodeURI(csvContent);
                    var link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", "bulk_upload_format.csv");
                    document.body.appendChild(link); // Required for FF
                    link.click();
                }
            }
          }


        }

    }
</script>
<style lang="scss">
  @import "@/assets/demo-ui/_chat-preview.scss";

 .m-mod-bulk-send {
  .vs__dropdown-option.vs__dropdown-option--highlight {
      background: rgb(225, 225, 225) !important;
      color: #000!important;
  }
 }
</style>
<style type="text/css" scoped="">
  .session-list .b-table-sticky-header{
    max-height: calc(100vh - 263px);
    overflow-y: scroll;
  }
  .vgrid-wrapper {
    width: 100%;
    min-width: 50px;
    position: relative;
    min-height: 100px;
    height: 300px;
    background-color: rgba(139, 139, 139, 0.041);
  }
  
</style>
<style lang="scss">
.m-mod-bulk-send{
    .contact-list{
        .nav-item{
            flex-grow: 1;
            .nav-link {
                border: 1px solid;
                border-radius: 5px !important;
                margin: 0 5px;
                text-align: center;
            }
        }
    }
}
</style>
