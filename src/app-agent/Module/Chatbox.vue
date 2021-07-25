<template>
          <div class="card card-shadow m-chatbox scheme-color"
            @dragenter="dragEnter" 
            @dragover="dragEnter" 
            @dragleave="dragLeave"
            @mouseleave="dragLeave"
            @paste="onpaste"
            :id="chatsVersionGlobal"
        >
                <div class="card-header msg_head chat-head">   
                    <div class="d-block clear-both">               
                        <div class="d-flex bd-highlight chat-header-left">
                            <div class="chat-header-left-left d-sm-block d-md-none">
                                <router-link tag="i" class="fa fa-arrow-left" 
                                    :to="{ 
                                        name: 'defAgentView', 
                                        params: { 
                                            mvu : 'CONTACTS'
                                    }}"
                                >&nbsp;&nbsp;</router-link >
                            </div>
                            <div class="img_cont" 
                                @click="showContactProfile">
                                <img v-if="activeChat" :src="activeChat.profilePic || MyDict.profilePic" class="rounded-circle user_img">
                                <span class="online_icon" hidden ></span>
                            </div>
                            <div class="user_info"
                                v-if="activeChat">
                                <span class="user_name" @click="showContactProfile" >{{activeChat.name}}</span>
                                <div v-if="assignedToAgent" class="user_assignment">
                                    <v-select v-if="isChatActive" :options="agentOptions" v-model="assignedToAgent"
                                    @option:selected="onAssignedToAgent" label="code"
                                    :components="{Deselect}">
                                        <template #selected-option="option">
                                          <div class="user_assignment-selected">Assigned to {{ option.code }}</div>
                                        </template>
                                        <template #open-indicator="{ attributes }">
                                          <span v-bind="attributes" class="fa fa-caret-down"></span>
                                        </template>
                                        <template #option="{ code, name, dept, session,statusScore }">
                                        <i v-if="!session || !session.isEnabled || !session.isLoggedIn" class="fa fa-times-circle"/>
                                        <i v-else-if="session.isAway" class="fa fa-question-circle"/>
                                        <i v-else-if="session.isOnline" class="fa fa-check-circle"/> 
                                        <i v-else-if="!session.isOnline" class="fa fa-minus-circle"/>

                                        {{ code }}<em>  - {{ name }}</em>
                                        </template>
                                    </v-select>
                                    <span v-if="!isChatActive" class="vs__selected">
                                        Assigned to {{assignedToAgent.code}}
                                    </span>
                                </div>
                            </div>

                            <div class="chat_actions" hidden>
                                <button  @click="closSession" title="Close Chat"
                                class="btn"><i class="fa fa-check-circle"></i></button>                            
                            </div>
                        </div>

                        <div  class="chat-header-right">
                            <div v-if="activeChat" class="quick_options">
                                <b-dropdown id="dropdown-offset" offset="10"
                                    class="float-right quick_option_menu d-sm-block d-md-none"
                                    ref="quick_option_menu" no-caret  variant="link" block right
                                    toggle-tag="span" toggle-class="quick_option_icon float-right">
                                    <template #button-content>
                                       <i class="fas fa-ellipsis-v"></i>
                                    </template>
                                    <b-dropdown-item @click="showContactProfile('info')">
                                        <i class="fa fa-user"></i>&nbsp;&nbsp;Profile Info
                                    </b-dropdown-item>
                                    <b-dropdown-item  @click="showContactProfile('history')">
                                         <i class="fa fa-history"></i>&nbsp;&nbsp;Chat History
                                    </b-dropdown-item>
                                </b-dropdown>
                                <span class="float-right quick_option_icon d-none d-md-block" 
                                     v-bind:class="{'my-selected' : profileViewInfo }"
                                    @click="showContactProfile('info')" v-tooltip="'Profile Info'" >
                                    <i class="fa fa-user"></i>
                                </span> 
                                <span class="float-right quick_option_icon d-none d-md-block"
                                     v-bind:class="{'my-selected' : profileViewHistory }"
                                     @click="showContactProfile('history')" v-tooltip="'Chat History'" >
                                    <i class="fa fa-history"></i>
                                </span> 
                            </div>
                        </div>

                        <div  class="chat-header-right"  @mouseover="showChatOptions = true"
                                @mouseleave="showChatOptions = false">
                        </div>

                    </div> 
                    
                    <div class="d-block clear-both chat-header-lower"> 

                        <div class="chat_tags text-align-right float-right">

                            <span v-if="activeChat" class="tag-chat-status tag-darker" :class="'tag-chat-status-'+ activeChat.status"
                                v-b-modal.chattags >
                                {{activeChat.status}}
                            </span>

                          <b-modal v-if="isActionable && MyConst.config.CHAT_TAG_ENABLED" id="chattags" ref="chattags" title="Select Chat Status"
                                content-class="card"
                                footer-class="card-footer"
                                header-class="card-header"
                                header-text-variant="white"
                                body-class="card-body"
                                dialog-class="card-dialog modal-dialog-sm"
                                button-size="sm"
                                >  

                            <span v-for="(status,s) in MyDict.chatStatus" v-if="status.editable"
                                class="tag-chat-status-lg" @click="updateStatus(s)"
                                :class="'tag-chat-status-'+ s + ( s== activeChat.status ? ' tag-chat-status-active' : '')">
                                {{status.label}}
                            </span>

                            </b-modal>

                        </div> 

                        <div class="chat-actions float-right">
                            
                        </div>

                    </div>

                </div>

                <div class="card-body msg_card_body" v-show="is_CHAT_BOX">

                    <div class="msg_card_body-bubbles">

        <loading :active.sync="isLoading" 
        :can-cancel="false"  
        :loader="'dots'" :opacity="0.3"
        :is-full-page="false"></loading>

