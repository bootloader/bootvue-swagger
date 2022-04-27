<template>
    <b-input-group :class="['mt-3',('input-group-'+size)]">
            <b-input-group-prepend>
                <b-button variant="outline-dark" :class="['w-120px',('text-'+size)]">
                    {{label}}</b-button>
            </b-input-group-prepend>
            <b-form-input readonly
              :value="showValue"
            ></b-form-input>
            <b-input-group-append>

                <b-button v-if="reset && !value"
                  @click="onReset" 
                  variant="outline-success">Reset</b-button>
                <b-button v-else class="w-20"
                  v-clipboard:copy="value" 
                  variant="outline-success">Copy</b-button>

            </b-input-group-append>
      </b-input-group>
</template>
<script>

  var ID_COUNTER = 0;

  export default {
    inheritAttrs: false,
    name: "base-copy",
    props: {
      label: {
        type: String,
        description: "Input label (text before input)"
      },
      value: {
        type: [String, Number,Boolean],
        description: "Input value"
      },
      size: {
        type: [String],
        description: "Size value"
      },
      reset: {
        type: Boolean,
        description: "Is it reset"
      },
    },
    data() {
      return {
        focused: false,
        inputId : ++ID_COUNTER,
        selectOptions : null
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
      }
    },
    created(){
      this.loadOptions();
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
  input.form-control {
    padding-left: 5px!important;
  }
</style>
