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
	isMobileApp : (window.CONST.APP_VIEW == "mobile"),
	isMobile : (function(){
		//return true;
		let check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	})()
};