<div v-if="!activeChat" class="msg_card_body-logo">
    <span class=""></span>
</div>
<div v-else-if="activeChat">

    <div v-if="activeChat.contact" class="msg_card_body-bubbles-header"> 
        <div class="msg_card_body-bubbles-lane">
            <div><small>Channel Details</small></div>
            <i class="contact_type fa" v-bind:class="MyDict.socialPrefix(activeChat.contactType)"></i>            
            <span class="text-align-left">&nbsp;{{activeChat.contact.lane}}</span>
        </div>
        <hr/>
    </div>  

    <ChatMessages
        :activeChat="activeChat"
        v-show="is_CHAT_BOX"
    />

</div>
                    </div>


                    <div v-if="isActionable && activeChat && activeChat.active" class="msg_card_body-panel">
                        <hr/>
                        <div class="msg_card_body-panel-tags" >
                            <div class="quick-replies-wrapper" ref="quickRepliesWrapper" >
                                <span class="float-right"> 
                                    <span class="msg_cotainer_smart"
                                         @click="(showQuickReplies=!showQuickReplies) && scrollToBottom(true)" 
                                         v-tooltip="showQuickReplies ? 'Show Less' : 'Show More'">
                                        <i v-if="!showQuickReplies" class="fa fa-arrow-circle-up" ></i>
                                        <i v-if="showQuickReplies" class="fa fa-arrow-circle-down" ></i>
                                    </span> 
                                    <span v-if="quickReplies && quickReplies.length>0 " class="divider-v" ></span> 
                                    <span class="msg_cotainer_smart" @click="activeChat.assignedToAgent && closSession()" v-tooltip="'End Chat'" 
                                        v-bind:class="{'my-disbaled' : !activeChat.assignedToAgent}">
                                        <i class="fa fa-check-circle" ></i>
                                    </span>

                                     <span class="msg_cotainer_smart" v-b-modal.stickynote v-tooltip="'Add Sticky Note'" 
                                            v-bind:class="{'my-disbaled' : !activeChat.assignedToAgent}">
                                             <i class="fas fa-sticky-note"></i> 
                                    </span>
                                   
                                </span>    
  
                                <span v-if="quickReplies" class="quick-replies-less" ref="quickRepliesLess">
                                    <span v-for="(quickReply, index) in quickReplies" v-if="(index < countQuickReplies)"
                                    @click="sendQuickReply(quickReply._message)" v-tooltip="quickReply._message"
                                    class="msg_cotainer_smart">  {{quickReply.title}}</span>    
                                </span>
      
                            </div>
                        </div>

                        <slide-up-down :active="showQuickReplies && !!quickReplies" :duration="200" class="quick-replies-more"> 
                                <span v-for="(quickReply, index) in quickReplies"  v-if="(index >= countQuickReplies)"
                                @click="sendQuickReply(quickReply._message)" v-tooltip="quickReply._message"
                                class="msg_cotainer_smart">  {{quickReply.title}}</span>
                             <hr/>
                        </slide-up-down>
                    </div>


                </div>
                <div v-show="is_QUICK_MEDIA" class="card-body media_card_body" >
                    <div class="media_card_body-bubbles">
                        <div class="media_card_body-bubbles-wrapper">
                            <div v-for="media in mediaOptions" class="media_thumb"  @dblclick="sendQuickMedia(media)">
                                    <input :id="'mdeia-'+media.name" type="radio" name="media" :value="media.name" v-model="selectedMedia" />
                                    <label class="media_thumb_label" :for="'mdeia-'+media.name">
                                        <img v-lazy="formatters.https_thumburl(media.url)">
                                    </label>
                            </div>
                        </div>
                    </div>
                    <div class="media_card_body-panel hidden">
                        <hr/>
                        <div class="media_card_body-panel-actions">
                            <span class="media_cotainer_smart">Cancel</span>
                            <span class="media_cotainer_smart">Send</span>
                        </div>
                    </div>
                </div>

                <div v-show="is_UPLOAD_MEDIA" class="card-body upload_card_body" >
                    <div class="card-body-title">Upload Preview <span class="fa fa-close align-right" @click="cancelUpload"/></div>
                    <div  class="upload_card_body-bubbles">
                      <vue-dropzone ref="myVueDropzone"
                        id="dropzone" :options="dz"

                        v-on:vdropzone-drag-enter="dragEnter" 
                        v-on:vdropzone-drag-over="dragEnter" 
                        
                        v-on:vdropzone-file-added="fileAdded" 
                        v-on:vdropzone-sending="fileUploading"
                        v-on:vdropzone-success="fileUploaded"

                        v-on:vdropzone-queue-complete="fileUploadedAll"
                        ></vue-dropzone>
                    </div>
                </div>
                

                <div class="card-footer">
                    <slide-up-down :active="is_QUICK_ACTIONS && isActionable" :duration="200" class="action-events">
                            <span v-if="quickActions" v-for="quickAction in quickActions" 
                             @click="sendQuickAction(quickAction.action)"
                            class="msg_cotainer_smart">  {{quickAction.title}}</span>
                         <hr/>
                    </slide-up-down>

                     <div v-if="activeChat && activeChat.active" class="control-panel">
                        <!--   Contorl Box-->
                     </div>  


                    <div class="input-group my-input-section" 
                        v-bind:class="{ invisible : !isActionable}"
                        >
                        <div class="input-group-prepend">
                            <span
                            @click="toggleView('QUICK_MEDIA')"  v-tooltip="'Select Quick Media'"
                            class="input-group-text input-group-text-left attach_btn"><i class="fa fa fa-photo-video"></i></span>
                            <span 
                            @click="toggleView('QUICK_ACTIONS')" v-tooltip="'Trigger Quick Action'"
                            class="input-group-text attach_btn"><i class="fa fa-sliders-h"></i></span>

                        </div>
                        <textarea name="" class="form-control type_msg input-message"  ref="message_text" 
                            placeholder="Type your message..." 
                            autocomplete="off" :disabled="!inputTextEnabled"
                            v-model="message_text"
                            @keydown.enter.exact.prevent
                            @keyup.enter.exact="onSendMessage"
                            @keydown.enter.shift.exact="newline"
                            @input="onInputType"
                            rows=1
                            ></textarea>
                        <div class="input-group-append">
                            <span
                                @click="onSendMessage" v-tooltip="'Send'" 
                             class="input-group-text send_btn"><i class="fa fa-location-arrow"></i></span>
                            <span 
                            @click="openFileUpload" v-tooltip="'Select File to upload'"
                            class="input-group-text attach_btn input-group-text-right"><i class="fa fa-paperclip"></i></span>
                        </div>
                    </div>
                </div>





              <b-modal v-if="isActionable" id="stickynote" ref="stickynote" title="Add Sticky Note"
                    content-class="card"
                    footer-class="card-footer"
                    header-class="card-header"
                    header-text-variant="white"
                    body-class="card-body"
                    dialog-class="card-dialog modal-dialog-sm"
                    button-size="sm"
                    @ok="addStickNote"
                    >  

                    <textarea name="" class="form-control input-message type_note" 
                            placeholder="Type your message..." 
                            autocomplete="off"
                            v-model="sticky_note"
                            rows=8
                    ></textarea>
                   <small>* Only your colleagues can see <em>Sticky Notes</em></small> 


                </b-modal>
  


            </div>
