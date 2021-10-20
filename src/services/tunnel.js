

export default {
	client : null,
	connected : false,
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
	  }
	  return this.client;
	},
	instance : function () {
		return this.client.instance()
	}
}