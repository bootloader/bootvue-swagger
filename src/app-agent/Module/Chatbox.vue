<template>
          <div class="card card-shadow" 
            @dragenter="dragEnter" 
            @dragover="dragEnter" 
            @dragleave="dragLeave"
            @mouseleave="dragLeave"
            :id="chatsVersionGlobal"
        >
                <div class="card-header msg_head chat-head">                   
                    <div class="d-flex bd-highlight chat-header-left">
                        <div class="img_cont" 
                            @click="showContactProfile">
                            <img v-if="activeChat" :src="activeChat.profilePic || MyDict.profilePic" class="rounded-circle user_img">
                            <span class="online_icon" hidden ></span>
                        </div>
                        <div class="user_info"
                            v-if="activeChat">
                            <span class="user_name" @click="showContactProfile" >{{activeChat.name}}</span>
                            <div v-if="activeChat.ilastmsg" class="user_stamp">{{activeChat.ilastmsg.timestamp | formatDate}} </div>
                            <div v-if="assignedToAgent" class="user_assignment">
                                <v-select v-if="sendEnabled" :options="agentOptions" v-model="assignedToAgent"
                                @option:selected="onAssignedToAgent"
                                :components="{Deselect}">
                                    <template #selected-option="option">
                                      <div class="user_assignment-selected">Assigned to {{ option.code }}</div>
                                    </template>
                                    <template #open-indicator="{ attributes }">
                                      <span v-bind="attributes" class="fa fa-caret-down"></span>
                                    </template>
                                    <template #option="{ code, name, dept }">
                                      <em>{{ code }} - {{ name }}</em>
                                    </template>
                                </v-select>
                                <span v-if="!sendEnabled" class="vs__selected">
                                    Assigned to {{assignedToAgent.code}}
                                </span>
                            </div>

                    <div>

                    </div>

                        </div>

                        <div class="video_cam">
                            <span hidden><i class="fas fa-video" ></i></span>
                            <span hidden><i class="fas fa-phone" ></i></span>
                            <span  hidden  @click="showContactProfile" >
                                <i class="fas fa-history"></i>
                            </span> 
                        </div>
                        <div class="chat_actions" hidden>
                            <button  @click="closSession" title="Close Chat"
                            class="btn"><i class="fa fa-check-circle"></i></button>                            
                        </div>
                    </div>

                    <div  class="chat-header-right">
                        <div v-if="activeChat" class="video_cam">
                            <span  @click="showContactProfile('info')" v-tooltip="'Show Profile Info'" >
                                <i class="fa fa-user"></i>
                            </span> 
                            <span  @click="showContactProfile('history')" v-tooltip="'Show Chat History'" >
                                <i class="fa fa-history"></i>
                            </span> 
                        </div>
                    </div>
                    <div  class="chat-header-right"  @mouseover="showChatOptions = true"
                            @mouseleave="showChatOptions = false">
                        <span id="action_menu_btn"> <i class="fas fa-user-clock" hidden></i></span>
                        <div class="action_menu" v-show="showChatOptions">
                            <ul style="padding-top: 10px">
                                <li @click="showContactProfile">
                                    <i class="fas fa-history"></i> Chat Hisotry</li>
                                <li @click="closSession"><i class="fa fa-check-circle"></i> Resolve Ticket</li>
                            </ul>
                        </div>  
                    </div>
                </div>
                <div class="card-body msg_card_body" v-show="showChatWindow">

                    <div class="msg_card_body-bubbles">

        <loading :active.sync="isLoading" 
        :can-cancel="false"  
        :loader="'dots'" :opacity="0.3"
        :is-full-page="false"></loading>

<div v-if="!activeChat" class="msg_card_body-logo">
    <span class=""></span>
