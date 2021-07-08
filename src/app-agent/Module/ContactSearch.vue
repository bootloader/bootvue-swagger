<template>
     <div class="m-contact-search card mb-sm-3 mb-md-0 contacts_card card-shadow">
        <div class="card-header contacts-header">

            <div class="input-group">

            <div class="input-wrapper my-lane">
                <v-select :options="input.lane.values" 
                    v-model="input.lane.selected"
                    @option:selected="loadContacts" 
                    :searchable="false"
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
            </div>

            <div class="input-group-append">
                    <a class="input-group-text menu_btn new-chat fa fa-arrow-left" v-b-toggle 
                    @click="MyFlags.agent.showContactSearch=!MyFlags.agent.showContactSearch"
                     @click.prevent>
                    </a>
            </div>


            </div>


            <div class="input-group">
                <input type="text" 
                    v-model="input.search.text"
                    placeholder="Search..." name="" class="form-control search"
                    @keyup="loadContacts">
                <div class="input-group-prepend">
                    <span v-if="!!input.search.text" 
                        class="input-group-text search_btn" @click="(input.search.text='');loadContacts()" ><i class="fa fa-close"></i></span>
                    <span v-if="!input.search.text" 
                        class="input-group-text search_btn" ><i class="fa fa-search"></i></span>
                </div>

            </div>

        </div>
        <div class="card-body contacts_body">
            <ul class="contacts contact-list" v-if="activeChats && activeChats.length>0">
                <router-link tag="li" v-for="(chat,index) in activeChats"  :key="index"
                     :id="chat.contactId" :to="'/app/chat/' + chat.contactId + '/active-sesssion/' + chat.contactId">
                    <div class="d-flex bd-highlight contact-preview" @click="MyFlags.agent.mvu='CHATBOX'">
                        <div class="img_cont">
                            <img v-lazy="{
                                    src : formatters.https_thumburl(chat.profilePic || MyDict.profilePic),
                                    error : MyDict.profilePic
                                }"
                                class="rounded-circle user_img" alt="profilpicture">
                                <span class="online_icon"></span>
                                <span class="contact_type fab"
                                v-bind:class="MyDict.social[chat.contactType]"></span>
                        </div>
                        <div class="user_info contact-text">
                            <span class="font-name" >{{chat.name || chat.contactId}}</span>
                            <span class="font-preview">{{chat.phone || chat.email}}</span>  
                        </div>
                    </div>
                </router-link>
            </ul>
            <ul class="contacts contact-list" v-if="activeChats.length==0">
               <center><small>No active session </small></center>
            </ul>
            <ul class="contacts contact-list-unassigned">
                
            </ul>
        </div>
    </div>
</template>

<script>

    import { MyFlags,MyDict,MyConst } from './../../services/global';
    import tunnel from './../../services/tunnel';
    import formatters from './../../services/formatters';

    import debounce from 'debounce';
    import throttle from 'throttleit';

    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';

    export default {
        components: {
            vSelect
        },
        computed : {
            activeChats : function(){ 
                var THAT = this;
                return (this.contacts || []).filter(function(contact) {
                    return (contact.name + contact.phone + contact.email + "")
                            .toLowerCase()
                            .indexOf(THAT.input.search.text.toLowerCase()) > -1
                });
            },
            isOnline :  function (){
                if(this.$store.getters.StateMeta){
                    return this.$store.getters.StateMeta.isOnline;
                }
                return false;
            },
            contactId : function () {
               return this.$route.params.contactId;
            },
        },
        data:() => ({
            MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
            input : {
                search: {
                    text : ""
                }, 
                lane : {
                  options : { multi: false, labelName: 'Filter Types'},
                  values : [],
                  selected : null,
                  sender : ""
                }
            },
            contacts : [],
            formatters
        }),
        mounted () {
            // fetch the data when the view is created and the data is
            // already being observed
            this.loadLanes();
            //MyFlags.agent.contactsTab = this.$route.params.contactsTab
            //this.pingOnline();
            this.loadContacts();

        },
        beforeUnmount (){
            this.tunnel.off();
        },
        watch: {

        },
        methods: {
            async loadLanes(){
                let resp = await this.$service.get('/api/options/lanes');
                this.input.lane.values = resp.results;
            },
            loadContacts :  debounce(async function(){
                if(!this.input.lane.selected) return;
                let resp = await this.$service.get('/api/options/contacts', {
                    search : this.input.search.text, 
                    lane : this.input.lane.selected.lane
                });
               this.contacts = resp.results;
            },1000),
            async toggleOnline(){
                await this.$store.dispatch('OnlineStatus', !this.isOnline);
            },
            async pingOnline(){ 
                clearInterval(this.intervalid1);        
                this.intervalid1 = setInterval(function(){
                    this.$store.dispatch('OnlineStatus', this.isOnline);
                }.bind(this), MyConst.config.agentSessionTimeout);
            },
            searchTag : function(searchTag) {
                if(this.search.text === searchTag){
                    this.search.text = "";
                } else {
                    this.search.text = searchTag;
                }
            },
            searchText : function() {
                var searchTag = this.search.text.split(/(:[\w]+\ *)/).map(function (argument) {
                    var argument = argument.trim();
                    if(argument.indexOf(":") == 0){
                        return (argument == searchTag) ? "" : searchTag;
                    }
                    return argument;
                }).filter(function (argument) {
                    return !!argument;
                }).join(" ");

                console.log("sss",[searchTag,this.search,searchTag]);
                if(this.search.text !== searchTag){
                    this.search.text = searchTag;
                } else if(this.search.text === searchTag){
                    this.search.text = "";
                } else {
                    this.search.text = searchTag + " " + this.search.text;
                }
            },
            async loadQuickLabels(){
                return await this.$store.dispatch('LoadQuickLabels');
            },
        },
        beforeUnmount : function (argument) {
          clearInterval(this.intervalid1);  
        }
    }
