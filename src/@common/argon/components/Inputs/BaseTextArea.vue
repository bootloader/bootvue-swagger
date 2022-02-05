<template>
  <validation-provider :rules="rules" :name="name" v-bind="$attrs" v-slot="{errors, valid, invalid, validated}"
  :class="['basic-component bc-text-area','bc-span', 'bc-layout-' + layout,'bc-size-' + size]">
    <b-form-group class="form-group-input" label-for="'fmg-' + inputId"
      :class="['layout-' + layout,
        {'is-question': question },
        {'resizable' : resizable},
      ]">
      <slot name="label">
        <label v-if="label || name" 
          :for="'fmg-' + inputId"
          :class="[
          {'focused': focused},
          {'is-valid': valid && validated }, 
          {'is-invalid': invalid && validated},
          {'has-value': value != ''},
          {'is-disabled' : disabled},
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
        <div v-if="prependIcon || $slots.prepend" class="input-group-prepend">
        <span class="input-group-text">
          <slot name="prepend">
            <i :class="prependIcon"></i>
          </slot>
        </span>
        </div>
        
          <text-complete v-if="textCompleteStrategies && textCompleteStrategies.length && !disabled"  
              :id="'fmg-' + inputId"
              :value="value"
              :type="type"
              v-on="listeners"
              v-bind="$attrs" 
              :valid="valid" :disabled="disabled"
              :placeholder="$attrs.placeholder"
              :required="required"
              class=""
              :areaClass="[ 
                size ? 'form-control-'+size : '',
                (valid && validated && successMessage) ? 'is-valid' : '',
                (invalid && validated) ? 'is-invalid' : '',
                inputClasses].join(' ')"
              :strategies="textCompleteStrategies || []">
          </text-complete>

          <textarea v-else
            :id="'fmg-' + inputId"
            :value="value"
            :type="type"
            v-on="listeners"
            v-bind="$attrs" 
            :disabled="disabled"
            :valid="valid" 
            :placeholder="$attrs.placeholder"
            :required="required"
            class="form-control"
            :class="[
                {'is-valid': valid && validated && successMessage}, 
                {'is-invalid': invalid && validated}, inputClasses]">
          </textarea>

        <div v-if="feedback"  class="input-group-append">
            <span class="input-group-text">
               <i class="fa" :class="[
                { 'fa-exclamation-circle text-danger' : errors[0]},
                { 'fa-check-circle text-success' : valid && validated }
               ]"></i>
            </span>
        </div>
        <div v-if="copy" class="input-group-append input-group-append-copy">
            <b-button v-clipboard:copy="value" 
                variant="outline-success fa fa-clipboard"></b-button>
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
    </b-form-group>
  </validation-provider>
</template>
<script>
 
 import passwordMeter from "vue-simple-password-meter";
 import TextComplete from '@/@common/cloned/v-textcomplete';

 var ID_COUNTER = 0;

  export default {
    components: { passwordMeter,TextComplete },
    inheritAttrs: false,
    name: "base-text-area",
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
      resizable : {
        type: Boolean,
        description: 'Resiable',
        default : false
      },
      disabled : {
        type: Boolean,
        description: 'Disabled',
        default : false
      },
      copy : {
        type : Boolean,
        default : false
      }
    },
    data() {
      return {
        focused: false,
        inputId : ++ID_COUNTER,
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
          this.textLimit > 0 ||
          this.group
        );
      },
      showHelpMessage(){
        if(this.helpMessage){
          return true;
        }
      }
    },
    methods: {
      updateValue(evt) {
        let value = (evt.target) ? evt.target.value : evt;
        this.$emit("input", value);
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
  .basic-text-area textarea{
    resize: none;
  }
  .basic-text-area .resizable textarea{
    resize: both;
  }
</style>
