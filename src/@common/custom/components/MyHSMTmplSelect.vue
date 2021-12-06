<template>
    <MyVSelect
            ref="myVSelect"
            :options="options"
             v-bind="$attrs"
             v-on="$listeners"
            class="w-100 text-black"
            style="min-width: 220px"
            :value="value"
            v-model="model.value"
            :searchable="false"
            :clearable="true"
            :placeholder="placeholder" 
            @input="clickAction">

        <template #selected-option="option">
            <span v-if="$attrs.selectedPrefixClass" v-bind:class="$attrs.selectedPrefixClass">&nbsp;</span>
            {{option ? option.item.desc : null }} ({{option ? option.item.lang : null}})
        </template>

        <template #option="option">
            {{option ? option.item.desc : null }} ({{option ? option.item.lang : null }}) 
        </template>

    </MyVSelect>
</template>

<script>
    import MyVSelect from './MyVSelect.vue'
    export default {
        components: {
            MyVSelect,
        },
        props: {
            options: {
                default: 'getx:/api/tmpl/hsm',
            },
            value: {
                default: null,
            },
            placeholder :{
                default : "Select Template"
            }
        },
        data: () => ({
            model: {
                options: [],
                value: null,
                sender: '',
            },
        }),
        mounted: function () {
            this.model.value = this.value;
        },
        watch : {
            value(){
                this.model.value = this.value;
            }
        },
        methods: {
            clickAction: function () {
                //console.log("clickAction");
                let value = this.model.value;
                this.$emit("input", value);
                this.$emit("change", value);
            },
            option :function (){
                return this.$refs.myVSelect.option();
            }
        },
    }
</script>
