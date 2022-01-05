<template>
        <b-modal :id="mid"
            v-bind="$attrs"
            :title="'Confirmation'"
            buttonSize="sm"
            ok-variant="success"
            header-class="p-2 border-bottom-0"
            footer-class="p-2 border-bottom-0"
            centered>
            <slot>
                {{message}}
            </slot>   
            <template #modal-footer="{ok}">
                  <button @click="ok"
                    class="btn btn-primary">Ok</button>
            </template>
        </b-modal> 
</template>

<script>
    let counter = 0;
    export default {
        props : {
            options : {
            },
            value : {
            },
            messgage : {},
            autostart : {
                type : Boolean,
                default : false
            }
        },
        data:() => ({
            mid : 'my-model-' + (++counter)
        }),
        components: {
        },
        mounted(){
            if(this.autostart)
                this.$bvModal.show(this.mid);
        }
    }
</script>
