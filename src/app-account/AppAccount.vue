<template>
  <router-view></router-view>
</template>

<script>
import Vue from 'vue';
import DashboardPlugin from '@/@common/argon/plugins/dashboard-plugin';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { extend } from 'vee-validate';
import { required, email,regex } from 'vee-validate/dist/rules';
import formatters from './../services/formatters';  
Vue.use(DashboardPlugin);


  // No message specified.
  extend('email', email);
  extend("regex", regex);
  // Override the default message.
  extend('required', {
    ...required,
    message: 'This field is required'
  });

formatters.validators.forEach(ruleName => {
  if(formatters[ruleName]){
    extend(ruleName, formatters[ruleName]);
  }
});


export default {
  mounted() {
      let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', 'https://kit.fontawesome.com/1153462312.js')
      document.head.appendChild(recaptchaScript);
  }
}
</script>
