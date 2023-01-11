<template>
    <span  v-if="m" class="m-chat-message-content">
        <span v-if="m.status == 'DELTD'" class="text-capitalize text-sm">
            <span class="fa fa-ban"></span>&nbsp;<i>message deleted&nbsp;</i>
        </span>
         <span v-else>
            <span v-if="m.text" v-linkify="{ className: 'my-clickable-link'}" >{{m.text | striphtml | newlines}}</span>
            <div v-if="m.attachments"> 
                <span v-if="m.template" ><span class="bi bi-code-square"/>&nbsp;{{m.template}}</span>
                <div class="input-group my-attachments">
                    <span class="my-attachment" :class="['mediaType-'+atch.mediaType]" v-for="(atch,i) in m.attachments" 
                        v-viewer="viewerOptions" v-bind:key="atch.mediaURL">
                        <img v-if="atch.mediaType == 'IMAGE'" :id="`attachment-${m.messageId}-${i}`"
                            :alt="atch.mediaCaption"
                            v-lazy="$formatters.https_thumburl(atch.mediaURL)" class="" :data-full-src="atch.mediaURL | https">
                        <audio-player v-else-if="atch.mediaType == 'AUDIO'" 
                                :file="atch.mediaURL"
                            ></audio-player>    
                        <a class="my-attachment-link text-center w-100 d-block bg-greyish" :id="`attachment-${m.messageId}-${i}`"
                            v-else :href="atch.mediaURL | https" target="_blank" download>
                            <my-icon type="fileType" 
                                :value="atch.mediaMimeType" 
                                :status="atch.mediaMimeType"
                                :meta="atch.mediaURL" :class="[atch.mediaMimeType,atch.mediaName]"/>
                        </a>
                        <label class="my-attachment-title mediaCaption"  :for="`attachment-${m.messageId}-${i}`"
                            v-if="atch.mediaCaption && atch.mediaCaption !== m.text">{{atch.mediaCaption}}</label>
                        <label class="my-attachment-title mediaName" :for="`attachment-${m.messageId}-${i}`"
                            v-else-if="atch.mediaName">{{atch.mediaName}}</label>
                    </span>
                </div>
            </div>
            <div v-else-if="m.vccards && m.vccards.length">
                <div class="input-group my-attachments">
                    <span class="my-attachment mediaType-vccard text-white" 
                        v-for="(atch,i) in m.vccards" v-bind:key="atch.mediaURL" >
                        <div class="d-flex" v-if="atch.name && atch.name.firstName">
                            <div class="vccard-icon">
                                <img :src="$global.MyDict.profilePicFun(null,atch.name.firstName)" 
                                    class="img-responsive img-circle user_img"/>
                            </div>
                            <div class="text-white vccard-details">
                                <div class="mx-2 my-1 vccard-name">{{atch.name.firstName}} {{atch.name.lastName}}</div>
                                <div v-if="atch.phones && atch.phones[0] && atch.phones[0].phone" 
                                    class="mx-2 fa fa-phone text-center">&nbsp;{{atch.phones[0].phone}}</div>
                                <div v-if="atch.emails && atch.emails[0] && atch.emails[0].email" 
                                    class="mx-2 fa fa-envelop text-center">&nbsp;{{atch.emails[0].email}}</div>
                            </div>
                        </div> 
                        <div class="" v-if="atch.locations && atch.locations.length">
                            <a  target="_blank" v-for="(loc,i) in atch.locations" class="d-flex"
                                v-bind:key="`attachment-${m.messageId}-${i}-loc`"
                                :href="`http://maps.google.com/?ie=UTF8&hq=&ll=${loc.latitude},${loc.longitude}&z=18`">
                                <div class="vccard-icon">
                                    <span class="fas fa-map-marked-alt"></span>
                                </div>
                                <a class="text-white text-sm" 
                                    v-bind:key="`vcard-location`+i" >
                                    <span class="text-white">{{loc.name}}</span><br/>
                                    <span class="text-white">{{loc.address}}</span><br/>
                                </a>
                            </a>    
                        </div>       
                        <div class="clearfix"></div>
                    </span>
                </div> 
            </div>   
            <div v-else-if="m.template" class="my-msg-template-tag">
                <span class="bi bi-code-square"></span>&nbsp;{{m.template}}
            </div>  
         </span>
    </span>
