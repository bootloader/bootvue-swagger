<template>
    <span><i :class="[icon, colorClass]"
    /> <slot>
        </slot>
    </span>
</template>
<script>
var MAP = {
    approved : "s",
    rejected : 'd',
    submitted : 'w',
    true : 's',
    false : 'd'
}

export default {
    props : {
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
        colorClass(){
            if(this.noColor){
                return '';
            }
            let status = MAP[this.value];
            if(status == 's'){
                return 'text-success';
            }
            if(status == 'd'){
                return 'text-danger';
            }
            if(status == 'w'){
                return 'text-warning';
            }

        }
    }
}
</script>