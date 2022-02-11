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
        @search="onSearch"
        :appendToBody="appendToBody"
        :calculatePosition="calculatePosition"
        @input="onChange">

        <template #selected-option="option">
            <span v-if="selectedPrefixClass" :class="[selectedPrefixClass,'mr-1']">&nbsp;</span>
            <span v-if="option.prefixClass" :class="[option.prefixClass,'mr-1']">&nbsp;</span>{{option.label }}
        </template>

        <template #option="option">
            <span v-if="option.prefixClass" :class="[option.prefixClass,'mr-1']">&nbsp;</span>{{option.label }}
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
                value: null,
                sender: '',
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
                    console.error("options",options)
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
                                let meta = key.split(".");
                                let value = meta[1] 
                                        ? (option.item[meta[0]] ? option.item[meta[0]][meta[1]] : undefined) 
                                        : option.item[key];
                                if(filter[key] === true){
                                    if(!value){
                                        return false;
                                    }
                                } else if(filter[key] !== value){
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
                    let json = await import("@/@data/" + this.options.replace(/^(data:|@data\/)/,"") + ".json");
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
            onChange: function () {
                let value = this.model.value ? this.model.value.value : null;
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