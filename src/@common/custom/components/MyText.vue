<template>
    <MySource :options="options" 
        :filter="filter" v-bind="$attrs"
        :optionLabel="optionLabel"
        :value="value">
    </MySource> 
</template>

<script>
    import MySource from './MySource.vue';
    export default {
        inheritAttrs: false,
        props : {
            options : {
            },
            value : {
            },
            filter : {
            },
            optionLabel : {
            }
        },
        components: {
            MySource
        }
    }
</script>
