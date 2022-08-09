<template>
  <div>
    <web-chat-launcher
      v-if="isConfigSet"
      :participants="participants"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :open="openChat"
      :showEmoji="true"
      :showHeader="!config.header.disabled"
      :showFile="true"
      :showMic="true"
      :showTypingIndicator="showTypingIndicator"
      :showLauncher="!config.launcher.disabled"
      :showCloseButton="true"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :disableUserListToggle="false"
      :messageStyling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage"
      :launcherPosition="config.launcher.position"
      >

      <template v-slot:header>
        <img v-if="config.header.icon.url" class="sc-header--img" :src="config.header.icon.url" alt="" 
          style="width:34px;height:34px ;" />
        <div class="sc-header--title">{{ config.header.title.text }}</div>
      </template>


      <template v-slot:text-message-body="{ message,messageText, messageColors}">
        <p class="sc-message--text-content" v-html="messageText" dir="auto"></p>

        <p  class="sc-message--text-content"
            dir="auto"
            v-if="message.data.attachments && message.data.attachments.length>0">
            <span  v-for="atch in message.data.attachments" :key="atch.mediaURL">
                <img v-if="atch.mediaType == 'IMAGE'"  
                    :src="atch.mediaURL | https | thumburl" class="" :data-full-src="atch.mediaURL | https" @click="e => downloadImage(e,atch.mediaURL)">
                <audio-player v-else-if="atch.mediaType == 'AUDIO'" 
                                :file="atch.mediaURL | https"
                            ></audio-player>
                <a v-else :href="atch.mediaURL | https" class="fa fa-file-alt float-right" target="_blank">
                <small>&nbsp;{{atch.mediaCaption || atch.mediaType}}</small>
                </a>
                <br/>
            </span>  


        </p>
        <ul v-if="message.data.inputs && message.data.inputs.length>0">
            <li>{{message.data.inputs[0].label}}</li>
        </ul>
        <p v-if="message.data.timestamp" class="sc-message--meta" :style="{color: messageColors.color}">
          {{ message.data.timestamp|formatDate }}&nbsp;
          <span v-if="message.data.type=='I'">
              <i v-if="message.id" class="fas fa-check"></i>
              <i v-else class="fas fa-sync fa-spin"></i>
          </span>
        </p>
      </template>
      <template v-slot:suggestion-button="{suggestion,button,sendSuggestion}">
          <button v-if="suggestion.type=='QUICK_REPLY'" 
              :style="button.style" :class="button.class"
              @click="sendSuggestion(suggestion)" >
              {{suggestion.label}}
          </button>
          <a v-else-if="suggestion.type=='URL'" 
              :style="button.style" :class="['btn',button.class]"
              :href="suggestion.url" target="_blank" >
              <i class="fa fa-external-link"/>&nbsp;{{suggestion.label}}
          </a>
          <button v-else 
              :style="button.style" :class="button.class"
              @click="sendSuggestion(suggestion)" >
              {{suggestion.label}}
          </button>
      </template>
    </web-chat-launcher>

  </div>
</template>

