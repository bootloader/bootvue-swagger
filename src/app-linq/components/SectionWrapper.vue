<template>
    <div class="section-wrapper" :class="{
      'section-wrapper-header' : header
    }">
      <h4 v-if="!!title" class="section-divider linq-section-divider">{{title}}</h4>
       <slot name="default">
         </slot>     
    </div> 
</template>
<script>
export default {
  props : {
    header : { type : Boolean, default : false},
    title : {}
  },
  data() {
    return {
    };
  },
  computed : {
  },
  methods: {
  },
  components: {
  },
};
</script>
<style lang="scss">
.section-wrapper {
    padding:15px 20px;
    display: block;
    background: #fff;
    overflow-y: scroll;
    height: 100%;

    .section-divider {
        width: 100%;             
        -webkit-text-stroke: thin;
        font-variant: all-petite-caps;
        font-size: 16px;
        .section-title {
            font-size: 12px; 
            background-color: #ffffff; 
            padding: 0 5px;
            border-radius: 5px;
        }
    }
    
    &.section-wrapper-header {
        border-bottom: 1px #e1e1e1 solid;
    }

}
</style>