</template>

<script>

    import Vue from 'vue';
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
    import { MyFlags,MyDict,MyConst,MyFunc } from './../../services/global';
    import formatters from './../../services/formatters';
    import Loading from 'vue-loading-overlay';
    import tunnel from './../../services/tunnel';
    import mustache from 'mustache';
    import SlideUpDown from 'vue-slide-up-down'

    import vue2Dropzone from 'vue2-dropzone'
    import 'vue2-dropzone/dist/vue2Dropzone.min.css'

    import debounce from 'debounce';
    import throttle from 'throttleit';

    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';

    import { Textcomplete } from "@textcomplete/core";
    import { TextareaEditor } from "@textcomplete/textarea";

    import ChatMessages from "./ChatMessages";

    var sampleJson = {
        contact : {
          name : "John Doe", phone : "919876543210", email : "John.Doe@company.com"
        }
    };

    var sampleJsonKeys = formatters.keys(sampleJson);


    export default {
        components: {
            'font-awesome-icon': FontAwesomeIcon,
            Loading: Loading,SlideUpDown,vueDropzone: vue2Dropzone, vSelect :vSelect,
            ChatMessages
        },
        computed : {
            inputTextEnabled : function (argument) {
               return !!this.$route.params.contactId && !!this.activeChat && this.activeChat.active;
            },
            isChatActive : function (argument) {
                return (!!this.activeChat && this.activeChat.active);
            },
            isActionable : function (argument) {
               return (!!this.$route.params.contactId && !!this.activeChat && this.activeChat.active)
               && (this.$route.params.profileId == this.$route.params.contactId)
               && ((this.activeChat.assignedToAgent == MyConst.agent) || !this.activeChat.assignedToAgent)
               ;
            },
            activeChatss : function(){ 
 
            },
            agentOptions : function(){ 
                return this.$store.getters.StateAgentOptions;
            },
            mediaOptions : function(){ 
                //console.log("mediaOptions=",this.$store.getters.StateMediaOptions)
                return this.$store.getters.StateMediaOptions;
            },
            quickActions : function(){ 
                //console.log("quickActions=",this.$store.getters.StateQuickActions)
                return this.$store.getters.StateQuickActions;
            },
            is_CHAT_BOX : function (argument) {
                return (this.winMode === null) || this.winMode == "CHAT_BOX" || this.winMode == "QUICK_ACTIONS";
            },
            is_QUICK_MEDIA : function (argument) {
                return this.winMode == "QUICK_MEDIA"
            },
            is_QUICK_ACTIONS : function (argument) {
                return this.winMode == "QUICK_ACTIONS"
            },
            is_UPLOAD_MEDIA : function (argument) {
                return this.winMode == "UPLOAD_MEDIA"
            },
            chatsVersionGlobal : function(){
                return this.$store.getters.StateChatsVersion;
            },
            profileViewInfo : function (argument) {
                return MyFlags.agent.profileView =='info' && MyFlags.agent.showProfile
            }, profileViewHistory : function (argument) {
                return MyFlags.agent.profileView =='history' && MyFlags.agent.showProfile
            }
        },
        data: () => ({
            message_text : "",quickReplies : null,sticky_note : null, 
            selectedMedia : null,
            showChatOptions : false,
            lastMessageId : null,ilastMessageId :  null,
            MyDict,MyFlags,MyConst, MyFunc,
            isLoading : false,
            is : {
                QUICK_ACTIONS  : false,
                QUICK_MEDIA :  false
            },
            showQuickReplies : false, countQuickReplies : 3,
            showAgentOption : false,
            assignedToAgent : null,
            activeChat : null,
            chatsVersionLocal : 0,

            winMode : null,

            //Locla Dirty Flags
            quickRepliesWrapperHeight : null,

            dz: {
              url: MyConst.context + '/api/sessions/message/upload',
              thumbnailWidth: 150,
              maxFilesize: 10, 
              //maxFiles : 1,
              autoProcessQueue: false,
              addRemoveLinks : true,

              // Extra-/-External Flags
              file_count : 0,
              file_dragging : false,file_dropped : false, file_in : false,
              showcounter : null
            },
            wout : {
                dragstart : null, dragend :  null, dragenter :  null, dragover : null, dragleave : null,
                mouseleave : null, mouseenter : null
            },
            win : {
                dragstart : null, dragend :  null, dragenter :  null, dragover : null, dragleave : null,
                mouseleave : null, mouseenter : null
            },
            Deselect: {
                render: function(createElement) {
                    var elm = createElement('span',{
                        domProps : {
                            className : "fa fa-times"
                        }
                    });
                    //elm.className = "fa fa-times";
                    //elm.elm.class = "fa fa-times";
                    console.log("RENDER",elm)
                    //elm.setAttribute('class','fa');
                    return null;
                   // return ("<span>S</span>");
                }
            },
            formatters : formatters,

            strategies: [{
              match: /(^|\s)\/([a-z0-9+\-\_\.]*)$/,
              search(term, callback) {
                callback(sampleJsonKeys.filter(function (name) {
                  return name.startsWith(term);
                }).slice(0, 10))
              },
              template(name) {
                return name;
              },
              replace(value) {
                return '' + value + ''
              },
            }]

        }),
        created () {
            // fetch the data when the view is created and the data is
            // already being observed
            console.log("loading...")
            this.loadMediaOptions();
            this.loadQuickActions();
            this.scrollToBottom();
        },
        updated (){
            this.scrollToBottom();
            this.refreshQuickReplies();
        },
        mounted (){
            this.scrollToBottom();
            this.loadQuickReplies();
            this.loadChats();

            var THAT =  this;
            this.tunnel = tunnel.init().instance()
            .on("/agent/onmessage", function(msg){
                if(msg.sessionId == THAT.$route.params.sessionId)
                    THAT.scrollToBottom(true);
            });

            // const editor = new TextareaEditor(this.$refs.message_text);
            // this.textcomplete = new Textcomplete(editor,this.strategies, {
            //     dropdown :  { 
            //         placement: "top" 
            //     }
            // })
        },
        beforeUnmount (){
            this.tunnel.off();
            //this.textcomplete.destroy()
        },
        watch: {
            '$route.params.contactId': function (contactId) {
                this.scrollToBottom();
                this.loadQuickReplies();
                this.onSessionChange();
            },
            '$route.params.sessionId': function (contactId) {
                //this.loadChat();
                this.onSessionChange();
                this.toggleView("CHAT_BOX");
            }
        },
        methods: {
            prepareMessage : function (text,template,action,empty) {
                var activeChat = this.activeChat;
                if(!activeChat){
                    return;
                }
                if(!text && !template && !action && !empty){
                    return;
                }
                var sessionId = activeChat.sessionId;
                //this.scrollToBottom();
                var msg = {
                    text : text, timestamp : new Date().getTime(),
                    sender : MyConst.agent, name : MyConst.agent,
                    messageId : "",sessionId : sessionId,
                    template : template,
                    action : action, type : (action ? "A" : "O")
                };
                return msg;
            },
            async sendText(text,template, action){
                this.showQuickReplies = false;
                this.selectedMedia = null;

                if(this.winMode == "UPLOAD_MEDIA" && this.$refs.myVueDropzone.getQueuedFiles().length > 0){
                    await this.$refs.myVueDropzone.processQueue();
                } 

                var msg = this.prepareMessage(text,template, action);
                if(!msg){
                    console.log("I Return")
                    return;
                }
                //activeChat.messages.push(msg);
                this.toggleView("CHAT_BOX");
                this.scrollToBottom();

                try {
                    console.log("beforeSendcta")
                    var resp = await this.$store.dispatch('SendChat', msg);
                    console.log("resp",resp)
                    // msg.messageId = resp.results[0].messageId;
                } catch(e){
                    console.error(e)
                    msg.logs = ["Error While Sending"];
                }
                this.toggleView("CHAT_BOX");
                this.scrollToBottom(true);
            },
            onSendMessage :  function () {
                this.sendText(this.message_text,this.is_QUICK_MEDIA ?   this.selectedMedia : null);
                this.message_text = "";
            }, newline : function (argument) {
                this.value = `${this.message_text}\n`;
            },
            sendQuickReply : function (argument) {
                this.sendText(argument || event.target.innerText,this.is_QUICK_MEDIA ?   this.selectedMedia : null);
            },
            sendQuickAction : function (argument) {
                this.sendText(null, null, argument);
            },
            sendQuickMedia : function (media) {
                this.sendText(null, media.name, null);
            },
            updateStatus : function (status) {
                this.$store.dispatch('UpdateSessionTags', {
                    status : status, 
                    sessionId : this.activeChat.sessionId
                });
                this.$refs.chattags.hide();
            },
            addStickNote :  function (argument) {
                this.sendText(this.sticky_note,null,"/add_stick_note");
                this.sticky_note = null;
                //this.$refs.stickynote.hide();
            },
            closSession :  function () {
                this.sendText("/exit_chat");
                this.$router.push("/app/chat")
            },
            showContactProfile : function (type, type2) {
                if(typeof type !='string'){
                    type = "info";
                }
                if(this.$route.params.profileView != type){
                    this.$router.push({
                        name: 'defAgentView', 
                        params: { 
                            profileView : type,
                            mvu : 'CPROFILE'
                        } 
                    }) 
                }

                if(false  && MyFlags.agent.profileView == type ){
                    MyFlags.agent.showProfile = !MyFlags.agent.showProfile
                    if(!MyFlags.agent.showProfile){
                         MyFlags.agent.profileView = null;
                    }
                } else {
                    MyFlags.agent.profileView = type
                    MyFlags.agent.showProfile = true
                    MyFlags.agent.mvu='CPROFILE'
                }
            },
            scrollToBottom : function (force) {
                if(!this.is_CHAT_BOX){
                    return;
                }

                var activeChat = this.activeChat;
                if(!activeChat){
                    return;
                }
                var msgs = activeChat.messages;
                if(!msgs || !msgs.length){
                    return;
                }
                var lastMessageId = msgs[msgs.length-1].messageId;
                if(this.lastMessageId == lastMessageId && !force){
                    return;
                }
                this.lastMessageId = lastMessageId;

                this.$nextTick(() => {
                    var mcb =document.querySelector('.msg_card_body');
                    if(mcb){
                        mcb.scrollTop =  mcb.scrollHeight+50;
                    }
                });
            },
            async loadMediaOptions(){
                await this.$store.dispatch('LoadMediaOptions')
            },
            async loadQuickActions(){
                return await this.$store.dispatch('LoadQuickActions');
            },
            async loadQuickReplies(){
                return await this.$store.dispatch('LoadQuickReplies');
            },
            calcQuickReplies : debounce(function (argument) {
                console.log("calcQuickReplies")
                if(this.$refs.quickRepliesLess){
                    console.log("calcQuickReplies = N",this.$refs.quickRepliesLess.childNodes.length);
                    var totalWidth = this.$refs.quickRepliesLess.offsetWidth;
                    var count = 0, innerWidth = 0;
                    for (var i = 0; i < this.$refs.quickRepliesLess.childNodes.length; i++) {
                        var node = this.$refs.quickRepliesLess.childNodes[i];
                        if(node.tagName != 'SPAN')
                            continue;
                        innerWidth = innerWidth + node.offsetWidth + 6;
                        if(innerWidth > totalWidth){
                            break;
                        }
                        count++;
                    }
                    console.info("calcQuickReplies = C",count);
                    //this.countQuickReplies = count;
                }
            },2000),
            async refreshQuickReplies(force){
                this.refreshActiveChats();
                var activeChat = this.activeChat;
                if(!activeChat){
                    return;
                }

               //this.calcQuickReplies();
                var categories = [];
                var ilastmsg = activeChat.ilastmsg;
                if(ilastmsg){
                    categories = ilastmsg.tags.categories;
                } else if(!force){
                    return;
                }

                if( (this.ilastMessageId == ilastmsg.messageId) && !force){
                    return;
                }

                this.ilastMessageId = ilastmsg.messageId;

                var quickReplies = await this.$store.dispatch('LoadQuickReplies',{
                    categories : categories,
                    text : this.message_text
                });
                this.quickReplies = quickReplies.map(function (quickReply) {
                    if(quickReply.template){
                        quickReply._message = mustache.render(quickReply.template, { 
                            contact : activeChat.contact
                        });
                    } else {
                        quickReply._message = quickReply.message || quickReply.title;
                    }
                    quickReply._message = quickReply._message;
                    return quickReply
                });
                this.scrollToBottom(true);
            },
            async loadChats(){
                await this.$store.dispatch('GetChats');
                await this.$store.dispatch('LoadAgentOptions');
                this.onSessionChange();
            },
            onSessionChange : debounce(async function(){
                console.log("onSessionChange : Session On Change")
                this.activeChat = this.loadActiveChat();

                if(this.activeChat == null && this.$route.params.contactId){
                    let resp = await this.$service.get('/api/sessions/contact/active', {
                            contactId : this.$route.params.contactId,
                            sessionId : this.$route.params.sessionId,
                            _processor : "session"
                    });
                    if(resp.results.length > 0){
                        this.activeChat = resp.results[0];
                    }
                }
                this.loadArchiveMessages();

            },200),
            loadActiveChat () {
                for(var i in this.$store.getters.StateChats){
                    var chat = this.$store.getters.StateChats[i];
                    if(this.$route.params.sessionId == chat.sessionId){
                        return chat;
                    }
                }
                for(var i in this.$store.getters.StateChatHistory){
                    var chat = this.$store.getters.StateChatHistory[i];
                    if(this.$route.params.sessionId == chat.sessionId){
                        return chat;
                    }
                }
                if(this.activeChat && (this.$route.params.sessionId == this.activeChat.sessionId)){
                    return this.activeChat;
                }
                return null;
            },
            refreshActiveChats(force){
                if(this.chatsVersionLocal != this.chatsVersionGlobal || force){
                    this.activeChat = this.loadActiveChat();
                    this.chatsVersionLocal = this.$store.getters.StateChatsVersion;
                }
                return this.activeChat
            },
            async loadArchiveMessages(){
                this.refreshActiveChats(true);
                var activeChat = this.activeChat;
                if(!activeChat){
                     MyFlags.agent.showProfileAllowed = false;
                    return;
                }
                MyFlags.agent.showProfileAllowed = true;
                
                if( activeChat._tab && activeChat.active){
                    console.log("Setting Tab to ",activeChat,activeChat._tab)
                    MyFlags.agent.contactsTab = activeChat._tab;
                }
                
                this.assignedToAgent = this.$store.getters.StateAgentOptions.filter(function (t) {
                    return t.code == activeChat.assignedToAgent;
                })[0] || {};

                if(!activeChat.messages){
                    this.isLoading = true;
                    var resp = await this.$store.dispatch('GetSessionChats',{
                        contactId : this.activeChat.contactId,
                        sessionId : this.activeChat.sessionId,
                        contactType : this.activeChat.contactType,
                        name : this.activeChat.name
                    });
                    activeChat.messages = resp.messages;
                    this.isLoading = false;
                }
                this.scrollToBottom(true);
            },

            async onAssignedToAgent (argument) {
                var resp = await this.$store.dispatch('AssingToAgent',{
                    sessionId : this.activeChat.sessionId,
                    agentId : argument.id
                });
                this.refreshActiveChats();
            },

            //DOMS
            onInputType : throttle(function onInputType (event,a,b,c) { //type_msg,type_note
                console.log("onInputType",event,a,b,c) 
                event.target.style.height = "auto";
                event.target.style.height = event.target.scrollHeight + "px";
                this.refreshQuickReplies(true);
            },600),

            toggleView : function (argument) {
                if(this.winMode === argument){
                    this.winMode = null;
                } else {
                    this.winMode = argument;
                }
            },
            showQuickOptionsMenu : function (argument) {
                this.$refs.quick_option_menu.show();
            },


            async onpaste (event){
                console.log("Paste",event)
                var items = (event.clipboardData || event.originalEvent.clipboardData).items;
                for (var index in items) {
                    var item = items[index];
                    if (item.kind === 'file') {
                        console.log("adds the file to your dropzone instance",item.getAsFile())
                        this.$refs.myVueDropzone.addFile(item.getAsFile());
                         this.winMode = "UPLOAD_MEDIA";
                         this.dragLeave();
                         event.preventDefault();
                    }
                }
            },

            async dragEnter (event) {
                this.dz.file_dragging = true;
                this.winMode = "UPLOAD_MEDIA";
                //window.clearTimeout(this.dz.showcounter);
                this.dragLeave();
            },
            dragLeave : debounce(function(argument){
                //console.log("Trying to leave")
                //window.clearTimeout(this.dz.showcounter);
                //var THAT = this;
                //this.dz.showcounter = setTimeout(function(argument) {
                if( this.winMode == "UPLOAD_MEDIA"){
                    console.log("Trying to left"+this.$refs.myVueDropzone.getQueuedFiles().length)
                    if(this.$refs.myVueDropzone.getQueuedFiles().length == 0){
                        this.dz.file_dragging = false
                        this.winMode = null;
                    } 
                }
                //},2000)
                //this.dz.file_dragging = false;
            },2000),
            cancelUpload :  function (argument) {
                console.log("Cancel UPload")
                this.dz.file_dragging = false;
                this.$refs.myVueDropzone.removeAllFiles(true)
            },
            openFileUpload : function (argument) {
                this.$refs.myVueDropzone.$el.click();
                this.winMode = "UPLOAD_MEDIA";
            },
            //DZ options
            async fileAdded(argument) {
                 //this.dz.file_dropped = true;
            },
            async fileUploading(file, xhr, formData) {
                var msg = this.prepareMessage(null, null,null,true);
                this.$store.dispatch("SendChatPre",msg);
                console.log("fileUploading2",msg)
                formData.append('message', JSON.stringify(msg));
            },
            async fileUploaded(file,resp) {
                if(resp){
                    this.$store.dispatch("ReadChatMessage",resp.results[0]);                  
                }
                this.$refs.myVueDropzone.removeFile(file);
            },
            async fileUploadedAll(e){
                this.toggleView("CHAT_BOX");
            }

        },

    }

