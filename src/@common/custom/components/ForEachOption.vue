<template>
    <span>
        <span v-for="(option,index) in model.options" v-bind:key="'options-'+index" class="options-wrapper">
              <slot name="option"  v-bind="{option}"  >
                    {{option.label || option.name || option.value || option.id }}
              </slot>
        </span>   
    </span>
</template>

<script>
    export default {
        components: {
        },
        props: {
            options: {
                default: '',
            }
        },
        data: () => ({
            model: {
                options: [],
                value: null,
                sender: '',
            },
        }),
        computed: {
            myOptions: function () {},
        },
        watch : {
            options : function(newVal, oldVal){
                this.loadChannels();
            }
        },
        mounted: function () {
            this.loadChannels();
        },
        methods: {
            async loadChannels() {
                if(this.options){
                    let resp = await this.$service.getX(this.options)
                    this.model.options = resp;  
                }
            }
        },
    }
</script>
