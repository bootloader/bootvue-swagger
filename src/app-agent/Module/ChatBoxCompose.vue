<template>
    <div class="m-chatbox-compose card card-shadow scheme-color">
        <div class="card-header">
            <div class="d-block clear-both text-white">
                <div class="d-flex bd-highlight card-header-left">
                    <h5 class="">New Message</h5>
                </div>
                <div  class="card-header-right">
                    <div class="quick-options">
                        <span class="float-right quick-option" 
                            @click="$router.back()"
                            v-tooltip="'Cancel'" >
                            <i class="fa fa-times" aria-hidden="true"></i>
                        </span> 
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body scheme-bg">
                <div class="w-100 m-0">
                    <div class="w-100 p-0 message-box-input">
                        <div class="bg-white text-greyer w-100 form-group message-box-meta">
                                <MyChannelSelect v-model="model.channelId"  ref="channelSelect"
                                    :filter="{
                                        pushToNewContactAllowed : true
                                    }"
                                />
                                <MyVSelect searchable placeholder="To"  :filterable="false" clearable
                                    :options="contacts" optionKey="contactId"
                                     v-model="model.contactId"  ref="contactSelect"
                                    selectedPrefixClass="fa fa-address-book text-xl px-1 text-greyer"
                                    @search="onContactSearch" 
                                    @option="onContactOption"
                                    />
                                <MyVSelect options="getx:/api/options/tmpl/hsm" ref="selectedTemplate"
                                    class="f-hsm-template"
                                    selectedPrefixClass="fa fa-file-code text-xl px-1 text-greyer"
                                    v-model="model.templateId" searchable filterable
                                    :filter="{
                                        'meta.agentAllowed' : true
                                    }">
                                    <template #selected-option="{ item }">
                                        <span class="">
                                            <div> <my-icon type="messageType" :value="item.formatType"></my-icon>&nbsp;{{ item.desc}}</div>
                                            <small class="btn btn-xs btn-outline-grey text-whites text-xxs mg-1">{{item.category}}</small>
                                            <small class="btn btn-xs btn-outline-dark text-xxs  mg-1">{{item.lang}}</small>
                                            <small class="mg-2 btn btn-xs" 
                                                v-for="link in item.approved" v-bind:key="link.templateId"
                                                v-show="link.channelId == model.channelId"
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
                                        <small class="text-md mg-2 btn btn-xs float-right" 
                                            v-for="link in item.approved" v-bind:key="link.templateId"
                                            v-show="link.channelId == model.channelId">
                                            <my-icon type="channel" :value="link.channelId" :status="link.status"
                                            v-tooltip="`This template is ${link.status} for channel ${link.channelId}`"
                                            ></my-icon>  
                                        </small>
                                    </template>
                                </MyVSelect>
                                     
                        </div>
                        <div class="message-box-preview m-0 w-100"> 
                                <div v-if="model.templateId" class="">
                                    <div  class="">
                                        <TemplatePreview  :templateId="model.templateId" 
                                        class="template-preview h-100p"
                                        format="COMMON" :model="{
                                            contact : vars.contact, 
                                            data : vars.data
                                        }" />
                                    </div>    
                                    <div v-if="model.templateId" class="m-3">
                                        <my-model-form size="sm" class="mt-3 d-block"
                                            :configs="sampleVarData" prelabel variant="outline-grey"
                                            :model="vars">
                                        </my-model-form>  
                                    </div>    
                                    <div  class="template-attachment position-relative m-1" v-if="hasAttachment">
                                        <vue-dropzone ref="myVueDropzone" class="m-2" v-bind:key="acceptedFiles"
                                            id="dropzone" :options="{...dz,acceptedFiles}"

                                            v-on:vdropzone-drag-enter="dragEnter" 
                                            v-on:vdropzone-drag-over="dragEnter" 
                                            
                                            v-on:vdropzone-file-added="fileAdded" 
                                            v-on:vdropzone-sending="fileUploading"
                                            v-on:vdropzone-success="fileUploaded"

                                            v-on:vdropzone-queue-complete="fileUploadedAll"
                                            ></vue-dropzone>
                                        </div>

                                </div>
                                <div v-else class="text-center mt-5">
                                    <span class="fa fa-code fa-5x text-white-dirty" />
                                    <br/>
                                    <small> Any additional message you send to the customer beyond the Customer Care Window must be a Template Message,</small>
                                    <br/>
                                </div> 
                        </div>   
   
                    </div>
                </div>
              
        </div>
        <div class="card-footer">
            <div
                v-if="$config.SETUP.POSTMAN_AGENT_CHAT_INIT"
                class="control-panel text-center">
                <b-button
                    pill
                    variant="outline-white-dirty"
                    class="btn-sm text-white:hover"
                    @click="sendNewMessage(true)">
                    Send
                </b-button>
                <b-button hidden
                    pill
                    variant="outline-grey"
                    class="btn-sm text-white:hover ml-2"
                        @click="$router.push({ params: { mvu: 'CONTACTS' } })"
                        v-tooltip="'Cancel'" >
                        Cancel
                </b-button> 
                <b-button 
                    pill
                    variant="outline-grey"
                    class="btn-sm text-white:hover ml-2"
                        @click="$router.back()"
                        v-tooltip="'Cancel'" >
                        Cancel
                </b-button> 
            </div>
        </div>
    </div>
