import Vue from 'vue';

export const myVar = 'This is my variable'

window.CONST.dev =  window.CONST.dev != 'false';

export const MyConst = {
 	some: 'Settings',
	app : window.CONST.APP,
	cdn : window.CONST.CDN_URL,
	appPrefix : "/" + window.CONST.APP, tenant : window.CONST.TENANT,
	appDomain : window.CONST.APP_DOMAIN,appDomainId : window.CONST.APP_DOMAIN_ID,
	context : window.CONST.CONTEXT,
	user : window.CONST.APP_USER, dept : window.CONST.APP_DEPT,
	userName : window.CONST.APP_USER_NAME,
	agent : window.CONST.APP_USER,
	nounce : window.CONST.NOUNCE,
	config : (function(config){
		//Derived Constants
		config.chatRefreshInterval = config.chatIdleTimeout/5; //Chats/sessions should be refreshed after this interval
		return config;
	})(Object.assign({
		chatSessionTimeout : 86400000, // After which chat is expired
		chatIdleTimeout : 1000*60*5, // Time after which  chat raised attention
		agentSessionTimeout : 1000*60*10, // Time to ping server
		CHAT_TAG_ENABLED : true,
		AGENT_CHAT_INIT : false,
	}, window.CONST.CONFIG || window.CONST.CONFG,window.CONST.dev ? {
		//CHAT_TAG_ENABLED : false,
		//AGENT_CHAT_INIT : true,
		//AGENT_CHAT_SEARCH_SESSION : true,
		// SETUP : {
		// 	POSTMAN_AGENT_CHAT_INIT_SESSION : true,
		// 	POSTMAN_AGENT_CHAT_INIT_CONTACT : true
		// }
	}: {})),
	logo : {
		full : window.CONST.CDN_URL + "/logo/logo-long.png",
		full_inverse : window.CONST.CDN_URL + "/logo/logo-long-o.png",
		short : window.CONST.CDN_URL + "/logo/logo-short.png",
		short_inverse : window.CONST.CDN_URL + "/logo/logo-short-o.png",
	},
	sessionLoadStamp : new Date().getTime()
}
export const MyFlags = {
  showSidebar: false,
  showContactProfile : true,
  agent : {
  	showProfile : true, showProfileAllowed : false,
  	showContactSearch :  false,
	showSessionSearch :  false,
  	profileView : 'history', //history,info
  	contactsTab : 'ME',
  	mvu : 'CONTACTS', //CONTACTS,CHATBOX,CPROFILE
  }
}

export const MyDict = {
	social : {
	 "FACEBOOK" : "fa fa-facebook", "WEBSITE" : "fa fa-chrome", "TELEGRAM" : "fa fa-telegram",  
	 "TWITTER" : "fa fa-twitter","WHATSAPP" : "fa fa-whatsapp","INSTAGRAM" : "fa fa-instagram",
	},
	chatStatus : {
		"UNASSIGNED"	: {label : "UNASSIGNED" }, 
		"OPEN" 		: {label : "OPEN",editable : true}, 
		"ATTENTION" : {label :"ATTENTION", editable : true}, 
		"URGENT" 	: {label :"URGENT",editable : true}, 
		"ONHOLD" 	: {label :"ONHOLD",editable : true}, 
	  	"EXPIRED" 	: {label : "EXPIRED"},
	  	"RESOLVED" 	: {label : "RESOLVED",editable : true}, 
	  	"CLOSED" 	: {label :"CLOSED"}
	},
	socialPrefix : function(argument,prefix){
		var clz = this._socialPrefix(argument);
		if(prefix){
			return clz.replace(/^fa |^f /,prefix+' ');
		} else {
			return clz.replace(/^f /,'');
		}
		return clz;
	},
	_socialPrefix : function (argument) {
		argument = argument || "";
		if(this.social[argument]){
			return this.social[argument];
		}
		if(argument.indexOf('tw')==0){
			return this.social.TWITTER
		} else if(argument.indexOf('tg')==0){
			return this.social.TELEGRAM
		} else if(argument.indexOf('fb')==0){
			return this.social.FACEBOOK
		} else if(argument.indexOf('wa')==0){
			return this.social.WHATSAPP
		}
		return this.social.WEBSITE;
	},
	profilePic : require('./../assets/agent/images/profile.png')
}

export const MyFunc  = {
	isInbound(mType){
		return ["I","Ii"].indexOf(mType) > -1
	},
	isOutbound(mType){
		return ["O","Oi"].indexOf(mType) > -1
	}
}

Vue.prototype.$config = MyConst.config;
Vue.prototype.$global = {
	MyConst,MyFlags,MyDict,MyFunc
};
