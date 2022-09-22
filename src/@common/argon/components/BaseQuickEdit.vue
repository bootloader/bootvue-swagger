<template>
    <base-input  v-on="listeners"
        class="mx-0 px-0" size="sm" :label="label" :name="name" v-bind="$attrs"
        ref="input"  v-model="inputValue" autocomplete="off" :rules="rules" 
        :prependClass="prependClass" :prependIcon="prependIcon" :prelabel="prelabel" :prependGroupClass="prependGroupClass"
        @keyup.enter="commitValue">
        <template #default>
          <span v-if="!editing" id="fmg-1"
            autocomplete="off" class="form-control form-control-sm non-edit-mode" @dblclick="editValue">
              {{value}}
          </span>
        </template>
        <template #actions>
            <b-button variant="outline-primary" class="fa fa-edit"  v-if="!editing" @click="editValue"
            ></b-button>
            <b-button variant="outline-success"  class="fa fa-check" v-if="editing" @click="commitValue"
            ></b-button>
            <b-button variant="outline-danger" class="fa fa-times"  v-if="editing" @click="editValue(false)"
            ></b-button>
            <b-button variant="outline-danger" class="fa fa-trash"  v-if="!editing && clearable" @click="removeValue"
            ></b-button>
        </template>  
    </base-input>
</template>
<script>

  var ID_COUNTER = 0;

  export default {
    components: {
    },
    inheritAttrs: false,
    name: "base-quick-edit",
    props: {
      label: {
        type: String,
        description: "Input label (text before input)"
      },
      name: {
        type: String,
        description: "Input label (text before input)"
      },
      value: {
        type: [String, Number,Boolean],
        description: "Input value"
      },
      rules: {
        type: [String, Number,Boolean],
        description: "Input value"
      },
      size: {
        type: [String],
        description: "Size value"
      },
      prelabel : {
        type: Boolean,
      },
      prependClass: {
        type: String,
        default : "",//"input-group-text",
        description: "Prepend Class (left)"
      },
      prependGroupClass : {
        type: String,
        default : "",//"input-group-text",
        description: "Prepend Class (left)"
      },
      prependIcon: {
        type: String,
        description: "Prepend icon Class (left)"
      },
      clearable: {
        type: Boolean,
        description: "Is it reset"
      },
      reset: {
        type: Boolean,
        description: "Is it reset"
      },
    },
    data() {
      return {
        editing : false,
        focused: false,
        inputId : ++ID_COUNTER,
        selectOptions : null,
        inputValue : null
      };
    },
    computed: {
      listeners() {
        return {
          ...this.$listeners,
          input: this.updateValue,
          focus: this.onFocus,
          blur: this.onBlur
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
          this.group
        );
      },
      showValue(){
        return this.reset ? (this.value || '***********') : this.value;
      },
    },
    created(){
      this.loadOptions();
    },
    methods: {
      editValue(edit){
        if(edit === false){
          this.editing=false;
        } else {
            this.editing=true;
            setTimeout(()=>{
                if(this.$refs.input.$refs.input){
                  this.$refs.input.$refs.input.focus();
                }
            },50);
        }
        this.inputValue = this.value;
      },
      commitValue(){
        this.$emit("input", this.inputValue);
        this.$emit("commit", this.inputValue);
        this.editing=!this.editing
      },
      removeValue(){
        this.$emit("remove", this.inputValue);
      },
      onFocus(evt) {
        this.focused = true;
        this.$emit("focus", evt);
        this.editValue();
      },
      onBlur(evt) {
        this.focused = false;
        this.$emit("blur", evt);
      },
      onReset(evt) {
        this.$emit("reset", evt);
      },
      fromOptions(options){
          this.selectOptions = options.map(function(option){
            if(typeof option == 'string' || typeof option == 'number'){
              return {
                id : option, name : option
              }
            } else {
              return {
                id : option.id || option.key || option.code || option.value || option.label || option.name, 
                name : option.name || option.label || option.value || option.code || option.key || option.id
              }
            }
          });
      },
      async loadOptions(){
        if(this.options && (typeof this.options == 'string') && this.options.indexOf('data:') == 0){
          let json = await import("@/@data/" + this.options.replace("data:","") + ".json");
          this.fromOptions(json.options);
        } else if(this.options){
          this.fromOptions(this.options);
        }
      }
    }
  };
</script>
<style scoped>
  span.form-control.non-edit-mode {
    background-color: #00000012;
  }
</style>
