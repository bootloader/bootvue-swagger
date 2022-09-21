<template>
  <div id="app">
    <component :is="layout">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </component>
    <MyTheme/>
  </div>
</template>

<script>
  import Vue from 'vue';
  import router from "./app-admin/router";
  import DataStore from "./app-admin/Service/DataStore";
  import { ValidationProvider, ValidationObserver } from 'vee-validate';
  import VueClipboard from 'vue-clipboard2';

  Vue.component('admin-default-layout', () => import('./app-admin/Layout/baseLayout.vue'));
  Vue.component('admin-scriptus-layout', () => import('./app-admin/Layout/ScriptusLayout.vue'));
  Vue.component('admin-userpages-layout', () => import('./app-admin/Layout/pagesLayout.vue'));
  Vue.component('master-view', () => import('./app-admin/Layout/MasterView.vue'));

  Vue.component('ValidationProvider', ValidationProvider);
  Vue.component('ValidationObserver', ValidationObserver);
  Vue.component('BaseInput', () => import('./@common/argon/components/Inputs/BaseInput.vue'));
  Vue.component('BaseCheckbox', () => import('./@common/argon/components/Inputs/BaseCheckbox.vue'));
  Vue.component('BaseTextArea', () => import('./@common/argon/components/Inputs/BaseTextArea.vue'));
  Vue.component('BaseSelect', () => import('./@common/argon/components/Inputs/BaseSelect.vue'));
  Vue.component('ButtonRadioGroup', () => import('./@common/argon/components/ButtonRadioGroup.vue'));
  Vue.component('BaseDropdown', () => import('./@common/argon/components/BaseDropdown.vue'));
  Vue.component('BaseCopy', () => import('./@common/argon/components/BaseCopy.vue'));
  Vue.component('BaseQuickEdit', () => import('./@common/argon/components/BaseQuickEdit.vue'));
  import globalDirectives from '@/@common/argon/plugins/globalDirectives';
  Vue.use(globalDirectives);

  Vue.component('XSimpleForm', () => import('./@common/custom/components/XSimpleForm.vue'));
  Vue.component('MyModalBox', () => import('./@common/custom/components/MyModalBox.vue'));
  Vue.component('MySource', () => import('./@common/custom/components/MySource.vue'));
  Vue.component('MyText', () => import('./@common/custom/components/MyText.vue'));
  Vue.component('MyDatePicker', () => import('./@common/custom/components/MyDatePicker.vue'));
  Vue.component('ForEachOption', () => import('./@common/custom/components/ForEachOption.vue'));
  Vue.component('MyVSelect', () => import('./@common/custom/components/MyVSelect.vue'));
  Vue.component('BaseVSelect', () => import('./@common/custom/components/base/BaseVSelect.vue'));
  Vue.component('MyAxon', () => import('./@common/custom/components/MyAxon.vue'));
  Vue.component('MyIcon', () => import('./@common/custom/components/MyIcon.vue'));
  Vue.component('MyMedia', () => import('./@common/custom/components/MyMedia.vue'));

  VueClipboard.config.autoSetContainer = true // add this line
  Vue.use(VueClipboard)

  import 'viewerjs/dist/viewer.css';
  import Viewer from 'v-viewer';
  Vue.use(Viewer);


  const loadimage = __webpack_public_path__ + '/_common/static/loading-spin.svg';
  const errorimage = __webpack_public_path__ + '/_common/static/loading-spin.svg';
  import VueLazyload from 'vue-lazyload'
  Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: errorimage,
    loading: loadimage,
    attempt: 1,
    throttleWait : 1000
  })

  import MyTheme from '@/@common/custom/layout/MyTheme';

  const default_layout = "default";
  console.log("ADMIN APP IS LOADED")
  export default {
    name:"AppAdmin",
    components : { MyTheme },
    computed: {
      layout() {
        return 'admin-' +(this.$route.meta.layout || default_layout) + '-layout';
      }
    },
    mounted : function (argument) {
        let recaptchaScript = document.createElement('script')
        recaptchaScript.setAttribute('src', 'https://kit.fontawesome.com/1153462312.js')
        document.head.appendChild(recaptchaScript);

      recaptchaScript = document.createElement('link')
      recaptchaScript.setAttribute('rel', 'stylesheet')
      recaptchaScript.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.2/font/bootstrap-icons.css')
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
  @import "./assets/fonts/openweb/css/openwebicons.css";
  .v-input-error {
    color : red;
  }
</style>
