<template>
          <div class="card card-shadow m-chatbox scheme-color"
            @dragenter="dragEnter" 
            @dragover="dragEnter" 
            @dragleave="dragLeave"
            @mouseleave="dragLeave"
            @paste="onpaste"
            :id="chatsVersionGlobal"
            v-touch:swipe.right="onSwipeRight"
            v-touch:swipe.left="onSwipeLeft"
        >
                <ChatHeaderPlug
                    :showContactProfile="showContactProfile"
                    :activeChat="activeChat"
                    :chatLocal="chatLocal"
                    :agentOptions="agentOptions"
                    :onAssignedToAgent="onAssignedToAgent"
                    :isActionable="isActionable"
                    :assignedToAgent="chatLocal.agent"
                    :closSession="closSession"
                    ref="chatHeader"
                    :plug="plug"
                    v-if="plug"
                    hidden
                 />

                <ChatHeader
                    :showContactProfile="showContactProfile"
                    :activeChat="activeChat"
                    :chatLocal="chatLocal"
                    :agentOptions="agentOptions"
                    :onAssignedToAgent="onAssignedToAgent"
                    :isActionable="isActionable"
                    :assignedToAgent="chatLocal.agent"
                    :closSession="closSession"
                    ref="chatHeader"
                    v-else
                 />
                 

                <div class="card-body msg_card_body" v-show="is_CHAT_BOX">

                    <div class="msg_card_body-bubbles">

        <loading :active.sync="isLoading" 
        :can-cancel="false"  
        :loader="'dots'" :opacity="0.3"
        :is-full-page="false"></loading>

<div v-if="!activeChat" class="msg_card_body-logo">
    <span class="" :style="{'background-image': `url(${$config.PROP_LOGO_BG_X_LOGO})`}"></span>
</div>
<div v-else-if="activeChat">

    <div v-if="activeChat.contact" class="msg_card_body-bubbles-header"> 
        <pre hidden>
            is_SEND_NEW:{{is_SEND_NEW}}
            > {{activeChat.contact.sessionId}} == {{$route.params.sessionId}}
            > open:{{chatLocal.open}} closed:{{chatLocal.closed}} active:{{chatLocal.active}}
            > expired:{{chatLocal.expired}} live:{{chatLocal.live}}
            > {{activeChat}}
        </pre>
        <div class="msg_card_body-bubbles-lane">
            <div>   
                <small class="text-xs">Channel</small>
                <span class="chat-channel-code">
                     <MyText options="getx:/api/options/channels"
                        v-model="chatLocal.channelId"
                        optionLabel="channelCode" :invalidDisplay="chatLocal.lane"
                        :emptyDisplay="chatLocal.lane" />
                </span>
            </div>
            <i class="contact_type fac-bg" v-bind:class="MyDict.socialPrefix(activeChat.contactType)"></i>            
            <span class="text-align-left">&nbsp;{{activeChat.contact.lane}}</span>
            <div v-if="activeChat.subject"
                class="text-align-left text-darkish font-weight-bold"><i class="far fa-bookmark"/>&nbsp;{{activeChat.subject}}</div>
        </div>
        <hr/>
    </div>  
    <div v-if="is_SEND_NEW" class="text-center">
         <span v-if="!chatLocal.isModeAgent || !chatLocal.isAssignedToMe">
            <span class="fa fa-5x text-white-dirty"
                :class="{
                    'fa-user-secret' : chatLocal.isModeAgent,
                    'fa-robot' : chatLocal.isModeBot,
                    'openwebicons-webhooks' : !(chatLocal.isModeBot || chatLocal.isModeAgent)
                }" />
            <br/>
                <small>This conversation is ACTIVE and in {{activeChat.mode}} Mode</small>
            <br/>
            <span class="msg_cotainer_smart" @click="$router.push({ 
                    name : 'agentAction',
                    params: { mvu: 'COMPOSE', app : $route.params.app, contact : activeChat.contact } })"
                @click.prevent v-tooltip="'Send New Message'"> 
                Compose new Message
            </span>
         </span>
        <span v-else>
            <span class="fa fa-hourglass-end fa-5x text-white-dirty" />
            <br/>
                <small> Any additional message you send to the customer beyond the Customer Care Window must be a Templated Message,</small>
            <br/>
            <ForEachOption options="getx:/api/options/tmpl/hsm" 
                    :filter="{ 'meta.agentAllowed' : true }"> 
                <template #data={option}>
                    <span  @click="sendNewMessage(option.item)" class="msg_cotainer_smart">
                        {{option.item.desc}} ({{option.item.lang}})
                    </span>
                </template>
            </ForEachOption>
        </span>
    </div> 
    <ChatMessages v-else
        :activeChat="activeChat"
        v-show="is_CHAT_BOX"
    />

