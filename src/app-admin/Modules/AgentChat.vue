<template>
          <div class="card card-shadow chat_box_wrapper">
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
                    </div>
                    <div  class="chat-header-right">
                        <div class="video_cam">
                            <span  @click="closeBox" v-tooltip="'Close'" style="cursor: pointer;">
                                <i class="fa fa-close"></i>
                            </span> 
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
            <i v-if="m.logs" class="log_icon fa fa-exclamation-triangle float-right" v-tooltip="m.logs+''"></i>
            <span class="msg_time_send">{{m.timestamp|formatDate}}&nbsp;&nbsp;<span class="msg_user">{{m.name ||'---'}}</span></span>
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

                </div>

                <div class="card-footer">

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
    import Loading from 'vue-loading-overlay';
    import mustache from 'mustache';
    import SlideUpDown from 'vue-slide-up-down'

    export default {
        components: {
            'font-awesome-icon': FontAwesomeIcon,
            Loading: Loading,SlideUpDown
        },
        props: {
            session: Object,
        },
        computed : {

        },
        data: () => ({
            message_text : "",quickReplies : null,
            selectedMedia : null,
            showMediaOptions : false,
            showChatOptions : false,
            lastMessageId : null,ilastMessageId :  null,
            MyDict,MyFlags,MyConst,
            isLoading : false,
            showQuickActions : false,
            activeChat : {
                messages : null
            }
        }),
        created () {
            console.log("created")
        },
        updated (){
            console.log("updated")
        },
        mounted (){
            this.loadMessages();
            this.loadQuickLabels();
        },
        beforeUnmount (){

        },
        methods: {
            async loadMessages(){
                console.log("GetSessionChats...");
                this.isLoading = true;
                //this.session.contactType = "TELEGRAM";
                var resp = await this.$store.dispatch('GetSessionChats',this.session);
                console.log("resp",resp)
                this.activeChat = resp;
                this.isLoading = false;
            },
            closeBox : function (argument) {
                this.$emit('close');
            },
            async loadQuickLabels(){
                return await this.$store.dispatch('LoadQuickLabels');
            },
        },

    }


</script>

<style type="text/css" scoped>
    .chat_box_wrapper {
        height: 100%;
        border-radius: 0px;
    }
    .chat-header-left{
        float: left;
    }
    .chat-header-right{
        float: right;
    }

    .user_info{
        margin-top: auto;
        margin-bottom: auto;
        margin-left: 15px;
      }
      .user_info span{
        font-size: 20px;
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
      .user_info p{
        font-size: 10px;
      }
    .user_img{
        max-height: 30px;
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

.msg_card_body{
  overflow-y: auto;
  background-color: #f5f5f5 !important;
  padding-bottom: 5px;
}
.msg_card_body-panel {
  width:100%
}
.msg_card_body-bubbles {
  min-height: calc(100% - 65px);
  min-height: -webkit-calc(100% - 65px);
  min-height: -moz-calc(100% - 65px);
}
.msg_card_body-panel hr{
  border-top: 1px solid #e0dddd;
  margin: 10px 0;
}


    .chat-bubble{
        flex-wrap: wrap;
        padding-bottom : 10px;
      }
      .msg_cotainer{
        margin-top: auto;
        margin-bottom: auto;
        margin-left: 10px;
        border-radius: 7px;
        background-color: #4b56c0d1;
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
          border-color: transparent transparent #4b56c0d1 #4b56c0d1;
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

      .log_icon {
        color: red;
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
