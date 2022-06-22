<template>
    <div>
        <page-title :heading=heading :subheading=subheading :icon=icon :actions=actions
        @action="onAction"></page-title>

          <div class="row">
              <b-card class="col-md-4" >
                <ValidationObserver ref="session_form" v-slot="{ invalid }" >

                      <ValidationProvider v-slot="v" rules="required" tag="div" class="form-row">
                        <label>Account Details</label>
                        <div class="input-group input-group-sm "> 
                            <div class="input-group-append w-50">
                                <vue-multi-select class="w-100"
                                v-model="input.lane.selected"
                                :btnLabel="input.lane.btnLabel"
                                btnClass="w-100"
                                :options="input.lane.options"
                                :selectOptions="input.lane.values"
                                @selectionChanged="onInputChange" disabledUnSelect
                                />
                            </div>
                            <b-form-input class="" placeholder="Enter Contact No." v-model="meta.sender" readonly>
                            </b-form-input>
                        </div>
                      </ValidationProvider>

                      <br>
                      <ValidationProvider v-slot="v" rules="required|phone"  class="form-row" vid="input_contact_number" 
                           name="Contact Number">
                          <label>Contact Details</label>
                          <div class="input-group input-group-sm">
                              <input vid="input_contact_number" type="tel" name="phone" 
                              class="form-control" @change="onInputChange" v-model="meta.contactMobile" placeholder="Enter Contact No."/>
                              <div class="input-group-prepend w-50">
                                  <vue-multi-select class="w-100"
                                    v-model="input.contact.selected"
                                    :btnLabel="input.contact.btnLabel"
                                     btnClass="w-100"
                                    :options="input.contact.options"
                                    :selectOptions="input.contact.values"
                                    @selectionChanged="onInputChange"  disabledUnSelect
                                    />
                              </div>
                          </div>
                           <span class="v-input-error">{{ v.errors[0] }}</span>
                      </ValidationProvider> 

                      <br>
                      <div class="form-row">
                                             <div class="input-group input-group-sm">
                            <input  type="text" name="contactName" 
                                class="form-control" v-model="meta.contactName" placeholder="Optional Name for contact"/>
                         </div>
                      </div>

                        
                      <br/>
                      <b-form-row>
                          <button @click="uploadChat"
                              name="password" id="examplePassword" :disabled="invalid"
                              class="form-control btn btn-primary">Upload</button>
                      </b-form-row>

                </ValidationObserver>    
            </b-card>
            <b-card class="col-md-5 session-list" >
              <b-table v-if="table.items && table.items.length"
                     :striped=true
                     :bordered=true
                     :outlined=false
                     :small=true
                     :hover=true
                     :dark=false
                     :fixed=false
                     :foot-clone=false
                     :items="table.items"
                     :fields="table.fields"
                     :stickyColumn=true
                     :isRowHeader=true
                     sticky-header responsive
                     >

                <template #cell(assignedToAgent)="row">
                    <font-awesome-icon v-if="row.item.mode=='BOT'" icon="robot" :style="{ color: 'grey' }" />
                    <font-awesome-icon v-if="row.item.mode=='AGENT'" icon="user" :style="{ color: 'grey' }" />
                    &nbsp;{{ row.item.assignedToAgent}}
                </template>
                <template #cell(contactId)="row">
                    <i  class="fab"  v-bind:class="MyDict.socialPrefix(row.item.contactId)"> </i>
                    {{ row.item.contactName || row.item.contactId}}
                </template>
                <template #cell(startSessionStamp)="row">
                    {{ row.item.startSessionStamp | formatDate}}
                </template>
                <template #cell(fistResponseStamp)="row">
                    {{ row.item.fistResponseStamp | formatDate}} 
                </template>
                <template #cell(closeSessionStamp)="row">
                    {{ row.item.closeSessionStamp | formatDate}}
                    <font-awesome-icon v-if="row.item.active" icon="circle" :style="{ color: 'green' }" />
                </template>   
                <template #cell(actions)="row">
                    <span style="cursor: pointer;" class="far fa-comment-alt"  @click="showChat(row.item, row.index, $event.target)" > </span>
                </template>

            </b-table>

 </b-card>
          </div>


        <input hidden type="file" ref="file" @change="onFileChange">
      <div class="chat_archive"  v-bind:class="{closed : !session}" >
          <mod-import-chat-preview v-if="session" :session="session" :key="session.sessionId"
          :sender="meta.sender" :contact="meta.contact"
          @close="hideChat">
          </mod-import-chat-preview>
      </div> 

    </div>
</template>

