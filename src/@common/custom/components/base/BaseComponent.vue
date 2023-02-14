<template>
  <span :rules="rules" :name="name" v-bind="$attrs"
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
          {'has-value': value != ''},
          'text-'+size,
          labelClasses
        ]">
          {{fieldLabel}}
        </label>
      </slot>
      <slot name="default">

      </slot>

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
            <div v-if="errors[0]" class="invalid-feedback" style="display: block;">
              {{ errors[0] }}
            </div>
          </slot>
      </span>  
    </b-form-group>
  </span>
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
        valid : true,
        validated : true,
        invalid : false,errors : []
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
    },
    watch : {
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
