<template>
    <v-select
        :options="model.options"
        class="w-100 agent-select" style="min-width: 220px;"
        v-model="model.value"
        :searchable="false"
        :clearable="false"
        placeholder="Select Agent"
        @input="clickAction">
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
                default: '/admin/fetch-agent-chat-session-list',
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
            this.loadAgent()
        },
        methods: {
            async loadAgent() {
            var resp = await this.$store.dispatch('LoadAgentList');
            this.model.options = resp.filter(v=>v)
            },
            clickAction: function () {
                let value = this.model.value ? this.model.value : null;
                this.$emit("input", value);
                this.$emit("change", value);
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