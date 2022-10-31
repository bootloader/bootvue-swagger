<template>
    <span><span :class="[myTypeClass[0], valueClass[0], myColorClass , statusClass[0]]"
        :id="`${myTypeClass[0]} = ${valueClass[0]} = ${myColorClass} = ${statusClass[0]}`">
        <slot v-if="noType" name="notype">
            {{valued|display(options)}}
        </slot>
    </span> <slot>
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
    waba : {
        '_' : [''], "$" : ["fa fa-circle"],
        'approved' : ["fa fa-circle", "text-success"], 
        'active' : ["fa fa-circle", "text-success"],
        'live' : ["fa fa-circle","text-success"],
        'rejected' : ["fa fa-circle",'text-danger'],
        'submitted' : ["fa fa-circle",'text-warning'],
        'true' : ["fa fa-circle",'text-success'],
        'false' : ["fa fa-circle",'text-danger'],
        'verified' : ["fa fa-check-circle",'text-success'],
        'ready' : ["fa fa-check-circle",'text-success'],
        'running' : ["fa fa-dot-circle",'text-success'],
        'certificate_declined' : ["fas fa-certificate",'text-warning'],
        'pending_deletion' : ["fa fa-minus-circle",'text-yellow'],
        'pending' : ["fa fa-circle",'text-yellow'],
    },
    switch : {
        '_' : ['my-switch'], '$' : ['no-type-status', 'text-success border-success'],
        'on' : ["fa fa-toggle-on",'text-success'],
        'true' : ["fa fa-toggle-on",'text-success'],
        'off' : ['fa fa-toggle-on fa-rotate-180', 'text-danger'],
        'false' : ['fa fa-toggle-on fa-rotate-180', 'text-danger'],
        'null' : ['fa fa-toggle-off'],
        'none' : ['fa fa-toggle-on fa-rotate-180','text-danger']
    },
    chatmode : {
        '_' : [''],  '$' : ['fa fa-th-large'],
        'bot' : ["fa fa-robot"],
        'agent' : ['fa fa-user-secret'],
        'webhook' : ['openwebicons-webhooks']
    },
    channel : {
        '_' : [''],
        'twitter' : ['fa fa-twitter'],
        'facebook' : ["fa fa-facebook"],
        'telegram' : ['fa fa-telegram'],
        'whatsapp' : ['fa fa-whatsapp'],
        'instagram' : ['fa fa-instagram'],
        'email' : ['fas fa-envelope'],
        'website' : ['fa fa-chrome'],
        '$' : function(value, status, meta){
		    value = value || "";
            if(this[value]){
                return this[value];
            }
            let prefix = value.split(":")[0];
            switch(prefix){
                case 'tw':
                    return this['twitter'];
                case 'fb':
                    return this['facebook'];
                case 'tg':
                    return this['telegram'];
                case 'wa360':
                case 'wa':
                    return this['whatsapp'];
                case 'ig':
                    return this['instagram'];
                case 'mailto':
                    return this['email'];
                default:
                    return this['website'];
            }
        }
    },
    senderType : {
        '_' : [''],  '$' : ['fa fa-th-large'],
        'bot' : ["fa fa-robot"],
        'system' : ['fa fa-robot'],
        'agent' : ['fa fa-user-secret'],
        'api' : ['openwebicons-webhooks'],
        'admin' : []
    },
    infoType : {
        '_' : [''], '$' : ['fa fa-question-circle'],
         'primary' : ["fa fa-dot-circle"],
         'secondary' : ["fa fa-minus-circle"],
         'success' : ["fa fa-check-circle"],
         'info' : ["fa fa-info-circle"],
         'warning' : ["fa fa-exclamation-circle"],
         'danger' : ["fa fa-times-circle"],
         'dark' : ["fa fa-stop-circle"]
    },
    messageType : {
        '_' : [''], '$' : ['fa fa-envelope'],
        "image" : ['fa fa-image'],
        "video" : ['fa fa-youtube']
    },
    fileType : {
        '_' : [''], '$' : ['fa fa-file-alt'],
        'application/pdf' : ['fa fa-file-pdf','text-danger'],
        'application/word' : ['fa fa-file-word','text-blue'], 
        'application/excel' : ['fa fa-file-excel'],
        'application/csv' : ['fa fa-file-csv'],
        'image' : ['fa fa-file-image'],
        'image/png' : ['fa fa-file-image'],
        'video' : ['fa fa-file-video','text-info'],
        '$' : function(value, status, meta){
            if(typeof meta == 'string'){
               let file =  meta.split('?')[0].split('.');  
               let ext = file[file.length-1];
                if(!ext) {
                    return ['fa fa-link'];
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
                    case 'mp4':
                       return this['video']; 
               }
            } else {

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
        variant : {
        },
        variantPrefix : {
            default : 'text-'
        },
        status : {
        }, 
        meta : {
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
        options : {
        },
        showNoType : {
            type : Boolean,
            default : false
        },
    },
    computed : {
        myType(){
            return MAP[this.type] || MAP.status || [];
        },
        myTypeClass(){
            return this.typeClass || this.myType._ || [""];
        },
        valued(){
            return (`${this.value}`).toLowerCase();
        },
        noType(){
            return  this.showNoType && this.valued && !this.myType[this.valued];
        },
        valueClass(){
            return this.myType[this.valued] 
                || (typeof this.myType["$"] == 'function' ? this.myType["$"](this.value,this.status,this.meta) : this.myType["$"]) 
                || "";
        },
        myColorClass (){
            if(this.variant){
                if((this.variant.indexOf('text-')==0) || (this.variant.startsWith('bg-'))){
                    return this.variant;
                } 
                return this.variantPrefix + this.variant;
            }
            return (!this.noColor ? this.valueClass[1] : null) || '';
        },
        statusClass(){
            return (this.status ? MAP.status[this.status.toLowerCase()] : '') || [];
        },
    }
}
</script>
<style scoped>
    .no-type-status {
        background: #ffffff00;
        color: #fff;
        border-radius: 6px;
        padding: 1px 5px;
        font-size: 12px;
        font-weight: 500;
        line-height: 22px!important;

        display: inline-block;
        padding: 0 10px;
        font-size: 10px;
        font-weight: 500;
        line-height: 18px!important;
        border: 1px solid transparent;
        border-radius: 2em;
        margin-right: 4px;
        cursor: pointer;
    }
    .my-switch.fa-toggle-on,.my-switch.fa-toggle-off  {
        font-size: 20px;
    }
</style>