</script>
<style type="text/css" scoped>
    .chat-header-left{
        float: left;
    }
    .chat-header-left-left{
        color: white;
        margin: auto 0px auto -16px;
    }
    .chat-header-right{
        float: right;
    }
    .chat-header-lower{
        height: 18px;
        color: #FFF;
    }
    .quick_options {
        margin-right: -10px;
        color: white;
        margin-top: 5px;
    }
    .msg_card_body-bubbles-header {
    }
    .msg_card_body-bubbles-lane {
        text-align: right;
        color: #737373;
        font-size: 16px;
    }
    .msg_card_body-bubbles-header .contact_type{
        line-height: 20px;
        font-size: 20px;
        width: 30px;
        height: 30px;
    }
    .msg_card_body-logo{
        min-height: calc(100% - 25px);
        height: 100%;
        position: relative;
        padding-top: calc(50vh - 120px);
        filter: grayscale(100%);
        opacity : 0.2;
        text-align: center;
    }
    .msg_card_body-logo>span{
        background-image: url(./../../assets/images/logo-long.png);
        background-size: 200px auto;
        background-repeat: no-repeat;
        background-position: center;
        display: inline-block;
        height: 60px;
        width: 188px;
    }

    .msg_card_body-panel .msg_card_body-panel-tags {
        text-align: center;
        /*width: 90%;*/
        margin: 0 auto;
        display: table;
        min-height : 25px;
    }
    .msg_card_body-panel .quick-replies-wrapper {

    }
   
    .log_icon {
        color: red;
    }
    .msg_status_send-wrapper {
        display: inline-block;
        height: 15px;
        width: 15px;
        padding: 0px;
        margin: 0px;
        float: right;
    }
    .msg_status_send {
        font-size: 20px;
    }
    .msg_status_send.muted {
        color: #6c757d87 !important;
    }
    .msg_status_send.sending {
        color: #6c757d87 !important;
        /* width: 6px; */
        /* height: 6px; */
        font-size: 11px;
        margin: 0px;
        padding: 0px;
        line-height: 15px;
    }

    .my-attachments img {
        cursor: pointer;
        margin: 10px;
        max-width: 200px;
        min-width: 100px;
    }

    .divider-v {
        padding-left: 2px;
        padding-right: 4px;
    }
    .divider-v:after{
        content: " ";
        border-right: solid 1px #00000066;
    }

    .msg_cotainer_smart{
        margin-bottom: 2px;
        margin-left: 3px;
        /*margin-top: 2px;*/
        border-radius: 8px;
        background-color: #FFF;
        color: #212121;
        padding: 6px;
        position: relative;
        font-size: 14px;
       /* border: 1px solid #4b56c0d1;*/
        cursor : pointer;
        display: inline-block;

    /*margin-bottom: auto;*/
    margin-right: 3px;
    border-radius: 7px;
    background-color: #FFF;
    padding: 6px;
    position: relative;
    font-size: 14px;
    -border : 1px solid #0000001c;
    box-shadow: 0 1.5px 1.5px #00000052;

    }

    
    .upload_card_body {
/*    overflow-y: auto;
    height: 100%;*/
/*    background-color: #f5f5f5;
*/ 
    padding: 0px;
    overflow-y: auto;
   }
    .upload_card_body .card-body-title {
        color: #FFF;
        padding: 10px;
        height: 35px;
        line-height: 14px;
        background-color: #ffffff12;
    }
    .upload_card_body .card-body-title span{
        float: right;
        cursor: pointer;
/*        padding: 6px;*/
    }

    .upload_card_body-bubbles {
        height: calc(100% - 35px);
        background-color: #f5f5f5;
        overflow-y: auto;
    }
    .upload_card_body-bubbles .dropzone{
        min-height: calc(100% - 0px);
    }

    .card-footer .control-panel {
        color: #FFF;
    }
    .action-events hr {
        border: 0;
        border-top: 1px solid #ffffff61;
        margin: 10px 0;
    }
    .quick-replies-more {
        text-align: center;
    }


