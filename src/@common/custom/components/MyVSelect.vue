<template>
    <v-select v-if="type=='dropdown'"
        :options="model.options"
        style="min-width: 220px;"
        v-model="model.value"
        v-bind="$attrs"
        :filterable="filterable"
        :searchable="searchable"
        :placeholder="placeholder"
        :clearable="clearable"
        :filter="search"
        @search="onSearch"
        :appendToBody="appendToBody"
        :calculatePosition="calculatePosition"
        @input="onChange">

        <template #selected-option="option">
            <span :class="option.selectedClass">
                <span v-if="selectedPrefixClass" :class="[selectedPrefixClass,'mr-1']">&nbsp;</span>
                <span v-if="option.prefixClass" :class="[option.prefixClass,'mr-1']">&nbsp;</span>{{option.label }}
            </span>
        </template>

        <template #option="option">
             <span :class="[option.optionClass]">
                <span v-if="option.prefixClass" :class="[option.prefixClass,'mr-1']">&nbsp;</span>{{option.label }}
             </span>  
        </template>

        <template #open-indicator="{ attributes }">
            <span v-bind="attributes" class="fa fa-caret-down"></span>
        </template>

        <template v-for="slotName in Object.keys($scopedSlots)" v-slot:[slotName]="slotScope">
              <slot :name="slotName" v-bind="slotScope"></slot>
        </template>

    </v-select>
    <span v-else>
        <slot name="selected-option"  v-bind="{option : model.value}" v-if="model.value" >
            <span v-if="selectedPrefixClass" v-bind:class="selectedPrefixClass">&nbsp;</span>{{model.value.label }}
        </slot>
    </span>
</template>

<script>
    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';
    import debounce from 'debounce';
    import { createPopper } from '@popperjs/core'

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
            optionContext : {
                type : String,
                default : null
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
            },
            search :{
            },
            type : {
                type : String,
                default : "dropdown"
            },
            autoPosition : {
                type : Boolean,
                default : false
            }
        },
        data: () => ({
            model : {
                options: [],
                value: null
            },
            placement: 'top'
        }),
        computed :{
            myOptions : function(){
            },
            appendToBody(){
                return this.autoPosition == true
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
        created : function(){
            this.onOption = debounce(this.onOption);
        },
        mounted: function () {
            this.loadOptions()
        },
        methods: {
            valueOnChange : function(newVal, oldVal){
                this.selectModelValue();
            },
            selectModelValue(){
                this.model.value = null;
                for(var i in this.model.options){
                    if(this.model.options[i].value == this.value){
                        this.model.value = this.model.options[i];
                    }
                }
                if(this.selectDefault && (this.model.value === undefined || this.model.value === null)){
                    if(this.selectDefault==true && this.model.options[0]){
                        this.model.value = this.model.options[0];
                        this.onChange();
                    }
                }
                this.onOption();
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
                        let context = THIS.optionContext ? option[THIS.optionContext] : option;
                        let value = context[THIS.optionKey] || context.id || context.key || context.code || context.value || context.label || context.name;
                        let label = context[THIS.optionLabel] || context.name || context.label || context.value || context.code || context.key || context.id;
                        return {
                            value : value,
                            label : label || ((value === null || value === undefined) ? (THIS.emptyDisplay || THIS.placeholder) : ''),
                            item : option,
                            prefixClass : option.prefixClass || option.icon,
                            optionClass : option.optionClass || option.class,
                            selectedClass : option.selectedClass || option.class,
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
                //console.log("filters",this.filter);
                if(this.filter){
                    let filters = [];
                    if(Object.prototype.toString.call(this.filter) === '[object Array]') {
                        filters = [...this.filter];
                    } else if(Object.prototype.toString.call(this.filter) === '[object Object]') {
                        filters = [this.filter];
                    }
                    //console.log("filters",filters);
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
                    let url = this.options.replace("getx:","");
                    let resp = await this.$service.getX(url);
                    this.fromOptions(resp.results ? resp.results : resp);
                } else if(this.options && (typeof this.options == 'string') && this.options.indexOf('get:') == 0){
                    let url = this.options.replace("get:","");
                    let resp = await this.$service.get(url);
                    this.fromOptions(resp.results ? resp.results : resp);
                } else if(this.options && (typeof this.options == 'string') && this.options.indexOf('dispatch:') == 0){
                    let evenName = this.options.replace("dispatch:","");
                    let resp = await this.$store.dispatch(evenName);
                    this.fromOptions(resp.results ? resp.results : resp);
                } else if(this.options){      
                    this.fromOptions(this.options);
                }
            },
            onChange: function () {
                let value = this.model?.value?.value;
                this.$emit("input", value);
                this.$emit("change", value);
            },
            onSearch : function (search, loading) {
                this.$emit("search", search, loading);
            },
            onOption :function (oldVal, newVal) {
               this.$emit("option", this.model.value);
            },
            option :function (){
                return this.model.value;
            },
            selected :function (){
                return this.model?.value;
            },
            calculatePosition(dropdownList, component, {width, top, left}){
                if(this.autoPosition){
                    return this.withPopper(dropdownList, component, {width, top, left});
                } else {
                    dropdownList.style.top = top;
                    dropdownList.style.left = left;
                    dropdownList.style.width = width;
                }
            },
            withPopper(dropdownList, component, { width }) {
                /**
                 * We need to explicitly define the dropdown width since
                 * it is usually inherited from the parent with CSS.
                 */
                dropdownList.style.width = width

                /**
                 * Here we position the dropdownList relative to the $refs.toggle Element.
                 *
                 * The 'offset' modifier aligns the dropdown so that the $refs.toggle and
                 * the dropdownList overlap by 1 pixel.
                 *
                 * The 'toggleClass' modifier adds a 'drop-up' class to the Vue Select
                 * wrapper so that we can set some styles for when the dropdown is placed
                 * above.
                 */
                const popper = createPopper(component.$refs.toggle, dropdownList, {
                    placement: this.placement,
                    modifiers: [
                    {
                        name: 'offset',
                        options: {
                        offset: [0, -1],
                        },
                    },
                    {
                        name: 'toggleClass',
                        enabled: true,
                        phase: 'write',
                        fn({ state }) {
                            component.$el.classList.toggle(
                                'drop-up',
                                state.placement === 'top'
                            )
                        },
                    },
                    ],
                })

                /**
                 * To prevent memory leaks Popper needs to be destroyed.
                 * If you return function, it will be called just before dropdown is removed from DOM.
                 */
                return () => popper.destroy()
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