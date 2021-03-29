<template>
          <div class="card card-shadow">
                <div class="card-header msg_head chat-head">
                    <div class="d-flex bd-highlight chat-header-left">
                        <div class="img_cont" 
                            v-if="activeChat"
                            @click="MyFlags.showContactProfile = !MyFlags.showContactProfile">
                            <img :src="activeChat.profilePic || MyDict.profilePic" class="rounded-circle user_img">
                            <span class="online_icon" hidden></span>
                        </div>
                        <div class="user_info"
                            v-if="activeChat"
                            @click="MyFlags.showContactProfile = !MyFlags.showContactProfile">
                            <span class="user_name">{{activeChat.name}}</span>
                            <p v-if="activeChat.ilastmsg" class="user_text">{{activeChat.ilastmsg.timestamp | formatDate}} </p>
                        </div>
                        <div class="video_cam">
                            <span hidden><i class="fas fa-video" ></i></span>
                            <span hidden><i class="fas fa-phone" ></i></span>
                            <span  hidden  @click="MyFlags.showContactProfile = !MyFlags.showContactProfile" >
                                <i class="fas fa-history"></i>
                            </span> 
                        </div>
                        <div class="chat_actions" hidden>
                            <button  @click="closSession" title="Close Chat"
                            class="btn"><i class="fa fa-check-circle"></i></button>                            
                        </div>
                    </div>
                    <div  class="chat-header-right">
                        <div class="video_cam">
                            <span  @click="MyFlags.showContactProfile = !MyFlags.showContactProfile" v-tooltip="'Show Chat History'" >
                                <i class="fa fa-history"></i>
                            </span> 
                        </div>
                    </div>
                    <div  class="chat-header-right"  @mouseover="showChatOptions = true"
                            @mouseleave="showChatOptions = false">
                        <span id="action_menu_btn"> <i class="fas fa-user-clock" hidden></i></span>
                        <div class="action_menu" v-show="showChatOptions">
                            <ul style="padding-top: 10px">
                                <li @click="MyFlags.showContactProfile = !MyFlags.showContactProfile">
                                    <i class="fas fa-history"></i> Chat Hisotry</li>
                                <li @click="closSession"><i class="fa fa-check-circle"></i> Resolve Ticket</li>
                            </ul>
                        </div>  
                    </div>
                </div>
                <div class="card-body msg_card_body" v-show="!showMediaOptions">

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
            <span>{{m.text | striphtml | newlines}}</span>
            <div v-if="m.attachments"> <span class="fa fa-paperclip"></span>&nbsp;{{m.template}} 
                <div class="input-group my-attachments">
                    <img v-for="atch in m.attachments" :src="atch.mediaURL | thumburl" class="">
                </div>
            </div>
            <div v-else-if="m.template" class="my-msg-template-tag">
                <span class="fa fa-tag"></span>&nbsp;{{m.template}}
            </div>
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
                    <div v-if="activeChat && activeChat.active" class="msg_card_body-panel">
                        <hr/>
                        <div class="msg_card_body-panel-tags">
                            <span v-if="quickReplies" v-for="quickReply in quickReplies" 
                            @click="sendQuickReply(quickReply._message)" v-tooltip="quickReply._message"
                            class="msg_cotainer_smart">  {{quickReply.title}}</span>

                            <span v-if="quickReplies && quickReplies.length>0" class="divider-v" ></span>

                            <span class="msg_cotainer_smart" @click="closSession" v-tooltip="'End Chat'">
                                <i class="fa fa-check-circle" ></i>
                            </span>                        

                        </div>
                    </div>
                </div>
                <div v-show="showMediaOptions" class="card-body media_card_body" >
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


                <div class="card-footer">

                    <slide-up-down :active="showQuickActions" :duration="200" class="action-events">
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
                            @click="showMediaOptions=!showMediaOptions"
                            class="input-group-text input-group-text-left attach_btn"><i class="fa fa-paperclip"></i></span>
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
    import { MyFlags,MyDict,MyConst } from './../global';
    import Loading from 'vue-loading-overlay';
    import tunnel from './../../services/tunnel';
    import mustache from 'mustache';
    import SlideUpDown from 'vue-slide-up-down'

    export default {
        components: {
            'font-awesome-icon': FontAwesomeIcon,
            Loading: Loading,SlideUpDown
        },
        computed : {
            inputTextEnabled : function (argument) {
               return !!this.$route.params.contactId && !!this.activeChat && this.activeChat.active;
            },
            sendEnabled : function (argument) {
               return !!this.$route.params.contactId && !!this.activeChat && this.activeChat.active;
            },
            activeChat : function(){ 
                console.log("id",this.$route.params.contactId,this.$route.params.sessionId); 
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
            mediaOptions : function(){ 
                console.log("mediaOptions=",this.$store.getters.StateMediaOptions)
                return this.$store.getters.StateMediaOptions;
            },
            quickActions : function(){ 
                console.log("quickActions=",this.$store.getters.StateQuickActions)
                return this.$store.getters.StateQuickActions;
            },
        },
        data: () => ({
            message_text : "",quickReplies : null,
            selectedMedia : null,
            showMediaOptions : false,
            showChatOptions : false,
            lastMessageId : null,ilastMessageId :  null,
            MyDict,MyFlags,MyConst,
            isLoading : false,
            showQuickActions : false
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
            this.loadQuickReplies();
        },
        mounted (){
            this.scrollToBottom();
            this.loadQuickReplies();

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
                this.loadMessages();
            }
        },
        methods: {
            async sendText(text,template, action){
                var activeChat = this.activeChat;
                if(!activeChat){
                    return;
                }
                if(!text && !template && !action){
                    return;
                }
                var sessionId = activeChat.sessionId;
                //this.scrollToBottom();
                var msg = {
                    text : text, type :  true, timestamp : new Date().getTime(),
                    sender : MyConst.agent,name : MyConst.agent,
                    messageId : "",sessionId : sessionId,
                    template : template,
                    action : action
                };
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
                this.scrollToBottom(true);
            },
            onSendMessage :  function () {
                this.sendText(this.message_text,this.showMediaOptions ?   this.selectedMedia : null);
                this.message_text = "";
                this.showMediaOptions = false;
            }, newline : function (argument) {
                this.value = `${this.message_text}\n`;
            },
            sendQuickReply : function (argument) {
                this.sendText(argument || event.target.innerText,this.showMediaOptions ?   this.selectedMedia : null);
            },
            sendQuickAction : function (argument) {
                this.sendText(null, null, argument);
            },
            closSession :  function () {
                this.sendText("/exit_chat");
                this.$router.push("/app/chat")
            },
            scrollToBottom : function (force) {
                var activeChat = this.activeChat;
                if(!activeChat){
                    return;
                }
                console.log("scrollToBottom...",force)
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
                        console.log("updating",mcb.scrollTop, mcb.scrollHeight);
                        mcb.scrollTop =  mcb.scrollHeight+50;
                    }
                });
                 console.log("scrolledToBottom",force)
            },
            async loadMediaOptions(){
                await this.$store.dispatch('LoadMediaOptions')
            },
            async loadQuickActions(){
                return await this.$store.dispatch('LoadQuickActions');
            },
            async loadQuickReplies(){
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
            async loadMessages(){
                console.log("loadMessages...")
                var activeChat = this.activeChat;
                if(!activeChat){
                    return;
                }

                if(!activeChat.messages && !activeChat.active){
                    console.log("GetSessionChats...");
                    this.isLoading = true;
                    var resp = await this.$store.dispatch('GetSessionChats',{
                        contactId : this.activeChat.contactId,
                        sessionId : this.activeChat.sessionId,
                        contactType : this.activeChat.contactType,
                        name : this.activeChat.name
                    });
                    console.log("resp",resp)
                    activeChat.messages = resp;
                     this.isLoading = false;
                }
                this.scrollToBottom(true);
            },
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
    .divider-v {
        padding-left: 2px;
     padding-right: 4px;
    }
    .divider-v:after{
        content: " ";
        border-right: solid 1px #00000066;
    }
    .msg_cotainer_smart{
        margin-top: auto;
        margin-bottom: auto;
        margin-left: 3px;
        margin-top: 2px;
        border-radius: 8px;
        background-color: #FFF;
        color: #7b7575;
        padding: 6px;
        position: relative;
        font-size: 14px;
        border: 1px solid #4b56c0d1;
        cursor : pointer;
        display: inline;
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
</style>
