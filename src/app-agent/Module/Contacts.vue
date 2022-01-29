<template>
     <div class="card mb-sm-3 mb-md-0 contacts_card card-shadow scheme-color m-contacts-card"
        v-touch:swipe.right="onSwipeRight"
        v-touch:swipe.left="onSwipeLeft"
     >
        <div class="card-header contacts-header">
            <div class="input-group">
                <div class="input-group-prepend">
                    <a class="input-group-text menu_btn mySidebar-open" v-b-toggle href="#my-sidebar" @click.prevent>
                        <i class="fa fa-bars"></i>
                    </a>
                </div>
                    <text-complete v-model="search.text" placeholder="Search..." name="" @active="searchInActive"
                        class="form-control contact-search" :strategies="this.search.active ? strategies : []"
                        :rows="1" resize="none"/>
                <div class="input-group-prepend">
                    <span v-if="!!search.text" class="input-group-text search_btn" @click="search.text=''" ><i class="fa fa-close"></i></span>
                    <span v-if="!search.text" class="input-group-text search_btn" ><i class="fa fa-search"></i></span>
                </div>
                <div class="input-group-append" v-if="MyConst.config.SETUP.POSTMAN_AGENT_CHAT_INIT_SESSION">
                    <a class="input-group-text menu_btn new-chat fa fa-search-plus" v-b-toggle 
                     @click="MyFlags.agent.showSessionSearch=!MyFlags.agent.showSessionSearch"
                     @click.prevent v-tooltip="'Advance Search'">
                    </a>
                </div>
                <div class="input-group-append" v-if="MyConst.config.SETUP.POSTMAN_AGENT_CHAT_INIT_CONTACT">
                    <a class="input-group-text menu_btn new-chat fa fa-comment-medical" v-b-toggle
                        @click="$router.push({ params: { mvu: 'COMPOSE' } })"
                        @click.prevent
                            v-tooltip="'Send New Message'"
                        >
                    </a>
                </div>
            </div>

        </div>
        <div class="card-header contact-tabs">
             <ul class="nav nav-tabs nav-fill card-header-tabs"  v-if="!isSearch">
              <li class="nav-item">
                <span class="nav-link btn-xs" v-bind:class="{ 'active' : (MyFlags.agent.contactsTab == 'ME')}" @click="MyFlags.agent.contactsTab = 'ME'">
                    <span class="fa fa-user"/> Me</span>
              </li>
              <li class="nav-item" >
                <span class="nav-link btn-xs" v-bind:class="{ 
                    contact_attention : urgentChat, 
                    'active' : (MyFlags.agent.contactsTab == 'TEAM')}" @click="MyFlags.agent.contactsTab = 'TEAM'">
                    <span class="fa fa-user-friends"/> Team</span>
              </li>
              <li v-if="$config.SETUP.POSTMAN_AGENT_TAB_HISTORY_PERIOD > 86400000"
                    class="nav-item" >
                <span class="nav-link btn-xs" v-bind:class="{ 'active' : (MyFlags.agent.contactsTab == 'HISTORY')}" @click="MyFlags.agent.contactsTab = 'HISTORY'">
                    <span class="fa fa-stopwatch"/> History</span>
              </li>
             </ul>
             <ul class="nav nav-tabs nav-fill card-header-tabs"  v-if="isSearch">  
              <li class="nav-item">
                <span class="nav-link btn-xs active">
                    <span class="fa fa-search"/> Results for "{{search.text}}"
                     <span class="fa fa-times float-right" @click="search.text=''"></span>
                </span>
              </li>
            </ul>
        </div>
        <div class="card-body contacts_body">
            <ul class="contacts contact-list" v-if="activeChats.length>0">
                <router-link tag="li" v-for="(chat,index) in activeChats"  :key="index"
                    v-bind:class="{
                        data_assigned : chat.assignedToAgent,
                        data_unassigned : !chat.assignedToAgent,
                        active_contact : (contactId == chat.contactId),
                        contact_attention : chat._attention && (chat._tab == 'TEAM' ),
                        contact_waiting : chat._waiting
                    }"
                    :id="chat.contactId"
                    :to="{ 
                        name: 'defAgentView', 
                        params: { 
                            contactId: chat.contactId,
                            sessionId : chat.sessionId,
                            profileId : chat.contactId,
                            profileView : $route.params.profileView || 'hide',
                            mvu : 'CHATBOX'
                        }}">
                    <div class="d-flex bd-highlight contact-preview">
                        <div class="img_cont">
                            <img :src="chat.profilePic || MyDict.profilePic" class="rounded-circle user_img" alt="profilpicture">
                                <span class="contact_type fab fac-bg"
                                v-bind:class="MyDict.socialPrefix(chat.contactType)"></span>
                        </div>
                        <div class="user_info contact-text">
                            <span class="font-name" >{{chat.contact.name || chat.contact.phone || chat.contact.email || chat.contactId}}</span>

                            <span v-if="chat.lastmsg" class="font-preview"
                                :class="{
                                    'text-blue' : $global.MyFunc.isOutbound(chat.lastmsg.type)
                                }"
                            >
                                <span v-if="chat.lastmsg.type=='O'" class="fa fa-reply fa-rotate-45s"></span>&nbsp;
                                <span v-if="chat.lastmsg.attachments && chat.lastmsg.attachments[0]" class="fw-normal text-capitalize">
                                    <span  :class="[{
                                            'fa fa-camera' : chat.lastmsg.attachments[0].mediaType == 'IMAGE',
                                            'fa fa-video' : chat.lastmsg.attachments[0].mediaType == 'VIDEO',
                                            'fa fa-microphone' : chat.lastmsg.attachments[0].mediaType == 'AUDIO',
                                            'fa fa-file-alt' : chat.lastmsg.attachments[0].mediaType == 'DOCUMENT',
                                        }]"></span>
                                    {{chat.lastmsg.attachments[0].mediaType | lowercase}}
                                </span>

                                <span v-else>{{chat.lastmsg.text}}</span>
                            </span>
                            <div v-if="MyConst.config.CHAT_TAG_ENABLED" data-v-5dda926d="" class="chat_tags">
                                <div data-v-5dda926d="" class="chat_tags text-align-left">
                                    <span data-v-5dda926d="" class="tag-chat-status-sm" :class="'tag-chat-status-' + chat.status">
                                        {{chat.status+''}}
                                    </span>
                                </div>
                            </div>

                        </div>
                        <div class="contact-flags">
                            <span class="contact-time" :title="chat.lastInComingStamp | formatStamp"
                                :id="'time-details'+ chat.contactId" >{{(chat.lastInComingStamp || chat.updatedStamp) | formatDate}} </span>

                            <div id="'nm' + c.contactId" class="chat_flags">
                                <span>
                                    <b-icon v-if="chat._new" icon="circle-fill" class="new_message" variant="red"
                                        v-tooltip="'You have unread messages from ' + (chat.name || chat.contactId)" ></b-icon>
                                </span>
                                <span>
                                    <b-icon v-if="chat._attention"  class="icon_attention" variant="red"
                                            icon="alarm-fill" 
                                            v-tooltip="(chat.name || chat.contactId) + ' is waiting for response for ' + chat._waitingstamp_en"
                                    ></b-icon>
                                    <b-icon v-else-if="chat._waiting"  class="icon_attention" variant="red"
                                            icon="phone-vibrate" 
                                            v-tooltip="(chat.name || chat.contactId) + ' has replied \n& is waiting for response'"
                                    ></b-icon>
                                </span>
                                <span>
                                    <span v-if="chat.assignedToAgent" class="fa fa-user-secret text-success assigned_to_agent"
                                        v-tooltip="`Ticket is assigned to ${chat.assignedToAgent}`"
                                    ></span>
                                </span>
                            </div>  
                        </div>
                    </div>
                </router-link>
            </ul>
            <ul class="contacts contact-list" v-if="activeChats.length==0">
               <center><small>No session </small></center>
            </ul>
            <ul class="contacts contact-list-unassigned">
                
            </ul>
        </div>
        <div class="card-footer">
            &nbsp; <i class="contact_type fac-bg fa fa-facebook" @click="searchTag(':facebook')"
                    v-bind:class="{'my-selected' : search.text==':facebook' }"></i>
                <i class="contact_type fa fac-bg fa-whatsapp"  @click="searchTag(':whatsapp')"
                    v-bind:class="{'my-selected' : search.text==':whatsapp' }" ></i>
                <i class="contact_type fac-bg fab fa-twitter"  @click="searchTag(':twitter')" 
                    v-bind:class="{'my-selected' : search.text==':twitter' }"></i>
                <i class="contact_type fac-bg fab fa-telegram"  @click="searchTag(':telegram')"
                    v-bind:class="{'my-selected' : search.text==':telegram' }"></i>
                <i class="contact_type fac-bg fab fa-instagram"  @click="searchTag(':instagram')"
                    v-bind:class="{'my-selected' : search.text==':instagram' }"></i>
                <i class="contact_type fac-bg fa fa-chrome" @click="searchTag(':website')"
                    v-bind:class="{'my-selected' : search.text==':website' }"></i>
            
            <span
                 v-bind:class="{'toggle-active' : isOnline, 'fa-rotate-180' : !isOnline }" 
                 @click="toggleOnline"
                 v-tooltip="isOnline ? 'Availble' : 'Not Availble'"
                class="online-toggle fa fa-toggle-on"></span>
        </div>
    </div>