</div>
                    </div>


                    <div v-if="isActionable && chatLocal.active" class="msg_card_body-panel">
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
                                    <span class="msg_cotainer_smart" @click="activeChat.assignedToAgent && closSession()"
                                        v-tooltip="'End Chat'" 
                                        v-bind:class="{'my-disbaled' : !activeChat.assignedToAgent}">
                                        <i class="fa fa-check-circle" ></i>
                                    </span>

                                     <span class="msg_cotainer_smart" v-b-modal.stickynote v-tooltip="'Add Sticky Note'" 
                                            v-bind:class="{'my-disbaled' : !activeChat.assignedToAgent}">
                                             <i class="fas fa-sticky-note"></i> 
                                    </span>
                                   
                                     <span class="msg_cotainer_smart" v-tooltip="'Push HSM'" 
                                            v-bind:class="{
                                                'my-disbaled' : !activeChat.assignedToAgent,
                                                'btn-active'  : is_SEND_NEW
                                            }"
                                            @click="showPushNewHSM()" >
                                             <i class="fa fa-comment-medical"></i> 
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
                                <span v-for="(quickReply, index) in quickReplies" 
                                    v-if="(index >= countQuickReplies)"
                                    v-bind:key="index"
                                @click="sendQuickReply(quickReply._message)" v-tooltip="quickReply._message"
                                class="msg_cotainer_smart">  {{quickReply.title}}</span>
                             <hr/>
                        </slide-up-down>
                    </div>


                </div>
                <div v-show="is_QUICK_MEDIA" class="card-body media_card_body" >
                    <div class="media_card_body-bubbles">
                        <div class="media_card_body-bubbles-wrapper">
                            <div v-for="media in mediaOptions" v-bind:key="media.id"
                                class="media_thumb"  @dblclick="sendQuickMedia(media)">
                                    <input :id="'mdeia-'+media.name" type="radio" name="media" :value="media" v-model="selectedMedia" />
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
                <div v-show="is_RECORD_AUDIO" class="card-body upload_card_body">
                    <av-media class="av-media" type="frequ" :media="media" line-color="white"
                        frequ-direction="mo"
                    :frequ-lnum="60"/>
                    <div class="button-wrapper">

                        <b-button 
                            class="btn-sm text-white:hover" variant="outline-white-dirty" pill
                            @click="onCancelRecording"> 
                            Cancel
                        </b-button>
                        <b-button 
                            class="btn-sm text-white:hover" variant="outline-white-dirty" pill
                            @click="onSendRecording"> 
                            Stop and Send
                        </b-button>
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
                    <div class="caption_text_wrapper">
                        <span>
                            <textarea class="caption_text" ref="caption_text" 
                                    v-model="caption_text" 
                                    placeholder="Enter Media Caption"
                                    autocomplete="off"
                                    @keydown.enter.exact.prevent
                                    @keyup.enter.exact="onSendMessage"
                                    @keydown.enter.shift.exact="newline"
                                    @input="onInputType"
                                    rows="1"
                             >
                            </textarea>
                        </span>
                    </div>
                </div>
                

                <div class="card-footer">
                    <slide-up-down :active="is_QUICK_ACTIONS && isActionable" :duration="200" class="action-events">
                            <span v-if="quickActions" v-for="quickAction in quickActions" v-bind:key="'qa-'+quickAction.action"
                             @click="sendQuickAction(quickAction.action)"
                            class="msg_cotainer_smart">  {{quickAction.title}}</span>
                         <hr/>
                    </slide-up-down>

                    <!-- If chat is ACTIVE -->
                    <div v-if="chatLocal.active && chatLocal.isModeAgent"> 
                        <!-- If chat is NOT Actionable -->
                        <div  v-if="isActionable" class="input-group my-input-section" 
                            v-bind:class="{ invisible : !isActionable}"> 
                                <div class="input-group-prepend">
                                    <span
                                    @click="toggleView('QUICK_MEDIA')"  v-tooltip="'Select Quick Media'"
                                    :class="{
                                        'btn-active' : is_QUICK_MEDIA
                                    }"
                                    class="input-group-text input-group-text-left attach_btn"><i class="fa fa fa-photo-video"></i></span>
                                    <span 
                                    @click="toggleView('QUICK_ACTIONS')" v-tooltip="'Trigger Quick Action'"
                                    :class="{
                                        'btn-active' : is_QUICK_ACTIONS
                                    }"
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
                                    <span @click="onSendMessage" v-if="is_TEXT_ENTER_REQUIRED"
                                        v-tooltip="'Send'" 
                                        class="input-group-text send_btn">
                                        <i class="fa fa-location-arrow"></i></span>
                                    <span @click="openAudioRecord" v-if="!is_TEXT_ENTER_REQUIRED"
                                        v-tooltip="'Send Voice Message'"
                                        class="input-group-text attach_btn">
                                        <i class="fa fa-microphone"></i></span>

                                    <span v-tooltip="'Select Emoji'"
                                        class="input-group-text attach_btn input-group-text">
                                        <EmojiIcon :on-emoji-picked="_handleEmojiPicked" color="#FFF" />
                                    </span>

                                    <span @click="openFileUpload" v-tooltip="'Select File to upload'"
                                        class="input-group-text attach_btn input-group-text-right">
                                        <i class="fa fa-paperclip"></i></span>
                                </div>
                                
                        </div>
                        <!-- If chat is NOT Actionable -->
                        <div v-else class="control-panel text-center"> 
                                <!--   Contorl Box-->
                                <b-button v-if="isAssignedToMe" 
                                    class="btn-sm text-white:hover" variant="outline-white-dirty" pill
                                    @click="goToChat()"> 
                                    Send New Message
                                </b-button>
                                
                                <b-button 
                                    class="btn btn-sm text-white:hover" variant="outline-white-dirty" pill
                                        v-b-modal.stickynote v-tooltip="'Add Sticky Note'">
                                                <i class="fas fa-sticky-note"></i> 
                                </b-button>
                        </div>
                    </div>
                    <!-- If chat is NOT ACTIVE -->
                    <div v-else> 
                        <div v-if="!is_SEND_NEW && $config.SETUP.POSTMAN_AGENT_CHAT_INIT" 
                                class="control-panel text-center">
                                <b-button pill variant="outline-white-dirty" class="btn-sm text-white:hover"
                                @click="initNewMessage(true,'click:Send New Message')"> 
                                  Send Message
                                </b-button>
                        </div> 
                         <div v-else-if="is_SEND_NEW" class="control-panel text-center"> 
                            <b-button 
                                class="btn-sm text-white:hover" variant="outline-white-dirty" pill
                                @click="goToBack()"> 
                                Cancel
                            </b-button>
                        </div>
                    </div>    
 
                </div>

              <b-modal id="stickynote" ref="stickynote" title="Add Sticky Note"
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
    import { MyFlags,MyDict,MyConst,MyFunc } from './../../services/global';
    import formatters from './../../services/formatters';
    import Loading from 'vue-loading-overlay';
    import tunnel from './../../services/tunnel';
    import mustache from 'mustache';
    import SlideUpDown from 'vue-slide-up-down';
    import ForEachOption from '@/@common/custom/components/ForEachOption.vue';

    import vue2Dropzone from 'vue2-dropzone'
    import 'vue2-dropzone/dist/vue2Dropzone.min.css'

    import debounce from 'debounce';
    import throttle from 'throttleit';
    import pebounce from 'pebounce';


    import { Textcomplete } from "@textcomplete/core";
    import { TextareaEditor } from "@textcomplete/textarea";

    import ChatMessages from "./ChatMessages";

    import getUserMedia from "get-user-media-promise";
    import AudioVisual from 'vue-audio-visual'
    import ChatHeader from './ChatHeader.vue';
    import ChatHeaderPlug from './ChatHeaderPlug.vue';
    import EmojiIcon from '@/@common/webchat/icons/EmojiIcon.vue'

    Vue.use(AudioVisual);

    var sampleJson = {
        contact : {
          name : "John Doe", phone : "919876543210", email : "John.Doe@company.com"
        }
    };
    var sampleJsonKeys = formatters.keys(sampleJson);

    export default {
        props: {
            plug: Boolean,
        },
        components: {
    Loading: Loading,
    SlideUpDown,
    vueDropzone: vue2Dropzone,
    ChatMessages,
    ForEachOption,
    getUserMedia,
    ChatHeader,
    ChatHeaderPlug,
    EmojiIcon
},
        computed : {
            chatLocal: function () {
                return (this.activeChat ? this.activeChat.local : null) || {};
            },
            inputTextEnabled : function () {
               return !!this.$route.params.contactId && this.chatLocal.active;
            },
            isActionable : function () {
               return (!!this.$route.params.contactId && this.chatLocal.active)
               && (this.$route.params.profileId == this.$route.params.contactId)
               && ((this.activeChat.assignedToAgent == MyConst.agent) || !this.activeChat.assignedToAgent)
               && this.chatLocal.open && this.chatLocal.isModeAgent;
            },
            isAssignedToMe : function () {
               return ((this.activeChat.assignedToAgent == MyConst.agent) || !this.activeChat.assignedToAgent);
            },
            agentOptions : function(){ 
                return [...this.$store.getters.StateAgentOptions,
                        ...this.$store.getters.StateApi.OptionsAgentTeams || []];
            },
            mediaOptions : function(){ 
                //console.log("mediaOptions=",this.$store.getters.StateMediaOptions)
                return this.$store.getters.StateMediaOptions;
            },
            quickActions : function(){ 
                //console.log("quickActions=",this.$store.getters.StateQuickActions)
                return this.$store.getters.StateQuickActions;
            },
            //STATES based in user selection
            is_CHAT_BOX : function () {
                return (this.winMode === null) || this.winMode == "CHAT_BOX" || this.winMode == "QUICK_ACTIONS";
            },
            is_QUICK_MEDIA : function () {
                return this.winMode == "QUICK_MEDIA"
            },
            is_QUICK_ACTIONS : function () {
                return this.winMode == "QUICK_ACTIONS"
            },
            is_UPLOAD_MEDIA : function () {
                return this.winMode == "UPLOAD_MEDIA"
            },
            is_RECORD_AUDIO : function () {
                return this.winMode == "RECORD_AUDIO"
            },
            is_SEND_NEW : function () {
                return (!this.activeChat?.contact?.sessionId ||
                    (this.activeChat?.contact?.sessionId == this.$route.params.sessionId))
                    && this.isSendNewMessage;
            },
            is_TEXT_ENTER_REQUIRED : function(){
                return !!this.message_text || this.is_QUICK_MEDIA || this.is_UPLOAD_MEDIA;
            },
            chatsVersionGlobal : function(){
                return this.$store.getters.StateChatsVersion;
            },
        },
        data: () => ({
            message_text : "",quickReplies : null,sticky_note : null, caption_text : null,
            selectedMedia : null,
            lastMessageId : null,ilastMessageId :  null,
            MyDict,MyFlags,MyConst, MyFunc,
            isLoading : false,
            is : {
                QUICK_ACTIONS  : false,
                QUICK_MEDIA :  false
            },
            showQuickReplies : false, countQuickReplies : 3,
            showAgentOption : false,
            assignedToAgent : { code : null },
            activeChat : {
                local : {
                    active : false,
                    expired : false,
                    agent : { }
                }
            },
            chatsVersionLocal : 0,
            isSendNewMessage : false,
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
            }],
            media: null,
            mediaRecorder : null
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
            this.tunnel = this.$tunnel.pipe()
            .on("/agent/onmessage", function(msg){
                if(msg.sessionId == THAT.$route.params.sessionId)
                    THAT.scrollToBottom(true);
            }).on("/chat/session/delta", function(data){
                if(THAT.activeChat.sessionId == data.sessionId
                    && (THAT.activeChat._tab == "ORG" || THAT.activeChat.local.tab == "ORG")){
                    THAT.loadCurrentession();
                } else {
                    THAT.refreshActiveChat();
                }
            })

            this.refreshActiveChat = debounce(this.refreshActiveChat,1000);

            this.refreshActiveChatInterval = setInterval(()=>this.refreshActiveChat,10000);

            // const editor = new TextareaEditor(this.$refs.message_text);
            // this.textcomplete = new Textcomplete(editor,this.strategies, {
            //     dropdown :  { 
            //         placement: "top" 
            //     }
            // })
        },
        beforeUnmount (){
            this.tunnel.off();
            clearInterval(this.refreshActiveChatInterval);
            //this.textcomplete.destroy()
        },
        watch: {
            '$route.params.contactId': function (contactId) {
                this.scrollToBottom();
                this.loadQuickReplies();
                this.onSessionChange();
            },
            '$route.params.sessionId': function (sessionId) {
                //this.loadChat();
                console.log("$route.params.sessionId",sessionId)
                this.onSessionChange();
                this.toggleView("CHAT_BOX");
                this.isSendNewMessage = false;
                //this.initNewMessage(undefined, 'watch:$route.params.sessionId');
            },
            '$store.getters.StateChatsVersion' : function(){
                this.refreshActiveChat(true);
                //this.$forceUpdate();
            }
        },
        methods: {
            prepareMessage : function (text,media,action,empty,_options) {
                let options = _options || {};
                var activeChat = this.activeChat;
                if(!activeChat){
                    return;
                }
                if(!text && !media && !action && !empty){
                    return;
                }
                var sessionId = activeChat.sessionId;
                //this.scrollToBottom();
                var msg = {
                    message : text, timestamp : new Date().getTime(),
                    sender : MyConst.agent, name : MyConst.agent,
                    messageId : "",sessionId : sessionId,
                    subject : options.subject,
                    caption : options.caption,
                    attachments : media ? [{
                        mediaType : media.type,
                        mediaId : media.id,
                        mediaURL : media.url,
                        mediaCaption : media.title,
                    }] : undefined,
                    action : action, type : (action ? "A" : "O")
                };
                return msg;
            },
            async sendText(text,media, action){
                this.showQuickReplies = false;
                this.selectedMedia = null;

                console.log("sendText:text",text);
                if(this.winMode == "UPLOAD_MEDIA" && this.$refs.myVueDropzone.getQueuedFiles().length > 0){
                    //this.caption_text = text;
                    console.log("sendText:caption_text",this.caption_text);
                    await this.$refs.myVueDropzone.processQueue();
                    //text =  this.caption_text;
                } 

                var msg = this.prepareMessage(text,media, action);
                if(!msg){
                    console.log("I Return")
                    return;
                }
                //activeChat.messages.push(msg);
                this.toggleView("CHAT_BOX");
                this.scrollToBottom();
                let resp;
                try {
                    console.log("beforeSendcta")
                    resp = await this.$store.dispatch('SendChat', msg);
                    console.log("resp",resp)
                    // msg.messageId = resp.results[0].messageId;
                } catch(e){
                    console.error(e)
                    msg.logs = ["Error While Sending"];
                }
                this.toggleView("CHAT_BOX");
                this.scrollToBottom(true);
                return resp;
            },
            onSendMessage :  function () {
                this.sendText(this.message_text,this.is_QUICK_MEDIA ?   this.selectedMedia : null);
                this.message_text = "";
            }, newline : function (argument) {
                console.log("Do NOTHING")
                //this.message_text = `${this.message_text}\n`;
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
            async sendNewMessage(option){
                var msg = this.prepareMessage(null,null, null, true);
                msg.templateId = option.id;
                let resp = await this.$store.dispatch('SendChat', msg);
                console.log("sendNewMessageResp",resp);
                this.isSendNewMessage = false;
                this.toggleView("CHAT_BOX");
                this.scrollToBottom(true);
                this.$router.push({
                    name: 'defAgentView', 
                        params: { 
                            sessionId : resp.results[0].sessionId,
                            profileId : this.$route.params.contactId,
                            sendNewMessage : false
                        } 
                }).catch(err => { console.error("Already ON Same Path") });
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
            async initNewMessage(init,track){
                console.log("initNewMessage", init,track,this.activeChat);
                if(!this.activeChat || !this.activeChat.contactId){
                    return this.composeNewMessage();
                } 
                try {
                    let resp = await this.$service.get('/api/session/compose',{
                        contactId : this.activeChat.contactId
                    },{ toast : false, metaType : 'contact', dataType : 'session'});
                    if(resp.results[0] && resp.results[0].local.live){
                        this.$router.push({
                            name: 'defAgentViewLong', 
                                params: { 
                                    sessionId : resp.results[0].sessionId,
                                    profileId : resp.results[0].contactId,
                                    mash : "PUSH_HSM"+Date.now()
                                }
                        }); 
                    } else if(resp.meta) {
                        this.composeNewMessage(resp.meta)
                    }
                } catch(e){
                    this.composeNewMessage(this.activeChat.contact);
                }
            },
            composeNewMessage(contact){
                this.$router.push({ 
                    name : 'agentAction',
                    params: { 
                        mvu: 'COMPOSE', 
                        app : this.$route.params.app,
                        contact : contact
                    }
                }); 
            },
            async goToChat(){
                this.composeNewMessage(this.activeChat.contact);
            },
            showPushNewHSM(){
                console.log("showPushNewHSM:is_SEND_NEW",this.is_SEND_NEW)
                if(this.is_SEND_NEW){
                    this.goToBack();
                    this.scrollToBottom(true);
                } else {
                    this.isSendNewMessage = true;
                    this.scrollToBottom(true);
                    //this.initNewMessage(true,'showPushNewHSM');
                }
            },
            goToBack(){
                this.initNewMessage(false,'goToBack');
                this.isSendNewMessage = false;
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
                this.refreshActiveChat();
                var activeChat = this.activeChat;
                if(!activeChat){
                    return;
                }

               //this.calcQuickReplies();
                var categories = [];
                var ilastmsg = activeChat?.msg?.lastInBoundMsg;
                if(ilastmsg && ilastmsg.tags){
                    categories = ilastmsg.tags.categories;
                } else if(!force || !ilastmsg){
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
            async loadSession(options){
                let chat = await this.$store.dispatch('GetSessionChats',options);
                //this.activeChat = chat;
                this.activeChat = this.selectActiveChat();
                return chat;
            },
            loadCurrentession : pebounce(async function(){
                if(this.$route.params.sessionId){
                    return await this.loadSession({
                        contactId : this.$route.params.contactId,
                        sessionId : this.$route.params.sessionId
                    });
                }
                return null;
            },100),
            onSessionChange : debounce(async function(){
                this.activeChat = this.selectActiveChat();

                if(this.activeChat == null && this.$route.params.contactId){
                    await this.loadCurrentession();
                    this.loadArchiveMessages(false);
                } else {
                    this.loadArchiveMessages(true);
                }
                this.$refs.chatHeader && typeof this.$refs.chatHeader.defaultSelectedStatusTag == "function"  ? this.$refs.chatHeader?.defaultSelectedStatusTag() : "";
            },200),
            async loadChats(){
                await this.$service.getX('/api/options/agent_teams');
                await this.$store.dispatch('GetChats');
                await this.$store.dispatch('LoadAgentOptions');
                this.onSessionChange();
            },
            selectActiveChat () {
                for(var i in this.$store.getters.StateChats){
                    var chat = this.$store.getters.StateChats[i];
                    if(this.$route.params.sessionId == chat.sessionId){
                        return chat;
                    }
                }

                if(this.activeChat && (this.$route.params.sessionId == this.activeChat.sessionId)){
                    return this.activeChat;
                }

                if(this.$store.getters.StateChatHistory){
                    for(var i in this.$store.getters.StateChatHistory){
                        var chat = this.$store.getters.StateChatHistory[i];
                        if(this.$route.params.sessionId == chat.sessionId){
                            return chat;
                        }
                    }
                } 
                if(this.$route.params.sessionId){
                    //console.error("No Session",this.$route.params.sessionId)
                    this.loadCurrentession();
                }
                return null;
            },
            refreshActiveChat(force){
                let stamp = Date.now()-5000;
                let needRefresh = (this.activeChat?.snapshot < stamp)
                    || (this.activeChat?.snapshot < this.activeChat?.local?.updatedStamp);
                if(this.chatsVersionLocal != this.chatsVersionGlobal || force
                    || needRefresh){
                    this.activeChat = this.selectActiveChat();
                    this.chatsVersionLocal = this.$store.getters.StateChatsVersion;
                    if(!this.activeChat || !this.activeChat.messages || !this.activeChat.messages.length
                    || needRefresh){
                        this.loadCurrentession();
                    }
                }
                return this.activeChat
            },
            async loadArchiveMessages(forceLoad){
                this.refreshActiveChat(true);
                var activeChat = this.activeChat;
                let chatLocal = this.chatLocal;
                if(!activeChat || !this.activeChat.sessionId){
                     MyFlags.agent.showProfileAllowed = false;
                    return;
                }
                MyFlags.agent.showProfileAllowed = true;
                
                // if( activeChat._tab && chatLocal.active
                //   //  && !this.$store.getters.SearchChat.text
                // ){
                //     console.log("Setting Tab to ",activeChat,activeChat.local.tab,activeChat.local.state)
                //     this.$store.commit('setContactTab',{ 
                //         tab : activeChat.local.tab,
                //         state : activeChat.local.state,
                //     });
                // }
                
                this.assignedToAgent = this.$store.getters.StateAgentOptions.filter(function (t) {
                    return t.code == activeChat.assignedToAgent;
                })[0] || { code : null};

                if(!activeChat.messages || forceLoad){
                    this.isLoading = (!activeChat.messages || !activeChat.messages.length);
                    var resp = await this.loadSession({
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
                var resp = await this.$service.submit('/api/session/agent',{
                    sessionId : this.activeChat.sessionId,
                    agentId : argument.dept_id ? argument.id : null,
                    agentCode :  argument.dept_id ? argument.code : null,
                    deptCode :  !argument.dept_id ? argument.code : null,
                    deptId :  !argument.dept_id ? argument.id : null,
                });
                this.$service.dispatch("AddChat",resp.results[0]);
                this.onSessionChange();
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

            _handleEmojiPicked(a){
                this.message_text = this.message_text + ' ' +  a;
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


            openAudioRecord : function () {
                let chunks = [];
                let _THAT = this;
                getUserMedia({ audio: true })
                    .then(function(stream) {
                        _THAT.winMode = "RECORD_AUDIO";
                        _THAT.media = stream;
                        const mime = "audio/webm;codecs=opus"
                        _THAT.mediaRecorder = new MediaRecorder(_THAT.media, {mimeType: mime});
                        _THAT.mediaRecorder.start();
                        _THAT.mediaRecorder.onstop = function(e) {
                            if(_THAT.uploadRecording){
                                let blob = new Blob(chunks, { 'type' : "audio/mpeg" });
                                _THAT.media.getTracks().forEach(track => track.stop());
                                chunks= [];
                                _THAT.mediaRecorder = null;
                                let reqObj = {
                                    message:_THAT.prepareMessage(null, null,null,true),
                                    file: blob,
                                    fileName:"Recording.mp3"
                                }
                                _THAT.$store.dispatch("SendFile",reqObj);                  
                                _THAT.winMode="CHAT_BOX";
                            } else {
                                _THAT.media.getTracks().forEach(track => track.stop());
                                chunks= [];
                                _THAT.mediaRecorder = null;
                                _THAT.winMode="CHAT_BOX";
                            }
                    
                        }
                        _THAT.mediaRecorder.ondataavailable = function(e) {
                            chunks.push(e.data);
                        }

                }).catch(function(error) {
                    Vue.$toast.error("Please enable Microphone");
                });
            },
            onSendRecording(){
                this.uploadRecording = true;
                this.mediaRecorder.stop();
            },
            onCancelRecording(){
                this.uploadRecording = false;
                this.mediaRecorder.stop(false);
            },
            //DZ options
            async fileAdded(argument) {
                 this.winMode = "UPLOAD_MEDIA";
                 //this.dz.file_dropped = true;
            },
            async fileUploading(file, xhr, formData) {
                var msg = this.prepareMessage(null,null,null,true,{
                    subject : null
                });
                this.$store.dispatch("SendChatPre",msg);
                console.log("fileUploading2",msg)
                formData.append('message', JSON.stringify(msg));
                if(this.caption_text)
                    formData.append("caption",this.caption_text);
                //this.caption_text = null;
            },
            async fileUploaded(file,resp) {
                if(resp){
                    this.$store.dispatch("ReadChatMessage",resp.results[0]);                  
                }
                this.$refs.myVueDropzone.removeFile(file);
            },
            async fileUploadedAll(e){
                this.toggleView("CHAT_BOX");
                this.caption_text = null;
            },
            onSwipeRight(){
                this.$router.push({
                        name: 'defAgentView', 
                        params: { 
                            mvu : 'CONTACTS'
                    }
                })
            },
            onSwipeLeft(){
                this.showContactProfile('info')
            }
            
        },

    }

</script>
<style type="text/css" scoped>

    .av-media{
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100% - 100px);
    }

    .button-wrapper{
        display: flex;
        height: 100px;
        justify-content: center;
        align-content: space-between;
    }
    .button-wrapper .btn-sm{
        width: 40%;
        margin: 0 10px;
        height: 50px;
        box-shadow: 0 1.5px 1.5px #00000052;
        background-color: #fff;
        color: #000;
        font-size: 18px;
        max-width: 200px;
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
    .msg_card_body-bubbles-header .chat-channel-code {
        margin: 2px 5px 0px 5px;
        border-radius: 3px;
        border-width: 1px;
        border-style: solid;
        padding: 1px 4px 1px 4px;
        font-size: 0.6em;
        text-align: center;
        background-color: #ffffff00;
        border-color: rgb(33, 33, 33);
        color: rgb(33, 33, 33);
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: uppercase;
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
    .msg_cotainer_smart.btn-active{
         background-color: rgb(0 0 0 / 70%);
         color: #FFF;
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
        height: calc(100% - 85px);
        background-color: #f5f5f5;
        overflow-y: auto;
    }
    .upload_card_body-bubbles .dropzone{
        min-height: calc(100% - 0px);
    }

    .card-footer .control-panel {
        color: #FFF;
        display: flex;
        align-content: stretch;
        flex-wrap: nowrap;
        flex-direction: row;
        justify-content: center;
        align-items: center;

    }
    .card-footer .control-panel>* {
        margin: auto 2px;
    }
    .action-events hr {
        border: 0;
        border-top: 1px solid #ffffff61;
        margin: 10px 0;
    }
    .quick-replies-more {
        text-align: center;
    }


    .my-input-section .input-group-text:hover {
        background-color: #00000069!important;
    }
    .my-input-section .input-group-text.btn-active {
        background-color: #00000094!important;
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
    .caption_text_wrapper {
        background-color: rgb(255, 255, 255) !important;
        height: 50px;
        text-align: center;
        padding: 3px;
    }
    .caption_text_wrapper span {
       background-color: rgba(0, 0, 0, 0.447) !important;
       padding: 5px 15px;
       border-radius: 15px 15px 15px 15px !important;
        width: 80%;
        display: inline-block;
        max-height: 44px;
    }
    .caption_text {
      background-color: rgba(0, 0, 0, 0) !important;
      border:0 !important; outline: 0;
      color:rgb(255, 255, 255) !important;
      font-size: 12px; line-height: 13px;
      min-height: 25px;
      max-height: 38px;
      width: 100%;
      overflow-y: auto;
      resize: none;
    }
    .caption_text::placeholder{
      color:rgba(255, 255, 255, 0.68) !important;
      font-size: 15px;
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
    .cat-title{
        font-size: 10px;
    }
    #chattags hr{
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
    }
</style>
<style type="text/css">
    .av-media canvas{
        max-height: 200px;
        height: 100%;
    }
</style>
