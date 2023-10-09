<template>
        <my-source :options="configs">
                <template #data="{options}">
                    <x-simple-form size="sm" 
                        :readonly="readonly" :prelabel="prelabel" :variant="variant"
                        :inputs="options.map(function({item}){
                            let key  = item.ukey || item.key;
                            return {
                                meta : item,
                                config : { 
                                    key : key,
                                    path : item.path,
                                    value : key ? model[key] 
                                        : JsonXPath({ path : '$.'+item.path,json : model})[0] || item.defaultValue || ''
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
    import MySource from './MySource.vue';

    export default {
        name: "my-modal-form",
        components: {
            XSimpleForm,MySource
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
            },
            readonly : {
                type : Boolean, default : false
            },
            prelabel : { type : Boolean, default : false },
            variant : { type: String,  default : 'outline-success' }
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
                console.log("onChange",meta.path, meta.key)
                if(meta.path){
                    const rs = JsonXPath({
                        path : '$.' +meta.path,
                        json: this.model,
                        resultType: "all",
                        value : config.value
                    });
                } else {
                    let key = meta.ukey || meta.key;
                    this.model[key] = config.value;
                }
                //console.log("this.model",this.model)
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
