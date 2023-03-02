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
                    :readonly="input.meta.readonly || (input.meta.createonly && !isnew) || readonly"
                    :disabled="input.meta.readonly || (input.meta.createonly && !isnew) || readonly"
                    :placeholder="input.meta.example || 'Select'"
                    searchable :clearable="!!input.meta.optional" filterable
                    @change="onChange(input.meta,input.config)" >
                    <template #help>
                      <small class="text-xs" v-if="input.meta.desc">  
                          &nbsp;  <MyIcon type="infoType" value="info"/> {{input.meta.desc}}
                      </small>
                    </template>    
                </BaseVSelect>
                <ButtonRadioGroup v-else-if="input.meta.inputType=='OPTIONS'"
                    :name="(input.meta.title || input.meta.key)"
                        v-model="input.config.value"
                        :value="input.meta.defaultValue"
                         size="sm"
                        :options="input.meta.options"
                        :readonly="input.meta.readonly || (input.meta.createonly && !isnew) || readonly"
                        @change="onChange(input.meta,input.config)"
                />
                <b-alert v-else-if="input.meta.inputType=='MESSAGE'" show
                    :variant="input.meta.messageType.toLowerCase()">
                       <span> <MyIcon type="infoType" :value="input.meta.messageType"/> {{input.meta.title}}</span><br/>
                      <small style="white-space: pre-line;"> {{input.meta.desc}}</small>
                </b-alert>
                <div v-else-if="input.meta.inputType == 'JSON'" class="form-group form-group-input" >
                    <label class="form-control-label text-sm">
                        {{input.meta.title || input.meta.key}}
                    </label>
                    <v-jsoneditor 
                    v-model="input.config.value" :options="{
                      mode : 'code', mainMenuBar : false,
                      onChange : ()=>onChange(input.meta,input.config)
                    }" :plus="false" :height="settings.json_height || '400px'" @error="onJsonError"
                    />
                </div>
                <base-text-area v-else-if="input.meta.inputType == 'TEXTAREA'"  class="mb-0" :size="size"
                    :label="(input.meta.title || input.meta.key)" :prelabel="prelabel" :variant="variant"
                    v-model="input.config.value" 
                    :readonly="input.meta.readonly || (input.meta.createonly && !isnew) || readonly"
                    :value="input.meta.defaultValue"
                    :required="!input.meta.optional "
                    :placeholder="input.meta.example"
                    @change="onChange(input.meta,input.config)">
                </base-text-area>

                <base-input v-else  class="mb-0" :size="size"
                    :label="(input.meta.title || input.meta.key)" :prelabel="prelabel" :variant="variant"
                    v-model="input.config.value" 
                    :readonly="input.meta.readonly || (input.meta.createonly && !isnew) || readonly"
                    :value="input.meta.defaultValue"
                    :required="!input.meta.optional "
                    :placeholder="input.meta.example"
                    @change="onChange(input.meta,input.config)"
                >
                    <template #help>
                      <small class="text-xs" v-if="input.meta.desc">  
                          &nbsp;  <MyIcon type="infoType" value="info"/> {{input.meta.desc}}
                      </small>
                    </template>  
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

    import VJsoneditor from 'v-jsoneditor'
    export default {
        name: "x-simple-form",
        components: {
            VJsoneditor
        },
        props: {
            inputs: {
                type: Array,
                description: "pass list of input configs",
                default : function () {
                    return [{}];
                }
            },
            settings : {
                type : Object, default : function(){
                    return {}
                }
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
            },
            onJsonError(e){
                console.log("onJsonError",e)
            }
        }
    };
</script>
