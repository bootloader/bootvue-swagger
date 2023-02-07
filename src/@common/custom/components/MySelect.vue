<template>
        <my-source :options="options" ref="source"
                :optionKey="optionKey"
                :optionLabel="optionLabel"
                :emptyDisplay="emptyDisplay"
                :selectDefault="selectDefault"
                :filter="filter"
                :value="value"
                v-on="listeners"
                >
                <template #data="{options}">
                    <v-select v-if="type=='dropdown'"
                        :options="options"
                        style="min-width: 220px;"
                        v-model="model.selected"
                        v-bind="$attrs"
                        :filterable="filterable"
                        :searchable="searchable"
                        :placeholder="placeholder"
                        :clearable="clearable"
                        :filter="search"
                         @search="onSearch"
                        :appendToBody="appendToBody"
                        :calculatePosition="calculatePosition"
                        @input="onChange"
                        >
                        <template #selected-option="option">
                            <span :class="option.selectedClass">
                                <span v-if="selectedPrefixClass" :class="[selectedPrefixClass,'mr-1']">&nbsp;</span>
                                <span v-if="option.item && option.item.prefixClass" :class="[option.item.prefixClass,'mr-1']">&nbsp;</span>{{option.label}}
                            </span>
                        </template>
                        <template #option="option">
                            <span :class="[option.item.optionClass]">
                                <span v-if="option.item.prefixClass" :class="[option.item.prefixClass,'mr-1']">&nbsp;</span>{{option.label }}
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
        </my-source>            
</template>

<script>
    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';
    import { createPopper } from '@popperjs/core'
    import MySource from '@/@common/custom/components/MySource.vue'

    export default {
        components: {
            vSelect,MySource
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
                selected : null,
                value: null
            },
            placement: 'top'
        }),
        computed :{
            currentValue(){

            },
            listeners() {
                return {
                ...this.$listeners,
                option : this.onOption
               // focus: this.onFocus,
                };
            },
            appendToBody(){
                return this.autoPosition == true
            }
        },
        watch : {

        },
        methods: {
            selected :function (){
                return this.model?.selected;
            },
            option :function (){
                return this.selected();
            },
            async onChange(newVal,oldVal) {
                console.log("onChange",newVal,oldVal)
                let value = newVal?.value;
                this.$emit("input", value);
                this.$emit("change", value);
            },
            onSearch : function (search, loading) {
                this.$emit("search", search, loading);
            },
            onOption :function (option) {
                this.model.selected = option;
                this.$emit("option", option);
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