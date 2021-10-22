<template>
    <v-select
        :options="model.options"
        class="w-100" style="min-width: 220px;"
        v-model="model.value"
        :searchable="false"
        :clearable="false"
        placeholder="Select Account"
        @input="clickAction">
        <template #selected-option="option">
            <div class="">
                <span
                    class="contact_type contact_type-24 fab"
                    v-bind:class="
                        $global.MyDict.social[option.contactType]
                    "></span
                >&nbsp;&nbsp;{{ option.lane }}
            </div>
        </template>
        <template #open-indicator="{ attributes }">
            <span v-bind="attributes" class="fa fa-caret-down"></span>
        </template>
        <template #option="{ contactType, lane }">
            <span
                class="contact_type contact_type-24 fab"
                v-bind:class="$global.MyDict.social[contactType]"></span>
            {{ lane }}
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
                default: '/api/options/channels',
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
        mounted: function () {
            this.loadChannels()
        },
        methods: {
            async loadChannels() {
                let resp = await this.$service.getX(this.options)
                this.model.options = resp
            },
            clickAction: function () {
                let value = this.model.value ? this.model.value.channelId : null;
                this.$emit("input", value);
                this.$emit("change", value);
            }
        },
    }
</script>
