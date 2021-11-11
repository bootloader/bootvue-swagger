<template>
    <div class="m-chatbox-compose card card-shadow scheme-color">
        <div class="card-header">
            <div class="d-block clear-both text-white">
                <div class="d-flex bd-highlight card-header-left">
                    <h5 class="">New Message</h5>
                </div>
                <div  class="card-header-right">
                    <div class="quick-options">
                        <span class="float-right quick-option d-none d-md-block" 
                            @click="$router.push({ params: { mvu: 'CHATBOX' } })"
                            v-tooltip="'Cancel'" >
                            <i class="fa fa-times" aria-hidden="true"></i>
                        </span> 
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body scheme-bg">
                <div class="row m-0">
                    <div class="col-lg-12 p-0 message-box-input">
                        <form class="bg-white text-greyer">
                            <div class="form-group">
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
                                    v-model="model.templateId" />
                            </div>
                        </form>
                        <TemplatePreview v-if="model.templateId" :templateId="model.templateId" class="template-preview"
                            format="COMMON" :model="{
                                contact : contact, 
                            }" />
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
                    Send Message
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
                if(search.length < 5) return;
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
        .message-box-input .v-select .vs__search {
            padding: 2px 5px;
            text-align: left;
        } 
        .template-preview {
            margin: 10px;
        }
    }
</style>

