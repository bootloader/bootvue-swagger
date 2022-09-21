
import './preloader'
import Vue from 'vue'

import mainrouter from './services/router';
import store from './store';
import service from './services/DataService';
import axios from 'axios';

import { BootstrapVue,BootstrapVueIcons,SidebarPlugin} from "bootstrap-vue"

import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import VTooltip from 'v-tooltip'

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

import { i18n } from "./services/i18n";
import "./services/vee-validate"; 
import Vue2TouchEvents from 'vue2-touch-events'


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
Vue.use(SidebarPlugin)

Vue.use(VueLoading);
Vue.use(VTooltip);
VTooltip.options.defaultClass = 'my-tooltip';
VTooltip.options.defaultTemplate =
  '<div class="foo" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';
VTooltip.enabled = window.innerWidth > 768;
Vue.use(VueToast);
Vue.use(Vue2TouchEvents)

import AppWrapper from './AppWrapper';

(function(configs,app){
	var config = configs[app] || configs.dev
	console.log("ALWAYS",app,config);

	if(typeof config.beforeLoad == 'function'){
		config.beforeLoad();
	}

	Vue.component(`app-${app}`, config.component);
	
	import(`./app-${app}/router`).then(function (argument) {
    	new Vue({
		  el: '#app',
		  store,service,i18n,
		  router : mainrouter.router(),
		  template: '<AppWrapper/>',
		  components: { AppWrapper }
		});

	 })

})({
	"admin" : {
		component : () => import('./AppAdmin.vue')	
	},
	"agent" : { 
		component : () => import('./app-agent/AppAgent.vue')
	},
	"customer" : { //Customer App
		component : () => import('./app-customer/AppCustomer.vue')
	},
	"account" : { //Account App
		beforeLoad : () => {
		},
		component : () => import('./app-account/AppAccount.vue')
	},
	"partner" : { //Partner App
		beforeLoad : () => {
		},
		component : () => import('./app-partner/AppPartner.vue')
	},
    "cpanel" : { //Partner App
		beforeLoad : () => {
		},
		component : () => import('./app-cpanel/AppCpanel.vue')
	},
	"front" : { //Account App
		component : () => import('./app-front/AppFront.vue')
	},
	"page" : { //Account App
		component : () => import('./app-page/AppPage.vue')
	},
	"contak" : { //Notp App
		component : () => import('./app-contak/AppContak.vue')
	},
	"dev" : { 
		component : () => import('./app-dev/AppDev.vue')
	},
    "content" : { //Partner App
		beforeLoad : () => {
		},
		component : () => import('./app-content/AppContent.vue')
	},
},window.CONST.APP);