</template>

<script>

    import TemplatePreview from "@/@common/custom/components/TemplatePreview.vue";
    import MyChannelSelect from '@/@common/custom/components//MyChannelSelect.vue';
    import MyHSMTmplSelect from '@/@common/custom/components//MyHSMTmplSelect.vue';
    import MyVSelect from '@/@common/custom/components//MyVSelect.vue';
    import debounce from 'debounce';
    import parsePhoneNumber from 'libphonenumber-js';
    import BaseVSelect from '@/@common/custom/components/base/BaseVSelect.vue';
    import { MyFlags,MyDict,MyConst,MyFunc } from './../../services/global';
    import vue2Dropzone from 'vue2-dropzone'
    import 'vue2-dropzone/dist/vue2Dropzone.min.css'
    import TmplUtils from "@/@common/utils/TmplUtils";
    import MyModelForm from '../../@common/custom/components/MyModelForm.vue';

    export default {
        name: 'ChatBoxCompose',
        components: {MyChannelSelect,MyHSMTmplSelect,MyVSelect,TemplatePreview,BaseVSelect,
            vueDropzone: vue2Dropzone,
            MyModelForm},
        computed: {
            m() {
                return this.message
            },
            selectedTemplate(){
              if(this.model.templateId){
                return {
                    ...this.$refs.selectedTemplate?.selected().item,
                   // attachments : this.attachments 
                }
              }
              return null;  
            },
            hasAttachment(){
                return this.selectedTemplate.formatType && !(this.selectedTemplate.formatType == 'TEXT')
            },
            acceptedFiles(){
                switch(this.selectedTemplate.formatType){
                    case "IMAGE":
                        return 'image/png, image/jpeg';
                    case "VIDEO":
                        return 'video/*';
                    case "AUDIO":
                        return 'audio/*';
                    default :
                        return null;
                }
            },
            sampleVarData(){
              if(this.model.templateId){
                let neVal = (this.selectedTemplate.header + this.selectedTemplate.template + this.selectedTemplate.footer)
                 let THAT = this;
                  return TmplUtils.getVars(neVal,/({{((data|global)\.[\w\d\.]+)}})/g
                  ).map(function(v,i){
                    return {
                        title : v.path,
                        path : v.path,
                        //value : JsonXPath({path : '$.' +v.path,json : THAT.input.templates.vars})[0]
                    }
                });
              }
            },
        },
        data: () => ({
            model : {
                channelId : null,//"tg:mehery_demo_bot",
                search : "",
                contactId : null,
                templateId : null,
            },
            vars : {
                contact : null, 
                data : {}, 
            },
            contacts : [],
            dz: {
              url: MyConst.context + '/api/sessions/message/upload',
              thumbnailWidth: 150,
              maxFilesize: 10, 
              maxFiles : 1,
              autoProcessQueue: false,
              addRemoveLinks : true,

              // Extra-/-External Flags
              file_count : 0,
              file_dragging : false,file_dropped : false, file_in : false,
              showcounter : null
            },
        }),
        mounted(){
            console.log("this.$route.params.contact",this.$route.params.contact)
            if(this.$route.params.contact){
                this.contacts.push(this.$route.params.contact);
                this.model.contactId = this.$route.params.contact.contactId;
            }
            console.log("this.$route.params.contact",this.$refs.contactSelect.option());
        },
        methods : {
            onContactOption (option){
                this.vars.contact = option ? option.item : null;
            },
            onContactSearch(search, loading) {
                if(search.length>0) {
                    this.loadContacts(loading, search);
                }
            },
            loadContacts :  debounce(async function(loading, search){
                let channel  = this.$refs.channelSelect.option().item;
                if(!channel) return;
                let noContacts = [];
                let searchedPhone = null;
                const phoneNumber = parsePhoneNumber(search,"IN");
                if(phoneNumber && phoneNumber.isValid()){
                    searchedPhone = `${phoneNumber.countryCallingCode}${phoneNumber.nationalNumber}`
                    noContacts.push({
                        label : `${phoneNumber.formatInternational()}`,
                        phone : searchedPhone,
                        contactType : channel.contactType,
                        channelType : channel.channelType,
                        lane : channel.lane
                    });
                } 
                const phoneNumberPlus = parsePhoneNumber("+"+search);
                if(phoneNumberPlus && phoneNumberPlus.isValid()){
                    let phone = `${phoneNumberPlus.countryCallingCode}${phoneNumberPlus.nationalNumber}`;
                    if(!searchedPhone !== phone){
                        noContacts.push({
                            label : `${phoneNumberPlus.formatInternational()}`, 
                            phone : phone,
                            contactType : channel.contactType,
                            channelType : channel.channelType,
                            lane : channel.lane
                        });
                    }
                    searchedPhone = phone;
                }
                this.contacts = noContacts.length ? [...noContacts] : [];
                console.log(phoneNumber,phoneNumberPlus);
                if(search.length < 3) return;
                loading(true);
                let resp = await this.$service.get('/api/options/contacts', {
                    search : searchedPhone || search, 
                    lane : channel.lane
                });
                this.vars.contacts = noContacts.length ? [...resp.results,...noContacts] : resp.results;
                loading(false);
            },500),
            prepareMessage(){
                let contact = this.$refs.contactSelect.option();
                var msg = {
                    timestamp : new Date().getTime(),
                    sender : this.$global.MyConst.agent, name : this.$global.MyConst.agent,
                    contact : contact?.item,
                    messageId : "", templateId : this.model.templateId, type :"O",
                    hsm : {
                        id : this.model.templateId,
                        code : this.selectedTemplate.code,
                        data : this.vars.data,
                    }
                };
                return msg;
            },
            async sendNewMessage() {
                let msg = this.prepareMessage();
                let resp = null;
                if(this.hasAttachment){
                     await this.updaedNewMessage(msg);
                } else {
                    resp = await this.$store.dispatch('SendChat', msg);
                    this.onSendNewMessage(resp);
                }
            },
            async updaedNewMessage() {
                await this.$refs.myVueDropzone.processQueue();
            },
            async onSendNewMessage(resp) {
                if(resp){
                    this.$router.push({
                            name: 'defAgentView', 
                            params: { 
                                contactId : resp.meta?.contactId,
                                sessionId : resp.meta?.sessionId,
                                profileId : resp.meta?.contactId,
                                mvu : "CHATBOX",
                                sendNewMessage : false,
                            }
                    }).catch(err => { console.error("Already ON Same Path") });
                }
            },
                        //DZ options
            dragEnter : function (params) {
                
            },
            async fileAdded(argument) {
                 this.winMode = "UPLOAD_MEDIA";
                 //this.dz.file_dropped = true;
            },
            async fileUploading(file, xhr, formData) {
                var msg = this.prepareMessage();
                this.$store.dispatch("SendChatPre",msg);
                formData.append('message', JSON.stringify(msg));
            },
            async fileUploaded(file,resp) {
                if(resp){
                    this.$store.dispatch("ReadChatMessage",resp.results[0]);  
                    this.onSendNewMessage(resp);          
                }
                this.$refs.myVueDropzone.removeFile(file);
            },
            async fileUploadedAll(e){
                //this.toggleView("CHAT_BOX");
                this.caption_text = null;
            },
        },
        props: {
            message: {
                type: Object,
            },
        },
    }
