

export default {
	client : null,
	connected : false,
	online : true,
	strength : function(){
		return 0 + (this.connected ? 2 : 0) + (this.online ? 1 : 0);
	},
	init : function () {
	  if(!this.client){
		let THAT = this;
		this.client =  window.tunnelClient.config({
			user : window.CONST.APP_USER,
			context : window.CONST.APP_CONTEXT,
		});
		window.__onsocket_disconnect__  = function(error, reconnect){
			console.log("MSG",error);
			if(error.type == "CLOSED"){
				THAT.connected = false;
				reconnect();
			}
		};
		window.__onsocket_connect__  = function(error, reconnect){
			THAT.connected = true
		};
		window.addEventListener('offline', function(e) { 
			console.log('tunnel:offline'); 
			THAT.online = !!navigator.onLine
			THAT.client.global.ping();
			THAT.online = !!navigator.onLine
			THAT.client.triggerChange('offline',e);
		});
		window.addEventListener('online', function(e) { 
			console.log('tunnel:online'); 
			THAT.online = !!navigator.onLine
			THAT.client.global.ping();
			THAT.online = !!navigator.onLine
			THAT.client.triggerChange('online',e);
		});
	  }
	  this.online = !!navigator.onLine;
	  return this.client;
	},
	instance : function () {
		return this.client.instance()
	},
	pipe : function () {
		return this.init().instance()
	}
}