</div>
<div v-else-if="activeChat" v-for="m in activeChat.messages">
    
    <div v-if="m.type == 'I'" class="d-flex justify-content-start mb-4 chat-bubble" :title="m.tags ? m.tags.categories : null" >
        <div class="img_cont_msg">
            <img src="assets/images/profile.png" class="rounded-circle user_img_msg">
        </div>
        <div class="msg_cotainer">
            <span>{{m.text | striphtml | newlines}}</span>
        </div>
        <span class="msg_time"><span class="msg_user">{{m.name ||'---'}}</span>&nbsp;&nbsp;{{m.timestamp|formatDate}}</span>
    </div>

    <div v-else-if="m.type=='O'" class="d-flex justify-content-end mb-4 chat-bubble" data-local-id="m.localId" :data-message-id="m.messageId">
       <i v-if="!m.messageId" class="sending fa fa-spinner fa-spin" >&nbsp;</i>
        <div class="msg_cotainer_send">
            <span v-if="m.text" >{{m.text | striphtml | newlines}}</span>
            <div v-if="m.attachments"> 
                <span v-if="m.template" ><span class="fa fa-paperclip"/>&nbsp;{{m.template}}</span>
                <div class="input-group my-attachments">
                    <span v-for="atch in m.attachments">
                        <img v-if="atch.mediaType == 'IMAGE'" :src="atch.mediaURL | thumburl" class="">
                            <a v-else :href="atch.mediaURL | thumburl" class="fa fa-file-alt float-right"></a>
                        <br/>
                        <small v-if="atch.mediaCaption">{{atch.mediaCaption}}</small>
                    </span>
                </div>
            </div>
            <div v-else-if="m.template" class="my-msg-template-tag">
                <span class="fa fa-tag"></span>&nbsp;{{m.template}}
            </div>
            <i v-if="m.logs" class="log_icon fa fa-exclamation-triangle float-right" v-tooltip="m.logs+''"></i>
            <span class="msg_time_send">{{m.timestamp|formatDate}}&nbsp;&nbsp;<span class="msg_user">{{m.name ||'---'}}</span></span>
        </div>
        <div class="img_cont_msg">
            <img src="assets/images/profile.png" class="rounded-circle user_img_msg">
        </div>
    </div>

    <div v-else-if="m.type=='A' || m.type=='L'" 
        class="d-flex justify-content-center chat-bubble chat-bubble-note" data-local-id="m.localId" :data-message-id="m.messageId">
        <i v-if="!m.messageId" class="sending fa fa-spinner fa-spin" >&nbsp;</i>
        <div class="msg_cotainer_action">
            {{m.timestamp|formatDate}}&nbsp;&nbsp;<span class="msg_user">{{m.name ||'---'}}</span>&nbsp;<span class="fa fa-long-arrow-alt-right"/>&nbsp;{{m.action | striphtml | newlines}}

            <i v-if="m.logs" v-for="log in m.logs" class="prepend-comma">
                &nbsp;{{log | log_option(m.action)| striphtml | newlines}}</i>

        </div>
    </div>    