</template>

<script>

    import Vue from 'vue';
    import AudioPlayer from '@/@common/custom/components/AudioPlayer';

    import { vLinkify as linkify } from  "vue-linkifier";
    Vue.use(linkify)

    export default {
        name : "ChatMessageContent",
        components: {
            AudioPlayer
        },
        directives: {
            linkify
        },
        computed : {
            m : function (params) {
                return this.message;
            }
        },
        methods: {
            emitOnViewer(){
                this.$emit('viewer',true)
            }
        },
        data: function(){
            let __THAT = this;
            return {
                viewerOptions : {
                    url: 'data-full-src',
                    title: [4, (image, imageData) => `${image.alt}`],
                    className : "m-chat-message-content-viewer",
                    navbar : false,
                    show : function(){
                        __THAT.$emit('viewer',true)
                        console.log('show true');
                    },
                    hide : function(){
                        console.log('hide false')
                        __THAT.$emit('viewer',false)
                    }
                }
            }
        },
        props: {
            message : {
                type: Object,
                default : function () {
                    return {
                        text : ""
                    }
                }
            }
        }

    }

</script>
<style type="text/css" scoped>
    .my-msg-template-tag  {
        font-size: smaller;
        color: #00000085;
    }
    .my-attachments {
        justify-content: center;
        width: fit-content;
        background-color: rgba(255, 255, 255, 0.216);
        padding: 1px 1px 1px 3px;
    }
    .my-attachments .my-attachment {
        background-color: rgba(0, 0, 0, 0.216);
        cursor: pointer;
        padding: 1px; margin: 2px 2px 2px 0px;
        max-width: 100px; min-width: 100px; 
        min-height: 100px;   max-height: 100px;
    }
    .my-attachments .my-attachment+.my-attachment {
        max-width: 100px;
    }
    .my-attachments .my-attachment.mediaType-AUDIO {
        max-width: 250px; min-width: 250px; 
        min-height: 50px;   max-height: 100px;
    }
    .my-attachments .my-attachment.mediaType-AUDIO .my-attachment-title{
        display: none;
    }
    .my-attachments .my-attachment-title {
        background-color: rgb(0 0 0 / 70%);
        height: 30px; line-height: 15px; font-size: 0.6em;
        /* position: absolute;
        bottom: 2px; left: 2px;  right: 2px; */
        width: 100%;
        color: #FFF;
        padding: 1px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-top: -30px;
        display: block;
        z-index: 100000000000000000000!important;
        mix-blend-mode: hard-light;
    }
    .my-attachments img {
        width: 100%;
        opacity: 0.6;
    }
    .my-attachment-link {
        line-height: 60px;
        font-size: 70px;
        padding: 14px;
        text-align: center;
        margin-bottom: 0px;
    }
    .my-attachments .my-attachment.mediaType-vccard {
        max-width: 250px; min-width: 250px; 
        min-height: 50px;   max-height: 100px;
    }
    .my-attachments .my-attachment.mediaType-vccard .vccard-icon {
        width: 60px; height: 50px; 
        font-size: 2em;;
        text-align: center;
    }
    .my-attachments .my-attachment.mediaType-vccard .vccard-details {
        width: 230px; height: 50px; 
    }
    .my-attachments .my-attachment.mediaType-vccard .vccard-details .vccard-name{
        font-size: 15px;
        line-height: 18px;
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
    .m-chat-message-content-viewer.viewer-container .viewer-footer .viewer-title{
       white-space: pre-wrap !important;
       background-color: rgba(0, 0, 0, 0.802);
       color: #FFF;
       padding: 8px;
       border-radius: 5px;
    }
</style>
