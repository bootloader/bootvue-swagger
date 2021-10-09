<template>
    <div v-if="activeChat">
        <div v-for="m in activeChat.messages"><!-- LOOP Start -->
        

            <div v-if="MyFunc.isInbound(m.type) && (m.text || m.attachments)" 
                    class="d-flex justify-content-start mb-4 chat-bubble" :title="m.tags ? m.tags.categories : null" >
                <div class="img_cont_msg">
                    <span ssrc="assets/images/profile.png" class="rounded-circle user_img_msg"/>
                </div>
                <div class="msg_cotainer">
                    <span v-if="m.text" v-linkify="{ className: 'my-clickable-link'}" >{{m.text | striphtml | newlines}}</span>
                    <div v-if="m.attachments"> 
                        <span v-if="m.template" ><span class="fa fa-paperclip"/>&nbsp;{{m.template}}</span>
                        <div class="input-group my-attachments">
                            <span v-for="atch in m.attachments" v-viewer="viewerOptions" v-bind:key="atch.mediaURL">
                                <img v-if="atch.mediaType == 'IMAGE'"  
                                    v-lazy="formatters.https_thumburl(atch.mediaURL)" class="" :data-full-src="atch.mediaURL | https">
                                  <audio-player v-else-if="atch.mediaType == 'AUDIO'" 
                                        :file="atch.mediaURL"
                                    ></audio-player>    
                                <a v-else :href="atch.mediaURL | https" class="fa fa-file-alt float-right"></a>
                                <br/>
                                <small v-if="atch.mediaCaption">{{atch.mediaCaption}}</small>
                            </span>
                        </div>
                    </div>
                </div>
                <span class="msg_time"><span class="msg_user">{{m.name ||'---'}}</span>&nbsp;&nbsp;{{m.timestamp|formatDate}}</span>
            </div>

            <div v-else-if="MyFunc.isOutbound(m.type)" class="d-flex justify-content-end mb-4 chat-bubble" data-local-id="m.localId" :data-message-id="m.messageId">
                <div class="msg_cotainer_send">
                    <span v-if="m.text" v-linkify="{ className: 'my-clickable-link'}" >{{m.text | striphtml | newlines}}</span>
                    <div v-if="m.attachments"> 
                        <small v-if="m.template" ><span class="fa fa-paperclip"/>&nbsp;{{m.template}}</small>
                        <div class="input-group my-attachments">
                            <span v-for="atch in m.attachments" v-viewer="viewerOptions" v-bind:key="atch.mediaURL">
                                <img v-if="atch.mediaType == 'IMAGE'" 
                                    v-lazy="formatters.https_thumburl(atch.mediaURL)" class="" :data-full-src="atch.mediaURL | https">
                                <a v-else :href="atch.mediaURL | https" class="fa fa-file-alt float-right"></a>
                                <br/>
                                <small v-if="atch.mediaCaption">{{atch.mediaCaption}}</small>
                            </span>
                        </div>
                    </div>
                    <div v-else-if="m.template" class="my-msg-template-tag">
                        <span class="fa fa-tag"></span>&nbsp;{{m.template}}
                    </div>
                    <span class="msg_time_send">
                        
                        <span>{{m.timestamp|formatDate}}&nbsp;&nbsp;</span><span class="msg_user">{{m.name ||'---'}}</span> 
                        <span>&nbsp;&nbsp;</span>

                        <span v-if="m.logs || m.stamps" class="msg_status_send-wrapper">
                            <i v-if="!m.messageId" class="sending fa fa-spinner fa-spin msg_status_send" >&nbsp;</i>
                            <b-icon v-else-if="m.stamps.SENT_ERR" icon="exclamation-triangle"  scale=.8 v-tooltip="m.logs+''"
                                variant="danger" class="msg_status_send" ></b-icon>
                            <b-icon v-else-if="m.stamps.BLCKD" icon="slash-circle-fill"  scale=.8 v-tooltip="m.logs+''"
                                variant="danger" class="msg_status_send" ></b-icon>  
                            <b-icon v-else-if="m.logs || m.stamps.FAILD || m.stamps.NSENT || m.stamps.SENTX_ERR" 
                                icon="exclamation-triangle-fill"  scale=.8 v-tooltip="m.logs+''"
                                variant="danger" class="msg_status_send" ></b-icon>  
                            <b-icon v-else-if="m.stamps.READ" icon="check-all" 
                                variant="success" class="msg_status_send"></b-icon>
                             <b-icon v-else-if="m.stamps.DLVRD" icon="check-all" 
                                variant="dark" class="msg_status_send"></b-icon>
                             <b-icon v-else-if="m.stamps.SENTX" icon="check" 
                                variant="dark" class="msg_status_send"></b-icon>
                             <b-icon v-else-if="m.stamps.SENT" icon="check" 
                                variant="muted" class="msg_status_send muted"></b-icon>
                             <b-icon v-else="" icon="check" 
                                variant="light" class="msg_status_send"></b-icon>
                        </span>
                    </span>
                </div>
                <div class="img_cont_msg">
                    <span ssrc="assets/images/profile.png" class="rounded-circle user_img_msg"/>
                </div>
            </div>

            <div v-else-if="m.type=='A' || m.type=='L' || m.type=='N'" 
                class="d-flex justify-content-center chat-bubble chat-bubble-note" data-local-id="m.localId" :data-message-id="m.messageId">
                <i v-if="!m.messageId" class="sending fa fa-spinner fa-spin" >&nbsp;</i>
                
                <!-- Sticky Note  -->
                <div v-if="m.type=='N'" class="msg_cotainer_note">
                    <div class="text">{{m.text | striphtml | newlines}}</div>

                    <span class="msg_user" v-bind:class="{'float-right' : m.sender == MyConst.agent}">{{m.name ||'---'}}</span>
                    <span v-bind:class="{'float-right' : m.name == MyConst.agent}">
                        {{m.timestamp|formatDate}}&nbsp;&nbsp;
                    </span>
                </div>

                <div v-else class="msg_cotainer_action">
                    {{m.timestamp|formatDate}}&nbsp;&nbsp;<span class="msg_user">{{m.name ||'---'}}</span>&nbsp;<span class="fa fa-long-arrow-alt-right"/>&nbsp;{{m.action | striphtml | newlines}}
                    <i v-if="m.logs" v-for="log in m.logs" class="prepend-comma">
                        &nbsp;{{log | log_option(m.action)| striphtml | newlines}}</i>
                </div>
            </div> 


        </div> <!-- LOOP ENDS -->
    </div>

