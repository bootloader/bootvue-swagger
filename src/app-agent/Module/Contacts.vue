<template>
     <div class="card mb-sm-3 mb-md-0 contacts_card card-shadow">
        <div class="card-header">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text menu_btn"
                        @click="MyFlags.showSidebar = !MyFlags.showSidebar">
                        <i class="fa fa-bars"></i>
                    </span>
                </div>
                <input type="text" 
                    v-model="search"
                    @keyup="inputSearch"
                    placeholder="Search..." name="" class="form-control search">
                <div class="input-group-prepend">
                    <span v-if="!!search" class="input-group-text search_btn" @click="search=''" ><i class="fa fa-close"></i></span>
                    <span v-if="!search" class="input-group-text search_btn" ><i class="fa fa-search"></i></span>
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
                    v-bind:class="{data_assigned : chat.assigned, data_unassigned : !chat.assigned }"
                     :id="chat.contactId" :to="'/app/chat/' + chat.contactId + '/' + chat.sessionId + '/' + chat.contactId">
                    <div class="d-flex bd-highlight contact-preview">
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
                        <div class="contact-time" v-if="chat.ilastmsg" :title="chat.ilastmsg.timestamp">
                            <p>{{chat.ilastmsg.timestamp | formatDate}} </p>
                            <div v-if="chat.newmsg" class="new-message" id="'nm' + c.contactId"><p>&nbsp;</p></div>  
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
            &nbsp;<span class="contact_type fa fa-facebook" @click="search=':facebook'"></span>
            <span class="contact_type fa fa-whatsapp" @click="search=':whatsapp'" ></span>
            <span class="contact_type fa fa-twitter"  @click="search=':twitter'"></span>
            <span class="contact_type fa fa-telegram"  @click="search=':telegram'"></span>
            <span class="contact_type fa fa-chrome" @click="search=':website'"></span>
            <span
                 v-bind:class="{'toggle-active' : isOnline, 'fa-rotate-180' : !isOnline }" 
                 @click="toggleOnline"
                 v-tooltip="isOnline ? 'Go Offline' : 'Go Online'"
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
                console.log("store",this.$store.getters.StateChats); 
                let searchTags = this.search.split(/(:[\w]+\ )/).filter(function (argument) {
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
                            return ((chat.name || "").toLowerCase().indexOf(searchTag.text.toLowerCase()) > -1) && chat.active;
                        }
                    });
                    return _searchTags.length == searchTags.length;
                }).sort(function(a, b){
                    if(a.assigned && !b.assigned){
                        return -1;
                    } else if(!a.assigned && b.assigned){
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
            }
        },
        data:() => ({
             MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
             search: '',
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
                await this.$store.dispatch('OnlineStatus');
            },
            inputSearch : ()=> {

            },
            loadQuickReply : () => {

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
    .contacts li.router-link-exact-active{
        background-color: rgb(0 0 0 / 6%)
    }
    ul.contacts .user_info *, ul.contacts .contact-time p{
       color : rgba(21, 21, 21, 0.68) !important
    }
    .card-footer .contact_type {
        cursor: pointer;
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

</style>