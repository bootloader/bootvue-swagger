<template>
    <b-button v-bind="$attrs" @click="safeclick" :disabled="disabled || loading"
        :size="size" :readonly="readonly || loading"
        :variant="variant"
    ><slot></slot><span v-if="loading">&nbsp;<i :class="['fa',spinnerClass,'fa-spin']"></i></span>
    </b-button > 
</template>

<script>
    export default {
        inheritAttrs: false,
        props : {
            spinner : {
                default : "refresh", //circle,cog,gear,refresh,spinner
            },
            disabled : {
                type : Boolean,
                default : false
            },
            readonly : {
                type : Boolean,
                default : false
            },
            size : {}, variant : {},
            onSafeclick : {
                type: Function,
                required: false // this is up to you
            }
        },
        data (){
            return {
                loading : false,
            }
        },
        components: {
        },
        computed : {
            spinnerClass(){
                return this.spinner == 'circle' ? 'fa-circle-o-notch' : `fa-${this.spinner}`
            }
        },
        methods : {
            async safeclick(e){
                console.log("safeclick enter");
                try {
                    if(this.onSafeclick){
                        this.loading = true;
                        await this.onSafeclick(e);
                    }
                    if(this.$listeners && this.$listeners.click){
                        this.loading = true;
                        await this.$listeners.click(e)
                    }
                } finally {
                    this.loading = false;
                }
                console.log("safeclick exit"); 
            }
        }
    }
</script>
