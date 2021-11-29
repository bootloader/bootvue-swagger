<template>
    <component :is="tag">
        <slot name="data" v-bind="model">
            {{myDisplay}}
        </slot>
    </component>
</template>

<script>
    export default {
        components: {
        },
        props: {
            options: {
                default: '/options',
                 description: "examples;- getx:RelativeGetXUrl,dispatch:DispatchableEventName,data:PathNameIn@data"
            },
            emptyDisplay : {
                type: String,
                default: null
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
            filter : {
            },
            tag : {
                type : String,
                default : "span"
            }
        },
        data: () => ({
            model : {
                options: [],
                selected: null
            }
        }),
        computed :{
            myDisplay : function(){
                return this.model?.selected?.label; 
            }
        },
        watch : {
            value : function(newVal, oldVal){
                this.valueOnChange(newVal, oldVal);
            },
            options : function(newVal, oldVal){
                this.loadOptions();
            }
        },
        mounted: function () {
            this.loadOptions()
        },
        methods: {
            valueOnChange : function(newVal, oldVal){
                this.selectModelValue();
            },
            selectModelValue(){
                this.model.selected = null;
                for(var i in this.model.options){
                    if(this.model.options[i].value == this.value){
                        this.model.selected = this.model.options[i];
                    }
                }
                let oldOption = this.model.selected;
                 console.log("selectModelValue1",this.selectDefault,this.model.selected)
                if(this.selectDefault && (this.model.selected === undefined || this.model.selected === null)){
                    if(this.selectDefault==true && this.model.options[0]){
                        this.model.selected = this.model.options[0];
                        this.onChange(this.model.selected,oldOption);
                    }
                }
                console.log("selectModelValue2",this.selectDefault,this.model.selected)
                this.$emit("option", this.model.selected);
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
                            item : option,
                            prefixClass : option.prefixClass || option.icon
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
                                if(filter[key] === true){
                                    if(!option.item[key]){
                                        return false;
                                    }
                                } else if(filter[key] !== option.item[key]){
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
            async onChange(newVal,oldVal) {
                if(newVal != oldVal){
                    let value = this.model?.selected?.value;
                    this.$emit("input", value);
                    this.$emit("change", value);
                }
            },
            onSearch : function (search, loading) {
                this.$emit("search", search, loading);
            },
            selected :function (){
                return this.model?.selected;
            },
            option :function (){
                return this.selected();
            }
        },
    }
</script>