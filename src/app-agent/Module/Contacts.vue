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
                        :rows="1" resize="none" nonewline/>
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
                        @click="$router.push({ 
                            name : 'agentAction',
                            params: { mvu: 'COMPOSE', app : $route.params.app } })"
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
                <span class="nav-link btn-xs" v-bind:class="{ 'active' : (searchTab == 'ME')}" @click="search.tab = 'ME'">
                    <span class="fa fa-user"/> Me</span>
              </li>
              <li class="nav-item" >
                <span class="nav-link btn-xs" v-bind:class="{ 
                    contact_attention : urgentChat, 
                    'active' : (searchTab == 'TEAM')}" @click="search.tab = 'TEAM'">
                    <span class="fa fa-user-friends"/> My Team</span>
              </li>
              <li v-if="$config.SETUP.POSTMAN_AGENT_TAB_ORG || $config.SETUP.POSTMAN_AGENT_TAB_ORG === undefined"
                    class="nav-item" >
                <span class="nav-link btn-xs" 
                    v-bind:class="{ 'active' : (searchTab == 'ORG')}" 
                    @click="search.tab = 'ORG'">
                    <span class="fa fa-landmark"/> Others</span>
              </li>
             </ul>
             <ul class="nav nav-tabs nav-fill card-header-tabs"  v-if="!isSearch">
                <li class="nav-item bg-white">
                    <span class="text-grey text-xs">
                        Show only
                    </span>
                </li>
              <li class="nav-item chat_tags">
                <span class="tag-chat-status" 
                    v-bind:class="[searchState == 'ACTIVE' ? 'tag-darker' : 'tag-lighter']"
                    @click="search.state = 'ACTIVE'">
                     Active</span>
              </li>
              <li class="nav-item chat_tags">
                <span class="tag-chat-status" 
                    v-bind:class="[searchState == 'OUTBOUND' ? 'tag-darker' : 'tag-lighter']"
                    @click="search.state = 'OUTBOUND'">
                     Outbox</span>
              </li>
              <li class="nav-item chat_tags">
                <span class="tag-chat-status" 
                     v-bind:class="[searchState == 'CLOSED' ? 'tag-darker' : 'tag-lighter']"
                    @click="search.state = 'CLOSED'">
                    Closed</span>
              </li>
              <li class="nav-item chat_tags"  v-if="$config.SETUP.POSTMAN_AGENT_TAB_HISTORY_PERIOD > 86400000">
                <span class="tag-chat-status" 
                    v-bind:class="[searchState == 'EXPIRED' ? 'tag-darker' : 'tag-lighter']"
                    @click="search.state = 'EXPIRED'">
                    Expired</span>
              </li>
              <li class="nav-item chat_tags position-relative p-1px p-1px" 
                    v-tooltip="searchMode == 'AGENT' ? `Show all Chats` : `Show only Agent Chats`"
                    v-if="$config.SETUP.POSTMAN_AGENT_TAB_NONAGENT && search.tab == 'ORG'">
                <span class="fa fa-user-secret pointer" 
                    v-bind:class="[searchMode == 'AGENT' ? 'text-scheme:after text-scheme:before' : 'tag-lighter fa-x text-grey:after text-grey:before']"
                    @click="search.mode = search.mode ? null : 'AGENT'">
                    </span>
              </li>
             </ul>
             <ul class="nav nav-tabs nav-fill card-header-tabs"  v-if="isSearch">  
              <li class="nav-item">
                <span class="nav-link btn-xs active">
                    <span class="fa fa-search"/> Results for "{{search.text}}" <span v-if="search.sortBy" hidden>sorted by {{search.sortBy}}</span>
                     <span class="fa fa-times float-right" @click="search.text=''"></span>
                </span>
              </li>
            </ul>
        </div>
        <div class="card-body contacts_body" ref="scrollable">
            <ul class="contacts contact-list" v-if="activeChats.length>0" :class="'sort-state-'+search.sortBy">
                <li v-for="(chat,index) in activeChats"  :key="index"
                    v-bind:class="[{
                        data_assigned : chat.assignedToAgent,
                        data_unassigned : !chat.assignedToAgent,
                        active_contact : (contactId == chat.contactId && ticketHash == chat.ticketHash),
                        contact_attention : chat.local.is_waiting_long && (chat._tab == 'TEAM' ),
                        contact_waiting : chat.local.is_waiting,
                        contact_is_unattended : chat.local.is_unattended,  contact_not_unattended : !chat.local.is_unattended,
                        contact_is_waiting : chat.local.is_waiting, contact_not_waiting : !chat.local.is_waiting,
                        contact_is_waiting_long : chat.local.is_waiting_long,  contact_not_waiting_long : !chat.local.is_waiting_long,
                        data_subjective : !!chat.subject
                    },'sort-state-'+search.sortBy]">
                <router-link tag="span" 
                    :id="chat.contactId"
                    :to="{ 
                        name: 'defAgentView', 
                        params: { 
                            ticketHash: chat.ticketHash,
                            contactId: chat.contactId,
                            sessionId : chat.sessionId,
                            profileId : chat.contactId,
                            profileView : $route.params.profileView || 'hide',
                            mvu : 'CHATBOX'
                        }}">
                    <div class="d-flex bd-highlight contact-preview">

                        <div>
                            <div class="img_cont">
                                <img :src="MyDict.profilePicFun(chat.profilePic,chat.contact.name,chat.contactType)" class="rounded-circle user_img" alt="profilpicture">
                                <span class="contact_type fab fac-bg"
                                v-bind:class="MyDict.socialPrefix(chat.contactType)"></span>
                            </div>
                            <div class="chat_tags text-center">
                                <span class="chat-channel-code">
                                    <MyText
                                        options="getx:/api/options/channels"
                                        v-model="chat.local.channelId"
                                        optionLabel="channelCode" :invalidDisplay="chat.local.lane" :emptyDisplay="chat.local.lane"
                                    />
                                </span>
                            </div>    
                        </div>
                        <div class="user_info contact-text">
                            <span class="font-name" >{{chat.contact.name || chat.contact.phone || chat.contact.email || chat.contactId}}</span>
                            <span class="font-subject" >{{chat.subject}}</span>
                            <span v-if="chat.msg.lastMsg" class="font-preview"
                                :class="{
                                    'text-blue' : $global.MyFunc.isOutbound(chat.msg.lastMsg.type)
                                }"
                            >
                                <span v-if="chat.msg.lastMsg.type=='O'" class="fa fa-reply fa-rotate-45s"></span>&nbsp;
                                <span v-if="chat.msg.lastMsg.status == 'DELTD'" class="fw-normal text-capitalize">
                                    <span class="fa fa-ban"></span>&nbsp;
                                    <i>message deleted</i>
                                </span>
                                <span v-else-if="chat.msg.lastMsg.attachments && chat.msg.lastMsg.attachments[0]" class="fw-normal text-capitalize">
                                    <span  :class="[{
                                            'fa fa-camera' : chat.msg.lastMsg.attachments[0].mediaType == 'IMAGE',
                                            'fa fa-video' : chat.msg.lastMsg.attachments[0].mediaType == 'VIDEO',
                                            'fa fa-microphone' : chat.msg.lastMsg.attachments[0].mediaType == 'AUDIO',
                                            'fa fa-file-alt' : chat.msg.lastMsg.attachments[0].mediaType == 'DOCUMENT',
                                        }]"></span>
                                    {{chat.msg.lastMsg.attachments[0].mediaType | lowercase}}
                                </span>
                                <span v-else>
                                    <span  :class="[{
                                            'bi bi-code-square' : chat.msg.lastMsg.template,
                                        }]"></span>
                                    {{chat.msg.lastMsg.text || chat.msg.lastMsg.template}}</span>
                            </span>
                            <div v-if="MyConst.config.CHAT_TAG_ENABLED" data-v-5dda926d="" class="chat_tags">
                                <div data-v-5dda926d="" class="chat_tags text-align-left">
                                    <span data-v-5dda926d="" class="tag-chat-status-sm" :class="'tag-chat-status-' + chat.status">
                                        {{chat.status+''}}
                                    </span>
                                    <span v-if="chat.tagId &&  chat.tagId.length"
                                        class="tag-chat-status-sm btn-outline-grey text-grey"
                                        v-b-modal.chattags>
                                        {{$formatters.contactTags(chat.tagId[0]).title}}
                                    </span>
                                </div>
                            </div>

                        </div>
                        <div class="contact-flags">
                            <span class="contact-time" :title="chat.lastInComingStamp | formatStamp"
                                :id="'time-details'+ chat.contactId" >{{(chat.lastInComingStamp || chat.lastActivityStamp || chat.updatedStamp) | formatDate}} </span>

                            <div id="'nm' + c.contactId" class="chat_flags">
                                <span>
                                    <b-icon v-if="chat._new" icon="circle-fill" class="new_message text-md" variant="online"
                                        v-tooltip="'You have unread messages from ' + (chat.name || chat.contactId)" ></b-icon>
                                </span>
                                <span class="">
                                    <b-icon v-if="chat.local.resolved && chat.local.closed"  class="text-md" variant="success"
                                            icon="check-circle-fill" 
                                            v-tooltip="`This conversation is marked as resolved & closed`"
                                    ></b-icon>
                                    <b-icon v-else-if="chat.local.resolved"  class="text-md" variant="success"
                                            icon="check-circle" 
                                            v-tooltip="`This conversation is marked as resolved`"
                                    ></b-icon>
                                    <b-icon v-else-if="chat.local.expired"  class="icon_attention text-md" variant="red"
                                            icon="dash-circle-fill" 
                                            v-tooltip="(chat.name || chat.contactId) + ' is waiting for response for ' + chat._waitingstamp_en"
                                    ></b-icon>
                                    <b-icon v-else-if="chat.local.is_waiting_long"  class="icon_attention text-md" variant="red"
                                            icon="alarm-fill" 
                                            v-tooltip="(chat.name || chat.contactId) + ' is waiting for response for ' + chat._waitingstamp_en"
                                    ></b-icon>
                                    <b-icon v-else-if="chat.local.is_waiting"  class="icon_attention text-md" variant="red"
                                            icon="phone-vibrate"
                                            v-tooltip="(chat.name || chat.contactId) + ' has replied \n& is waiting for response'"
                                    ></b-icon>
                                </span>
                                <span class="">
                                    <span v-if="chat.mode == 'AGENT' && chat.assignedToAgent"
                                        class="fa fa-user-secret assigned_to_agent text-md"
                                        :class="{
                                            'text-success' : !chat.local.is_offline_agent,
                                            'text-red' : chat.local.is_offline_agent
                                        }"
                                        v-tooltip="`Ticket is assigned to ${chat.assignedToAgent}` + (chat.local.is_offline_agent ? ` (offline)` : ``) "></span>
                                     <span v-else-if="chat.mode == 'AGENT' && !chat.assignedToAgent" class="fa fa-user-secret text-grey assigned_to_agent text-md"
                                        v-tooltip="`Ticket is assigned to None`"></span>
                                     <span v-else-if="chat.mode == 'BOT'" class="fa fa-robot text-success assigned_to_agent text-sm"
                                        v-tooltip="`Ticket is assigned to ${chat.assignedToBot || chat.assignedToQueue}`"></span>
                                     <span v-else class="openwebicons-webhooks text-success assigned_to_agent text-md"
                                        v-tooltip="`Ticket is assigned to ${chat.assignedToBot || chat.assignedToQueue || 'None'}`"></span>
                                </span>
                            </div>  
                        </div>
                    </div>
                </router-link>
                </li>    
            </ul>
            <ul class="contacts contact-list">
                <div style="height:40px;width:100%;position:relative;line-height:40px;">
                        <center v-if="activeChats.length==0 && !isLoading">
                            <small>No session </small>
                        </center>
                        <center v-else-if="!isLoading && !searchEndGame" @mouseenter="loadMore">
                            <b-button @click="loadMore"
                                    variant="outline-grey" pill
                                    class="btn-sm btn p-s1 text-sm"
                                    >Load More</b-button>
                        </center>
                        <loading :active.sync="isLoading" 
                            :can-cancel="false"  
                            :loader="'dots'"
                            :is-full-page="false"></loading>
                </div>  
            </ul>
            <ul class="contacts contact-list-unassigned">
                
            </ul>
        </div>
        <div class="card-footer">
            &nbsp; 
                <i class="contact_type fa fa-user-secret opacity-7" @click="sortByTag('is_unassigned')"
                    v-tooltip="'Show Un-Assigned on top'"
                    v-bind:class="{
                        'my-selected text-grey opacity-10 bg-white:before bg-grey' : search.sortBy=='is_unassigned',
                        'text-success bg-greyish:before' : (search.sortBy!='is_unassigned'),
                    }"></i>
                <i class="contact_type fa fa-user-secret text-red opacity-7 bg-greyish:before" @click="sortByTag('is_unattended')"
                    v-tooltip="'Show Un-Attended on top'"
                    v-bind:class="{
                        'my-selected opacity-10 bg-white:before bg-grey' : search.sortBy=='is_unattended',
                    }"></i>
                <i class="contact_type bi bi-alarm-fill pointer text-red opacity-7 bg-greyish:before" @click="sortByTag('is_waiting_long')"
                    v-tooltip="`Show 'Need Attention' on top`"
                    v-bind:class="{
                        'my-selected opacity-10 bg-white:before bg-grey' : search.sortBy=='is_waiting_long'
                     }">
                </i>
                <i class="contact_type bi bi-phone-vibrate pointer text-red opacity-7 bg-greyish:before" @click="sortByTag('is_waiting')"
                    v-tooltip="`Show 'Waiting for response' on top`"
                    v-bind:class="{
                        'my-selected opacity-10 bg-white:before bg-grey'  : search.sortBy=='is_waiting',
                    }">
                </i>

                <!-- 
                <i class="contact_type fac-bg fa fa-facebook" @click="searchTag(':facebook')"
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
             -->
             <span class="connection-wrapper">
                <i class="connection-status fas fa-signal pointer"
                    v-tooltip="`Signal strength is ${signal}`"
                    v-bind:class="{
                        'text-online'  : signal>0,
                        'text-grey'  : signal==0,
                        'opacity-10' : signal >2,
                        'opacity-5' : signal >0
                    }">
                </i>
                <span
                 v-bind:class="{'toggle-active' : isAvailable, 'fa-flip-x' : !isAvailable }" 
                 @click="toggleOnline"
                 v-tooltip="isAvailable ? 'Availble' : 'Not Availble'"
                class="online-toggle fa fa-toggle-on"></span>
             </span>    

        </div>
    </div>
