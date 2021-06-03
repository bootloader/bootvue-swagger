export const myVar = 'This is my variable'
export const MyConst = {
 	some: 'Settings',
	app : window.CONST.APP,
	cdn : window.CONST.CDN_URL,
	appPrefix : "/" + window.CONST.APP,
	context : window.CONST.CONTEXT,
	user : window.CONST.APP_USER, dept : window.CONST.APP_DEPT,
	agent : window.CONST.APP_USER,
	config : window.CONST.CONFIG || window.CONST.CONFG,
	logo : {
		full : window.CONST.CDN_URL + "/logo/logo-long.png",
		full_inverse : window.CONST.CDN_URL + "/logo/logo-long-o.png",
		short : window.CONST.CDN_URL + "/logo/logo-short.png",
		short_inverse : window.CONST.CDN_URL + "/logo/logo-short-o.png",
	},
	onlineTimeout : 1000*60*5,
	sessionLoadStamp : new Date().getTime()
}
export const MyFlags = {
  showSidebar: false,
  showContactProfile : true,
  agent : {
  	showProfile : true,
  	profileView : 'history', //history,info
  	contactsTab : 'ME',
  	mvu : 'CONTACTS', //CONTACTS,CHATBOX,CPROFILE
  }
}

export const MyDict = {
	social : {
	 "FACEBOOK" : "fa-facebook", "WEBSITE" : "fa-chrome", "TELEGRAM" : "fa-telegram",  "TWITTER" : "fa-twitter","WHATSAPP" : "fa-whatsapp",
	},
	chatStatus : {
		 "OPEN" : "OPEN", "UNASSIGNED" : "UNASSIGNED", "ATTENTION" : "ATTENTION",
	 	"URGENT" : "URGENT", "ONHOLD" : "ONHOLD", 
	  	"EXPIRED" : "EXPIRED", "RESOLVED" : "RESOLVED", "CLOSED" : "CLOSED"
	},
	socialPrefix : function (argument) {
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