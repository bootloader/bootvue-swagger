<template>
     <div class="m-contact-search card mb-sm-3 mb-md-0 contacts_card card-shadow">
        <div class="card-header contacts-header">
            <div class="input-group">
                <input type="text" 
                    v-model="search.text"
                    placeholder="Search..." name="" class="form-control search">
                <div class="input-group-prepend">
                    <span v-if="!!search.text" class="input-group-text search_btn" @click="search.text=''" ><i class="fa fa-close"></i></span>
                    <span v-if="!search.text" class="input-group-text search_btn" ><i class="fa fa-search"></i></span>
                </div>
                <div class="input-group-append">
                    <a class="input-group-text menu_btn new-chat fa fa-close" v-b-toggle 
                    @click="MyFlags.agent.showContactSearch=!MyFlags.agent.showContactSearch"
                     @click.prevent>
                    </a>
                </div>
            </div>
            <div class="input-wrapper my-lane">
                <v-select :options="input.lane.values" 
                    :searchable="false">
                    <template #selected-option="option">
                      <div class="user_assignment-selected"> {{ option.contactType }} - {{ option.lane }}</div>
                    </template>
                    <template #open-indicator="{ attributes }">
                      <span v-bind="attributes" class="fa fa-caret-down"></span>
                    </template>
                    <template #option="{ contactType, lane }">
                        {{ contactType }} - {{ lane }}</em>
                    </template>
                </v-select>
            </div>
        </div>
        <div class="card-body contacts_body">
            <ul class="contacts contact-list" v-if="activeChats.length>0">
                <router-link tag="li" v-for="(chat,index) in activeChats"  :key="index"
                     :id="chat.contactId" :to="'/app/chat/' + chat.contactId + '/' + chat.sessionId + '/' + chat.contactId">
                    <div class="d-flex bd-highlight contact-preview" @click="MyFlags.agent.mvu='CHATBOX'">
                        <div class="img_cont">
                            <img :src="chat.profilePic || MyDict.profilePic" class="rounded-circle user_img" alt="profilpicture">
                                <span class="online_icon"></span>
                                <span class="contact_type fa"
                                v-bind:class="MyDict.social[chat.contactType]"></span>
                        </div>
                        <div class="user_info contact-text">
                            <span class="font-name" >{{chat.name || chat.contactId}}</span>

                            <div v-if="MyConst.config.CHAT_TAG_ENABLED" data-v-5dda926d="" class="chat_tags">
                                <div data-v-5dda926d="" class="chat_tags text-align-left">
                                    <span data-v-5dda926d="" class="tag-chat-status" :class="'tag-chat-status-' + chat.status">
                                        {{chat.status+''}}
                                    </span>
                                </div>
                            </div>
                            <span v-else-if="chat.ilastmsg" class="font-preview">{{chat.ilastmsg.text}}</span>  
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
    
    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';

    export default {
        components: {
            vSelect
        },
        computed : {
            activeChats : function(){ 
                return this.$store.getters.StateChats;
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
             search: {
                contactType : null,
                text : ""
             }, 
            input : {
                lane : {
                  options : { multi: false, labelName: 'Filter Types'},
                  values : [],
                  selected : [],
                  sender : ""
                }
            },
        }),
        mounted () {
            // fetch the data when the view is created and the data is
            // already being observed
            this.loadLanes();
            //MyFlags.agent.contactsTab = this.$route.params.contactsTab
            //this.pingOnline();

        },
        beforeUnmount (){
            this.tunnel.off();
        },
        watch: {

        },
        methods: {
            async loadLanes(){
                let resp = await this.$store.dispatch('GetRequest',{
                    url : '/api/options/lanes'
                });
                console.log("resp.results",resp.results)
                this.input.lane.values = resp.results;
            },
            async loadContacts(){
                await this.$store.dispatch('GetChats');
                this.$emit('loaded', {});
            },
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
        /*margin-bottom: 3px !important;*/
        /*box-shadow: inset 0 0 52px #0000000d;*/
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
    .contact-preview .contact_type{
      bottom: 0px;
      right: 0px;
      position: absolute;
      width: 24px;
      height: 24px;
    }
    .contact-text {
        margin-left: 15px;
        height: 40px;
        font-size: 18px;
        color : rgba(21, 21, 21, 0.68);
    }
    .contact-text .font-name{
        text-overflow: ellipsis;
        max-width: 187px;
        overflow: hidden;
        /*font-weight: 300;*/
    }
    .contact_waiting  .contact-text .font-name{
        font-weight: 500;
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
        .input-wrapper.my-lane .v-select{
            margin-top: 8px;
            color: #000;
            width: 100%;
        }
        .input-wrapper.my-lane .v-select .vs__selected{
            color: #FFF;
        }
    }
</style>