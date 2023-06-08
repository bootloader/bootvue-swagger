<template>
    <div class="">
      <b-button variant="success" @click="debugCDN">DEBUG</b-button>
      <b-button variant="primary" @click="resetCDN">RESET</b-button>
    </div>
</template>
<script>
export default {
  props : {
  },
  data() {
    return {
    };
  },
  computed : {
  },
  methods: {
    debugCDN(){
      let url = window.prompt("CDN");
      console.log("url",url)
      document.cookie=`BOOTJX_CDN_URL=${btoa(url)};path=/`
    },resetCDN (){
      document.cookie=`BOOTJX_CDN_URL=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
  },
  components: {
  },
};
</script>
<style lang="scss">
</style>
