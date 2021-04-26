export const myVar = 'This is my variable'
export const MyConst = {
 	some: 'Settings',
	app : window.CONST.APP,
	appPrefix : "/" + window.CONST.APP,
	user : window.CONST.APP_USER,
	agent : window.CONST.APP_USER
}
export const MyFlags = {
  showSidebar: false,
  showContactProfile : true,
  agent : {
  	showProfile : true,
  	profileView : 'history', //history,info
  }
}

export const MyDict = {
	social : {
	 "FACEBOOK" : "fa-facebook", "WEBSITE" : "fa-chrome", "TELEGRAM" : "fa-telegram",  "TWITTER" : "fa-twitter","WHATSAPP" : "fa-whatsapp",
	},
	socialPrefix : function (argument) {
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
	} ,
	profilePic : require('./../assets/agent/images/profile.png')
}