</div>
                    </div>
                    <div v-if="sendEnabled && activeChat && activeChat.active" class="msg_card_body-panel">
                        <hr/>
                        <div class="msg_card_body-panel-tags">
                            <span v-if="quickReplies">
                                <span v-for="quickReply in quickReplies" v-if="quickReply.match"
                                @click="sendQuickReply(quickReply._message)" v-tooltip="quickReply._message"
                                class="msg_cotainer_smart">  {{quickReply.title}}</span>    
                            </span>

                            <span class="msg_cotainer_smart" @click="(showQuickReplies=!showQuickReplies) && scrollToBottom(true)" v-tooltip="'Show More'">
                                <i v-if="!showQuickReplies" class="fa fa-arrow-circle-up" ></i>
                                <i v-if="showQuickReplies" class="fa fa-arrow-circle-down" ></i>
                            </span>  

                            <span v-if="quickReplies && quickReplies.length>0" class="divider-v" ></span>
                            <span class="msg_cotainer_smart" @click="isShowMediaOptions=!isShowMediaOptions" v-tooltip="'Send QuickMedia'" hidden>
                                <i class="fa fa-photo-video" ></i>
                            </span> 
                            <span class="msg_cotainer_smart" @click="closSession" v-tooltip="'End Chat'">
                                <i class="fa fa-check-circle" ></i>
                            </span>                        
                        </div>

                    <slide-up-down :active="sendEnabled && showQuickReplies && quickReplies" :duration="200" class="action-events">
                            <span v-for="quickReply in quickReplies"  v-if="!quickReply.match"
                            @click="sendQuickReply(quickReply._message)" v-tooltip="quickReply._message"
                            class="msg_cotainer_smart">  {{quickReply.title}}</span>
                         <hr/>
                    </slide-up-down>


                    </div>
                </div>
                <div v-show="winMode=='QUICK_MEDIA'" class="card-body media_card_body" >
                    <div class="media_card_body-bubbles">
                        <div class="media_card_body-bubbles-wrapper">
                            <div v-for="media in mediaOptions" class="media_thumb">
                                    <input :id="'mdeia-'+media.name" type="radio" name="media" :value="media.name" v-model="selectedMedia" />
                                    <label class="media_thumb_label" :for="'mdeia-'+media.name">
                                        <img :src="media.url | thumburl">
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

                <div v-show="winMode=='UPLOAD_MEDIA'" class="card-body upload_card_body" >
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
                    <slide-up-down :active="showQuickActions && sendEnabled" :duration="200" class="action-events">
                            <span v-if="quickActions" v-for="quickAction in quickActions" 
                             @click="sendQuickAction(quickAction.action)"
                            class="msg_cotainer_smart">  {{quickAction.title}}</span>
                         <hr/>
                    </slide-up-down>

                     <div v-if="activeChat && activeChat.active" class="control-panel">
                        <!--   Contorl Box-->
                     </div>  


                    <div class="input-group my-input-section" 
                        v-bind:class="{ fade : !sendEnabled}"
                        >
                        <div class="input-group-prepend">
                            <span 
                            @click="showWinMode('QUICK_MEDIA')"
                            class="input-group-text input-group-text-left attach_btn"><i class="fa fa fa-photo-video"></i></span>
                            <span 
                            @click="showQuickActions=!showQuickActions"
                            class="input-group-text attach_btn"><i class="fa fa-sliders-h"></i></span>

                        </div>
                        <textarea name="" class="form-control type_msg input-message" 
                            placeholder="Type your message..." 
                            autocomplete="off" :disabled="!inputTextEnabled"
                            v-model="message_text"
                            @keydown.enter.exact.prevent
                            @keyup.enter.exact="onSendMessage"
                            @keydown.enter.shift.exact="newline"></textarea>
                        <div class="input-group-append">
                            <span
                                @click="onSendMessage"
                             class="input-group-text input-group-text-right send_btn"><i class="fa fa-location-arrow"></i></span>
                        </div>
                    </div>
                </div>
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
    import { MyFlags,MyDict,MyConst } from './../../services/global';
    import formatters from './../../services/formatters';
    import Loading from 'vue-loading-overlay';
    import tunnel from './../../services/tunnel';
    import mustache from 'mustache';
    import SlideUpDown from 'vue-slide-up-down'

    import vue2Dropzone from 'vue2-dropzone'
    import 'vue2-dropzone/dist/vue2Dropzone.min.css'

    import debounce from 'debounce';

    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';

    export default {
        components: {
            'font-awesome-icon': FontAwesomeIcon,
            Loading: Loading,SlideUpDown,vueDropzone: vue2Dropzone, vSelect :vSelect
        },
        computed : {
            inputTextEnabled : function (argument) {
               return !!this.$route.params.contactId && !!this.activeChat && this.activeChat.active;
            },
            sendEnabled : function (argument) {
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
            showChatWindow : function (argument) {
                return (this.winMode === null) || this.winMode == "CHAT_BOX";
            },
            showMediaUpload : function (argument) {
                return (this.dz.file_dragging || this.dz.file_dropped) && this.winMode == 'UPLOAD_MEDIA';
            }, 
            chatsVersionGlobal : function(){
                return this.$store.getters.StateChatsVersion;
            }
        },
        data: () => ({
            message_text : "",quickReplies : null,
            selectedMedia : null,
            isShowMediaOptions : false,
            showChatOptions : false,
            lastMessageId : null,ilastMessageId :  null,
            MyDict,MyFlags,MyConst,
            isLoading : false,
            showQuickActions : false,
            showQuickReplies : false,
            showAgentOption : false,
            assignedToAgent : null,
            activeChat : null,
            chatsVersionLocal : 0,

            winMode : null,

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
            this.setQuickReplies();
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

        },
        beforeUnmount (){
            this.tunnel.off();
        },
        watch: {
            '$route.params.contactId': function (contactId) {
                this.scrollToBottom();
                this.loadQuickReplies();
            },
            '$route.params.sessionId': function (contactId) {
                //this.loadChat();
                this.loadArchiveMessages();
            }
        },
        methods: {
            prepareMessage : function function_name(text,template,action,empty) {
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
                    sender : MyConst.agent,name : MyConst.agent,
                    messageId : "",sessionId : sessionId,
                    template : template,
                    action : action
                };
                return msg;
            },
            async sendText(text,template, action){
                this.showQuickReplies = false;
                this.isShowMediaOptions = false;
                if(this.winMode == "UPLOAD_MEDIA" && this.$refs.myVueDropzone.getQueuedFiles().length > 0){
                    await this.$refs.myVueDropzone.processQueue();
                }
                var msg = this.prepareMessage(text,template, action);
                if(!msg){
                    console.log("I Return")
                    return;
                }
                //activeChat.messages.push(msg);
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
                this.showWinMode("CHAT_BOX")
                this.scrollToBottom(true);
            },
            onSendMessage :  function () {
                this.sendText(this.message_text,this.isShowMediaOptions ?   this.selectedMedia : null);
                this.message_text = "";
            }, newline : function (argument) {
                this.value = `${this.message_text}\n`;
            },
            sendQuickReply : function (argument) {
                this.sendText(argument || event.target.innerText,this.isShowMediaOptions ?   this.selectedMedia : null);
            },
            sendQuickAction : function (argument) {
                this.sendText(null, null, argument);
            },
            closSession :  function () {
                this.sendText("/exit_chat");
                this.$router.push("/app/chat")
            },
            showContactProfile : function (type) {
                if(typeof type !='string'){
                    type = "info";
                }
                if(MyFlags.agent.profileView == type){
                    MyFlags.agent.showProfile = !MyFlags.agent.showProfile
                } else {
                    MyFlags.agent.profileView = type
                    MyFlags.agent.showProfile = true
                }
            },
            scrollToBottom : function (force) {
                if(!this.showChatWindow){
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
            async setQuickReplies(){
                this.refreshActiveChats();
                var activeChat = this.activeChat;
                if(!activeChat){
                    return;
                }
                var ilastmsg = activeChat.ilastmsg;
                if(!ilastmsg){
                    return;
                }
                if(this.ilastMessageId == ilastmsg.messageId){
                    return;
                }
                this.ilastMessageId = ilastmsg.messageId;
                var quickReplies = await this.$store.dispatch('LoadQuickReplies',ilastmsg.tags);
                this.quickReplies = quickReplies.map(function (quickReply) {
                    if(quickReply.template){
                        quickReply._message = mustache.render(quickReply.template, { 
                            contact : activeChat.contact
                        });
                    } else {
                        quickReply._message = quickReply.message || quickReply.title;
                    }
                    return quickReply
                });
                this.scrollToBottom(true);
            },
            async loadChats(){
                await this.$store.dispatch('GetChats');
                await this.$store.dispatch('LoadAgentOptions');
                this.loadArchiveMessages();
            },
            loadActiveChat (argument) {
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
                    return;
                }
                if( activeChat._tab){
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

            showWinMode : function (argument) {
                if(this.winMode === argument){
                    this.winMode = null;
                } else {
                    this.winMode = argument;
                    this.isShowMediaOptions =  true
                }
            },
            async dragEnter (argument) {
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
            async fileUploaded(argument,resp) {
                console.log("fileUploaded",resp)
                if(resp){
                    this.$store.dispatch("ReadChat",resp.results[0]);                  
                }
            },
            async fileUploadedAll(argument){

            }

        },

    }


</script>
<style type="text/css" scoped>
    .chat-header-left{
        float: left;
    }
    .chat-header-right{
        float: right;
    }
    #action_menu_btn{
        color: white;
        cursor: pointer;
        font-size: 20px;
        line-height: 60px;
    }
    .action_menu{
        z-index: 1;
        position: absolute;
        padding: 15px 0;
        background-color: rgb(255 255 255);
        color: #060606;
        border-radius: 5px;
        top: 15px;
        right: 10px;
        border: solid 1px #d8d8d8;
      }
      .action_menu ul{
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .action_menu ul li{
        width: 100%;
        padding: 10px 15px;
        margin-bottom: 5px;
      }
      .action_menu ul li i{

      }
      .action_menu ul li:hover{
        cursor: pointer;
        background-color: rgba(0,0,0,0.2);
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
        width: 90%;
        margin: 0 auto;
        display: table;
        text-align:center;
        min-height : 25px;
    }

    .log_icon {
        color: red;
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
    .msg_cotainer_action {
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 10px;
        border-radius: 7px;
        background-color: #e2e2e2f2;
        padding: 4px;
        position: relative;
        font-size: 10px;
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
    .chat-bubble .my-msg-template-tag  {
        font-size: smaller;
        color: #00000085;
    }
    .prepend-comma+.prepend-comma:before {
        content: ",";
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

</style>
<style type="text/css">
  .user_info .user_assignment .vs__selected {
    font-size: 13px !important;
    color: rgb(255 255 255);
    background: transparent;
    border: none;
  }
  .user_assignment .vs__dropdown-toggle {
    border : none;
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
</style>
