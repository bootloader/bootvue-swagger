<template>
    <div class="social-tile-container">
        <slot name="default">
          <social-tile class="w-full lg:w-4/12"
            v-for="(c,index) in items" v-bind:key="c.id+'_'+ index"
            :title="c.title"  :subtitle="c.subtitle" :provider="c.provider || provider" :path="c.path"> 
          </social-tile>
        </slot>  
    </div>
</template>
<script>
export default {
  props : {
    items : {},
    provider : {}
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
.social-tile-container {
  margin: auto;
  font-size: 0;
  text-align: center;
  left: 0;
  right: 0;
}
</style>