<script>

    import { MyFlags,MyDict,MyConst } from '../../../services/global';
    import PageTitle from "../../Components/PageTitle.vue";
    import ModImportChatPreview from './ModImportChatPreview';

    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faUsersSlash,faUsers,faStar
    } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

    library.add(
        faUsersSlash,faUsers,faStar
    );

    import vueMultiSelect from 'vue-multi-select'; 
    import 'vue-multi-select/dist/lib/vue-multi-select.css';

    function newItem() {
      return {
              "code": "",
              "dept_email": "",
              "id" : null,
              "name": ""
            };
    }
    export default {
        components: {
            PageTitle, 'font-awesome-icon': FontAwesomeIcon,vueMultiSelect,ModImportChatPreview
        },
        data: () => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            heading: 'Import Chat',
            subheading: 'Import WhatsApp Chats from exported file',
            icon: 'pe-7s-chat icon-gradient bg-tempting-azure fa fa-file-import',
            actions : [{
              label : "See past uploads", name : "PAST_IMPORTS", link : "/app/moderate/imported-chat-logs",
              type : "link"
            }, {
              label : "Import File", icon : "plus", name : "IMPORT_CHAT"
            }],
            input : {
                lane : {
                  btnLabel : values => values.length > 0 ? (values.join(',')) : 'Select Account',
                  options : { multi: false, labelName: 'Filter Types'},
                  values : [],
                  selected : [],
                  sender : ""
                },
                contact : {
                  btnLabel : values => values.length > 0 ? (values.join(',')) : 'Select Contact',
                  options : { multi: false, labelName: 'Filter Types'},
                  values : [],
                  selected : [],
                  number : ""
                },
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
            session : null,

        }),
        computed : {
            teams : function (argument) {
              return this.$store.getters.StateTeams
            }
        },
        created : function (argument) {
          this.loadAgentTeams();
        },
        methods : {
          async loadAgentTeams (){
            //await this.$store.dispatch('GetTeams');
          },
          async createTeam () {
            await this.$store.dispatch('CreatTeam', this.newItem);
            this.newItem = newItem();
            this.$refs.form.reset();
            this.onAction({name : "CANCEL"});
          },
          async enableTeam(item) {
             item.isactive = item.isactive == "Y" ? "N" : "Y";
             await this.$store.dispatch('CreatTeam', item);
          },
          async setItemDefault(item) {
             await this.$store.dispatch('SetTeamsDefault', item);
          },
          async cancelReps(item) {
             this.newItem = newItem();
             this.onAction({name : "CANCEL"});
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


          async uploadChat(){
              //+965 517 80410
              await this.$store.dispatch("UploadParsedChat", {
                meta : {
                    contact :  this.meta.contact, 
                    contactMobile : this.meta.contactMobile.replace(/\D/g,''), contactName :  this.meta.contactName,
                    sender : this.meta.sender, lane : this.meta.lane, 
                    contactType : "WHATSAPP",
                    importDetails : this.meta.importDetails
                },
                results : this.table.items
              });
              this.$router.push("/app/moderate/imported-chat-logs");
          },

          async onInputChange () {
              this.meta.lane =  this.input.lane.selected[0]
              this.meta.contact = this.input.contact.selected[0];
              this.meta.sender = (this.meta.contact == this.input.contact.values[0]) 
                                        ? this.input.contact.values[1] : this.input.contact.values[0];
             
          },

          //File upload
          onFileChange(e) {
              const file = this.$refs.file.files[0];
              this.file = file;
              console.log("onFileChange",file);
              this.uploadFile(file);
              this.$refs.session_form && this.$refs.session_form.validate();
          },
          async uploadFile(file) {
              try{
                  let resp = await this.$store.dispatch("ParseChatFile", {
                    file : file,
                    contactType : "WHATSAPP",
                    clientDate :  new Date().toString().split("(")[0].trim(),
                    clientDateFormat : "eee MMM dd yyyy HH:mm:ss 'GMT'Z"
                  });
                  this.message = 'Uploaded!!'
                  this.table.items = resp.results;
                  this.input.contact.values = [resp.meta.senderA,resp.meta.senderB];
                  this.input.contact.selected = [resp.meta.senderA];

                  this.input.lane.values = resp.meta.lanes;
                  this.input.lane.selected = [resp.meta.lanes[0]];
                  this.meta.importDetails = resp.meta.importDetails

                  this.onInputChange();

              } catch(err){
                  console.log(err);
                  this.message  = "Something went wrong!!";
              }

          },
          removeImage: function (e) {
              this.file  = '';
          },


          //Chat Previews
          hideChat : function (argument) {
            this.session = null;
          },
          showChat : function (r) {
            if(this.session && this.session == r){
              this.session = null;
            } else {
              this.session = r;
            }
            console.log("this.session ...", this.session);
          }



        }


    }
</script>
<style type="text/css" scoped="">
  .chat_archive {
    right: 0px;
    position: fixed;
    background-color: #f5f5f5;
    bottom: 0px;
    top: 60px;
    width: 450px;
    z-index: 5;
  }
  .chat_archive.closed {
    width: 0px;
    opacity : 0;
    transition: width 0.5s, opacity 1s ease-in;
  }
  .chat_archive{
    width: 450px;
    opacity : 1;
    transition: width 0.5s ease-out, opacity 0.2s ease-out;
  }
  .chat_archive>div {
    width: 450px;
  }
  .session-list .b-table-sticky-header{
    max-height: calc(100vh - 263px);
    overflow-y: scroll;
  }
</style>>
<style type="text/css">
  .b-table-sticky-header .table.b-table>thead>tr>th {
    background-color: white;
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    z-index: 2;
  } 
</style>
