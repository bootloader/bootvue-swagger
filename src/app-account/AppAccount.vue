<template>
  <router-view></router-view>
</template>

<script>
import Vue from 'vue';
import DashboardPlugin from '@/@common/argon/plugins/dashboard-plugin';
Vue.use(DashboardPlugin);

export default {
  mounted() {
      let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', 'https://kit.fontawesome.com/1153462312.js')
      document.head.appendChild(recaptchaScript);
  }
}
</script>
