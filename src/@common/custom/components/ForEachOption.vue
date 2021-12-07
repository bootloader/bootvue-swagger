<template>
    <MySource :options="options" :filter="filter">
        <template #data="data">
            <component :is="optionTag" 
                v-for="(option,index) in data.options" v-bind:key="'options-'+index" 
                :class="['options-wrapper',optionClass]">
                <slot name="data" v-bind="{option}"  >
                    #{{index}} - {{option.label || option.name || option.value || option.id }}
                </slot>
            </component>  
        </template>   
    </MySource>
</template>

<script>
    import MySource from "./MySource.vue"

    export default {
        components: {
            MySource
        },
        props: {
            options: {
                default: '',
            },
            optionTag : {
                default: 'span',
            },
            optionClass : {
                default: '',
            },
            filter : {
            }
        },
        data: () => ({
        }),
        computed: {
        },
        watch : {
        },
        mounted: function () {
        },
        methods: {
        },
    }
</script>
