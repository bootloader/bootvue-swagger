<template>
     <div class="card mb-sm-3 mb-md-0 contacts_card card-shadow scheme-color ">
        <div class="card-header contacts-header">
            <div class="input-group">
                <div class="input-group-prepend">
                    <a class="input-group-text menu_btn mySidebar-open" v-b-toggle href="#my-sidebar" @click.prevent>
                        <i class="fa fa-bars"></i>
                    </a>
                </div>
                <input type="text" 
                    v-model="search.text"
                    placeholder="Search..." name="" class="form-control search">
                <div class="input-group-prepend">
                    <span v-if="!!search.text" class="input-group-text search_btn" @click="search.text=''" ><i class="fa fa-close"></i></span>
                    <span v-if="!search.text" class="input-group-text search_btn" ><i class="fa fa-search"></i></span>
                </div>
                <div class="input-group-append" v-if="MyConst.config.AGENT_CHAT_INIT">
                    <a class="input-group-text menu_btn new-chat fa fa-edit" v-b-toggle 
                    @click="MyFlags.agent.showContactSearch=!MyFlags.agent.showContactSearch"
                     @click.prevent>
                    </a>
                </div>
            </div>

        </div>
        <div class="card-header contact-tabs">
             <ul class="nav nav-tabs nav-fill card-header-tabs">
              <li class="nav-item">
                <span class="nav-link btn-xs" v-bind:class="{ 'active' : (MyFlags.agent.contactsTab == 'ME')}" @click="MyFlags.agent.contactsTab = 'ME'">
                    <span class="fa fa-user"/> Me</span>
              </li>
              <li class="nav-item" v-bind:class="{ contact_attention : urgentChat }">
                <span class="nav-link btn-xs" v-bind:class="{ 'active' : (MyFlags.agent.contactsTab == 'TEAM')}" @click="MyFlags.agent.contactsTab = 'TEAM'">
                    <span class="fa fa-user-friends"/> Team</span>
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
                                <span class="online_icon"></span>
                                <span class="contact_type fab"
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
                            <span v-else-if="chat.lastmsg" class="font-preview"
                                :class="{
                                    'text-danger' : $global.MyFunc.isInbound(chat.lastmsg.type),
                                    'text-grey' : $global.MyFunc.isOutbound(chat.lastmsg.type)
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
                            
                        </div>
                        <div class="contact-flags">
                            <p hidden>
                                Calc : {{chat._gracestamp | formatStamp}}
                                LastOut : {{chat.lastResponseStamp | formatStamp}}
                                LastIn : {{chat.lastInComingStamp | formatStamp}}
                            </p>

                            <b-popover triggers="hover focus" :target="'x-time-details'+ chat.contactId" >
                              <template #title><small> 
                                <div class="text-align-left"> @ {{chat._gracestamp | formatStamp}}</div>
                                <div v-if="chat.lastResponseStamp" class="text-align-left"> LastOut : {{chat.lastResponseStamp | formatStamp}}</div>
                                <div v-if="chat.lastInComingStamp" class="text-align-left"> LastIn : {{chat.lastInComingStamp | formatStamp}}</div></small>
                              </template>
                            </b-popover>

                            <span class="contact-time" :title="chat.lastInComingStamp | formatStamp"
                                :id="'time-details'+ chat.contactId" >{{chat.lastInComingStamp | formatDate}} </span>

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
                                    <b-icon v-if="chat._attention && false" icon="alarm-fill" class="very_old"></b-icon>
                                </span>
                            </div>  
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
        <div class="card-footer">
            &nbsp; <i class="contact_type fa fa-facebook" @click="searchTag(':facebook')"
                    v-bind:class="{'my-selected' : search.text==':facebook' }"></i>
                <i class="contact_type fa fa-whatsapp"  @click="searchTag(':whatsapp')"
                    v-bind:class="{'my-selected' : search.text==':whatsapp' }" ></i>
                <i class="contact_type fab fa-twitter"  @click="searchTag(':twitter')" 
                    v-bind:class="{'my-selected' : search.text==':twitter' }"></i>
                <i class="contact_type fab fa-telegram-plane"  @click="searchTag(':telegram')"
                    v-bind:class="{'my-selected' : search.text==':telegram' }"></i>
                <i class="contact_type fa fa-chrome" @click="searchTag(':website')"
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


    import {library} from '@fortawesome/fontawesome-svg-core'
    import {
        faTrashAlt,
        faCheck,
        faCalendarAlt,
        faAngleDown,
        faAngleUp,
        faTh,
        faWhatsapp
    } from '@fortawesome/free-solid-svg-icons'
    import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
    import { MyFlags,MyDict,MyConst } from './../../services/global';
    import tunnel from './../../services/tunnel';

    export default {
        components: {
            'font-awesome-icon': FontAwesomeIcon,
        },
        computed : {
            urgentChat : function (argument) {
                for(var i in this.$store.getters.StateChats){
                    if(this.$store.getters.StateChats[i]._attention 
                        && this.$store.getters.StateChats[i]._tab == 'TEAM' 
                        && this.$store.getters.StateChats[i].active){
                        return true;
                    }
                }
                return false;
            },
            activeChats : function(){ 
                console.log("activeChats",this.$store.getters.StateChats.length); 
                let searchTags = this.search.text.split(/(:[\w]+\ )/).filter(function (argument) {
                    return !!argument;
                }).map(function (argument) {
                    var tags = argument.split(":");
                    return {
                        isTag : !tags[0],
                        text : (tags[0] || tags[1]).trim()
                    }
                });
                var tab = MyFlags.agent.contactsTab;

                return (this.$store.getters.StateChats || []).filter(function (chat) {
                    return chat._tab == tab;
                    if(tab == 'ME'){
                        return (chat.assignedToAgent == MyConst.agent) || !chat.assignedToAgent;
                     }  else if(tab == 'TEAM'){
                        return !((chat.assignedToAgent == MyConst.agent) || !chat.assignedToAgent);
                     } 
                    return false;
                }).filter(function(chat){
                    var _searchTags = searchTags.filter(function (searchTag) {
                        if(searchTag.isTag){
                            return ((chat.contactType || "").toLowerCase().indexOf(searchTag.text.toLowerCase()) > -1);
                        } else {
                            console.log(chat.name,searchTag.text)
                            return ((chat.name || "").toLowerCase().indexOf(searchTag.text.toLowerCase()) > -1);
                        }
                    });
                    return (_searchTags.length == searchTags.length) && chat.active;
                }).sort(function(a, b){
                    if(a._assignedToMe && !b._assignedToMe){
                        return -1;
                    } else if(!a._assignedToMe && b._assignedToMe){
                        return 1;
                    }
                    return b.lastInComingStamp-a.lastInComingStamp;
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
             search: {
                contactType : null,
                text : ""
             }, 
             //contactsTab : "ME",
             //chats : this.$store.getters.StateChats
        }),
        mounted () {
            // fetch the data when the view is created and the data is
            // already being observed
            this.loadChats();
            //MyFlags.agent.contactsTab = this.$route.params.contactsTab
            this.pingOnline();
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
                        this.$store.dispatch('RefreshChats');
                        //this.$forceUpdate();
                    }
                }
            }
        },
        methods: {
            async loadChats(){
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
    }
    .contact-time {
        height: 28px;
    }
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
        color: #fff;
        font-size: 13px;
        cursor: pointer;
    }
    .contact-tabs .nav-link.active {
        background-color: #0000006b;
        border-radius: 0px !important;
        color: #fff;
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
        background-color: #ffffffd1;
      }
      50% {
        background-color: #ffffff75;
      }
      100% {
        background-color: #00000017;
      }
    }
    .nav-item.contact_attention {
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
    .contacts li .very_old {
        font-size: 17px;
        color: #ffa214;
        text-align: right;
        float: right;
    }

</style>