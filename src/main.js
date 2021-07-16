
import './preloader'
import Vue from 'vue'

import mainrouter from './services/router';
import store from './store';
import service from './services/DataService';
import axios from 'axios';

import { BootstrapVue,BootstrapVueIcons} from "bootstrap-vue"

import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import VTooltip from 'v-tooltip'

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';


axios.defaults.withCredentials = true
axios.defaults.baseURL = (function() {
	var origin  = window.location.origin
	if(window.CONST && window.CONST.APP_CONTEXT){
		return origin +window.CONST.APP_CONTEXT
	}
	return origin
})();
console.log("baseURL====",axios.defaults.baseURL);
console.log("location.pathname====",location.pathname);
Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons)
//Vue.use(SidebarPlugin)

Vue.use(VueLoading);
Vue.use(VTooltip);
VTooltip.options.defaultClass = 'my-tooltip';
VTooltip.options.defaultTemplate =
  '<div class="foo" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';
Vue.use(VueToast);

 import AppWrapper from './AppWrapper'
// import AppAdmin from './AppAdmin'
// import AppAgent from './AppAgent'
// import AppCustomer from './AppCustomer'
// import AppDev from './AppDev'

;(function mapper(condition,onmatch){ //Funtion
	//console.log(condition,onmatch)
	var result = (typeof condition == "function") ? condition() : condition;
	return function (option,execute) {
		if(option == result){
			onmatch(result,execute(result));
		}
		return mapper(result,onmatch);
	}
})(function () { //Condition
	return window.CONST.APP
},function(result,config){
	console.log("ALWAYS",result,config);
	 import(`./app-${result}/router`).then(function (argument) {

    new Vue({
		  el: '#app',
		  store,service,
		  router : mainrouter.router(),
		  template: '<AppWrapper/>',
		  components: { AppWrapper }
		});


	 });


})("admin",function (admin) { //Admin App
	 return { path : './AppAdmin.vue', name : 'AppAdmin'};
})("agent", function(agent){ //Agent App
   return { path : './AppAgent', name : 'AppAgent'};
})("customer", function(customer){ //Customer App
   return { path : './AppCustomer.vue', name : 'AppCustomer'};
})("dev", function(agent){ //Agent App
	return { path : './AppDev.vue', name : 'AppDev'};
});