</script>
<style type="text/css" scoped>
    .messege-right h1 {
        font-size: 18px;
    }
    .message-box-icon i {
        padding: 0px 3px;
    }
    .message-box-input .form-control {
        border-radius: unset;
        box-shadow: none;
        background-color: #FFF;
    }
    .card-body {
        padding: 0px;
    }
</style>
<style lang="scss" >
    .m-chatbox-compose {
        .message-box-input .v-select .vs__dropdown-toggle{
            border-radius: 0px!important;
        }
        .card-body {
            height: calc( 100% - 114px);
            overflow: hidden;
        }

        .message-box-input {
            height: calc( 100vh - 50px);
            .form-group.message-box-meta{
                height: 126px;
                margin: 0px;
                .f-hsm-template .vs__dropdown-toggle {
                    height: 50px;
                }
                .vs__dropdown-option.vs__dropdown-option--highlight {
                    background: rgb(225, 225, 225) !important;
                    color: #000!important;
                }
            }
            .v-select .vs__search {
                padding: 2px 5px;
                text-align: left;
            } 
            .message-box-preview {
                height: calc( 100vh - 242px) !important;
                overflow-y: scroll;

                .template-preview {
                    margin: 10px;
                }
                .template-attachment, #dropzone{
                    min-height: 100px!important;
                }
            }
        }

    }
</style>

