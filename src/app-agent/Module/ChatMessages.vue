<template>
    <div v-if="activeChat" class="m-chat-messages" tabindex="-1" >
        <div v-for="(m) in messages"  v-bind:key="`message-${activeChat.sessionId}-${m.messageId}-${m.messageIdRef}`" tabindex="-1" 
            :id="`message-${activeChat.sessionId}-${m.messageId}-${m.messageIdRef}`" ><!-- LOOP Start --><span v-if="m">
            <div v-if="$global.MyFunc.isInbound(m.type)"
                    class="d-flex justify-content-start mb-4 chat-bubble" :title="m.tags ? m.tags.categories : null" >
                <div class="msg_cotainer">
                    <div v-if="m.replyIdExt || m.replyId">
                        <div class="msg_cotainer_with_reply"
                            @click="jumpFor(m)" @mouseenter="onReplyShow(m)"
                            :id="'reply-id-'+ m.replyIdExt + '-' + m.messageId" >
                            Reply to &nbsp;<i class="fa fa-chevron-right"/>
                            <span hidden>{{m.local.replyMessage}}</span>
                        </div>
                        <b-popover triggers="hover focus"  @show="onReplyShow(m)"
                            :target="'reply-id-'+ m.replyIdExt + '-' + m.messageId"
                            :delay="100"
                            custom-class="message-preview" placement="right">
                            <span class="message-preview"> 
                                <ChatMessageContent v-if="m.local.replyMessage" :message="m.local.replyMessage">
                                </ChatMessageContent>
                                <span v-else>Loading</span>
                                <loading :active="!m.local.replyMessage"
                                        :loader="'dots'" :opacity="0.3"
                                        :is-full-page="false"></loading>
                            </span>
                        </b-popover> 
                    </div>    
                    <ChatMessageContent :message="m"></ChatMessageContent>    
                </div>
                <span class="msg_time">
                    <span class="msg_user">{{m.name ||'---'}}</span>&nbsp;&nbsp;{{m.timestamp|formatDate}}
                    <span v-if="m.logs || m.stamps" class="msg_status_send-wrapper">
                        &nbsp;
                        <b-icon v-if="m.stamps.FORWARDED" icon="skip-forward-fill" variant="dark" class="msg_status"
                            v-tooltip="'Forwarded @ ' + $formatters.formatStamp(m.stamps.FORWARDED)"
                        ></b-icon>
                    </span>  
                </span>
            </div>

            <div v-else-if="$global.MyFunc.isOutbound(m.type)" class="d-flex justify-content-end mb-4 chat-bubble" data-local-id="m.localId" :data-message-id="m.messageId">
                <div class="msg_cotainer_send">
  
                    <ChatMessageContent :message="m"></ChatMessageContent>  

                    <span class="msg_time_send">
                        
                        <span>{{m.timestamp|formatDate}}&nbsp;&nbsp;</span>
                        <span class="msg_user">{{m.name ||'---'}}</span> 
                        <span>&nbsp;</span>
                        <span v-if="m.route && m.route.senderType">
                            <my-icon type="senderType" :value="m.route.senderType"/>
                        </span>    
                        <span>&nbsp;&nbsp;</span>

                        <span v-if="m.logs || m.stamps" class="msg_status_send-wrapper">
                            <i v-if="!m.messageId" class="sending fa fa-spinner fa-spin msg_status_send" >&nbsp;</i>
                            <i v-else-if="m.stamps.CCWIN" class="fa fa-comment-slash msg_status_send text-danger"
                                v-tooltip="`Out of customer care window`"></i>
                            <b-icon v-else-if="m.stamps.SENT_ERR" icon="exclamation-triangle"  scale=.8 v-tooltip="cleanlog(m.logs)"
                                variant="danger" class="msg_status_send" ></b-icon>
                            <b-icon v-else-if="m.stamps.BLCKD" icon="slash-circle-fill"  scale=.8 v-tooltip="cleanlog(m.logs)"
                                variant="danger" class="msg_status_send" ></b-icon>  
                            <b-icon v-else-if="m.logs || m.stamps.FAILD || m.stamps.NSENT || m.stamps.SENTX_ERR" 
                                icon="exclamation-triangle-fill"  scale=.8 v-tooltip="cleanlog(m.logs)"
                                variant="danger" class="msg_status_send" ></b-icon>  
                            <b-icon v-else-if="m.stamps.READ" icon="check-all" scale=1.8
                                variant="success" class="msg_status_send"></b-icon>
                             <b-icon v-else-if="m.stamps.DLVRD" icon="check-all" scale=1.8
                                variant="dark" class="msg_status_send"></b-icon>
                             <b-icon v-else-if="m.stamps.SENTX" icon="check" scale=1.8
                                variant="dark" class="msg_status_send"></b-icon>
                             <b-icon v-else-if="m.stamps.SENT" icon="check" scale=1.8
                                variant="muted" class="msg_status_send muted"></b-icon>
                             <b-icon v-else icon="check" scale=1.8
                                variant="light" class="msg_status_send"></b-icon>
                        </span>
                    </span>
                </div>
            </div>

            <ChatMessageLog v-else-if="m.type=='A' || m.type=='L' || m.type=='N'"
                class="chat-bubble chat-bubble-note"
                :message="m">
            </ChatMessageLog> 

        </span><!-- LOOP ENDS --></div>
        <div class="text-center scroll-date"> 
            <span class="">{{activeChat.startSessionStamp|dateStamp}} </span> 
        </div>
    </div>

