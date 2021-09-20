<template>
    <div>
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
                                       <span class="contact_type fab"
                                              v-bind:class="MyDict.social[option.contactType]"></span>&nbsp;&nbsp;{{ option.lane }}</div>
                                  </template>
                                  <template #open-indicator="{ attributes }">
                                    <span v-bind="attributes" class="fa fa-caret-down"></span>
                                  </template>
                                  <template #option="{ contactType, lane }">
                                       <span class="contact_type fab"
                                              v-bind:class="MyDict.social[contactType]"></span>  {{ lane }}</em>
                                  </template>
                          </v-select>
                      </ValidationProvider>

                      <br>
                      <ValidationProvider v-slot="v" rules="required|phoneML"  class="form-row" vid="input_contact_number" 
                           name="Contact Number" mode="lazy">
                          <label>Contacts</label>
                            <textarea class="form-control" rows="10" v-model="input.contacts" >

                            </textarea>
                           <span class="v-input-error">{{ v.errors[0] }}</span>
                      </ValidationProvider> 


                 
            </b-card>
            <b-card class="col-md-4 session-list" >

                      <ValidationProvider v-slot="v" rules="required" tag="div" class="form-row">
                        <label>Template</label>
                         <v-select :options="input.templates.values"  class="w-100"
                                  v-model="input.templates.selected"
                                  :searchable="false" :clearable="false"
                                  placeholder="Select Account"
                                  >
                                  <template #selected-option="option">
                                      {{ option.name }}    
                                  </template>
                                  <template #open-indicator="{ attributes }">
                                    <span v-bind="attributes" class="fa fa-caret-down"></span>
                                  </template>
                                  <template #option="{ category, name }">
                                       <small class="">{{category}}</small> &nbsp; {{ name }}
                                  </template>
                          </v-select>
                      </ValidationProvider>
                      <br>
                      <ValidationProvider v-slot="v" rules="required|phone"  class="form-row" vid="input_contact_number" 
                           name="Contact Number">
                          <label>Message Preview</label>
                          <div class="message-preview WHATSAPP w-100" v-if="preview" >
                            <div class="message-text">{{preview.text}}</div>
                            <div class="message-buttons" v-if="preview.options">
                              <div class="message-button" v-for="(button,key) in preview.options.buttons">
                                  {{button.label}}
                              </div>

                            </div>
                            
                          </div>
                           <span class="v-input-error">{{ v.errors[0] }}</span>
                      </ValidationProvider> 

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

    import { MyFlags,MyDict,MyConst } from './../../services/global';
    import formatters from './../../services/formatters';
    import PageTitle from "../Components/PageTitle.vue";
    import mustache from 'mustache';

    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faUsersSlash,faUsers,faStar
    } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

    library.add(
        faUsersSlash,faUsers,faStar
    );

    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';

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
            PageTitle, 'font-awesome-icon': FontAwesomeIcon,vSelect
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
                  selected : [],
                  sender : ""
                },
                contacts : ""
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

        }),
        computed : {
            preview : function (argument) {
              if(!this.input.templates.selected || !this.input.templates.selected.template)
                return { preview : "", text : ""};
              var content = this.input.templates.selected.template.split('---options---');
              return  { 
                text : mustache.render(content[0], this.sample),
                options : formatters.message_form_options(formatters.map_from_string(content[1]))
              };
            }
        },
        created : function (argument) {
          this.loadLanes();
          this.loadTemplates();
        },
        methods : {
          async loadLanes (){
            let resp = await this.$service.get('/api/options/channels');
            this.input.lane.values = resp.results.filter(function (lane) {
                return lane.contactType == "WHATSAPP";
            });
          },
          async loadTemplates (){
            let resp = await this.$service.get('/api/tmpl/pushtemplate');
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
          async sendBulk (argument) {
            let resp = await this.$service.post('/api/message/bulk/push/send',{
              "message": this.preview.text,
              "subject": this.input.lane.selected.title,
              "templateId": this.input.templates.selected.id,
              "contact" : {
                "contactType": this.input.lane.selected.contactType,
                "lane" : this.input.lane.selected.lane,
                "channel" : this.input.lane.selected.channel
              },
              "to": this.input.contacts.match(/[^\r\n\,]+/g).map(function(item) {
                  return item.trim()
              }).filter(function (argument) {
                return !!argument
              })
            });
            this.$router.push("/app/moderate/bulk-push-jobs");
          }

        }

    }
</script>
<style lang="scss">
  @import "./../../assets/demo-ui/_chat-preview.scss";

</style>
<style type="text/css" scoped="">
  .session-list .b-table-sticky-header{
    max-height: calc(100vh - 263px);
    overflow-y: scroll;
  }
</style>>

