<template>
    <MyVSelect
            ref="myVSelect"
            :options="options"
             v-bind="$attrs"
            class="w-100 text-black"
            style="min-width: 220px"
            v-model="model.value"
            :searchable="false"
            :clearable="true"
            placeholder="Select Template" 
            @input="clickAction">

        <template #selected-option="option">
            <span v-if="$attrs.selectedPrefixClass" v-bind:class="$attrs.selectedPrefixClass">&nbsp;</span>
            {{option.item.desc }} ({{option.item.lang }})
        </template>

        <template #option="option">
            {{option.item.desc }} ({{option.item.lang }})
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
                default: 'getx:/api/tmpl/pushtemplate',
            },
            value: {
                default: null,
            },
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
