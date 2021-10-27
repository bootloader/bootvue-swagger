<template>
    <v-select
        :options="model.options"
        class="w-100 text-black"
        style="min-width: 220px"
        v-model="model.value"
        :searchable="false"
        :clearable="true"
        placeholder="Select Template"
        @input="clickAction">
        <template #selected-option="option">
            <div class="">{{ option.name }}</div>
        </template>
        <template #open-indicator="{ attributes }">
            <span v-bind="attributes" class="fa fa-caret-down"></span>
        </template>
        <template #option="{ name }">
            <span class="contact_type contact_type-24 fab"></span>
            {{ name }}
        </template>
    </v-select>
</template>

<script>
    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css'
    export default {
        components: {
            vSelect,
        },
        props: {
            options: {
                default: '/api/tmpl/pushtemplate',
            },
            value : {

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
            value : function(newVal, oldVal){
                this.selectModelValue();
            }
        },
        mounted: function () {
            this.loadChannels();
            this.selectModelValue();
        },
        methods: {
            async selectModelValue(){
                for(var i in this.model.options){
                    if(this.model.options[i].id == this.value){
                        this.model.value = this.model.options[i];
                    }
                }
            },
            async loadChannels() {
                let resp = await this.$service.getX(this.options)
                this.model.options = resp;  
                this.selectModelValue(); 
            },
            clickAction: function () {
                let value = this.model.value ? this.model.value.id : null
                this.$emit('input', value);
                this.$emit('change', value);
            },
        },
    }
</script>
