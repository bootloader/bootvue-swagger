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
  
  Vue.use(ReadMore);

  console.log("Front App is loaded")
  export default {

  }

</script>