</template>

<script>


    import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
    import { MyFlags,MyDict,MyConst } from './../../services/global';
    import debounce from "debounce";
    import TextComplete from '../../@common/cloned/v-textcomplete/TextComplete.vue';
    import contact_types from '@/@data/contact_types.json';
    import chat_search_tokens from '@/@data/chat_search_tokens.json';

    let sampleJsonKeys = [...contact_types.options.map(function(c){
        return c.code.toLowerCase();
    }),...chat_search_tokens.options.map(function(c){
        return c.code.toLowerCase();
    })];

    var allTabs = ['ME','TEAM','ORG'];

    export default {
        components: {
            'font-awesome-icon': FontAwesomeIcon,
                TextComplete,
        },
        computed : {
            urgentChat : function (argument) {
                for(var i in this.$store.getters.StateChats){
                    if(this.$store.getters.StateChats[i].local.is_waiting_long 
                        && this.$store.getters.StateChats[i]._tab == 'TEAM' 
                        && this.$store.getters.StateChats[i].local.active){
                        return true;
                    }
                }
                return false;
            },
            activeAgents (){
                var agents = {}
                this.$store.getters.StateAgentOptions.map(function(agent){
                    agents[agent.code] = agent;
                });
                return agents;
            },
            activeChats : function(){ 
                let unique = {};
                console.log("activeChats",this.$store.getters.StateChats.length); 
                let search = this.search;
                let searchText = this.search.text.trim();
                let searchTokens = this.$store.getters.SearchChat.tokens;
                var tab = search.tab;
                var status = this.$store.getters.SearchChat.state;
                
                //console.log("searchTokens",searchTokens)
                console.log("activeChats",this.$store.getters.StateChats)
                return (this.$store.getters.StateChats || []).filter(function (chat) {
                    return (chat._tab == tab) || searchText;
                }).filter(function(chat){
                    var _searchTokens = searchTokens.filter(function (searchToken) {
                        console.log(chat.name,searchToken.isTag,searchToken._text,"===",chat._searchText);
                        if(searchToken.isTag){
                            if((chat.contactType || "").toLowerCase().indexOf(searchToken._text) == 0
                                || (chat.status || "").toLowerCase().indexOf(searchToken._text) == 0
                            ){
                                return true;
                            }
                            switch(searchToken._text ){
                                case  "waiting" :
                                    return chat.local.is_waiting;
                                case  "waiting_long" :
                                case  "need_attention" :
                                    return chat.local.is_waiting_long;
                                case  "unattended" :
                                    return chat.local.is_unattended;
                                case  "unassigned" :
                                    return chat.local.is_unassigned;
                                case  "resolved" :
                                    return chat.local.resolved;
                                case  "expired" :
                                    return chat.local.expired;
                                default :
                                    return true;
``                            }
                        } else {
                            return ((chat._searchText || "").toLowerCase().indexOf(searchToken._text) > -1);
                        }
                    });
                    return (_searchTokens.length == searchTokens.length);// && chat.active;
                }).filter(function(chat){
                    let ticketHash = chat.ticketHash || chat.contactId;
                    if(unique[ticketHash]) return false;
                    unique[ticketHash] = true;
                    if(searchText){
                        return true
                    } else if(status == chat.local.state){
                        return true;
                    } else if(status == 'EXPIRED')
                        return chat.local.expired;
                    else if(status == 'CLOSED')
                        return chat.local.resolved;    
                     else if(status == 'OUTBOUND')
                        return !chat?.msg?.lastInBoundMsg; 
                    return chat.local.active && !!chat?.msg?.lastInBoundMsg;
                }).sort(function(a, b){
                    if(search.sortBy){
                       if(a.local[search.sortBy] && !b.local[search.sortBy]){
                            return -1;
                       } else if(!a.local[search.sortBy] && b.local[search.sortBy]){
                            return 1;
                       }
                    }
                    if(a._assignedToMe && !b._assignedToMe){
                        return -1;
                    } else if(!a._assignedToMe && b._assignedToMe){
                        return 1;
                    }
                    return b?.local?.lastActivityStamp - a?.local?.lastActivityStamp;
                });
            },
            isAvailable :  function (){
                if(this.$store.getters.StateMeta){
                    return this.$store.getters.StateMeta.isOnline;
                }
                return false;
            },
            contactId : function () {
               return this.$route.params.contactId;
            },
            ticketHash(){
                return this.$route.params.ticketHash;
            },
            isSearch(){
                return !!this.search.text.trim();
            },
            isLoading(){
                return this.$store.getters.StateMeta.isLoadingChats;
            },
            searchState(){
                return this.$store.getters.SearchChat.state;
            },
            searchMode(){
                return this.$store.getters.SearchChat.mode;
            },
            searchTab(){
                return this.$store.getters.SearchChat.tab;
            },
            searchEndGame(){
                return this.$store.getters.SearchChat.endGame;
            }
        },
        data:() => ({
             MyFlags : MyFlags, MyDict : MyDict,MyConst : MyConst,
             search: {
                state : 'ACTIVE', mode : null, tab : "ME",
                contactType : null,
                text : "",
                active : false,
                limit : 0,
                sortBy : null
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
            scheduleUpdate : false,
            scrollPosition : 0,
             //contactsTab : "ME",
             //chats : this.$store.getters.StateChats
             signal : false
        }),
        mounted () {
            let THAT = this;
            this.search.state = this.$store.getters.SearchChat.state;
            this.search.mode = this.$store.getters.SearchChat.mode;
            this.search.text = this.$store.getters.SearchChat.text;
            this.search.tab = this.$store.getters.SearchChat.tab;
            // fetch the data when the view is created and the data is
            // already being observed
            this.loadChats();
            //search.tab = this.$route.params.contactsTab
            this.searchChat = debounce(this.searchChat,500);
            this.handleScroll = debounce(this.handleScroll,200);
            this.$refs.scrollable.addEventListener('scroll', this.handleScroll);
            this.tunnel = this.$tunnel.pipe().change(function(event){
                THAT.signal = THAT.$tunnel.strength();
            });
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
            "$store.getters.SearchChat.tab" : function(newVal,oldVal){
                this.search.tab = newVal;
            },
            "$store.getters.SearchChat.state" : function(newVal,oldVal){
                this.search.state = newVal;
            },
            "$store.getters.SearchChat.chatsFetchStamp" : function(newVal,oldVal){
                if(!this.searchEndGame)
                    this.handleScrollElement(this.$refs.scrollable);
            },
            "search.tab" : function(newVal,oldVal){
                this.changeSearchFilter();
            },
            "search.text" :  function (searchText) {
                this.changeSearchFilter();
            },
            "search.state" :  function (searchText) {
                this.changeSearchFilter();
            },
            "search.mode" :  function (searchText) {
                this.changeSearchFilter();
            },
        },
        methods: {
            async changeSearchFilter(){
                this.search.limit = 20;
                this.scrollPosition = 0;
                this.searchFilterOnChange(true);
            },
            async searchFilterOnChange(trigger){
                this.$store.commit("setSessionSearch",this.search);
                if(trigger)
                    this.searchChat();
            },
            async searchChat(){
                if(this.isLoadingChats || this.scheduleUpdate){
                    this.scheduleUpdate = true;
                    return;
                }
                try {
                    await this.$store.dispatch("RefeshSession",true);
                    if(this.scheduleUpdate){
                        await this.$store.dispatch("RefeshSession",true);
                        this.scheduleUpdate = false;
                    }
                } catch(e){
                     this.scheduleUpdate = false;
                }
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
                    online : !this.isAvailable 
                });
            },
            searchTag : function(searchTag) {
                if(this.search.text === searchTag){
                    this.search.text = "";
                } else {
                    this.search.text = searchTag;
                }
            },
            sortByTag (sortTag){
                if(this.search.sortBy  == sortTag){
                    this.search.sortBy = null;
                } else {
                    this.search.sortBy = sortTag;
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
                let curTab = Math.min(2,allTabs.indexOf(this.search.tab)+1);
                this.search.tab = allTabs[curTab];
            },
            onSwipeRight(){
                let curTab = Math.max(0,allTabs.indexOf(this.search.tab)-1);
                this.search.tab =  allTabs[curTab];
            },
            async handleScroll (event){
                this.handleScrollElement(event.target);
            },
            async handleScrollElement(target){
               let pos = (target.scrollTop + target.clientHeight)*100/target.scrollHeight;
                if((pos > this.scrollPosition && pos >= 75) || pos > 90){
                    await this.loadMore();
                } else if(target.scrollTop == 0 || pos<25){
                    this.search.limit = 0;
                    this.searchFilterOnChange();
                }
                this.scrollPosition = pos;
            },
            async loadMore(){
                this.search.limit = this.$formatters.toNum(this.search.limit,20)+30;
                await this.searchFilterOnChange(true);
            }
        },
        beforeUnmount : function (argument) {
            this.tunnel.off();
          //clearInterval(this.intervalid1); 
            if(this.$refs?.scrollable)
                this.$refs.scrollable.removeEventListener('scroll', this.handleScroll); 
        },
        destroyed () {
        },
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
        li.data_unassigned {
            &::before {
                content: "Un-Assigned";
                display: block;
                font-size: .8em;
                padding: 0px 10px;
                color: #000000cc;
                background-color :  rgba(var(--scheme-color-rgba), 0.2);
                border-left: 5px solid rgba(var(--scheme-color-rgba), 0.6);
            }
        }
        li.data_assigned {
            &::before {
                content: "Assigned";
                display: block;
                font-size: .8em;
                padding: 0px 10px;
                color: #000000cc;
                background-color :  rgba(var(--scheme-color-rgba), 0.2);
                border-left: 5px solid rgba(var(--scheme-color-rgba), 0.6);
            }
        }
        li.data_unassigned ~ .data_unassigned::before,
        li.data_assigned ~ .data_assigned::before{
            content: "";
            display: none;
        }
        .contact-list {
            &.sort-state-is_waiting {
                li.sort-state-is_waiting.contact_not_waiting::before  {
                    content: "~"; display: block;               
                }
                li.sort-state-is_waiting.contact_is_waiting::before {
                    content: "Waiting for Response"; display: block; 
                }
                li.contact_not_waiting ~ .contact_not_waiting::before,
                li.contact_is_waiting ~ .contact_is_waiting::before{
                    content: ""; display: none; 
                }
            }
            &.sort-state-is_waiting_long {
                li.sort-state-is_waiting_long.contact_not_waiting_long::before  {
                    content: "~"; display: block;               
                }
                li.sort-state-is_waiting_long.contact_is_waiting_long::before {
                    content: "Need Attention"; display: block; 
                }
                li.contact_not_waiting_long ~ .contact_not_waiting_long::before,
                li.contact_is_waiting_long ~ .contact_is_waiting_long::before{
                    content: ""; display: none; 
                }
            }
            &.sort-state-is_unattended {
                li.sort-state-is_unattended.contact_not_unattended::before  {
                    content: "~"; display: block;               
                }
                li.sort-state-is_unattended.contact_is_unattended::before {
                    content: "Un-Attended"; display: block; 
                }
                li.contact_not_unattended ~ .contact_not_unattended::before,
                li.contact_is_unattended ~ .contact_is_unattended::before{
                    content: ""; display: none; 
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
    .contacts li {
        width: 100% !important;
    }
    .contacts li > span{
        width: 100% !important;
        display: list-item;
        padding: 3px 10px;
        /*margin-bottom: 3px !important;*/
        /*box-shadow: inset 0 0 52px #0000000d;*/
        border-bottom: 1px solid #00000008;
        cursor: pointer;
        border-left: 5px solid #0000;
        border-right: 5px solid #0000;
    }
    .contacts li > span:hover{
        border-left: 5px solid #1d375273;
    }
    .contacts li > span.router-link-exact-active{
      border-left: 5px solid #1d3752;
      background-color: rgba(0,0,0,0.3);
    }
    .contacts li > span.router-link-exact-active, .contacts li.active_contact>span {
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
        color: rgba(255, 255, 255, 0.822);
        font-size: 12px;
        cursor: pointer;
    }
    .contact-tabs .nav-link.active {
        background-color: #0000006b;
        color: #fff;
        font-weight: 500;
    }
     .contact-tabs .chat_tags{
         background-color: rgb(255, 255, 255);
         padding: 0px 0px 3px;
         margin-top: 0px;
     }
    .contact-tabs .tag-chat-status{
        font-size: 9px;
        cursor: pointer;
        line-height: 14px!important;
    }
    .contact-tabs .tag-chat-status.tag-lighter {
        background-color: rgba(var(--scheme-color-rgba), 0.1)!important;
         text-transform: none;
    }
    .contact-tabs .tag-chat-status.tag-darker {
        background-color: rgba(var(--scheme-color-rgba), 0.9)!important;
        text-transform: uppercase;
    }
    .connection-wrapper {
        float: right;
        line-height: 25px!important;
        font-size: 23px!important;
    }
    .connection-status {
        /* line-height: 30px!important;
        padding: 0px 0px 0px 0px; */
        /* width: 25px;
        height: 25px; */
        font-size: 18px!important;
        display: inline-block;
        margin: 0px -1px;
        padding: 0px;
        opacity: 0.9;
        border-radius: 50%;
        margin-right: 6px;
    }
    .online-toggle {
        border-radius: 48%;
        cursor: pointer;
    }
    .online-toggle.fa-toggle-on {
      color: #ff5656;
    }
    .online-toggle.fa-toggle-on.toggle-active {
      color: #4cd137;
      height: 33px;
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
        text-align: right;
        float: right;
    }
    .contacts li > span.router-link-exact-active .new_message {
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
        .chat-channel-code {
            margin: 2px 0px 0px 0px;
            border-radius: 3px;
            padding: 1px 4px 1px 4px;
            font-size: 9px;
            text-align: center;
            background-color: #00000083;
            color: #FFF;
            max-width: 40px;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            text-transform: uppercase;
        }
        .contact-text {
            flex-grow: 1;
            margin-left: 15px;
            height: 59px;
            color : rgba(21, 21, 21, 0.68);
            width: calc(100% - 160px);
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 16px;

            .font-name{
                text-overflow: ellipsis;
                max-width: 187px;
                overflow: hidden;
            }
            .font-subject {
                text-overflow: ellipsis;
                max-width: 187px;
                overflow: hidden;
                display: block;
                font-size: 0.7em;
                font-style: italic;
            }
            .chat_tags {
                line-height: 0.6em;
                .tag-chat-status-sm {
                    font-size: 0.6em;
                    background: rgba(255, 255, 255, 0.274)!important;
                    padding-bottom: 0px;
                    padding-top: 0px;
                    line-height: 1.5em !important;
                }
            }
            .font-preview{
                text-overflow: ellipsis;
                max-width: 187px;
                overflow: hidden;
                font-size: 0.7em;
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
        li.data_subjective {
            .contact-text {
                line-height: 16px;
                height: 65px;
            }
            .font-preview {
                font-size: 0.7em;
            }
        }
    }


</style>