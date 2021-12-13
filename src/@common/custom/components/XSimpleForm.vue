<template>
    <div class="x-form">
        <span v-for="input in inputs" v-bind:key="input.key">
            <span v-if="!input.meta.hidden">
                <b-form-group  v-if="input.meta.inputType=='OPTIONS'" 
                    class=""
                    :label="input.meta.title || input.meta.key" 
                    v-slot="{ ariaDescribedby }">
                        <b-form-radio-group
                            id="btn-radios-2"
                            v-model="input.config.value"
                            :options="input.meta.options"
                            html-field="label"
                            text-field="value"

                            :readonly="input.meta.readonly || (input.meta.createonly && !empty(input.config.value))"
                            :aria-describedby="ariaDescribedby"
                            button-variant="outline-primary"
                            size="sm"
                            name="radio-btn-outline"
                            buttons
                        ></b-form-radio-group>
                </b-form-group>   
                <b-form-group v-else
                    class=""
                    :label="input.meta.title || input.meta.key">
                    <b-form-input id="input-1"
                        v-model="input.config.value" 
                        :readonly="input.meta.readonly || (input.meta.createonly && !empty(input.config.value))"
                        :value="input.meta.defaultValue"
                        @change="onChange(input.meta,input.config)"
                        trim></b-form-input>
                </b-form-group>
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
