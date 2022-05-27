<template>
    <span><i :class="[myTypeClass[0], valueClass[0], !noColor ? valueClass[1] : '' , statusClass[0]]"
    /> <slot>
        </slot>
    </span>
</template>
<script>
var MAP = {
    status : {
        '_' : ['fa fa-circle'],
        'approved' : ["text-success"],
        'rejected' : ['text-danger'],
        'submitted' : ['text-warning'],
        'true' : ['text-success'],
        'false' : ['text-danger'],
    },
    chatmode : {
        '_' : [''],  '$' : ['fa fa-th-large'],
        'bot' : ["fa fa-robot"],
        'agent' : ['fa fa-user-secret'],
        'webhook' : ['openwebicons-webhooks']
    },
    senderType : {
        '_' : [''],  '$' : ['fa fa-th-large'],
        'bot' : ["fa fa-robot"],
        'system' : ['fa fa-robot'],
        'agent' : ['fa fa-user-secret'],
        'api' : ['openwebicons-webhooks'],
        'admin' : []
    },
    messageType : {
        '_' : [''], '$' : ['fa fa-question-circle'],
         'primary' : ["fa fa-dot-circle"],
         'secondary' : ["fa fa-minus-circle"],
         'success' : ["fa fa-check-circle"],
         'info' : ["fa fa-info-circle"],
         'warning' : ["fa fa-exclamation-circle"],
         'danger' : ["fa fa-times-circle"],
         'dark' : ["fa fa-stop-circle"]
    },
    fileType : {
        '_' : [''], '$' : ['fa fa-file-alt'],
        'application/pdf' : ['fa fa-file-pdf','text-danger'],
        'application/word' : ['fa fa-file-word','text-blue'], 
        'application/excel' : ['fa fa-file-excel'],
        'application/csv' : ['fa fa-file-csv'],
        'image/png' : ['fa fa-file-image'],
        '$' : function(value, status, meta){
            if(typeof meta == 'string'){
               let file =  meta.split('?')[0].split('.');  
               let ext = file[file.length-1];
                if(!ext) {
                    return ['fa fa-link']
                } 
               switch(ext){
                    case 'xls':
                    case 'xlsx':
                       return this['application/excel'];
                    case 'docx':
                    case 'doc':
                       return this['application/word'];
                    case 'pdf':
                       return this['application/pdf'];   
               }
            }
            return ['fa fa-file-alt'];
        }
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
        }, 
        meta : {
        }
    },
    computed : {
        myType(){
            return MAP[this.type] || MAP.status || [];
        },
        myTypeClass(){
            return this.typeClass || this.myType._ || [];
        },
        valueClass(){
            return this.myType[(this.value || '').toLowerCase()] 
                || (typeof this.myType["$"] == 'function' ? this.myType["$"](this.value,this.status,this.meta) : this.myType["$"]) 
                || "";
        },
        statusClass(){
            return (this.status ? MAP.status[this.status.toLowerCase()] : '') || [];
        },
    }
}
</script>