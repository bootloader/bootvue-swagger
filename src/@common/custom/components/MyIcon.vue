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
        'BOT' : "fa fa-robot",
        'AGENT' : 'fa fa-user-secret',
        'WEBHOOK' : 'openwebicons-webhooks'
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
            return this.myType[this.value] || this.myType["$"] || "";
        },
    }
}
</script>