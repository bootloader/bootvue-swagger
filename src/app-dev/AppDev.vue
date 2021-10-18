<template>
  <div id="app">
    <div id="wrapper">
      <AppReleases/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import DashboardPlugin from '@/@common/argon/plugins/dashboard-plugin';
Vue.use(DashboardPlugin);

import VueClipboard from 'vue-clipboard2';
VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)

import AppReleases from './AppReleases'

  export default {
    components : {
      AppReleases
    },
    computed: {
      layout() {
        return 'dev-' + (this.$route.meta.layout || default_layout) + '-layout';
      }
    },
    mounted : function () {
      let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', 'https://kit.fontawesome.com/1153462312.js')
      document.head.appendChild(recaptchaScript);
    },
  }
</script>
<style lang="scss">
  #wrapper {
    background-color: #ffffff;
  }
</style>
