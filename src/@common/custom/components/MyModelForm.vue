<template>
        <my-source :options="configs">
                <template #data="{options}">
                    <x-simple-form size="sm"
                        :inputs="options.map(function({item}){
                            let key = (item.path || item.key);
                            return {
                                meta : item,
                                config : { 
                                    key : item.key,
                                    path : item.path,
                                    value : JsonXPath({ path : '$.'+key,json : model})[0] || item.defaultValue || ''
                                }
                            }
                        })"
                        @change="onChange"
                    >
                    </x-simple-form>    
                </template>  
        </my-source> 
</template>

<script>
    import XSimpleForm from './XSimpleForm.vue';
    import JsonXPath from '@/@common/utils/JsonXPath'

    export default {
        name: "my-modal-form",
        components: {
            XSimpleForm
        },
        props: {
            configs: {
            },
            model : {
                type : Object
            },
            isnew : {
                type : Boolean,
                default : false
            },
            size : {
            }
        },
        data() {
            return {
                JsonXPath,
                empty(value){
                    return value == undefined || value === null || value === ""
                }
            }
        },
        computed : {
        },
        watch : {
        },
        mounted : function (argument) {
            
        },
        methods: {
            loadConfigs(){

            },
            onChange({meta,config}){
                var key = (meta.path || meta.key);
                console.log("onChange",key)
                const rs = JsonXPath({
                    path : '$.' +key,
                    json: this.model,
                    resultType: "all",
                    value : config.value
                });
                console.log("this.model",this.model)
                this.model.__ob__.dep.notify()
                this.$emit('change',this.model);
                this.$emit('input',this.model);
            },
            getOutput() {
                return inputs;
            }
        }
    };
</script>