</template>

<script>

    import Vue from 'vue';
    import { MyFlags,MyDict,MyConst,MyFunc } from './../../services/global';
    import formatters from './../../services/formatters';
    import Loading from 'vue-loading-overlay';
    import tunnel from './../../services/tunnel';
    import mustache from 'mustache';
    import SlideUpDown from 'vue-slide-up-down'
    import AudioPlayer from '@/@common/custom/components/AudioPlayer';

    import debounce from 'debounce';
    import throttle from 'throttleit';

    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';

    import { Textcomplete } from "@textcomplete/core";
    import { TextareaEditor } from "@textcomplete/textarea";

    import { vLinkify as linkify } from  "vue-linkifier";
    Vue.use(linkify)

    export default {
        name : "ChatMessages",
        components: {
            Loading: Loading,SlideUpDown, vSelect :vSelect,
            AudioPlayer
        },
        directives: {
            linkify
        },
        computed : {

        },
        data: () => ({
            MyFlags,MyDict,MyConst,MyFunc,formatters,
            viewerOptions : {
                url: 'data-full-src'
            },
        }),
        created () {

        },
        updated (){

        },
        mounted (){

        },
        beforeUnmount (){

        },
        watch: {

        },
        methods: {

        },
        props: {
            isLoading : Boolean,
            activeChat : {
                type: Object
            }
        }

    }

</script>
<style type="text/css" scoped>

    .prepend-comma+.prepend-comma:before {
        content: ",";
    }

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

    .msg_cotainer_action, .msg_cotainer_note {
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 10px;
        border-radius: 7px;
        background-color: #e2e2e2f2;
        padding: 4px;
        position: relative;
        font-size: 10px;
    }
    .msg_cotainer_note {
        background-color: #fff9caf2;
        font-size: 10px;
        box-shadow: 0 1.5px 1.5px #00000052;
        min-width: 250px;
        max-width: 85%;
    }
    .msg_cotainer_note .text {
        border-bottom: 1px dashed #00000017;
        font-size: 13px;
        color: #481e00;
        box-shadow: 0px 16px 1px #ffffff29
        /*font-family: 'Reenie Beanie';*/
    }

    .chat-bubble{
        flex-wrap: wrap;
        padding-bottom : 10px;
    }

    .chat-bubble .my-msg-template-tag  {
        font-size: smaller;
        color: #00000085;
    }
</style>
<style type="text/css">
 
     .my-clickable-link {
        display: inline-block;
        max-width: 250px;
        overflow: hidden;
        word-wrap: normal;
        text-overflow: ellipsis;
        clear: none;
        white-space: nowrap
    }

</style>
