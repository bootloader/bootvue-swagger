<template>
    <div class="x-form">
        <span v-for="input in inputs" v-bind:key="input.key">
            <span v-if="!input.meta.hidden">
                <BaseVSelect 
                    v-if=" input.meta.inputType=='OPTIONS' && (input.meta.optionsSource || input.meta.options.length > 5)" 
                    :size="size" 
                    :name="(input.meta.title || input.meta.key)"
                    :optionKey="input.meta.optionsKey"
                    :optionlabel="input.meta.optionsLabel"
                    :options="input.meta.optionsSource || input.meta.options" 
                    v-model="input.config.value"
                    :value="input.meta.defaultValue"
                    :readonly="input.meta.readonly || (input.meta.createonly && !isnew)"
                    placeholder="Select"
                    searchable :clearable="false"
                    @change="onChange(input.meta,input.config)"
                    >
                </BaseVSelect>
                <ButtonRadioGroup v-else-if="input.meta.inputType=='OPTIONS'"
                    :name="(input.meta.title || input.meta.key)"
                        v-model="input.config.value" size="sm"
                        :options="input.meta.options"
                        :readonly="input.meta.readonly || (input.meta.createonly && !isnew)"
                        @change="onChange(input.meta,input.config)"
                />
                <base-input v-else  class="mb-0" :size="size"
                    :label="(input.meta.title || input.meta.key)"
                    v-model="input.config.value" 
                    :readonly="input.meta.readonly || (input.meta.createonly && !isnew)"
                    :value="input.meta.defaultValue"
                    :required="!input.meta.optional "
                    @change="onChange(input.meta,input.config)"
                >
                </base-input>
                <!-- <b-form-group v-else
                    class=""
                    :label="input.meta.title || input.meta.key">
                    <b-form-input id="input-1"
                        v-model="input.config.value" 
                        :readonly="input.meta.readonly || (input.meta.createonly && !empty(input.config.value))"
                        :value="input.meta.defaultValue"
                        @change="onChange(input.meta,input.config)"
                        trim></b-form-input>
                </b-form-group> -->
            </span>
        </span>
    </div>
</template>

<script>

    export default {
        name: "x-simple-form",
        components: {
        },
        props: {
            inputs: {
                type: Array,
                description: "pass list of input configs",
                default : function () {
                    return [{}];
                }
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
                empty(value){
                    return value == undefined || value === null || value === ""
                }
            }
        },
        mounted : function (argument) {
            
        },
        methods: {
            onChange(meta,config){
                this.$emit('change',{
                    meta : meta,
                    config : config
                });
            },
            getOutput() {
                return inputs;
            }
        }
    };
</script>
