<template>
    <span class="modal-selector">
        <button class="selected-option-button" v-b-modal.modal-selector-modal>
            <slot name="selected-option">
              <span v-if="selectedOption">
                    <i v-if="selectedOption.icon" v-bind:class="selectedOption.icon"></i>
                      {{selectedOption.label}}
              </span>  
              <span v-else-if="placeholder">
                {{placeholder}}
              </span>
            </slot>
        </button>  
        <input type="hidden" v-bind:value="value" v-on:input="$emit('input', $event.target.value)" >
        <b-modal id="modal-selector-modal" ref="modal-selector-modal" title="Select Message Category"
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
                    {{option.label}}
                  </slot>
                </button>
                
              </span>
          </div>


         ----|  {{selectedIndex}} |-----
        </b-modal>

    </span>
</template>

<script>




    var getOptionKey =  function (option) {
       if(!option ){
        return option;
       }
       if (typeof option !== 'object') {
          return option;
        } else  if (typeof option === 'object' && (option.id || option.key)) {
          return (option.id || option.key);
        } else {
          try {
            return JSON.stringify(option)
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

    export default {
        components: {

        },
        data: () => ({
            selectedIndex : null
        }),
        computed : {
          selectedOption : function () {
            for (var i  in this.options) {
              if(getOptionKey(this.options[i]) == getOptionKey(this.value)){
                return this.options[i];
              }
            }
          }
        },
        methods : {
          valueOnSelect : function (option) {
            this.$emit('input', option);
            this.$bvModal.hide('modal-selector-modal')
          },
          isSelected : function (option) {
             return (getOptionKey(option) == getOptionKey(this.value));
          }
        },
        created : function (argument) {
          
        },
        props: {
            placeholder : String,
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
