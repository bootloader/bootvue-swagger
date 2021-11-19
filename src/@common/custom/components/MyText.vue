<template>
    <my-v-select
        v-bind="$attrs"
        type="text"
    >
    </my-v-select>
</template>

<script>
    import MyVSelect from './MyVSelect.vue';
    export default {
        components: {
            MyVSelect
        }
    }
</script>
