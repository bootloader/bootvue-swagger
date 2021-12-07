<template>
    <component :is="tag" @click="onClick">
        <slot v-if="active" name="active">
            <span 
                v-tooltip="active ? activeTitle : title" :class="activeClass">
            </span>
        </slot>
        <slot v-else>
            <span 
                v-tooltip="active ? activeTitle : title" :class="inactiveClass">
            </span>
        </slot>
    </component>
</template>
<script>
export default {
    props : {
        api : {
        },
        tag : {
            default : "span"
        },
        active : {
            type : Boolean,
            default : false
        },
        activeClass : {
            default : "fa fa-toggle-on"
        },
        inactiveClass : {
             default : "fa fa-toggle-off"
        },
        title : {
        },
        activeTitle : {
        },
        body : {
        },
        params : {
        }
    },
    computed : {
    },
    methods : {
        async onClick(){
            console.log("this.body",this.body)
            let resp = await this.$service.post(this.api,this.body,{
                params : this.params
            });
            this.$emit("complete", resp);
        }
    }
}
</script>