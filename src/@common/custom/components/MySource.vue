<template>
    <component :is="tag">
        <slot name="data" v-bind="model">
            <i v-if="prependIcon && myIcon" :class="myIcon">&nbsp;</i>{{myDisplay}}
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
            invalidDisplay : {
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
            },
            prependIcon : {
                type : Boolean, 
                default : true
            }
        },
        data: () => ({
            model : {
                options: [],
                selected: null,
                value : null,
            }
        }),
        computed :{
            myDisplay : function(){
                return this.model?.selected?.label; 
            },
            myIcon : function(){
                return this.model?.selected?.item?.icon; 
            }
        },
        watch : {
            value : function(newVal, oldVal){
                this.valueOnChange(newVal, oldVal);
            },
            options : function(newVal, oldVal){
                this.loadOptions();
            },
            filter : function(newVal, oldVal){
                if(JSON.stringify(newVal) != JSON.stringify(oldVal))
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
                this.model.value = this.model.selected?.value;
                for(var i in this.model.options){
                    if(this.model.options[i].value == this.value){
                        this.model.selected = this.model.options[i];
                        this.model.value = this.model.selected?.value;
                    }
                }
                let oldOption = this.model.selected;
                //console.log("selectModelValue1",this.selectDefault,this.model.selected)
                if((this.model.selected === undefined || this.model.selected === null)){
                    if(this.selectDefault && this.selectDefault==true && this.model.options[0]){
                        this.model.selected = this.model.options[0];
                        this.model.value = this.model.selected?.value;
                        this.onChange(this.model.selected,oldOption);
                    } else if(this.invalidDisplay){
                        this.model.selected = {
                            label : this.invalidDisplay,
                            value : this.value
                        };
                        this.model.value = this.model.selected?.value;
                        this.onChange(this.model.selected,oldOption);
                    } 
                }
                //console.log("selectModelValue2",this.selectDefault,this.model.selected)
                this.$emit("option", this.model.selected);
            },
            fromOptions(options){
                let THIS = this;
                let hasEmptyValue = false;
                if(!options || !options.map){
                    console.error("options",options,'for',this);
                }

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
                        let value = THIS.$formatters.any(
                            option[THIS.optionKey], option.id, option.key , option.code , option.value , option.label , option.name
                        );
                        let label = option[THIS.optionLabel] || option.name || option.label || option.value || option.code || option.key || option.id;
                        return {
                            value : value,
                            label : label || ((value === null || value === undefined) ? (THIS.emptyDisplay || THIS.placeholder) : ''),
                            item : option,
                            prefixClass : option.prefixClass || option.icon,
                            _disabled : option._disabled
                        };
                    }
                }).filter(function(option){
                    if(option._disabled){
                        return false;
                    }
                    return true;
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
                                let filterValue = filter[key];
                                let existsQuery = false;
                                if(key.indexOf("!!") === 0){
                                    key = key.substr(2);
                                    existsQuery = true;
                                }
                                let meta = key.split(".");
                                let value = meta[1] 
                                        ? (option.item[meta[0]] ? option.item[meta[0]][meta[1]] : undefined) 
                                        : option.item[key];
                                if(existsQuery){
                                    if(filterValue){
                                        return value !== undefined && value !== null;
                                    } 
                                    return value === undefined || value === null;
                                } else if(filterValue !== value){
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
                if(this.options && (typeof this.options == 'string') 
                    && /^(data\:|@data\/)/.test(this.options) ){
                    let file =  this.options.split("#");   
                    let json = await import("@/@data/" + file[0].replace(/^(data:\/|data:|@data\/)/,"") + ".json");
                    this.fromOptions(json.options);
                } else if(this.options && (typeof this.options == 'string') 
                    && /^(json\:|@json\/)/.test(this.options) ){
                    let file =  this.options.split("#"); 
                    console.log("__webpack_public_path__",__webpack_public_path__); 
                    let jsonfile = __webpack_public_path__ + '/_json/' + file[0].replace(/^(json:\/|json:|@json\/)/,"") + ".json" 
                    let resp = await fetch(jsonfile);
                    let json = await resp.json();
                    //let resp = await this.$service.getX(jsonfile);
                    //this.fromOptions(resp.results ? resp.results : resp);
                    this.fromOptions(json.options);
                } else if(this.options && (typeof this.options == 'string') && this.options.indexOf('getx:') == 0){
                    let url = this.options.replace("getx:","").split("#");
                    let resp = await this.$service.getX(url[0]);
                    let results = url[1] || 'results';
                    this.fromOptions(resp[results] ? resp[results] : resp);
                } else if(this.options && (typeof this.options == 'string') && this.options.indexOf('get:') == 0){
                    let url = this.options.replace("get:","").split("#");
                    let resp = await this.$service.get(url[0]);
                    let results = url[1] || 'results';
                    this.fromOptions(resp[results] ? resp[results] : resp);
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