<template>
    <div class="d-flex justify-content-center"
        data-local-id="m.localId" :data-message-id="m.messageId">
        <i v-if="!m.messageId" class="sending fa fa-spinner fa-spin" >&nbsp;</i>
        <!-- Sticky Note  -->
        <div v-if="m.type=='N'" class="msg_cotainer_note">
            <div class="text">{{m.text | striphtml | newlines}}</div>
            <span class="msg_user" v-bind:class="{'float-right' : m.sender == MyConst.agent}">{{m.name | blank3dash}}</span>
            <span v-bind:class="{'float-right' : m.name == MyConst.agent}">
                {{m.timestamp|formatDate}}&nbsp;&nbsp;
            </span>
        </div>
        <div v-else class="msg_cotainer_action">
            {{m.timestamp|formatDate}}&nbsp;&nbsp;<span class="msg_user">{{m.name | blank3dash}}</span>&nbsp;<span class="fa fa-long-arrow-alt-right"/>&nbsp;{{m.action | striphtml | newlines}}
            <span v-if="m.logs"><i v-for="(log,index) in m.logs" class="prepend-comma" v-bind:key="index">
                &nbsp;{{log | log_option(m.action)| striphtml | newlines}}</i></span>
        </div>
    </div> 
</template>

<script>
    export default {
        name : "ChatMessageLog",
        components: {
        },
        computed : {
            m(){
               return this.message; 
            }
        },
        data: () => ({
        }),
        props: {
            message : {
                type: Object
            }
        }

    }

</script>
<style type="text/css" scoped>
    .prepend-comma+.prepend-comma:before {
        content: ",";
    }
    .msg_user {
        font-size: 10px;
        flex: 0 0 100%; 
        font-weight: 600;
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

</style>
