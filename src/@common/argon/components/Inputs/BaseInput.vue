<template>
  <validation-provider :rules="rules" :name="name" v-bind="$attrs" v-slot="{errors, valid, invalid, validated}">
    <b-form-group class="form-group-input" label-for="'fmg-' + inputId"
      :class="[
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
          labelClasses
        ]">
          {{label || name}}
        </label>
      </slot>
      <div :class="[
       {'input-group': hasIcon || (feedback)},
       {'focused': focused},
       {'input-group-alternative': alternative},
       {'has-label': (label || name) || $slots.label},
       inputGroupClasses
       ]">
        <div v-if="prependIcon || prelabel || $slots.prepend" class="input-group-prepend">
          <slot name="prepend">
            <span class="input-group-text">
              <i v-if="prependIcon" :class="prependIcon"></i>
              <span v-if="prelabel">{{label || name}}</span>
            </span>
          </slot>
        </div>
        <slot v-bind="slotData">
          <input
            :id="'fmg-' + inputId"
            :value="value"
            :type="type"
            v-on="listeners"
            v-bind="$attrs" 
            :valid="valid" 
            :placeholder="question ? '' : $attrs.placeholder"
            :required="required"
            class="form-control"
            :class="[{'is-valid': valid && validated && successMessage}, {'is-invalid': invalid && validated}, inputClasses]">
        </slot>
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
      <slot name="help">
          <div class="help-feedback" v-if="showHelpMessage">
            {{helpMessage || $attrs.placeholder}}
          </div>
      </slot>
      <password-meter v-show="strengthBar" :password="value" @score="listeners.score" />
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
          this.prelabel !== undefined ||
          this.textLimit > 0 ||
          this.group
        );
      },
      showHelpMessage(){
        if((this.question && this.$attrs.placeholder)  || this.helpMessage){
          return true;
        }
      }
    },
    methods: {
      updateValue(evt) {
        let value = evt.target.value;
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
</style>
