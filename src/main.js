
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

Vue.use(BootstrapVue,{
	breakpoints: [`xs`, 'sm', ,'ms', 'md', 'lg', 'xl', 'xxl']
});
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
	let appFile = app[0].toUpperCase() + app.substring(1); 
	var config = configs[app] || {
		component : () => import(`./app-${app}/App${appFile}.vue`)
	};
	//console.log("ALWAYS",app,config);

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
	"page" : { //Account App
		component : () => import('./app-page/AppPage.vue')
	},
	"linq" : { //Linq App
		component : () => import('./app-linq/AppLinq.vue')
	},
	"dev" : { 
		component : () => import('./app-dev/AppDev.vue')
	},
    "content" : { //Partner App
		beforeLoad : () => {
		},
		component : () => import('./app-content/AppContent.vue')
	},
	"www" : { //Www App
		beforeLoad : () => {
		},
		component : () => import('./app-www/AppW.vue')
	},
},window.CONST.APP);









