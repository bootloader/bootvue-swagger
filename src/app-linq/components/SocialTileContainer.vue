<template>
    <div class="social-tile-container">
        <social-tile class="w-full lg:w-4/12"
          v-for="(c,index) in items" v-bind:key="c.id+'_'+ index"
          :title="c.title"  :subtitle="c.subtitle" :provider="c.provider"> 
        </social-tile>
    </div>
</template>
<script>
export default {
  props : {
    items : {}
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
</style>
