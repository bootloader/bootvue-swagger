<template>
    <span  v-if="m">
        <span v-if="m.text" v-linkify="{ className: 'my-clickable-link'}" >{{m.text | striphtml | newlines}}</span>
        <div v-if="m.attachments"> 
            <span v-if="m.template" ><span class="fa fa-paperclip"/>&nbsp;{{m.template}}</span>
            <div class="input-group my-attachments">
                <span v-for="atch in m.attachments" v-viewer="viewerOptions" v-bind:key="atch.mediaURL">
                    <img v-if="atch.mediaType == 'IMAGE'"  
                        v-lazy="$formatters.https_thumburl(atch.mediaURL)" class="" :data-full-src="atch.mediaURL | https">
                    <audio-player v-else-if="atch.mediaType == 'AUDIO'" 
                            :file="atch.mediaURL"
                        ></audio-player>    
                    <a v-else :href="atch.mediaURL | https" target="_blank" class="fa fa-file-alt float-right" download></a>
                    <br/>
                    <small v-if="atch.mediaCaption">{{atch.mediaCaption}}</small>
                </span>
            </div>
        </div>
        <div v-else-if="m.template" class="my-msg-template-tag">
            <span class="fa fa-tag"></span>&nbsp;{{m.template}}
        </div>
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
            },
        },
        data: () => ({
            viewerOptions : {
                url: 'data-full-src'
            },
        }),
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
