<template>
    <my-v-select v-if="options"
        :options="options"
        :value="value"
        type="text"
        v-bind="$attrs"
    >
    </my-v-select>
    <span v-else>
        {{value}}
    </span>   
</template>

<script>
    import MyVSelect from './MyVSelect.vue';
    export default {
        props : {
            options : {
            },
            value : {
            }
        },
        components: {
            MyVSelect
        }
    }
</script>