</script>
<style type="text/css" scoped="">
    .m-contact-search.card {
        border-radius: 0px !important;
        min-width: 200px;
    }
    .contacts_body{
        padding:  0 0 !important;
        overflow-y: auto;
        white-space: nowrap;
        background-color: #f5f5f5;
    }
    .contacts-header {
        padding : 0.75rem 0.5rem; 
    }
    .contacts-header .new-chat {
        font-size: 20px;
        text-decoration: none;
        line-height: 23px;
    }


    .contacts{
        list-style: none;
        padding: 0;
        max-width: 348px;

        list-style: none;
        max-width: calc(100% - 0px);
    }
    .contacts li{
        width: 100% !important;
        padding: 5px 10px;
        border-bottom: 1px solid #00000008;
        cursor: pointer;
        border-left: 5px solid #0000;
        border-right: 5px solid #0000;
    }
    .contacts li:hover{
        border-left: 5px solid #1d375273;
    }
    .contacts li.router-link-exact-active{
      border-left: 5px solid #1d3752;
      background-color: rgba(0,0,0,0.3);
    }
    .contacts li.router-link-exact-active, .contacts li.active_contact {
        background-color: rgb(0 0 0 / 6%)
    }


    .img_cont,
    .user_img {
        width: 40px;
        height: 40px;
    }

    .contact_type {
        width: 24px;
        height: 22px;
        font-size: 12px;
    }
    .contact-preview .contact_type{
      bottom: 0px;
      right: 0px;
      position: absolute;
    }

    .contact-text {
        margin-left: 15px;
        height: 40px;
        font-size: 18px;
        color : rgba(21, 21, 21, 0.68);
        width: calc(100% - 55px);
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .contact-text .font-name{
        text-overflow: ellipsis;
        max-width: 187px;
        overflow: hidden;
        /*font-weight: 300;*/
    }
    .contact-text .font-preview{
        text-overflow: ellipsis;
        max-width: 187px;
        overflow: hidden;
        font-size: 10px;
        display: block;
    }

</style>
<style lang="scss">
    .m-contact-search {
        .input-wrapper.my-lane {
            width: calc( 100% - 50px);

            .v-select{
                margin-bottom: 8px;
                color: #000;
                width: 100%;
            }
             .v-select .vs__selected{
                color: #FFF;
                background: transparent;
                border: none;
                padding-left: 19px;
            }
            .vs__dropdown-toggle  {
                border : none;
                color: #fff;
                background-color: #0000002e;
                border-radius: 6px;
            }
            .v-select .vs__search {
                visibility: none;
                width: 0px;
                padding: 0px;
                color: #FFF;
                padding: 2px 0px;
                text-align: center;
            }
           .v-select.vs--open .vs__search {
                opacity: 0.5;
            }
            .vs__clear {
                display: none;;
            }
        }
    }
</style>