<template>
    <my-source 
      :options="options" 
      v-bind="$attrs" 
      :class="['basic-component bc-toggle btn-group-toggle','bc-span', 'bc-layout-' + layout]"
      data-toggle="buttons" tag="div"
      v-model="model"> 
      <template #data="{options}">
       <b-form-group :label="name" :size="size" :class="['text-'+size]"
              v-slot="{ ariaDescribedby }" label-for="'fmg-' + inputId">
              <b-form-radio-group
                id="btn-radios-2"
                v-model="model"
                :options="options"
                html-field="label"
                text-field="value"
                :aria-describedby="ariaDescribedby"
                :button-variant="buttonVariant"
                name="radio-btn-outline"
                buttons
                :size="size"
              ></b-form-radio-group>
          </b-form-group>
      </template>
    </my-source>  
</template>
<script>

  import MySource from "@/@common/custom/components/MySource.vue";

   var ID_COUNTER = 0;

  export default {
    name: 'button-radio-group',
    components : {
        MySource
    },
    props: {
      layout : {
        type : String,
        default : "default",
        description: "ex : flushed"
      },
      options: {
        description: 'Radio options. Should be an array of objects {value: "", label: ""}'
      },
      value: {
        description: 'Radio value'
      },
      name: {
        type: String,
        description: 'Label value'
      },
      buttonVariant: {
        type: [String, Object],
        default : 'outline-primary',
        description: 'Inner button css classes'
      },
      size: {
        type: String,
        description: 'Size xs,sm/lg/xl'
      },
    },
    data() {
      return {
        focused: false,
        inputId : ++ID_COUNTER,
      };
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    computed: {
      model: {
        get() {
          return this.value
        },
        set(value) {
          console.log("set",value);
          this.$emit('input', value)
          this.$emit('change', value)
        }
      }
    },
    methods : {

    }
  }
</script>
<style>
</style>
