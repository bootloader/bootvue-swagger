<template>
    <MyVSelect
        v-bind="$attrs"
        :options="options"
        class="w-100 agent-select" style="min-width: 220px;"
        v-model="model.value"
        :emptyDisplay="emptyDisplay"
        placeholder="Select Agent"
        @input="clickAction">
    </MyVSelect>
</template>

<script>
    import MyVSelect from '@/@common/custom/components/MyVSelect.vue';
    export default {
        components: {
            MyVSelect,
        },
        props: {
            options: {
                default: 'dispatch:LoadContactType',
            },
            emptyDisplay : {
            }
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
        methods: {
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