</template>

<script>

    import ChatMessageLog from './ChatMessageLog';
    import ChatMessageContent from './ChatMessageContent';
    import pebounce from "pebounce";

    export default {
        name : "ChatMessages",
        components: {
            ChatMessageLog,ChatMessageContent
        },
         watch: {
            '$store.getters.StateChatsVersion' : function(){
                this.refreshKey = !this.refreshKey;
            },
            '$route.params.sessionId': function (sessionId) {
                if(this.$route.params.jumpTo){
                    this.jumpTo(this.$route.params.jumpTo);
                }
            },
        },
        computed : {
            messages(){
                this.refreshKey;
                let sessionId = this.activeChat.sessionId;
                return (this.activeChat.messages || []).filter(function(m){
                    return sessionId == m.sessionId;
                }).sort(function(a,b){
                    return a.timestamp - b.timestamp;
                }).map(function(m){
                    m.local = m.local || { counter : 0 };
                    return m;
                });
            }
        },
        data: () => ({
             refreshKey: false,
             cleanlog : function(logs){
                 return (logs +'').replace('360dialog',"whatsapp");
             }
        }),
        mounted : function(){
        },
        methods: {
            onReplyShow : pebounce(async function(m) {
                if(this.activeChat && this.activeChat.messages){
                    for(var i in this.activeChat.messages){
                        if(m.replyId && this.activeChat.messages[i].messageId == m.replyId){
                            m.local.replyMessage = this.activeChat.messages[i];
                        } else if(m.replyIdExt && this.activeChat.messages[i].messageIdExt == m.replyIdExt){
                            m.local.replyMessage = this.activeChat.messages[i];
                        }
                    }
                    if(!m.local.replyMessage){
                         let resp = await this.$service.get("/api/session/messages",{
                            sessionId : this.activeChat.sessionId,
                            messageId : m.replyId,
                            messageIdExt : m.replyIdExt
                        });
                        if(resp.results[0]){
                            m.local.replyMessage = resp.results[0];
                            this.$forceUpdate();
                        }
                    } else {
                        //m.local = Object.assign({},m.local)
                        this.$forceUpdate();
                    }
                }
            },500),
            jumpTo : pebounce(async function(selector) {
                this.$scrollTo(selector,{
                    container: '.msg_card_body',
                });
            }),
            async jumpFor(m) {
                await this.onReplyShow(m);
                let contactId =  this.activeChat.contactId.replace('/','-');
                if(m.local.replyMessage){
                    if(m.local.replyMessage.sessionId == this.activeChat.sessionId){
                        this.jumpTo(`#message-${this.activeChat.sessionId}-${m.local.replyMessage.messageId}`);
                    } else {
                        this.$router.push({ 
                            name: 'defAgentView', 
                            params: { 
                                contactId: contactId,
                                sessionId : m.local.replyMessage.sessionId,
                                profileId : contactId,
                                mvu : 'CHATBOX',
                                jumpTo : `#message-${m.local.replyMessage.sessionId}-${m.local.replyMessage.messageId}`
                            }
                        })
                    }
                }
            },
        },
        props: {
            activeChat : {
                type: Object
            }
        }

    }

