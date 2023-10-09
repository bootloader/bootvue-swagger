<template>
  <router-view></router-view>
</template>

<script>
import Vue from 'vue';
import DashboardPlugin from '@/@common/argon/plugins/dashboard-plugin';
Vue.use(DashboardPlugin);

import VueClipboard from 'vue-clipboard2';
VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard);

console.log("This is AppPartner")

export default {
  mounted() {
      let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', 'https://kit.fontawesome.com/1153462312.js')
      document.head.appendChild(recaptchaScript);
  }
}
</script>
<style lang="scss">
    @import '@/assets/utils/_popular.scss';
</style>
