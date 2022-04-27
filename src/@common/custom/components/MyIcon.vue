<template>
    <span><i :class="[myTypeClass, valueClass]"
    /> <slot>
        </slot>
    </span>
</template>
<script>
var MAP = {
    status : {
        '_' : 'fa fa-circle',
        'approved' : "text-success",
        'rejected' : 'text-danger',
        'submitted' : 'text-warning',
        'true' : 'text-success',
        'false' : 'text-danger'
    },
    chatmode : {
        '_' : '',  '$' : 'fa fa-th-large',
        'bot' : "fa fa-robot",
        'agent' : 'fa fa-user-secret',
        'webhook' : 'openwebicons-webhooks'
    },
    messageType : {
        '_' : '', '$' : 'fa fa-question-circle',
         'primary' : "fa fa-dot-circle",
         'secondary' : "fa fa-minus-circle",
         'success' : "fa fa-check-circle",
         'info' : "fa fa-info-circle",
        'warning' : "fa fa-exclamation-circle",
        'danger' : "fa fa-times-circle",
         'dark' : "fa fa-stop-circle"
    }
}

export default {
    props : {
        type : {
            default : 'status'
        },
        typeClass : {
            default : ''
        },
        value : {
        },
        icon : {
            default : 'fa fa-circle'
        },
        noColor : {
            type : Boolean,
            default : false
        }
    },
    computed : {
        myType(){
            return MAP[this.type] || MAP.status;
        },
        myTypeClass(){
            return this.typeClass || this.myType._ ;
        },
        valueClass(){
            return this.myType[(this.value || '').toLowerCase()] || this.myType["$"] || "";
        },
    }
}
</script>