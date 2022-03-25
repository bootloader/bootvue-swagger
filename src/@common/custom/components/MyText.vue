<template>
    <MySource :options="options" 
        :filter="filter" v-bind="$attrs"
        :optionLabel="optionLabel" :emptyDisplay="emptyDisplay" :invalidDisplay="invalidDisplay"
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
            },
            emptyDisplay :{},
            invalidDisplay : {}
        },
        components: {
            MySource
        }
    }
</script>
