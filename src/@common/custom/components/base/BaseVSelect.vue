<template>
  <validation-provider :rules="rules" :name="name" v-bind="$attrs" v-slot="{errors, valid, invalid, validated}"
  :class="['basic-component bc-v-select','bc-span', 'bc-layout-' + layout,'bc-size-' + size,
  disabled ? 'bc-disabled' : '', isMySelect ? 'bc-v-select-MySelect' : '']" ref="vp">
    <b-form-group class="form-group-input" :label-for="'fmg-bvs-' + inputId"
      :class="['layout-' + layout,
        {'is-question': question },
      ]">
      <slot name="label">
        <label v-if="!isPrelabel && (label || name)"
          :for="'fmg-bvs-' + inputId"
          :class="[
          {'focused': focused},
          {'is-valid': valid && validated }, 
          {'is-invalid': invalid && validated},
          {'has-value': value != ''},
          'text-'+size,
          labelClasses
        ]">
          {{label || name}}
        </label>
      </slot>
      <div :class="[
       {'focused': focused},
       {'input-group-alternative': alternative},
       {'has-label': (label || name) || $slots.label},
       {'has-prelabel' : isPrelabel},
       inputGroupClasses
       ]">
        <div v-if="isPrelabel" class="input-group-prepend">
            <slot name="prepend">
              <span v-if="prepend" class="input-group-text">{{prepend}}</span>
              <span v-else-if="prependClass" :class="prependClass" :variant="variant">
                <i v-if="prependIcon" :class="prependIcon"></i>
                <span v-else> {{label || name}}</span>
              </span>
              <b-button  v-else :variant="variant" :size="size">
                <i v-if="prependIcon" :class="prependIcon"></i>
                <span v-else> {{label || name}}</span>
              </b-button>
            </slot>
        </div>
        <my-select  v-if="isMySelect"
            :id="'fmg-bvs-' + inputId" ref="myVSelect" :size="size"
            :placeholder="$attrs.placeholder"
            :value="value" 
            v-on="listeners"
            v-bind="$attrs" 
            :options="options" :optionKey="optionKey" :optionLabel="optionLabel" :optionContext="optionContext"
            :emptyDisplay="emptyDisplay"
            :valid="valid" 
            :required="required" :disabled="disabled"
            :autoPosition="autoPosition"
            :filter="filter" :search="search"
             :searchable="searchable" :clearable="clearable"
            :class="['text-'+size, 'v-select-'+size,
              {'is-valid': valid && validated && successMessage}, 
              {'is-invalid': invalid && validated}, inputClasses]"
            >
            <template v-for="slotName in Object.keys($scopedSlots)" v-slot:[slotName]="slotScope">
              <slot :name="slotName" v-bind="slotScope"></slot>
            </template>
        </my-select> 
        <my-v-select v-else
            :id="'fmg-bvs-' + inputId" ref="myVSelect" :size="size"
            :placeholder="$attrs.placeholder"
            :value="value" 
            v-on="listeners"
            v-bind="$attrs" 
            :options="options" :optionKey="optionKey" :optionLabel="optionLabel" :optionContext="optionContext"
            :emptyDisplay="emptyDisplay"
            :valid="valid" 
            :required="required" :disabled="disabled"
            :autoPosition="autoPosition"
            :filter="filter" :search="search"
             :searchable="searchable" :clearable="clearable"
            :class="['text-'+size, 'v-select-'+size,
              {'is-valid': valid && validated && successMessage}, 
              {'is-invalid': invalid && validated}, inputClasses]"
            >
            <template v-for="slotName in Object.keys($scopedSlots)" v-slot:[slotName]="slotScope">
              <slot :name="slotName" v-bind="slotScope"></slot>
            </template>
        </my-v-select>

        <div v-if="feedback"  class="input-group-append">
            <span class="input-group-text">
               <i class="fa" :class="[
                { 'fa-exclamation-circle text-danger' : errors[0]},
                { 'fa-check-circle text-success' : valid && validated }
               ]"></i>
            </span>
        </div>
        <div v-if="appendIcon || $slots.append || textLimit>0" class="input-group-append">
          <span class="input-group-text">
               <slot name="append">
                  <span v-if="textLimit>0" class="">
                    {{value ? value.length : 0}}/{{textLimit}}
                  </span>
                  <i v-else :class="appendIcon"></i>
              </slot>
          </span>
        </div>
        <slot name="infoBlock"></slot>
      </div>
      <span class="input-bottom">
          <slot name="help">
              <div class="help-feedback" v-if="showHelpMessage">
                {{helpMessage || $attrs.placeholder}}
              </div>
          </slot>
          <password-meter v-if="strengthBar" v-show="strengthBar" :password="value" @score="listeners.score" />
          <slot name="success">
            <div class="valid-feedback" v-if="valid && validated && successMessage">
              {{successMessage}}
            </div>
          </slot>
          <slot name="error">
            <div v-if="errors[0]" class="invalid-feedback" style="display: block;">
              {{ errors[0] }}
            </div>
          </slot>
      </span>  
    </b-form-group>
  </validation-provider>
