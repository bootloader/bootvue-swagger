<template>
    <v-select
        :options="model.options"
        style="min-width: 220px;"
        v-model="model.value"
        v-bind="$attrs"
        :filterable="filterable"
        :searchable="searchable"
        :placeholder="placeholder"
        :clearable="clearable"
        @search="onSearch"
        @input="clickAction">

        <template #selected-option="option">
            <span v-if="selectedPrefixClass" v-bind:class="selectedPrefixClass">&nbsp;</span>{{option.label }}
        </template>

        <template #open-indicator="{ attributes }">
            <span v-bind="attributes" class="fa fa-caret-down"></span>
        </template>

        <template v-for="slotName in Object.keys($scopedSlots)" v-slot:[slotName]="slotScope">
              <slot :name="slotName" v-bind="slotScope"></slot>
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
                default: '/options',
                 description: "examples;- getx:RelativeGetXUrl,dispatch:DispatchableEventName,data:PathNameIn@data"
            },
            searchable: {
                type: Boolean,
                default: false
            },
            filterable : {
                type: Boolean,
                default: false  
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
            optionKey : {
                type : String,
                default : "key"
            },
            optionLabel : {
                type : String,
                default : "label"
            },
            value : {
                default : null
            },
            selectDefault : {
            },
            selectedPrefixClass : {
            },
            filter : {
            }
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
            selectModelValue(){
                for(var i in this.model.options){
                    if(this.model.options[i].value == this.value){
                        this.model.value = this.model.options[i];
                    }
                }
                if(this.selectDefault && (this.model.value === undefined || this.model.value === null)){
                    if(this.selectDefault==true && this.model.options[0]){
                        this.model.value = this.model.options[0];
                        this.clickAction();
                    }
                }
                console.log("option");
                this.$emit("option", this.model.value);
            },
            fromOptions(options){
                let THIS = this;
                let hasEmptyValue = false;
                this.model.options = options.map(function(option){
                    if(typeof option == 'string' || typeof option == 'number'){
                        return {
                            value : option, label : option, item : option
                        };
                    } else {
                        if(option === null || option === undefined){
                            hasEmptyValue = true;
                            return {
                                value : option,
                                label : (THIS.emptyDisplay || THIS.placeholder),
                                item : option
                            };
                        };
                        let value = option[THIS.optionKey] || option.id || option.key || option.code || option.value || option.label || option.name;
                        let label = option[THIS.optionLabel] || option.name || option.label || option.value || option.code || option.key || option.id;
                        return {
                            value : value,
                            label : label || ((value === null || value === undefined) ? (THIS.emptyDisplay || THIS.placeholder) : ''),
                            item : option
                        };
                    }
                });
                if(!hasEmptyValue && THIS.emptyDisplay){
                   this.model.options = [{
                        value : null,
                        label : this.emptyDisplay,
                        item : null,
                    },...this.model.options];
                }

                if(this.filter){
                    let filters = [];
                    if(Object.prototype.toString.call(this.filter) === '[object Array]') {
                        filters = [...this.filter];
                    } else if(Object.prototype.toString.call(this.filter) === '[object Object]') {
                        filters = [this.filter];
                    }
                    this.model.options  = this.model.options.filter(function(option){
                        return filters.some(function(filter){
                            for(var key in filter){
                                if(filter[key] !== option.item[key]){
                                    return false;
                                }
                            }
                            return true;
                        });
                    });
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
            onSearch : function (search, loading) {
                this.$emit("search", search, loading);
            },
            option :function (){
                return this.model.value;
            }
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