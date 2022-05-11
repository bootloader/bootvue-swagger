<template>
    <span><i :class="[myTypeClass, valueClass, statusClass]"
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
        'false' : 'text-danger',
        'application/pdf' : 'text-danger',
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
    },
    fileType : {
        '_' : '', '$' : 'fa fa-file-alt',
        'application/pdf' : 'fa fa-file-pdf',
        'application/word' : 'fa fa-file-word', 
        'application/excel' : 'fa fa-file-excel',
        'application/csv' : 'fa fa-file-csv',
        'image/png' : 'fa fa-file-image',
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
        },
        status : {
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
        statusClass(){
            return this.status ? MAP.status[this.status.toLowerCase()] : '';
        },
    }
}
</script>