</template>
<script>
 
 import MyVSelect from '@/@common/custom/components/MyVSelect.vue';
 import MySelect from '@/@common/custom/components/MySelect.vue';

 var ID_COUNTER = 0;

  export default {
    components: {MyVSelect ,MySelect},
    inheritAttrs: false,
    name: "base-text-area",
    props: {
      required: {
        type: Boolean,
        description: "Whether input is required (adds an asterix *)"
      },
      layout : {
        type : String,
        default : "default",
        description: "ex : flushed"
      },
      question: {
        type: Boolean,
        default: false,
        description: "Whether to amnimate placeholder to lable"
      },
      textCompleteStrategies : {
        type: Array,
        default: null,
      },
      feedback: {
        type: Boolean,
        default: false,
        description: "Whether to show feedback icon"
      },
      strengthBar : {
        type: Boolean,
        default: false,
        description: "Whether to show Password Strength Bar"
      },
      textLimit : {
        type: Number,
        default: 0,
      },
      group: {
        type: Boolean,
        description: "Whether input is an input group (manual override in special cases)"
      },
      alternative: {
        type: Boolean,
        description: "Whether input is of alternative layout"
      },
      label: {
        type: String,
        description: "Input label (text before input)"
      },
      error: {
        type: String,
        description: "Input error (below input)"
      },
      successMessage: {
        type: String,
        description: "Input success message",
        default: ''
      },
      helpMessage: {
        type: String,
        description: "Input help message",
        default: ''
      },
      labelClasses: {
        type: String,
        description: "Input label css classes",
        default: "form-control-label"
      },
      inputClasses: {
        type: String,
        description: "Input css classes"
      },
      inputGroupClasses: {
        type: String,
        description: "Input group css classes"
      },
      prelabel: {
        type: Boolean,
        default: false,
        description: "Prepend Label (left)"
      },
      variant : { type: String,  default : 'outline-success' },
      prepend : {
         type: String
      },
      prependIcon: {
        type: String,
        description: "Prepend icon (left)"
      },
      prependClass: {
        type: String,
        description: "Prepend Class (left)"
      },
      value: {
        type: [String, Number],
        description: "Input value"
      },
      type: {
        type: String,
        description: "Input type",
        default: "text"
      },
      appendIcon: {
        type: String,
        description: "Append icon (right)"
      },
      prependIcon: {
        type: String,
        description: "Prepend icon (left)"
      },
      rules: {
        type: [String, Array, Object],
        description: 'Vee validate validation rules',
        default: ''
      },
      name: {
        type: String,
        description: 'Input name (used for validation)',
        default: ''
      },
      size: {
        type: String,
        description: 'size sm/md/lg/xl',
      },
      layout : {
        type : String,
        default : "default"
      },
      options : {
      },
      optionKey : {
          type : String,
          default : "key"
      },
      optionLabel : {
          type : String,
          default : "label"
      },
      optionContext : {
      },
      filter : {
      },
      search : {
      },
      emptyDisplay :{},
      autoPosition : {
          type : Boolean,
          default : false
      },
      clearable : {
        type: Boolean,
        default: false
      },
      searchable : {
        type: Boolean,
        default: false
      },
      disabled : {
        type: Boolean,
        default: false
      },
      latest : {
        type: Boolean,
        default: false
      },
      version : {
        type: String,
        default: 'MyVSelect'
      }
    },
    data() {
      return {
        focused: false,
        inputId : ++ID_COUNTER,
      };
    },
    created :  function (params) {
        console.log("Created", this.options)
    },
    computed: {
      listeners() {
        return {
          ...this.$listeners,
          //input: this.updateValue,
          focus: this.onFocus,
          blur: this.onBlur,
          score : this.onScore,
          change : this.onChange
        };
      },
      slotData() {
        return {
          focused: this.focused,
          error: this.error,
          ...this.listeners
        };
      },
      hasIcon() {
        const { append, prepend } = this.$slots;
        return (
          append !== undefined ||
          prepend !== undefined ||
          this.appendIcon !== undefined ||
          this.prependIcon !== undefined ||
          this.prelabel !== undefined ||
          this.textLimit > 0 ||
          this.group
        );
      },
      showHelpMessage(){
        if(this.helpMessage){
          return true;
        }
      },
      isPrelabel(){
        return this.prependIcon || this.prelabel || this.$slots.prepend || this.prepend || this.prependClass
      },
      isMySelect(){
        return this.latest || (this.version=='MySelect')
      }
    },
    methods: {
      updateValue(value) {
        if(value?.target){
          value = (value?.target?.value);
        }
        this.emitValue(value);
      },
      emitValue(value){
        this.$emit("input", value);
        //this.$emit("change", value);
      },
      onChange(evt){
        setTimeout(()=>this.$refs.vp.validate());
        this.$emit("change", evt);
      },
      onFocus(evt) {
        this.focused = true;
        this.$emit("focus", evt);
      },
      onBlur(evt) {
        this.focused = false;
        this.$emit("blur", evt);
      },
      onScore(evt) {
        this.$emit("score", evt);
      },
      selected :function (){
          return this.$refs?.myVSelect?.selected();
      },
    }
  };
</script>
<style>
</style>
