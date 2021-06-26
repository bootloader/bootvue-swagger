<template>
  <div>
    <beautiful-chat
      :participants="participants"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :open="openChat"
      :showEmoji="true"
      :showFile="true"
      :showTypingIndicator="showTypingIndicator"
      :showLauncher="true"
      :showCloseButton="true"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :disableUserListToggle="false"
      :messageStyling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage">

      <template v-slot:header>
        <img v-if="header.titleImageUrl" class="sc-header--img" :src="header.titleImageUrl" alt="" />
        <div class="sc-header--title">{{ header.title }}</div>
      </template>


      <template v-slot:text-message-body="{ message,messageText, messageColors}">
        <p class="sc-message--text-content" v-html="messageText"></p>

        <p  class="sc-message--text-content"
            v-if="message.data.attachments && message.data.attachments.length>0" 
            v-for="atch in message.data.attachments">
              <img v-if="atch.mediaType == 'IMAGE'"  
                  :src="atch.mediaURL | https | thumburl" class="" :data-full-src="atch.mediaURL | https">
              <a v-else :href="atch.mediaURL | https" class="fa fa-file-alt float-right"></a>
              <br/>
              <small v-if="atch.mediaCaption">{{atch.mediaCaption}}</small>
        </p>
        <ul v-if="message.data.inputs">
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
    </beautiful-chat>

  </div>
</template>

<script>
    import Vue from 'vue';
    import Chat from 'vue-beautiful-chat'
    Vue.use(Chat);

    import formatters from './../../services/formatters';


    function toMessage(msg) {
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
          suggestions: (msg.options && msg.options.buttons) ? msg.options.buttons.map(function (button) {
              return button.label;
          }) : null
        } 
      };
    }

    export default {
      name: 'app',
      data() {
        return {
          participants: [
            {
              id: 'support',
              name: 'Support',
              imageUrl: 'https://avatars3.githubusercontent.com/u/1915989?s=230&v=4'
            }
          ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
          header : {
            titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
            title : "Support"
          },
          messageList: [
              // { type: 'text', author: `me`, data: { text: `Say yes!` } },
              // { type: 'text', author: `user1`, data: { text: `No.` } }
          ], // the list of the messages to show, can be paginated and adjusted dynamically
          newMessagesCount: 0,
          isChatOpen: false, // to determine whether the chat window should be open or closed
          showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
          colors: {
            header: {
              bg: '#4e8cff',
              text: '#ffffff'
            },
            launcher: {
              bg: '#4e8cff'
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
              text: '#565867'
            }
          }, // specifies the color scheme for the component
          alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
          messageStyling: true, // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown),
          csid : null,
          form_input :  null,
        }
      },
      methods: {
        sendMessage (text) {
          if (text.length > 0) {
            this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
            this.onMessageWasSent({ author: 'support', type: 'text', data: { text } })
          }
        },
        addMessage : function (message) {
          //message.type = message.data.file ? "file" : message.type; 
          this.messageList = [ ...this.messageList, message ]
        },
        async onMessageWasSentAsync (message) {
          // called when the user sends a message
          message.id=null;
          message.data.type="I"; 
          message.data.timestamp = Date.now();
          this.addMessage(message);
          var form = {};
          if(this.form_input){
            form[this.form_input.name] = message.data.text;
          }
          this.form_input = null;
          let resp = await this.$service.post("/ext/inbound/web/callback",{
             message : (message.data.text || message.data.emoji || "") , from : this.csid,
             form : form
          });
          var _msg = toMessage(resp);
          message.id = _msg.id;
          message.data.timestamp = _msg.data.timestamp;
          message.data.attachments = _msg.data.attachments;
        },
        onMessageWasSent (message) {
          if(message.data.text || message.data.emoji )
              this.onMessageWasSentAsync(message);
        },
        onMessageRecvd (message) {
          this.form_input = message.data.inputs[0];
          this.addMessage(message);
        },
        openChat () {
          // called when the user clicks on the fab button to open the chat
          this.isChatOpen = true
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
          let rsp = await this.$service.get("../" + window.CONST.POSTMAN + "/ext/outbound/web/auth/v2",{
            number : this.csid
          });
          console.log(rsp);
          var results =  rsp.results;
          for(var i in results){
              this.addMessage(toMessage(rsp.results[i]));
          }
          this.pollMessage();
          this.closeLoading();
        },
        async pollMessage (){
          try {
              let rsp = await this.$service.get("/ext/outbound/web/callback",{
                number : this.csid
              });
              if(rsp)
                this.onMessageRecvd(toMessage(rsp));
          } finally {
              let THAT =  this;
              setTimeout(function (argument) {
                THAT.pollMessage();
              },2000)
          }
        },
        closeLoading : function (argument) {
            var element = document.getElementsByTagName("html")[0];
            element.className = element.className.replace(/\loading\b/g, "")
        },
        init : function () {
          var THAT = this;
          clearTimeout(this.fploader);
          this.fploader = setTimeout(function() {
              if(window.CONST.fp){
                THAT.csid = (window.CONST.fp + "00");
                THAT.loadChats();
              } else {
                THAT.init();
              }
          },1000);
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
          if(!e || !e.data || typeof e.data != 'string' || e.data.trim().indexOf("{")!=0){
            return;
          }
          var data = JSON.parse(e.data);
          if(!data.myChatEvent){
            return;
          }
          var myChatEvent = data.myChatEvent;
          if(myChatEvent.event == "CHAT_TOGGLE"){
            //console.log("CHAT_TOGGLE",this,myChatEvent)
              if(this.isChatOpen){
                this.closeChat();
              } else {
                this.openChat();
              }
          }
        },
        sendPostMessage : function (obj) {
            var msg = JSON.stringify({myChatEvent : obj});
            //console.log("CHILD:sendPostMessage",msg)
            window.parent.postMessage(msg, '*');
        },



      },
      //Component Events
      mounted () {
        this.$service.config("DISABLE_RESPONSE_INTERCEPTOR");
        if (window.addEventListener) {
            window.addEventListener("message", this.onPostMessage, false);
        } else if (element.attachEvent) {
            window.attachEvent('onmessage', this.onPostMessage);
        }
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
    right: 0px!important;
    bottom: 0px!important;
  }
  .sc-launcher .sc-closed-icon, .sc-launcher .sc-open-icon{
      position: fixed;
      right: 0!important;
      bottom: 0!important;
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
</style>