<script>
    import Vue from 'vue';
    //import Chat from 'vue-beautiful-chat'
    import WebChatLauncher from '@/@common/webchat/WebChatLauncher.vue';
    import AudioPlayer from '@/@common/custom/components/AudioPlayer';
    import { required, email,regex } from 'vee-validate/dist/rules';
    import formatters from '../../services/formatters';
    import tunnel from '../../services/tunnel';
    import pebounce from "pebounce";
    
    import AudioVisual from 'vue-audio-visual'
    Vue.use(AudioVisual);

    var userAgent = window.navigator.userAgent.toLowerCase(),
    safari = /safari/.test( userAgent ),
    ios = /iphone|ipod|ipad/.test( userAgent );

    function toMessage(msg) {
      if(!msg) return;
      return { 
        author: msg.type == "I" ? 'me' : "support", 
        type: 'text', 
        id : msg.messageId,
        data: { 
          type : msg.type,
          text : msg.text || msg.message || "", 
          template : msg.template,
          meta : msg.timestamp, 
          timestamp : msg.timestamp,
          attachments : msg.attachments,
          file : (msg.attachments && msg.attachments[0]) ? {
            name : msg.attachments[0].mediaCaption,
            url : formatters.https_thumburl(msg.attachments[0].mediaURL)
          } : null,
          inputs : msg.options ? msg.options.inputs : null,
        } ,
        suggestions: (msg.options && msg.options.buttons) ? msg.options.buttons.map(function (button) {
            return button;
        }) : null
      };
    }

    export default {
      name: 'app',
      components: {
        AudioPlayer, WebChatLauncher
      },
      data() {
        return {
          participants: [
            {
              id: 'support',
              name: 'Support',
              imageUrl: 'https://avatars3.githubusercontent.com/u/1915989?s=230&v=4'
            }
          ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
          config : {
            header : {
              icon : {
                url: this.$global.MyConst.cdn + "/_common/static/support.png",
              },
              title : {
                text : "Support"
              },
              disabled : false,
            },
            launcher : {
              open : false,
              disabled:false,
              position:"right-bottom"
            },
            externalcss:{
                url:false
            }
          },
          options : {
            domain : null,
            channelId : null,
            channelKey : null
          },

          messageList: [
              // { type: 'text', author: `me`, data: { text: `Say yes!` } },
              // { type: 'text', author: `user1`, data: { text: `No.` } }
          ], // the list of the messages to show, can be paginated and adjusted dynamically
          messageMap : {},
          newMessagesCount: 0,
          isChatOpen: false, // to determine whether the chat window should be open or closed
          isChatOpened : false,
          isChatLoaded : false,
          showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
          colors: {
            header: {
              bg: '#000',
              text: '#ffffff',
              close : '#ffffff'
            },
            launcher: {
              bg: '#000'
            },
            messageList: {
              bg: '#ffffff'
            },
            sentMessage: {
              bg: '#4e8cff',
              text: '#ffffff'
            },
            receivedMessage: {
              bg: '#eaeaea',
              text: '#222222'
            },
            userInput: {
              bg: '#f4f7f9',
              text: '#565867',
              button:'#565867'
            }
          }, // specifies the color scheme for the component
          alwaysScrollToBottom: true, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
          messageStyling: true, // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown),
          browserfp : null,
          csid : null,
          webSession : {
            key : null, id : null
          },
          form_input :  null,

          //Flag to Determin if Plugin is SetOptions
          isConfigSet : false,
          swagger : null
        }
      },
      computed : {

      },
      methods: {
        filterReponse(resp){
              this.webSession.key = resp.meta?.webSessionIdKey || this.webSession.key;
              this.webSession.id = resp.meta?.webSessionId || this.webSession.id;
              this.csid = resp.meta?.csid || this.csid;
        },
        downloadImage(e,url){
            let nUrl = new URL(url);
            nUrl.protocol = "https:";
            window.open(nUrl, '_blank');
        },
        sendMessage (text) {
          if (text.length > 0) {
            this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1;
            this.onMessageWasSent({ author: 'support', type: 'text', data: { text } })
          }
        },
        addMessage : function (message) {
            console.log("message",message);
          message.type = message.data.file ? "file" : message.type; 
          if(!message){
              console.log("addMessage:message:undefined");
              return;
          }
          if(message.id && this.messageMap[message.id]){
            this.messageMap[message.id].data = message.data;
          } else {
            this.messageMap[message.id] = message;
            this.messageList = [ ...this.messageList, message ];
          }
          this.messageList = this.messageList.sort(function(a,b) {
              return a.data.timestamp - b.data.timestamp;
          });
        },
        async onMessageWasSentAsync (message, form) {
          // called when the user sends a message
          if(!message){
              console.log("onMessageWasSentAsync:message:undefined");
              return;
          }
          message.id=null;
          message.data.type="I"; 
          message.data.timestamp = Date.now();
          this.addMessage(message);
        
        if(message.type == "file"){
            let bodyFormData = new FormData();
            bodyFormData.append("file",message.data.file, message.data.file.fileName);
            let response = await this.$service.put(
                `ext/plugin/inbound/v2/web/callback/${this.$global.MyConst.nounce}/${this.options.channelId}/${this.options.channelKey}`+
                `?from=${this.csid}&${this.webSession.key}=${this.webSession.id}`,
                bodyFormData
            );
              
            this.filterReponse(response);
            var _msg = toMessage(response.results[0]);
            if(!_msg){
              console.log("onMessageWasSentAsync:if:_msg:undefined");
              return;
            }
            message.id = _msg.id;
            message.data.timestamp = _msg.data.timestamp;
            message.data.attachments = _msg.data.attachments;
            ///this.addMessage(_msg);
            return;
        }

        if(this.options.channelId){
                let resp = await this.$service.post(
                `ext/plugin/inbound/v2/web/callback/${this.$global.MyConst.nounce}/${this.options.channelId}/${this.options.channelKey}`+
                `?${this.webSession.key}=${this.webSession.id}`,
                {
                  message : (message.data.text || message.data.emoji || "") , from : this.csid,
                  form : form
                });
              this.filterReponse(resp);
              var _msg = toMessage(resp.results[0]);
              if(!_msg){
                console.log("onMessageWasSentAsync:if:_msg:undefined");
                return;
              }
              message.id = _msg.id;
              message.data.timestamp = _msg.data.timestamp;
              message.data.attachments = _msg.data.attachments;
          } else { 
            ///{@Deprecated
              let resp = await this.$service.post(
                "/ext/inbound/web/callback",
              {
                message : (message.data.text || message.data.emoji || "") , from : this.csid,
                form : form
              });
              this.filterReponse(resp);
              var _msg = toMessage(resp);
              if(!_msg){
                console.log("onMessageWasSentAsync:else:_msg:undefined");
                return;
              }
              message.id = _msg.id;
              message.data.timestamp = _msg.data.timestamp;
              message.data.attachments = _msg.data.attachments;
            ///}@Deprecated
          }

        },
        onMessageWasSent (message) {
            console.log("onMessageWasSent",message)
          var form = {};
          if(message.data.text && typeof message.data.text === "object"){
              form.reply_id = message.data.text.name;
              form.reply_title = message.data.text.label;
              message.data.text =  message.data.text.label;
          }
          if(this.form_input){
              if(this.form_input.type == "EMAIL" && !email.validate(message.data.text)){
                this.addMessage({ type : "system", data : { text : "Invalid Input" }});
                return false;
              }
              form[this.form_input.name] = message.data.text;
              this.form_input = null;
          }
          
          if(message.data.text || message.data.emoji || message.data.file){
              this.onMessageWasSentAsync(message,form);
          }
        },
        onMessageRecvd (message) {
          this.form_input = message.data.inputs ? message.data.inputs[0] : null;
          this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
          this.addMessage(message);
        },
        openChat () {
          // called when the user clicks on the fab button to open the chat
          this.isChatOpen = true;
          this.isChatOpened = true;
          this.start();
          this.newMessagesCount = 0
          this.publishChatWindowStatus();
        },
        closeChat () {
          // called when the user clicks on the botton to close the chat
          this.isChatOpen = false
          this.publishChatWindowStatus();
        },
        handleScrollToTop () {
          // called when the user scrolls message list to top
          // leverage pagination for loading another page of messages
        },
        handleOnType () {
          console.log('Emit typing event')
        },
        editMessage(message){
          const m = this.messageList.find(m=>m.id === message.id);
          m.isEdited = true;
          m.data.text = message.data.text;
        },
        async loadChats(){
          this.loading(true);
          //let rsp = await this.$service.post("https://almullaexchange.mehery.io/admin/api/message/messages",{"updated":{"stamp":1659619683568,"hour":461005,"day":19208,"week":2744},"sessionId":"62ebbff902e14c1604896ac5","ticketHash":null,"routingId":"62ebbff902e14c1604896ac5_agent_desk_1gvw7iccm0f0r","version":171,"contactId":"webdbbd3887739ebc61e68c561e375f49a700_wwd.almullaexchange.com","contactType":"WEBSITE","channel":"web","lane":"wwd.almullaexchange.com","contactName":"Jenjen","contact":{"email":null,"userid":null,"mobile":null,"phone":null,"name":null,"contactType":"WEBSITE","channelType":"web","lane":"wwd.almullaexchange.com","csid":"dbbd3887739ebc61e68c561e375f49a700","contactId":"webdbbd3887739ebc61e68c561e375f49a700_wwd.almullaexchange.com","filter":null},"subject":null,"assignedToDept":"Call Center","assignedToAgent":"anoop","assignedToBot":null,"assignedToQueue":"agent_desk","active":false,"initd":true,"resolved":true,"expired":false,"primary":true,"startSessionStamp":1659617273241,"fistResponseStamp":1659617577994,"agentSessionStamp":1659617570723,"firstInComingStamp":1659617273228,"firstOutGoingStamp":0,"lastInComingStamp":1659619223032,"lastOutGoingStamp":1659619683568,"assignedDeptStamp":1659617570723,"assignedAgentStamp":1659619055241,"lastResponseStamp":1659619683541,"resolveSessionStamp":1659619683505,"closeSessionStamp":1659619683568,"updatedStamp":1659619683568,"agentScore":null,"botScore":null,"mode":"AGENT","status":"CLOSED","tagCategory":null,"tagId":null,"store":null,"meta":null,"msg":{"lastInBoundMsg":{"text":"Hi","template":null,"templateId":null,"action":null,"name":null,"sessionId":"62ebbff902e14c1604896ac5","bulkSessionId":null,"messageId":"62ebc79702e14c1604897785","messageIdExt":null,"messageIdRef":null,"replyIdExt":null,"replyId":null,"timestamp":1659619223059,"type":"I","tags":null,"attachments":null,"vccards":null,"logs":null,"sender":null,"status":null,"stamps":{"session":1659619125260},"contact":{"channelType":null,"lane":null,"csid":null,"name":null,"email":null,"emailVerified":null,"phone":"dbbd3887739ebc61e68c561e375f49a700","phoneVerified":null,"profilePic":null,"labelId":null,"profile":null,"firstInBoundStamp":0,"firstOutBoundStamp":0,"lastInBoundStamp":0,"lastOutBoundStamp":0,"lastPushStamp":0,"lastReplyStamp":0,"lastOptInStamp":0,"createdStamp":null,"createdBy":null,"sessionId":null,"contactId":null,"contactType":"WEBSITE"},"meta":null,"options":null,"replyTo":{},"route":null},"lastMsg":{"text":"Hi Jenjen,\n\nTrust we were able to address your query today. We are closing this conversation.\n\nLook forward to your continued patronage.","template":"conversation_closed","templateId":"62551f5c2ce8576657d81ffb","action":null,"name":"anoop","sessionId":"62ebbff902e14c1604896ac5","bulkSessionId":null,"messageId":"62ebc96302e14c15b4913590","messageIdExt":null,"messageIdRef":null,"replyIdExt":null,"replyId":null,"timestamp":1659619683541,"type":"O","tags":null,"attachments":null,"vccards":null,"logs":null,"sender":"anoop","status":"SENT","stamps":{"INIT":1659619683541,"session":0,"SENT":1659619683551},"contact":{"channelType":null,"lane":null,"csid":null,"name":null,"email":null,"emailVerified":null,"phone":"dbbd3887739ebc61e68c561e375f49a700","phoneVerified":null,"profilePic":null,"labelId":null,"profile":null,"firstInBoundStamp":0,"firstOutBoundStamp":0,"lastInBoundStamp":0,"lastOutBoundStamp":0,"lastPushStamp":0,"lastReplyStamp":0,"lastOptInStamp":0,"createdStamp":null,"createdBy":null,"sessionId":null,"contactId":null,"contactType":"WEBSITE"},"meta":{"categoryType":"AUTO_REPLY","composeType":"R","sendType":"SM"},"options":{"buttons":[],"list_option_title":"","inputs":[],"more_option_title":""},"replyTo":null,"route":{"queueCode":null,"senderCode":null,"senderType":null,"sendMode":null,"senderApp":null}},"lastOutBoundMsg":{"text":"Hi Jenjen,\n\nTrust we were able to address your query today. We are closing this conversation.\n\nLook forward to your continued patronage.","template":"conversation_closed","templateId":"62551f5c2ce8576657d81ffb","action":null,"name":"anoop","sessionId":"62ebbff902e14c1604896ac5","bulkSessionId":null,"messageId":"62ebc96302e14c15b4913590","messageIdExt":null,"messageIdRef":null,"replyIdExt":null,"replyId":null,"timestamp":1659619683541,"type":"O","tags":null,"attachments":null,"vccards":null,"logs":null,"sender":"anoop","status":"SENT","stamps":{"INIT":1659619683541,"session":0,"SENT":1659619683551},"contact":{"channelType":null,"lane":null,"csid":null,"name":null,"email":null,"emailVerified":null,"phone":"dbbd3887739ebc61e68c561e375f49a700","phoneVerified":null,"profilePic":null,"labelId":null,"profile":null,"firstInBoundStamp":0,"firstOutBoundStamp":0,"lastInBoundStamp":0,"lastOutBoundStamp":0,"lastPushStamp":0,"lastReplyStamp":0,"lastOptInStamp":0,"createdStamp":null,"createdBy":null,"sessionId":null,"contactId":null,"contactType":"WEBSITE"},"meta":{"categoryType":"AUTO_REPLY","composeType":"R","sendType":"SM"},"options":{"buttons":[],"list_option_title":"","inputs":[],"more_option_title":""},"replyTo":null,"route":{"queueCode":null,"senderCode":null,"senderType":null,"sendMode":null,"senderApp":null}}},"stamps":{"firstInBound":1659619223068,"firstInBound_null":1659617568889,"lastInBound":1659619223068,"lastInBound_null":1659617568889,"firstOutBound":1659619683548,"firstOutBound_null":1659617561658,"lastOutBound":1659619683548,"lastOutBound_null":1659617561658,"firstOutBound_BOT":1659617568972,"lastOutBound_BOT":1659617568972,"firstInBound_BOT":1659617570671,"lastInBound_BOT":1659617570671,"firstOutBound_AGENT":1659619683548,"lastOutBound_AGENT":1659619683548,"firstInBound_AGENT":1659619223068,"lastInBound_AGENT":1659619223068},"read":{"tester":1659617807399,"kc":1659619243219,"riddhi":1659619289079,"anoop":1659619681186},"feedback":null,"lastInBoundMsg":{"messageIdExt":null,"messageIdRef":null,"traceId":"WWF-8hNST-8idcEEdof9d-000000-xxx-8iddf75gWUD","sessionId":"62ebbff902e14c1604896ac5","bulkSessionId":null,"collapseId":null,"timestamp":1659619223059,"type":"I","template":null,"templateId":null,"hsm":null,"action":null,"handler":null,"message":"Hi","subject":null,"formatType":null,"formatSubType":null,"status":null,"contact":{"email":null,"userid":null,"mobile":"dbbd3887739ebc61e68c561e375f49a700","phone":"dbbd3887739ebc61e68c561e375f49a700","name":null,"contactType":"WEBSITE","channelType":null,"lane":null,"csid":null,"contactId":null,"filter":null},"route":null,"queue":"agent_desk","agent":null,"tags":{"categories":null,"persons":null,"locations":null,"cities":null,"countries":null,"organizations":null,"sentiments":null,"langs":null,"sentimentScore":0},"model":null,"meta":null,"form":{},"options":null,"attachments":null,"vccards":null,"replyIdExt":null,"replyId":null,"quickReplyId":null,"mediaReplyId":null,"stamps":{"session":1659619125260},"logs":null,"replyTo":{},"contactId":"webdbbd3887739ebc61e68c561e375f49a700_wwd.almullaexchange.com","messageId":"62ebc79702e14c1604897785"},"lastOutBoundMsg":{"messageIdExt":null,"messageIdRef":null,"traceId":"DJB-8id8r-8id8CxuUetS-000000-xxx-8iddN79x4Kz","sessionId":"62ebbff902e14c1604896ac5","bulkSessionId":null,"collapseId":null,"timestamp":1659619683541,"type":"O","template":"conversation_closed","templateId":"62551f5c2ce8576657d81ffb","hsm":{"id":"62551f5c2ce8576657d81ffb","code":"conversation_closed","lang":null,"data":{}},"action":null,"handler":null,"message":"Hi Jenjen,\n\nTrust we were able to address your query today. We are closing this conversation.\n\nLook forward to your continued patronage.","subject":null,"formatType":null,"formatSubType":null,"status":"SENT","contact":{"email":null,"userid":null,"mobile":"dbbd3887739ebc61e68c561e375f49a700","phone":"dbbd3887739ebc61e68c561e375f49a700","name":null,"contactType":"WEBSITE","channelType":null,"lane":null,"csid":null,"contactId":null,"filter":null},"route":{"queueCode":null,"senderCode":null,"senderType":null,"sendMode":null,"senderApp":null},"queue":null,"agent":"anoop","tags":null,"model":{"data":{},"contact":{"tenant":null,"country":null,"userid":null,"prefix":null,"phone":"51780421","email":null,"name":"Jenjen","lang":null,"contactType":"WEBSITE","channelType":null,"lane":null,"csid":null,"contactId":null,"filter":null,"keymap":null},"global":{}},"meta":{"categoryType":"AUTO_REPLY","composeType":"R","sendType":"SM"},"form":null,"options":{"buttons":[],"list_option_title":"","inputs":[],"more_option_title":""},"attachments":null,"vccards":null,"replyIdExt":null,"replyId":null,"quickReplyId":null,"mediaReplyId":null,"stamps":{"INIT":1659619683541,"session":0,"SENT":1659619683551},"logs":null,"replyTo":null,"contactId":"webdbbd3887739ebc61e68c561e375f49a700_wwd.almullaexchange.com","messageId":"62ebc96302e14c15b4913590"},"lastMsg":{"messageIdExt":null,"messageIdRef":null,"traceId":"DJB-8id8r-8id8CxuUetS-000000-xxx-8iddN79x4Kz","sessionId":"62ebbff902e14c1604896ac5","bulkSessionId":null,"collapseId":null,"timestamp":1659619683541,"type":"O","template":"conversation_closed","templateId":"62551f5c2ce8576657d81ffb","hsm":{"id":"62551f5c2ce8576657d81ffb","code":"conversation_closed","lang":null,"data":{}},"action":null,"handler":null,"message":"Hi Jenjen,\n\nTrust we were able to address your query today. We are closing this conversation.\n\nLook forward to your continued patronage.","subject":null,"formatType":null,"formatSubType":null,"status":"SENT","contact":{"email":null,"userid":null,"mobile":"dbbd3887739ebc61e68c561e375f49a700","phone":"dbbd3887739ebc61e68c561e375f49a700","name":null,"contactType":"WEBSITE","channelType":null,"lane":null,"csid":null,"contactId":null,"filter":null},"route":{"queueCode":null,"senderCode":null,"senderType":null,"sendMode":null,"senderApp":null},"queue":null,"agent":"anoop","tags":null,"model":{"data":{},"contact":{"tenant":null,"country":null,"userid":null,"prefix":null,"phone":"51780421","email":null,"name":"Jenjen","lang":null,"contactType":"WEBSITE","channelType":null,"lane":null,"csid":null,"contactId":null,"filter":null,"keymap":null},"global":{}},"meta":{"categoryType":"AUTO_REPLY","composeType":"R","sendType":"SM"},"form":null,"options":{"buttons":[],"list_option_title":"","inputs":[],"more_option_title":""},"attachments":null,"vccards":null,"replyIdExt":null,"replyId":null,"quickReplyId":null,"mediaReplyId":null,"stamps":{"INIT":1659619683541,"session":0,"SENT":1659619683551},"logs":null,"replyTo":null,"contactId":"webdbbd3887739ebc61e68c561e375f49a700_wwd.almullaexchange.com","messageId":"62ebc96302e14c15b4913590"},"_stamp":1660070785406,"local":{"active":false,"expired":false,"tags":{},"live":false,"lastActivityStamp":1659619223032,"channelId":"web:wwd.almullaexchange.com","lane":"wwd.almullaexchange.com","resolved":true,"open":false,"closed":true,"isModeAgent":true,"isModeBot":false,"isShowAgentPush":true,"isAssignedToMe":false,"tab":"ORG","is_agent_responded":false,"isOutBound":true,"is_waiting":false,"is_waiting_long":false,"lastReadStamp":0,"is_unassigned":false,"is_assigned":true,"is_offline_agent":true,"is_unattended":true,"state":"CLOSED"},"_assignedToMe":false,"_tab":"ORG","_gracestamp":1660070485406,"_waitingSinceStamp":1659619683541,"_waitingstamp_en":"5.2 days","_new":true,"_searchText":"   dbbd3887739ebc61e68c561e375f49a700"});
          //rsp.results = rsp.data.messages;
          let rsp = await this.$service.submit("../" + window.CONST.POSTMAN + "/ext/plugin/outbound/web/auth/v2",{
            number : this.browserfp,
            csid : this.browserfp,
            browserfp : this.browserfp,
            user : window.CONST.APP_USER,
            channelId : this.options.channelId,
            channelKey : this.options.channelKey,
            visitorId : window.CONST.VISITOR_ID,
            visitId : window.CONST.VISIT_ID,
            userCode : this.options?.user?.code || this.options?.user?.profileId || this.options?.user?.profile_id,
            userToken : this.options?.user?.token,
            userName : this.options?.user?.name,
            userEmail : this.options?.user?.email,
            userPhone : this.options?.user?.phone,
          });
          this.filterReponse(rsp);
          var results =  rsp.results;
          for(var i in results){
              let _msg = toMessage(rsp.results[i])
              this.addMessage(_msg);
              this.onMessageRecvd(_msg);
          }
          if(window.CONST.STOMP_ENABLED){
              this.subscibeMessage(rsp?.meta?.stomp);
              let THAT = this;
              setInterval(() => {
                THAT.fetchMessage();
              }, 10000);

          } else {
              this.pollMessage();
          }
          try{
            let swagger = await this.$service.get("/v2/api-docs?group=latest");
            if(swagger){
              this.swagger = swagger;
            }
          } catch(e){
            console.error("apis fetch error",e);
          }
          this.loading(false);
        },
        fetchMessage : pebounce(async function (){
              return; // Polling can wait
              if(this.swagger && !this.swagger.paths['/ext/plugin/outbound/web/callback/v2']){
                  let rsp = await this.$service.get("/ext/plugin/outbound/web/callback",{
                    number : this.csid,  csid : this.csid,
                    user : window.CONST.APP_USER,
                    channelId : this.options.channelId,
                  });
                  if(rsp){
                      this.onMessageRecvd(toMessage(rsp));
                  }
              } else {
                let rsp = await this.$service.get("/ext/plugin/outbound/web/callback/v2",{
                  number : this.csid,  csid : this.csid,
                  user : window.CONST.APP_USER,
                  channelId : this.options.channelId,
                });
                if(rsp){
                  for(var i in rsp.results){
                    this.onMessageRecvd(toMessage(rsp.results[i]));
                  }
                }
              }
        },2000),
        async subscibeMessage(meta){
            var THAT =  this;
            console.log("TUNNEL")
            this.tunnel = tunnel.init({session : meta}).instance()
            .on("/message/receive/new", function(msg){
                  console.log("/message/receive/new",msg);
                  THAT.onMessageRecvd(toMessage(msg));
                  THAT.fetchMessage();
            });
        },
        async pollMessage (){
          try {
            await this.fetchMessage();
          } finally {
              let THAT =  this;
              setTimeout(function (argument) {
                THAT.pollMessage();
              },2000)
          }
        },
        loading : function (show) {
            var element = document.getElementsByTagName("html")[0];
            if(show) element.className = element.className.replace(/\loaded\b/g, "loading"); 
            else element.className = element.className.replace(/\loading\b/g, "loaded");
        },
        async start(){
          if(window.CONST.fp && this.options.channelId && this.isChatOpened && !this.isChatLoaded){
            this.isChatLoaded = true;
            await this.loadChats();
          }
        },
        init : function () {
          var THAT = this;
          clearTimeout(this.fploader);
          this.fploader = setTimeout(function() {
              console.log(`FP:${window.CONST.fp}, CH:${THAT.options.channelId}`);
              if(window.CONST.fp && THAT.options.channelId){
                THAT.browserfp = (window.CONST.fp + "");
                THAT.loading(false);
                THAT.start();
                //THAT.loadChats();
              } else {
                THAT.loading(true);
                THAT.init();
                //THAT.sendPostMessage({event : "NO_FP_AND_CH"})
              }
          },1500);
        },
        onOptionSet : function(){
            console.log("this.options",this.options);
            console.log("this.config",this.config)
            if(this.config.launcher.open){
              this.openChat();
            }
            console.log("this.config.externalcss.url",this.config.externalcss.url);
            if(this.options.stylesheet) this.loadCss(this.options.stylesheet);
            if(this.config.externalcss.url) this.loadCss(this.config.externalcss.url);
        },
        //Chat Windwo
        publishChatWindowStatus : function () {
            this.sendPostMessage({
                event : "ON_CHAT_TOGGLE",
                isChatOpen : this.isChatOpen
              });
        },
        onPostMessage : function (e) {
          //console.log("CHILD:onPostMessage",e)
          //alert("CALL:"+e.data)
          if(!e || !e.data || typeof e.data != 'string' || e.data.trim().indexOf("{")!=0){
            return;
          }
          console.log("myChatEvent====onPostMessage:data"+e.data);

          var data = JSON.parse(e.data);
          if(!data.myChatEvent){
            return;
          }
          var myChatEvent = data.myChatEvent;
          console.log("myChatEvent====onPostMessage"+JSON.stringify(myChatEvent))
          if(myChatEvent.event == "CHAT_TOGGLE"){
            //console.log("CHAT_TOGGLE",this,myChatEvent)
              if(this.isChatOpen){
                this.closeChat();
              } else {
                this.openChat();
              }
          } else if(typeof this[myChatEvent.event] == 'function'){
            this[myChatEvent.event](myChatEvent);
          } 
        },
        sendPostMessage : function (obj) {
            var msg = JSON.stringify({myChatEvent : obj});
            //console.log("CHILD:sendPostMessage",msg);
            console.log("before => window.parent.postMessage",msg);
            window.parent.postMessage(msg, '*');
            if(ios && !safari){
              this.sendPostMessageIOS(msg, '*');
            }
        },
        sendPostMessageIOS(message,star){
          if(webkit?.messageHandlers?.iosListener){
              webkit.messageHandlers.iosListener.postMessage(message,star);
          } else {
            setTimeout(()=>this.sendPostMessageIOS(message,star),1000);
          }
        },
        SET_OPTIONS : function (myChatEvent) {
            console.log("SET_OPTIONS===myChatEvent",myChatEvent);
            var config = myChatEvent.options.config || {};
            config.dummy = 'dummy.dummy';
            var thisConfig = this.config;
            for(var key in config){
                  var keys = key.split(".");
                  if(keys[keys.length-1] == 'color'){
                    this.colors[keys[0]][keys[1]] = config[key] || this.colors[keys[0]][keys[1]];
                    console.log(`${keys[0]}.${keys[1]} == `,this.colors[keys[0]][keys[1]])
                  } else if(thisConfig[keys[0]]!==undefined 
                            && thisConfig[keys[0]][keys[1]]!==undefined
                            && thisConfig[keys[0]][keys[1]][keys[2]]!==undefined){
                    console.log(`${keys[0]}.${keys[1]}.${keys[2]} =`,thisConfig[keys[0]][keys[1]][keys[2]])
                    thisConfig[keys[0]][keys[1]][keys[2]] =  config[key];
                  } else if(thisConfig[keys[0]]!==undefined
                            && thisConfig[keys[0]][keys[1]]!==undefined){
                    console.log(`${keys[0]}.${keys[1]} =`,thisConfig[keys[0]][keys[1]])
                    thisConfig[keys[0]][keys[1]] =  config[key];
                  } else {
                    console.log(`${keys[0]}.${keys[1]}.${keys[2]} !=`,thisConfig[keys[0]])
                  }
                  this.isConfigSet = true;
            }
            myChatEvent.options.config = null;
            delete myChatEvent.options.config;
            this.options = Object.assign({},this.options,myChatEvent.options);
            if(!this.options.channelId){
              this.options.channelId = this.$global.MyConst.config.SETUP.POSTMAN_CHAT_WEB_CHANNEL;
              this.options.channelKey = this.$global.MyConst.config.SETUP.POSTMAN_CHAT_WEB_CHANNEL_KEY;
              this.options.stylesheet = this.$global.MyConst.config.SETUP.POSTMAN_CHAT_WEB_CHANNEL_STYLESHEET;
            }  
            this.options.stylesheet = this.options.stylesheet || window.CONST.WEB_CHANNEL_STYLESHEET;
            this.onOptionSet();
        },
        loadCss : function(cssUrl){
            var lnk=document.createElement('link');
            lnk.href=cssUrl;
            lnk.rel='stylesheet';
            lnk.type='text/css';
            (document.head||document.documentElement).appendChild(lnk);
        }
      },
      //Component Events
      mounted () {
        this.$service.config("DISABLE_RESPONSE_INTERCEPTOR");
        if (window.addEventListener) {
            window.addEventListener("message", this.onPostMessage, false);
        } else if (element.attachEvent) {
            window.attachEvent('onmessage', this.onPostMessage);
        }
        let THIS = this;
        window.callMobileEventListener = function(data){
          //alert("CALL:"+data.event)
          console.log("myChatEvent====callMobileEventListener"+JSON.stringify(data))
          THIS.onPostMessage({
            data : JSON.stringify({myChatEvent : data})
          })
        };
        this.sendPostMessage({
          event : "ON_CHAT_LOAD"
        });
        this.init();
      },
      beforeDestroy () {
        if (window.addEventListener) {
            window.removeEventListener("message", this.onPostMessage, false);
        } else if (element.attachEvent) {
            window.removeEventListener('onmessage', this.onPostMessage);
        }
      }

    }


</script>
<style type="text/css">
  .sc-launcher {
    right: 5px!important;
    bottom: 5px!important;
  }
  .sc-launcher .sc-closed-icon, .sc-launcher .sc-open-icon{
      position: fixed;
      right: 5px!important;
      bottom: 5px!important;
  }
  .sc-header {
    min-height: 55px!important;
    padding: 5px!important;
  }
  .sc-message--text-content {
    white-space: pre-wrap;
    margin-bottom: 5px;
  }
  .sc-message--avatar {
    display: none;
  }
  .sc-message--file-text{
      display: none;
  }
</style>