/* User Info Panel */    
  .user_info{
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 15px;
  }
  .user_info .user_name{
    font-size: 15px;
    color: white;
    line-height: 15px;
    margin-bottom: 9px;
    display: block;
  }
  .user_info .font-name{
      text-overflow: ellipsis;
      max-width: 187px;
      display: inline-block;
      overflow: hidden;
  }
  .user_info .font-preview{
    text-overflow: ellipsis;
      max-width: 187px;
      overflow: hidden;
  }
  .user_info .user_stamp{
    font-size: 10px;
    color: rgba(255,255,255,0.6);
  }
  .my-input-section .input-group-text:hover {
    background-color: #00000069!important;
  }
  .tag-chat-status-lg {
    margin: 3px;
  }

    .type_msg{
      background-color: rgba(0,0,0,0.3) !important;
      border:0 !important;
      color:white !important;
      min-height: 60px;
      max-height: 180px;
      overflow-y: auto;
    }
    .type_msg:focus{
        box-shadow:none !important;
        outline:0px !important;
    }
    .type_note {
        background-color: #fff9caf2 !important;
        border: 1px solid #d6cf01 !important;
        color: #584600 !important;
        min-height: 60px;
        max-height: 180px;
        overflow-y: auto;
        -webkit-box-shadow: none !important;
        box-shadow: inset !important;
        outline: 1px #000 !important;
        border-radius: 14px;
    }