</script>
<style type="text/css" scoped>
  .msg_cotainer{
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 10px;
    border-radius: 7px;
    /*background-color: #4b56c0d1;*/
    background-color: rgb(var(--scheme-color-rgb) / 82%);
    color : #fff;
    padding: 6px;
    position: relative;
    font-size: 14px;
    -border : 1px solid #0000001c;
    box-shadow: 0 1.5px 1.5px #00000052;
  }
  .msg_cotainer span, .msg_cotainer_send span{
        white-space: pre-wrap;
  }
  .msg_cotainer_with_reply {
    background-color: rgba(0, 0, 0, 0.247);
    border-radius: 6px;
    padding: 0 5px;
    font-size: 0.8em;
    cursor: pointer;
  }
  .msg_cotainer_send{
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 10px;
    border-radius: 7px;
    background-color: #FFF;
    padding: 6px;
    position: relative;
    font-size: 14px;
    -border : 1px solid #0000001c;
    box-shadow: 0 1.5px 1.5px #00000052;
  }

  .msg_time{
      bottom: -22px;
      color: rgb(21 21 21 / 68%);
      font-size: 10px;
      margin-left: 5px;
      width: 100%;
      padding: 6px;
  }
  .msg_time_send{
    position: absolute;
    right:0;
    bottom: -22px;
    color: rgb(21 21 21 / 68%);
    font-size: 10px;
    min-width: 250px;
      text-align: right;
      margin-right : 5px;
  }


  .msg_user {
    font-size: 10px;
    flex: 0 0 100%; 
    font-weight: 600;
  }
  .msg_cotainer:after{
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      bottom: -7px;
      left: 4px;
      box-sizing: border-box;
      border: 4px solid black;
      border-color: transparent transparent rgb(var(--scheme-color-rgb) / 82%) rgb(var(--scheme-color-rgb) / 82%);
      transform-origin: 0 0;
      transform: rotate(-45deg);
      box-shadow: -1px 1px 1px 0 rgb(0 0 0 / 22%);
  }
  .msg_cotainer_send:after{
    content: "";
      position: absolute;
      width: 0;
      height: 0;
      bottom: -7px;
      right: 7px;
      box-sizing: border-box;
      border: 4px solid black;
      border-color: transparent transparent #FFF #FFFF;
      transform-origin: 0 0;
      transform: rotate(-45deg);
      box-shadow: -1px 1px 1px 0 rgb(0 0 0 / 22%);
  }  

    .chat-bubble .sending { 
        height: 15px;
        width: 15px;
        margin: 8px;
    }

    .chat-bubble{
        flex-wrap: wrap;
        padding-bottom : 10px;
    }

</style>
<style lang="scss">
    .m-chat-messages {
        .scroll-date {
            position: absolute !important;
            width: 100%;
            opacity: 0 !important;
            margin : 0 auto;
            z-index: 1000000000000 !important;
            top: 100px;
            span {
                display: inline-block;
                min-width: 100px;
                border-radius: 8px;
                background-color: rgba(0, 0, 0, 0.454);
                color: #FFF;
                padding: 0 5px;
            }
        }
    }
    .m-chat-messages:hover{
        .scroll-date {
            opacity: 1 !important;
        }
    }
</style>

