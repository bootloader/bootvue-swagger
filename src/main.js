
import './preloader'
import Vue from 'vue'

import mainrouter from './router';
import store from './store';
import service from './services/DataService';
import axios from 'axios';

import { BootstrapVue,BootstrapVueIcons} from "bootstrap-vue"

import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import VTooltip from 'v-tooltip'

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';


import AppAdmin from './AppAdmin'
import AppAgent from './AppAgent'
import AppCustomer from './AppCustomer'
import AppDev from './AppDev'

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

;(function mapper(condition){ //Funtion
	var result = (typeof condition == "function") ? condition() : condition;
	return function (option,execute) {
		if(option == result){
			execute(result);
		}
		return mapper(result);
	}
})(function () { //Condition
	return window.CONST.APP
})("admin",function (admin) { //Admin App
	 console.log("This is Admin App")
    new Vue({
	  el: '#app',
	  store,service,
	  router : mainrouter.router(),
	  template: '<AppAdmin/>',
	  components: { AppAdmin }
	});

})("agent", function(agent){ //Agent App
   console.log("This is Agent App")
   new Vue({
	  el: '#app',
	  store,service,
	  router : mainrouter.router(),
	  template: '<AppAgent/>',
	  components: { AppAgent }
	});
})("customer", function(customer){ //Customer App
   console.log("This is Customer App")
   new Vue({
	  el: '#app',
	  store,service,
	  router : mainrouter.router(),
	  template: '<AppCustomer/>',
	  components: { AppCustomer }
	});
})("dev", function(agent){ //Agent App
   new Vue({
	  el: '#app',
	  store,service,
	  router : mainrouter.router(),
	  template: '<AppDev/>',
	  components: { AppDev }
	});
});









