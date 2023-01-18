<template>
  <router-view></router-view>
</template>

<script>
import Vue from 'vue';
import DashboardPlugin from '@/@common/argon/plugins/dashboard-plugin';
Vue.component('BaseVSelect', () => import('@/@common/custom/components/base/BaseVSelect.vue'));
import ElementUI from 'element-ui';
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
// configure language
locale.use(lang)
Vue.use(ElementUI, { locale });
Vue.use(DashboardPlugin);

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
