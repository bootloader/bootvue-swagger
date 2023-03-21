import Vue from 'vue';

export const myVar = 'This is my variable'

window.CONST.dev =  window.CONST.dev != 'false';

export const MyConst = {
 	some: 'Settings',
	app : window.CONST.APP, appView : window.CONST.APP_VIEW,
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
		config.PERMS = {
			...(config.PERMS|| {})
		};
		config.isLagacy = ( config?.PERMS?.BUILD_VERSION<2 );
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

export const User = (function(){
	let user = {
		isDuperUser : (window.CONST.APP_USER_ROLE || []).indexOf('DUPER_USER')>=0,
		isSuperDev : (window.CONST.APP_USER_ROLE || []).indexOf('SUPER_DEV')>=0,
		isPartner : (window.CONST.APP_USER_ROLE || []).indexOf('BUSINESS_PARTNER')>=0,
		isDomainOwner : (window.CONST.APP_USER_ROLE || []).indexOf('BUSINESS_USER')>=0,
		isWabaManager : (window.CONST.APP_USER_ROLE || []).indexOf('WABA_MANAGER')>=0,
	}
	user.isMultiDomainUser = (user.isDuperUser || user.isSuperDev || user.isPartner);
	user.canAddOwner = (user.isDuperUser || user.isSuperDev || user.isPartner);
	user.canAddWaba = 	user.isDuperUser || user.isWabaManager;
	user.canManageWaba = user.isDuperUser || user.isWabaManager || user.isSuperDev;
	user.canDebugDomain = 	user.isDuperUser || user.isSuperDev || user.isDomainOwner;
	return user;
})();

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
	 "EMAIL" : "fas fa-envelope"
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
		} else if(argument.indexOf('ig')==0){
			return this.social.INSTAGRAM
		}
		return this.social.WEBSITE;
	},
	c2cUrl : function(c){
		if(c.contactType == 'FACEBOOK'){
			return `https://m.me/${c.facebook.handler}`;
		} else if(c.contactType == 'TWITTER'){
			return `https://twitter.com/${c.twitter.handler}`;
		} else if(c.contactType == 'WHATSAPP'){
			return `https://api.whatsapp.com/send/?phone=${c.lane}${c.sandbox? ('&text=/proxy '+
			(MyConst.appDomain || MyConst.tenant )) : ''}`;
		} else if(c.contactType == 'TELEGRAM'){
			return `https://telegram.me/${c.telegram.lane}`;
		} else if(c.contactType == 'INSTAGRAM'){
			return `https://instagram.com/${c.instagram.handler}`;
		}
		return `https://${MyConst.tenant}.${MyConst.config.PROP_SERVICE_SERVER}`;
	},
	profilePic : require('./../assets/agent/images/profile.png'),
	profilePicFun(url,name,type){
		if(url){
			return url;
		}
		switch(type){
			case 'FACEBOOK':
				return `https://ui-avatars.com/api/?name=${name}&background=a0acbe&color=333f54`;
			case 'TWITTER':
				return `https://ui-avatars.com/api/?name=${name}&background=b7d9ec&color=102f41`;
			case 'WHATSAPP':
				return `https://ui-avatars.com/api/?name=${name}&background=b9c4be&color=394f42`;
			case 'TELEGRAM':
				return `https://ui-avatars.com/api/?name=${name}&background=8ca5b2&color=243037`;
			case 'INSTAGRAM':
				return `https://ui-avatars.com/api/?name=${name}&background=cabcc6&color=371e4f`;
			case 'EMAIL':
				return `https://ui-avatars.com/api/?name=${name}&background=a9a9a9&color=313030`;
			default :
				return `https://ui-avatars.com/api/?name=${name}&background=c6d7ee&color=20262d`;
		}
	}
}

export const MyFunc  = {
	isInbound(mType){
		return ["I","Ii"].indexOf(mType) > -1
	},
	isOutbound(mType){
		return ["O","Oi"].indexOf(mType) > -1
	}
}

export const Event = {
	fp(callback){
		if(window.CONST.fp){
			callback(window.CONST.fp);
		} else {
			setTimeout(()=>Event.fp(callback),1500);
		}
	}
};

Vue.prototype.$config = MyConst.config;
Vue.prototype.$global = {
	MyConst,MyFlags,MyDict,MyFunc,User,Event,
	//Flags
	isMobileApp : (window.CONST.APP_VIEW == "mobile")
};
