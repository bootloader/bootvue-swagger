<template>
  <div id="app" class="app-wrapper">
    <component :is="app">

    </component>
  </div>
</template>

<script>
import Vue from 'vue';

  export default {
    name : "AppWrapper",
    computed: {
      app() {
        return 'app-'+window.CONST.APP;
      }
    }
  };
</script>

<style lang="scss">
  //@import "./assets/base.scss";
</style>
