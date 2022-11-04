<template>
      <span :class="{
        'd-flex flex-column' : !hasValueAndLabel,
         'mb-2 text-xs' : hasValueAndLabel
      }">
        <slot>
          <span v-if="isLabelCapitalize" class="text-capitalize">  {{label | nospacial | lowercase}} </span>
          <span v-else>  {{label}} </span>:&nbsp; 
          <span class="text-dark font-weight-bold ms-sm-2">{{text}}</span>
        </slot>  
      </span>
</template>

<script>
export default {
  name: "summary-tile-detail",
  props : {
    label : {}, text : {}, 
    labelCapitalize : {type : Boolean, default :  true},
    noLabelCapitalize : {type : Boolean, default :  false},
    textCapitalize : {type : Boolean, default :  false}
  },
  computed : {
    hasValueAndLabel (){
      return (this.label !== undefined) && (this.text !== undefined)
    },
    isLabelCapitalize(){
      return this.labelCapitalize && !this.noLabelCapitalize;
    }
  }
};
</script>