</template>

<script>


    import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
    import { MyFlags,MyDict,MyConst } from './../../services/global';
    import debounce from "debounce";
    import TextComplete from '../../@common/cloned/v-textcomplete/TextComplete.vue';
    import contact_types from '@/@data/contact_types.json';
    import chat_status from '@/@data/chat_status.json';

    let sampleJsonKeys = [...contact_types.options.map(function(c){
        return c.code.toLowerCase();
    }),...chat_status.options.map(function(c){
        return c.code.toLowerCase();
    })];

    export default {
        components: {
            'font-awesome-icon': FontAwesomeIcon,
                TextComplete,
        },
        computed : {
            urgentChat : function (argument) {
                for(var i in this.$store.getters.StateChats){
                    if(this.$store.getters.StateChats[i]._attention 
                        && this.$store.getters.StateChats[i]._tab == 'TEAM' 
                        && this.$store.getters.StateChats[i].local.active){
                        return true;
                    }
                }
                return false;
            },
            activeChats : function(){ 
                console.log("activeChats",this.$store.getters.StateChats.length); 
                let searchText = this.search.text.trim();
                let searchTags = this.$store.getters.SearchChat;
                var tab = MyFlags.agent.contactsTab;
                //console.log("searchTags",searchTags)
                return (this.$store.getters.StateChats || []).filter(function (chat) {
                    return (chat._tab == tab) || searchText;
                }).filter(function(chat){
                    var _searchTags = searchTags.filter(function (searchTag) {
                        console.log(chat.name,searchTag._text);
                        if(searchTag.isTag){
                            return (
                                (chat.contactType || "").toLowerCase().indexOf(searchTag._text) == 0
                                || (chat.status || "").toLowerCase().indexOf(searchTag._text) == 0
                            );
                        } else {
                            return ((chat._searchText || "").toLowerCase().indexOf(searchTag._text) > -1);
                        }
                    });
                    return (_searchTags.length == searchTags.length);// && chat.active;
                }).sort(function(a, b){
                    if(a._assignedToMe && !b._assignedToMe){
                        return -1;
                    } else if(!a._assignedToMe && b._assignedToMe){
                        return 1;
                    }
                    return b?.local?.lastActivityStamp - a?.local?.lastActivityStamp;
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
            isSearch(){
                return !!this.search.text.trim();
            }
        },
        data:() => ({
             MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
             search: {
                contactType : null,
                text : "",
                active : false
            }, 
            strategies: [{
                match: /(^|\s)\:([a-z0-9+\-\_\.]*)$/,
                async search(term, callback) {
                    console.log("term",term)
                    callback(sampleJsonKeys.filter(function (name) {
                        return name.startsWith(term);
                    }).slice(0, 10))
                },
                template(name) {
                    return name;
                },
                replace(start,end) {
                    let suffix = end.trim().startsWith(" ") ? '' : ' ';
                    if(start == "data."){
                    return ['$1:' + start, suffix];
                    }
                    return '$1:' + start + suffix
                },
            }],
             //contactsTab : "ME",
             //chats : this.$store.getters.StateChats
        }),
        mounted () {
            // fetch the data when the view is created and the data is
            // already being observed
            this.loadChats();
            //MyFlags.agent.contactsTab = this.$route.params.contactsTab
        this.searchChat = debounce(this.searchChat,500)
        },
        beforeUnmount (){
            //this.tunnel.off();
        },
        watch: {
            '$route.params.sessionId': function (sessionId, sessionIdFrom) {
                console.log("$route.params.sessionId", sessionId, sessionIdFrom)
                var activeChats = this.activeChats;
                for (var i in activeChats) {
                    var chat = activeChats[i];
                    if((sessionId == chat.sessionId) 
                        || (sessionIdFrom == chat.sessionId)){
                        chat._lastReadStamp = chat.lastInComingStamp;
                        this.$service.store('readStamp',chat.sessionId,Date.now());
                        this.$store.dispatch('RefreshChats');
                        //this.$forceUpdate();
                    }
                }
            },
            "$global.MyFlags.agent.contactsTab" : function(newVal,oldVal){
                if(newVal == "HISTORY"){
                    this.$store.dispatch("RefeshSession",true);
                }
            },
            "search.text" :  function (searchText) {
                this.$store.commit("setSessionSearch",this.search.text);
                this.searchChat();
            }
        },
        methods: {
            async searchChat(){
                this.$store.dispatch("RefeshSession",true);
            },
            searchInActive(e){
                this.search.active = e.active;
            },
            async loadChats(){
                await this.$store.dispatch('GetChats');
                this.$emit('loaded', {});
            },
            async toggleOnline(){
                await this.$store.dispatch('OnlineStatus', { 
                    type : "online",
                    online : !this.isOnline 
                });
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
            onSwipeLeft(){
                let curTab = MyFlags.agent.contactsTab;
                switch (curTab) {
                    case "ME":
                        MyFlags.agent.contactsTab = "TEAM"
                        break;
                    case "TEAM":
                        MyFlags.agent.contactsTab = "HISTORY"
                        break;
                }
            },
            onSwipeRight(){
                let curTab = MyFlags.agent.contactsTab;
                switch (curTab) {
                    case "HISTORY":
                        MyFlags.agent.contactsTab = "TEAM"
                        break;
                    case "TEAM":
                        MyFlags.agent.contactsTab = "ME"
                        break;
                }
            }
        },
        beforeUnmount : function (argument) {
          //clearInterval(this.intervalid1);  
        }
    }
</script>

<style lang="scss">
    .m-contacts-card{
        .contacts-header {
            .contact-search {
                border-radius: 15px 0 0 15px !important;
                background-color: rgba(0,0,0,0.3) !important;
                border: 0 !important;
                line-height: 20px;
                margin-top: 0px;
                margin-bottom: 0px;
                background: transparent;
                outline: 0;
                textarea {
                    color: white !important;
                    resize: none;
                    height: 32px;
                    background: transparent;
                    border: 0 !important;
                    outline: 0;
                    &:focus{
                        box-shadow:none !important;
                        outline:0px !important;
                    } 
                }
                .autocomplete {
                    background: var(--scheme-color);
                    color: #FFF;
                    border: none;
                    border-radius: 3px;
                    ul {
                        border: none;
                        li {
                            padding: 1px 10px;
                            min-width: 80px;
                            border: none;
                            background: #0000004a;
                            &.active {
                                background: transparent;
                                font-weight: 500
                            }
                        }

                    }
                }
            }
        }
    }
</style>
<style type="text/css" scoped="">
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
        padding-left: 12px;
        padding-right: 8px;
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
    /* .contact-preview .contact_type{
      bottom: 0px;
      right: 0px;
      position: absolute;
      width: 24px;
      height: 24px;
    } */
    /* .contact-text {
        margin-left: 15px;
        height: 40px;
        font-size: 18px;
        color : rgba(21, 21, 21, 0.68);
    }
    .contact-text .font-name{
        text-overflow: ellipsis;
        max-width: 187px;
        overflow: hidden;
    } */
    /* .contact-text .chat_tags {
        line-height: 13px;
    }
    .contact-text .chat_tags .tag-chat-status-sm {
        background: rgba(255, 255, 255, 0.274)!important;
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
    } */

    /* .contact-time {
        height: 28px;
    } */
    .card-footer .fa::before {
        margin: 0px;
        cursor: pointer;
    }
     .card-footer .contact_type {
        width: 35px;
        height: 35px;
        display: inline-block;
        margin: 0px -1px;
        padding: 5px;
        opacity: 0.9;
     }
     .contact_type.my-selected, .contact_type:hover {
        opacity: 1.0;
        border-radius: 40px;
        /*box-shadow: inset 0 0 15px #0000005e;*/
        box-shadow: inset -5px -12px 25px #f7f7f757
     }

    .contact-tabs {
        background-color: #00000021;
        padding: 2px 10px;
        border-radius: 0px !important;
        color: #fff;
    }
    .contact-tabs .nav-link {
        background-color: #00000021;
        border-radius: 0px !important;
        color: rgba(255, 255, 255, 0.822);
        font-size: 13px;
        cursor: pointer;
    }
    .contact-tabs .nav-link.active {
        background-color: #0000006b;
        border-radius: 0px !important;
        color: #fff;
        font-weight: 500;
    }
    .online-toggle {
        float: right;
        font-size: 25px!important;
        border-radius: 48%;
        line-height: 35px!important;
        cursor: pointer;
    }
    .online-toggle.fa-toggle-on {
      color: #ff5656;
    }
    .online-toggle.fa-toggle-on.toggle-active {
      color: #4cd137;
    }

    @keyframes blinking {
      0% {
        background-color: #ffffff8e;
      }
      50% {
        background-color: #ffffff27;
      }
      100% {
        background-color: #00000017;
      }
    }
    .nav-link.contact_attention:not(.active) {
      animation: blinking 1s infinite;
    }
    .chat_flags {
        display: flex;
        align-items: center;
        justify-content: center;
        column-count: 2;
        height: 30px;
    }
     .chat_flags>span {
        display: inline-block;
        width: 33%;
     }
    .contacts li .icon_attention {
        font-size: 17px;
        color: red;
        text-align: right;
        float: right;
    }
    .contacts li .new_message{
        font-size: 17px;
        color: #4cd137;
        text-align: right;
        float: right;
    }
    .contacts li.router-link-exact-active .new_message {
        display: none;
    }
    .contacts li .assigned_to_agent {
        font-size: 17px;
        text-align: right;
        float: right;
    }
    ul.contacts li.data_unassigned {
        color : #000 !important;
        opacity: 0.8;
        /* background: #000; */

    }
    ul.contacts li.data_assigned {
        /* background: #ffffff75; */
    }
    /* ul.contacts li.data_assigned .user_img{
        border: 1px solid #495d734d;
    }
    ul.contacts li.data_unassigned .user_img{
        border: 1px dashed #495d734d;
    } */
</style>

<style lang="scss" scoped="">
    .contact-preview {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        justify-content: flex-start;
        align-items: stretch;

        .contact_type{
            bottom: 0px;
            right: 0px;
            position: absolute;
            width: 20px;
            height: 20px;
            font-size: 10px;
        }

        .img_cont,
        .user_img {
            width: 40px;
            height: 40px;
            flex-grow: 0;
        }
        .contact-text {
            flex-grow: 1;
            margin-left: 15px;
            height: 59px;
            color : rgba(21, 21, 21, 0.68);
            width: calc(100% - 160px);
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 18px;

            .font-name{
                text-overflow: ellipsis;
                max-width: 187px;
                overflow: hidden;
            }
            .chat_tags {
                line-height: 13px;
                .tag-chat-status-sm {
                    background: rgba(255, 255, 255, 0.274)!important;
                }
            }
            .font-preview{
                text-overflow: ellipsis;
                max-width: 187px;
                overflow: hidden;
                font-size: 10px;
                display: block;
            }
        }
        .contact_waiting  .contact-text .font-name{
            font-weight: 500;
        }
        
        .contact-flags {

            width: 60px;
            font-size: 0.7em;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 0px;
            margin-left: auto;
            white-space : break-spaces;
            max-width:65px;

            float: right;
            text-align: right;
            align-self :baseline;
            flex-grow: 0;
            .contact-time{
                font-size: 1.0em;
                text-align: right;
                float: right;
                height: 28px;
            }
        }

    }

    .contacts {
        li.data_assigned .user_img{
            border: 1px solid #495d734d;
        }
        li.data_unassigned .user_img{
            border: 1px dashed #495d734d;
        }
    }


</style>