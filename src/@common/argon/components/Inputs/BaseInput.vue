<template>
  <validation-provider :rules="rules" :name="name" v-bind="$attrs" v-slot="{errors, valid, invalid, validated}"
    :class="['basic-component bc-input','bc-span', 'bc-layout-' + layout, 'bc-size-' + size,
    $attrs.disabled ? 'bc-disabled' : '' ]">
    <b-form-group class="form-group-input" :label-for="'fmg-bi-' + inputId"
      :class="[
        {'is-question': question }
      ]">
      <slot name="label">
        <label v-if="!isPrelabel && fieldLabel" 
          :for="'fmg-bi-' + inputId"
          :class="[
          {'focused': focused},
          {'is-valid': valid && validated }, 
          {'is-invalid': invalid && validated},
          {'has-value': value != '' || autofilled},
          'text-'+size,
          labelClasses
        ]">
          {{fieldLabel}}
        </label>
      </slot>
      <div :class="[
       {'input-group': hasIcon || (feedback)},
        size ? 'input-group-'+size : '',
       {'focused': focused},
       {'input-group-alternative': alternative},
       {'has-label': fieldLabel || $slots.label},
        {'has-prelabel' : isPrelabel},
       inputGroupClasses
       ]">
        <div v-if="isPrelabel" class="input-group-prepend">
          <slot name="prepend">
            <span v-if="prepend" class="input-group-text">{{prepend}}</span>
            <span v-else-if="prependClass" :class="prependClass" :variant="variant">
              <i v-if="prependIcon" :class="prependIcon"></i>
               <span v-else> {{fieldLabel}}</span>
            </span>
            <b-button  v-else :variant="variant">
              <i v-if="prependIcon" :class="prependIcon"></i>
               <span v-else> {{fieldLabel}}</span>
            </b-button>
          </slot>
        </div>
        <slot v-bind="slotData">
          <input 
            ref="input"
            :id="'fmg-bi-' + inputId"
            v-model="displayValue"
            :type="clearable ? 'search' : type"
            v-on="listeners"
            v-bind="$attrs" 
            :valid="valid" 
            :placeholder="question ? '' : $attrs.placeholder"
            :required="required"
            class="form-control"
            :list="'fmg-bi-' + inputId + '-suggestions'"
            :class="[
                size ? 'form-control-'+size : '',
                {'is-valid': valid && validated && successMessage}, 
                {'is-invalid': invalid && validated}, inputClasses]"
                :autocomplete="suggestionValid ? 'off' : undefined">
        </slot>
        <div v-if="suggestionValid && suggestionValid.length" class="bc-input-suggestions"
          @mouseenter="mouseEnter"  @mouseleave="mouseLeave">
          <div v-for="s in suggestionValid" :value="s" v-bind:key="s" @click="emitValue(s)">
            {{s}}
          </div>
        </div>
        <div v-if="feedback"  class="input-group-append">
            <span class="input-group-text">
               <i class="fa" :class="[
                { 'fa-exclamation-circle text-danger' : errors[0]},
                { 'fa-check-circle text-success' : valid && validated }
               ]"></i>
            </span>
        </div>
        <div v-if="link" class="input-group-append input-group-append-link">
            <a target="_blank" :href="value" class="btn btn-outline-success fa fa-external-link"></a>
        </div> 
        <div v-if="copy" class="input-group-append input-group-append-copy">
            <b-button v-clipboard:copy="value" :variant="variant" class="fa fa-clipboard" 
            v-tooltip="'Copy ' + fieldLabel"
            ></b-button>
        </div> 
        <div v-if="append || appendIcon || $slots.append || (textLimit>0) ||  $slots.actions" class="input-group-append">
          <span v-if="append || appendIcon || $slots.append || (textLimit>0)" 
            class="input-group-text" :class="[ 'border-'+variant, 'text-'+variant, appendClass ]" @click="onCommit">
              <slot name="append" >
                  <span v-if="textLimit>0" class="">
                    {{value ? value.length : 0}}/{{textLimit}}
                  </span>
                  <i v-else-if="appendIcon" :class="appendIcon"></i>
                  <span v-else-if="append">{{append}}</span>
              </slot>
          </span>
          <slot name="actions" >

          </slot>  
        </div>
        <slot name="infoBlock"></slot>
      </div>
      <span class="input-bottom">
          <slot name="help">
              <div class="help-feedback" v-if="showHelpMessage">
                {{helpMessage || $attrs.placeholder}}
              </div>
          </slot>
          <password-meter v-show="strengthBar" :password="`${value}`" @score="listeners.score" />
          <slot name="success">
            <div class="valid-feedback" v-if="valid && validated && successMessage">
              {{successMessage}}
            </div>
          </slot>
          <slot name="error">
            <div v-if="errors[0] || error" class="invalid-feedback" style="display: block;">
              {{ errors[0] || error}}
            </div>
          </slot>
      </span>  
    </b-form-group>
  </validation-provider>
