<template>
  <div id="app">
    <component :is="layout">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </component>
  </div>
</template>

<script>
  import Vue from 'vue';
  import router from "./app-admin/router";
  import DataStore from "./app-admin/Service/DataStore";
  import { ValidationProvider, ValidationObserver } from 'vee-validate';
  import VueClipboard from 'vue-clipboard2';

  Vue.component('admin-default-layout', () => import('./app-admin/Layout/baseLayout.vue'));
  Vue.component('admin-userpages-layout', () => import('./app-admin/Layout/pagesLayout.vue'));
  Vue.component('master-view', () => import('./app-admin/Layout/MasterView.vue'));

  Vue.component('ValidationProvider', ValidationProvider);
  Vue.component('ValidationObserver', ValidationObserver);
  Vue.component('BaseInput', () => import('./@common/argon/components/Inputs/BaseInput.vue'));
  Vue.component('BaseTextArea', () => import('./@common/argon/components/Inputs/BaseTextArea.vue'));
  Vue.component('ButtonRadioGroup', () => import('./@common/argon/components/ButtonRadioGroup.vue'));
  Vue.component('BaseDropdown', () => import('./@common/argon/components/BaseDropdown.vue'));
  import globalDirectives from '@/@common/argon/plugins/globalDirectives';
  Vue.use(globalDirectives);

  Vue.component('MySource', () => import('./@common/custom/components/MySource.vue'));
  Vue.component('ForEachOption', () => import('./@common/custom/components/ForEachOption.vue'));
  Vue.component('MyVSelect', () => import('./@common/custom/components/MyVSelect.vue'));
  Vue.component('BaseVSelect', () => import('./@common/custom/components/base/BaseVSelect.vue'));
  Vue.component('MyAxon', () => import('./@common/custom/components/MyAxon.vue'));

  VueClipboard.config.autoSetContainer = true // add this line
  Vue.use(VueClipboard)

  const default_layout = "default";

  console.log("ADMIN APP IS LOADED")
  export default {
    name:"AppAdmin",
    computed: {
      layout() {
        return 'admin-' +(this.$route.meta.layout || default_layout) + '-layout';
      }
    },
    mounted : function (argument) {
        let recaptchaScript = document.createElement('script')
        recaptchaScript.setAttribute('src', 'https://kit.fontawesome.com/1153462312.js')
        document.head.appendChild(recaptchaScript);
    },
    created (){
      this.$store.registerModule("DataStore",DataStore);
    },
  }
</script>

<style lang="scss">
  @import "./assets/base.scss";
  @import '@/assets/utils/_popular.scss';
  .v-input-error {
    color : red;
  }
</style>
