<template>
  <validation-provider :rules="rules" :name="name" v-bind="$attrs" v-slot="{errors, valid, invalid, validated}"
    :class="['basic-component bc-input','bc-span', 'bc-layout-' + layout, 'bc-size-' + size]">
    <b-form-group class="form-group-input" :label-for="'fmg-' + inputId"
      :class="[
        label+name+inputId,
        {'is-question': question }
      ]">
      <slot name="label">
        <label v-if="!prelabel && (label || name)" 
          :for="'fmg-' + inputId"
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
       {'input-group': hasIcon || (feedback)},
        size ? 'input-group-'+size : '',
       {'focused': focused},
       {'input-group-alternative': alternative},
       {'has-label': (label || name) || $slots.label},
       inputGroupClasses
       ]">
        <div v-if="prependIcon || prelabel || $slots.prepend || prepend" class="input-group-prepend">
          <slot name="prepend">
            <span v-if="prepend" class="input-group-text">{{prepend}}</span>
            <b-button  v-else-if="prelabel" variant="outline-success">
              {{label || name}}
            </b-button>
            <span v-else :class="prependClass">
              <i v-if="prependIcon" :class="prependIcon"></i>
            </span>
          </slot>
        </div>
        <slot v-bind="slotData">
          <input
            :id="'fmg-' + inputId"
            v-model="displayValue"
            :type="type"
            v-on="listeners"
            v-bind="$attrs" 
            :valid="valid" 
            :placeholder="question ? '' : $attrs.placeholder"
            :required="required"
            class="form-control"
            :class="[
                size ? 'form-control-'+size : '',
                {'is-valid': valid && validated && successMessage}, 
                {'is-invalid': invalid && validated}, inputClasses]">
        </slot>
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
            <b-button v-clipboard:copy="value" 
                variant="outline-success fa fa-clipboard"></b-button>
        </div> 
        <div v-if="append || appendIcon || $slots.append || textLimit>0" class="input-group-append">
          <span class="input-group-text">
              <slot name="append" >
                  <span v-if="textLimit>0" class="">
                    {{value ? value.length : 0}}/{{textLimit}}
                  </span>
                  <i v-else-if="appendIcon" :class="appendIcon"></i>
                  <span v-else-if="append">{{append}}</span>
              </slot>
          </span>
        </div>
        <slot name="infoBlock"></slot>
      </div>
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
        <div v-if="errors[0]" class="invalid-feedback" style="display: block;">
          {{ errors[0] }}
        </div>
      </slot>
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
        default : "btn btn-sm",//"input-group-text",
        description: "Prepend Class (left)"
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
      copy : {
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
      }
    },
    data() {
      return {
        focused: false,
        inputId : ++ID_COUNTER
      };
    },
    computed: {
      listeners() {
        return {
          ...this.$listeners,
          input: this.updateValue,
          focus: this.onFocus,
          blur: this.onBlur,
          score : this.onScore
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
        }
    },
    watch : {
      'formatValue' :  function(n,o){
        if(this.formatFilter && this.$options.filters[this.formatFilter]){
          let oldValue = this.$options.filters[this.formatFilter](o);
          if(!this.value || this.value == oldValue){
            this.displayValue = n;
          }
        }
      }
    },
    methods: {
      updateValue(evt) {
        console.log("updateValue",evt)
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
      onScore(evt) {
        this.$emit("score", evt);
      }
    }
  };
</script>
<style>
</style>