</template>
<script>

  import passwordMeter from "vue-simple-password-meter";
 
  var ID_COUNTER = 0;

  export default {
    components: { passwordMeter },
    inheritAttrs: false,
    name: "base-input",
    props: {
      layout : {
        type : String,
        default : "default",
        description: "ex : flushed"
      },
      size: {
        type: String,
        description: 'size sm/md/lg/xl',
      },
      required: {
        type: Boolean,
        description: "Whether input is required (adds an asterix *)"
      },
      question: {
        type: Boolean,
        default: false,
        description: "Whether to amnimate placeholder to lable"
      },
      prelabel: {
        type: Boolean,
        default: false,
        description: "Prepend Label (left)"
      },
      variant : { type: String,  default : 'outline-success' },
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
      value: {
        type: [String, Number,Array],
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
      appendClass : {
      },
      append : {
      },
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
      rules: {
        type: [String, Array, Object,Function],
        description: 'Vee validate validation rules',
        default: ''
      },
      name: {
        type: String,
        description: 'Input name (used for validation)',
        default: ''
      },
      copy : {
        type : Boolean,
        default : false
      }, clearable : {
        type : Boolean,
        default : false
      },
      link : {
        type : Boolean,
        default : false
      },
      formatFilter : {
         type: String
      },
      formatValue : {
      },
      formatLive : {
        type : Boolean,
        default : false
      },
      formatSync : {
        type : Boolean,
        default : true
      },
      suggestions : {
        type : [Array,Object],
        default : function(){
          return [];
        },
      }      
    },
    data() {
      return {
        focused: false,
        hovered : false,
        inputId : ++ID_COUNTER,
        autofilled : false
      };
    },
    computed: {
      listeners() {
        return {
          ...this.$listeners,
          input: this.updateValue,
          focus: this.onFocus,
          blur: this.onBlur,
          score : this.onScore,
        };
      },
      slotData() {
        return {
          hovered : this.hovered,
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
      isPrelabel(){
        return this.prependIcon || this.prelabel || this.$slots.prepend || this.prepend || this.prependClass
      },
      fieldLabel(){
        return (this.label || this.name)
      },
      showHelpMessage(){
        if((this.question && this.$attrs.placeholder)  || this.helpMessage){
          return true;
        }
      },
      inputValue(){
        if(this.value === null || this.value === undefined || this.value === ''){
          return this.formatValue;
        }
        return this.value;
      },
      displayValue : {
          get: function() {
              if (
                (this.formatLive || !this.focused) && this.formatFilter && this.$options.filters[this.formatFilter]) {
                return this.$options.filters[this.formatFilter](this.inputValue);
              } else {
                return this.inputValue;
              }
          },
          set: function(modifiedValue) {
              if(this.formatFilter && this.$options.filters[this.formatFilter]){
                let newValue = this.$options.filters[this.formatFilter](modifiedValue);
                this.emitValue(newValue);
              } else  this.emitValue(modifiedValue);
          }
      },
      suggestionValid(){
        if((!this.focused && !this.hovered) || this.$attrs.disabled || this.$attrs.readonly) return null;
        let value  = this.value?.toUpperCase() || '';
        return this.suggestions.filter((s)=>{
          let ss = s.toUpperCase();
          return (ss.indexOf(value)>-1) && (ss!=value);
        });
      }
    },
    watch : {
      'formatValue' :  function(n,o){
        if(this.formatSync && this.formatFilter && this.$options.filters[this.formatFilter]){
          let oldValue = this.$options.filters[this.formatFilter](o);
          if(!this.value || this.value == oldValue){
            this.displayValue = n;
          }
        }
      }
    },
    mounted(){
      setTimeout(()=> {
        this.autofilled = this.$refs?.input?.matches(':-internal-autofill-selected') || false;
      },1000);
    },
    methods: {
      updateValue(evt) {
        let value = evt.target.value;
        this.emitValue(value);
      },
      emitValue(value){
        this.$emit("input", value);
        this.$emit("change", value);
      },
      onFocus(evt) {
        this.focused = true;
        this.$emit("focus", evt);
      },
      onBlur(evt) {
        this.focused = false;
        this.$emit("blur", evt);
      },
      onCommit(evt) {
        this.$emit("commit", evt);
      },
      mouseEnter(){
        this.hovered = true;
      },
      mouseLeave(){
        this.hovered = false;
      },
      onScore(evt) {
        this.$emit("score", evt);
      }
    }
  };
</script>
<style>
</style>
