<template>
        <MyVSelect
            ref="myVSelect"
            :options="options"
             v-bind="$attrs"
            class="w-100" style="min-width: 220px;"
            v-model="model.value"
            :searchable="false"
            :clearable="false"
            placeholder="Select Account" :selectDefault="true"
            @input="clickAction">

            <template #selected-option="option">
                <div class="">
                    <span
                        class="contact_type contact_type-24 fac-bg fab"
                        v-bind:class="
                            $global.MyDict.social[option.item.contactType]
                        "></span
                    >&nbsp;&nbsp;{{ option.item.lane }}
                </div>
            </template>
            <template #option="{ item }">
                <span
                    class="contact_type contact_type-24 fac-bg fab"
                    v-bind:class="$global.MyDict.social[item.contactType]"></span>
                {{ item.lane }}
            </template>

        </MyVSelect>
   
</template>

<script>
    import MyVSelect from './MyVSelect.vue'
    export default {
        components: {
            MyVSelect
        },
        props: {
            options: {
                default: 'getx:/api/options/channels',
            },
            value: {
                default: null,
            },
        },
        data: () => ({
            model : {
                value: null,
                sender: '',
                option : null,
            }
        }),
        computed :{
        },
        mounted: function () {
            this.model.value = this.value;
        },
        methods: {
            clickAction: function () {
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
