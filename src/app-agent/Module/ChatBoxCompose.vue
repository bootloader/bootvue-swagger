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
                            @click="$router.push({ params: { mvu: 'CONTACTS' } })"
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
                        <div class="bg-white text-greyer w-100 form-group">
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
                                <MyHSMTmplSelect options="getx:/api/options/tmpl/hsm"
                                    selectedPrefixClass="fa fa-file-code text-xl px-1 text-greyer"
                                    v-model="model.templateId"
                                    :filter="{
                                        'meta.agentAllowed' : true
                                    }"
                                     />
                        </div>
                        <div class="message-box-preview m-0 w-100 center-wrap"> 
                                <TemplatePreview v-if="model.templateId" :templateId="model.templateId" 
                                    class="template-preview"
                                    format="COMMON" :model="{
                                        contact : contact, 
                                    }" />
                                <div v-else class="text-center mt-5">
                                    <span class="fa fa-code fa-5x text-white-dirty" />
                                    <br/>
                                    <small> Any additional message you send to the customer beyond the Customer Care Window must be a Templated Message,</small>
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
                <b-button 
                    pill
                    variant="outline-grey"
                    class="btn-sm text-white:hover ml-2"
                        @click="$router.push({ params: { mvu: 'CONTACTS' } })"
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


    export default {
        name: 'ChatBoxCompose',
        components: {MyChannelSelect,MyHSMTmplSelect,MyVSelect,TemplatePreview},
        computed: {
            m() {
                return this.message
            },
        },
        data: () => ({
            model : {
                channelId : null,//"tg:mehery_demo_bot",
                search : "",
                contactId : null,
                templateId : null,
            },
            contact : null, 
            contacts : []
        }),
        methods : {
            onContactOption (option){
                this.contact = option ? option.item : null;
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
                this.contacts = noContacts.length ? [...resp.results,...noContacts] : resp.results;
                loading(false);
            },500),
            async sendNewMessage() {
                let contact = this.$refs.contactSelect.option().item;
                var msg = {
                    timestamp : new Date().getTime(),
                    sender : this.$global.MyConst.agent, name : this.$global.MyConst.agent,
                    contact : contact,
                    messageId : "", templateId : this.model.templateId, type :"O"
                };
                let resp = await this.$store.dispatch('SendChat', msg);
                this.$router.push({
                        name: 'defAgentView', 
                        params: { 
                            contactId : resp.meta.contactId,
                            sessionId : resp.meta.sessionId,
                            profileId : resp.meta.contactId,
                            mvu : "CHATBOX",
                            sendNewMessage : false
                        } 
                }).catch(err => { console.error("Already ON Same Path") });
            }
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
            .form-group {
                height: 106px;
                margin: 0px;
            }
            .v-select .vs__search {
                padding: 2px 5px;
                text-align: left;
            } 
            .message-box-preview {
                height: calc( 100vh - 222px) !important;
                overflow-y: scroll;

                .template-preview {
                    margin: 10px;
                }

            }
        }

    }
</style>