</style>
<style type="text/css">
  .m-chatbox .quick_options span.quick_option_icon {
        color: white!important;
        font-size: 20px;
        cursor: pointer;
        opacity: 0.9;
        padding : 0px; 
        width: 30px;
        height : 30px;
        text-align: center;
        margin-left: 5px;
    }
     .m-chatbox .quick_options span.quick_option_icon.my-selected {
        opacity: 1.0;
        border-radius: 40px;
        box-shadow: inset 0 0 15px #0000005e;
     }

  .user_info .user_assignment .vs__selected {
    font-size: 13px !important;
    color: rgb(255 255 255);
    background: transparent;
    border: none;
  }
  .user_assignment .vs__dropdown-toggle {
    border : none;
    color: #fff;
    background-color: #0000002e;
    border-radius: 6px;
  }
  .user_assignment .vs__selected-options{
    /*min-width: 200px;*/
  }
  .user_assignment .v-select:not(.vs--open) .vs__search {
    /*display: none;*/
    visibility: none;
    width: 0px;
    padding: 0px;
    color: #FFF;
  }
 .user_assignment .vs__clear {
    display: none;;
 }
  .user_assignment .vs__search, .vs__search:focus{
    width: 100%;
  }
  .user_assignment .vs__dropdown-option {
    padding: 3px 7px;
    max-width: 250px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .user_assignment .vs__dropdown-option--highlight {
     background: #ddd;
     color: #000;
  }
  .user_assignment .vs__dropdown-option em {
    color: #929292;
    font-size: smaller;
    text-overflow: ellipsis;
  }
  .user_assignment .vs__dropdown-option .fa-check-circle {
    color: #3aa233;
    font-size: smaller;
  }
  .user_assignment .vs__dropdown-option .fa-minus-circle {
    color: #c10505;
    font-size: smaller;
  }
  .user_assignment .vs__dropdown-option .fa-question-circle {
    color: #f1993c;
    font-size: smaller;
  }
  .user_assignment .vs__dropdown-option .fa-times-circle {
    color: #929292;
    font-size: smaller;
  }
</style>
