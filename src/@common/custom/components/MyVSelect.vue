<template>
    <v-select
        :options="model.options"
        style="min-width: 220px;"
        v-model="model.value"
        v-bind="$attrs"
        :searchable="false"
        :clearable="false"
        @input="clickAction">
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
                default: '/options',
                 description: "examples;- getx:RelativeGetXUrl,dispatch:DispatchableEventName,data:PathNameIn@data"
            },
            searchable: {
                type: Boolean,
                default: true
            },
            clearable: {
                type: Boolean,
                default: true
            },
            emptyDisplay : {
                type: String,
                default: null
            },
            placeholder: {
                type: String,
                default: ""
            },
        },
        data: () => ({
            model : {
                options: [],
                value: null,
                sender: '',
            }
        }),
        computed :{
            myOptions : function(){

            }
        },
        watch : {
            value : function(newVal, oldVal){
                this.selectModelValue();
            },
            options : function(newVal, oldVal){
                this.loadOptions();
            }
        },
        mounted: function () {
            this.loadOptions()
        },
        methods: {
            async selectModelValue(){
                for(var i in this.model.options){
                    if(this.model.options[i].value == this.value){
                        this.model.value = this.model.options[i];
                    }
                }
            },
            fromOptions(options){
                let THIS = this;
                let hasEmptyValue = false;
                this.model.options = options.map(function(option){
                    if(typeof option == 'string' || typeof option == 'number'){
                        return {
                            value : option, label : option
                        };
                    } else {
                        if(option === null || option === undefined){
                            hasEmptyValue = true;
                            return {
                                value : option,
                                label : (THIS.emptyDisplay || THIS.placeholder)
                            };
                        };
                        let value = option.id || option.key || option.code || option.value || option.label || option.name;
                        let label = option.name || option.label || option.value || option.code || option.key || option.id;
                        return {
                            value : value,
                            label : label || ((value === null || value === undefined) ? (THIS.emptyDisplay || THIS.placeholder) : '')
                        };
                    }
                });
                if(!hasEmptyValue && THIS.emptyDisplay){
                   this.model.options = [{
                        value : null,
                        label : this.emptyDisplay
                    },...this.model.options];
                }
                this.selectModelValue();
            },
            async loadOptions(){
                if(this.options && (typeof this.options == 'string') && this.options.indexOf('data:') == 0){
                    let json = await import("@/@data/" + this.options.replace("data:","") + ".json");
                    this.fromOptions(json.options);
                } else if(this.options && (typeof this.options == 'string') && this.options.indexOf('getx:') == 0){
                    let url = this.options.replace("getx:","");
                    let resp = await this.$service.getX(url);
                    this.fromOptions(resp.results ? resp.results : resp);
                } else if(this.options && (typeof this.options == 'string') && this.options.indexOf('dispatch:') == 0){
                    let evenName = this.options.replace("dispatch:","");
                    let resp = await this.$store.dispatch(evenName);
                    this.fromOptions(resp.results ? resp.results : resp);
                } else if(this.options){      
                    this.fromOptions(this.options);
                }
            },
            clickAction: function () {
                let value = this.model.value ? this.model.value.value : null;
                this.$emit("input", value);
                this.$emit("change", value);
            },
        },
    }
</script>
<style lang="scss">
.agent-select{
    .vs__dropdown-toggle{
        background-color: #31a476;
        color: #fff;
    }
    
    .vs__selected, .vs__open-indicator{
        fill: #fff;
        color: #fff;
        font-weight: bold;
    }
}
</style>