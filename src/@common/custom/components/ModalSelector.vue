<template>
    <span class="modal-selector">
        <button class="selected-option-button" @click="showModal">
            <slot name="selected-option">
              <span v-if="selectedOption!==undefined && selectedOption!==null">
                    <i v-if="selectedOption.icon" v-bind:class="selectedOption.icon"></i>
                      {{getEmptyLabel(getOptionLabel(selectedOption),emptyLabel)}}
              </span>  
              <span v-else-if="placeholder">
                {{placeholder}}
              </span>
            </slot>
        </button>  
        <input type="hidden" v-bind:value="value" v-on:input="$emit('input', $event.target.value)" >
        <b-modal :id="'modal-selector-modal-'+selectorId" ref="modal-selector-modal" title="Select Message Category"
              hide-header
              hide-footer
              hide-backdrop
              centered
              size="lg"
          >
          <div class="row align-items-center">
              <span v-for="(option,i) in options" class="modal-selector-option col-4" @click="valueOnSelect(option)"
                v-bind:class="{
                  'selected' : isSelected(option)
                }" >
                <button class="btn">
                  <slot name="option">
                    <i v-if="option.icon" v-bind:class="option.icon"></i>
                    {{getEmptyLabel(getOptionLabel(option),emptyLabel)}}
                  </slot>
                </button>
                
              </span>
          </div>

        </b-modal>

    </span>
</template>

<script>

    var getOptionValue = function (option,defKey) {
        if(!option ){
          return option;
        }
        if (typeof option !== 'object') {
          return option;
        } else  if (typeof option === 'object' && (option.id || option.key)) {
          return (option.id || option.key);
        } else if(defKey){
          return defKey;
        }
        return option;
    };

    var getOptionKey =  function (option,defKey) {
        var optionValue = getOptionValue(option,defKey);
        if (typeof optionValue !== 'object') {
          return optionValue;
        } else {
          try {
            return JSON.stringify(optionValue)
          } catch(e) {
            return console.warn(
              `[vue-select warn]: Could not stringify option ` +
              `to generate unique key. Please provide 'getOptionKey' prop ` +
              `to return a unique key for each option.\n` +
              'https://vue-select.org/api/props.html#getoptionkey'
            )
            return null
          }
        };
    };

    var getOptionLabel =  function (option,emptyLabel) {
       if(!option ){
        return option;
       }
       if (typeof option !== 'object') {
          return option;
        } else  if (typeof option === 'object' && (option.label!==undefined)) {
          return (option.label);
        } else if(emptyLabel){
          return emptyLabel;
        } else {
          return getOptionKey(option,option.toString())
        };
    };

    var getEmptyLabel =  function (value,emptyLabel) {
      //console.log("getEmptyLabel",value,emptyLabel)
      if(value === "" || value === null){
        return emptyLabel;
      } else return value;
    }

    var counter = 0;

    export default {
        components: {

        },
        data: () => ({
            selectedIndex : null,
            selectorId : ++counter,
            getOptionLabel,getEmptyLabel
        }),
        computed : {
          selectedOption : function () {
            for (var i  in this.options) {
              if(getOptionKey(this.options[i]) == getOptionKey(this.value)){
                return this.options[i];
              }
            }
          },
        },
        methods : {
          valueOnSelect : function (option) {
            if(typeof this.value === 'string')
              this.$emit('input', getOptionKey(option));
            else this.$emit('input', getOptionValue(option));
            this.$bvModal.hide('modal-selector-modal-'+this.selectorId)
          },
          isSelected : function (option) {
             return (getOptionKey(option) == getOptionKey(this.value));
          },
          showModal : function (argument) {
             this.$bvModal.show('modal-selector-modal-'+this.selectorId)
          }
        },
        created : function (argument) {
          
        },
        props: {
            placeholder : String,
            emptyLabel : {
              default :  null
            },
            value : {
              default : ""
            },
            options : {
                type: Array,
                default() {
                  return [];
                }
            }
        }
    }
</script>
<style lang="scss">
  .modal-selector {
      button.selected-option-button {
        border: 0px solid #ced4da;
        background-color: #fff;
        border-radius: 0.25rem;
        width: 100%;
        cursor: pointer;
        color: inherit;
    }
  }
  .modal-selector-option{
    margin-bottom: 10px;
    &.selected>button{
      border: 1px solid #0a7cef;
      background-color: #0a7cef12;
    }
    &>button{
      border: 1px solid #ced4da;
      border-radius: 0.25rem;
      display: inline-block;
      width: 100%;
      height: 100%;
    }

  }

</style>
