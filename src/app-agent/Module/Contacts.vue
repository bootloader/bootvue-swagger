<template>
     <div class="card mb-sm-3 mb-md-0 contacts_card card-shadow">
        <div class="card-header">
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
            </div>

        </div>
        <div class="card-header contact-tabs">
             <ul class="nav nav-tabs nav-fill card-header-tabs">
              <li class="nav-item">
                <span class="nav-link btn-xs" v-bind:class="{ 'active' : (MyFlags.agent.contactsTab == 'ME')}" @click="MyFlags.agent.contactsTab = 'ME'">
                    <span class="fa fa-user"/> Me</span>
              </li>
              <li class="nav-item">
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
                        contact_attention : chat._attention
                    }"
                     :id="chat.contactId" :to="'/app/chat/' + chat.contactId + '/' + chat.sessionId + '/' + chat.contactId">
                    <div class="d-flex bd-highlight contact-preview" @click="MyFlags.agent.mvu='CHATBOX'">
                        <div class="img_cont">
                            <img :src="chat.profilePic || MyDict.profilePic" class="rounded-circle user_img" alt="profilpicture">
                                <span class="online_icon"></span>
                                <span class="contact_type fa"
                                v-bind:class="MyDict.social[chat.contactType]"
                                ></span>
                        </div>
                        <div class="user_info contact-text">
                            <span class="font-name" >{{chat.name || chat.contactId}}</span>
                            <p class="font-preview" v-if="chat.ilastmsg" >{{chat.ilastmsg.text}}</p>
                        </div>
                        <div class="contact-time" :title="chat.lastInComingStamp">
                            <p>{{chat.lastInComingStamp | formatDate}} </p>
                            <div  class="" id="'nm' + c.contactId" class="chat_flags">
                                <span>
                                    <b-icon v-if="chat.newmsg" icon="circle-fill" class="new_message" variant="red"></b-icon>
                                </span>
                                <span>
                                    <b-icon v-if="chat._attention" icon="phone-vibrate" class="icon_attention" variant="red"></b-icon>
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
                <i class="contact_type fa fa-twitter"  @click="searchTag(':twitter')" 
                    v-bind:class="{'my-selected' : search.text==':twitter' }"></i>
                <i class="contact_type fa fa-telegram"  @click="searchTag(':telegram')"
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
            var THAT =  this;
            this.tunnel = tunnel.init().instance()
                .on("/agent/onmessage", function(msg){
                    var activeChats = THAT.activeChats;
                    if(!activeChats){
                        return;
                    }
                    if(THAT.$route.params.sessionId != msg.sessionId){
                        for (var i in activeChats) {
                            var chat = activeChats[i];
                            if(msg.sessionId == chat.sessionId){
                                 chat.newmsg = true;
                                 THAT.$forceUpdate();
                            }
                        }
                    }
                });
            //MyFlags.agent.contactsTab = this.$route.params.contactsTab
            this.pingOnline();
        },
        beforeUnmount (){
            this.tunnel.off();
        },
        watch: {
            '$route.params.sessionId': function (sessionId) {
                var activeChats = this.activeChats;
                for (var i in activeChats) {
                    var chat = activeChats[i];
                    if(sessionId == chat.sessionId){
                         chat.newmsg = false;
                         this.$forceUpdate();
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
                }.bind(this), MyConst.onlineTimeout);
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
    }
</script>
<style type="text/css" scoped="">
    .contacts_body{
        background-color: #f5f5f5;
    }
    .contacts{
        list-style: none;
        padding: 0;
        max-width: 348px;

        list-style: none;
        padding: 0;
        max-width: calc(100% - 0px);
    }
    .contacts li{
        width: 100% !important;
        padding: 5px 10px;
        margin-bottom: 3px !important;
        cursor: pointer;
        border-left: 5px solid #0000;
        border-right: 5px solid #0000;
    }
    .contacts li:hover{
        border-right: 5px solid #00000024;
    }
    .contacts li.router-link-exact-active{
      border-left: 5px solid #1d3752;
      background-color: rgba(0,0,0,0.3);
    }
    .contacts li.router-link-exact-active, .contacts li.active_contact {
        background-color: rgb(0 0 0 / 6%)
    }
    ul.contacts .user_info *, ul.contacts .contact-time p{
       color : rgba(21, 21, 21, 0.68) !important
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
        box-shadow: inset 0 0 15px #0000005e;
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
        line-height: 21px!important;
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
    .contacts li.contact_attention {
      animation: blinking 1s infinite;
      /*border-right: 5px solid #e20a0a;*/
    }
    .chat_flags {
        display: flex;
        align-items: center;
        justify-content: center;
        column-count: 2;
    }
     .chat_flags>span {
        display: inline-block;
        width: 33%;
     }
    .contacts li.contact_attention .icon_attention {
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
    .contacts li .very_old{
        font-size: 17px;
        color: #ffa214;
        text-align: right;
        float: right;
    }

</style>