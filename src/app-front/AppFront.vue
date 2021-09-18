<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
  import Vue from 'vue';
  import "@fortawesome/fontawesome-free/css/all.min.css";
  import "@/assets/vendor/notus/styles/tailwind.css";
  import ReadMore from 'vue-read-more';
  import { ValidationProvider,ValidationObserver } from 'vee-validate';
  
  Vue.use(ReadMore);
  Vue.component('ValidationProvider', ValidationProvider);
  Vue.component('ValidationObserver', ValidationObserver);

  console.log("Front App is loaded")
  export default {

  }

</script>