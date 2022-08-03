var tunnelClient = (function(win) {
	var config = {
		context : "/offsite",
		user : "guest",
		token : guid(),
		reconnect : false,
		options : {}
	};
	var $connectd = null, $dfd = null;
	var sessionToken = null;
	var tenantToken = null;
	var stompClient = null;
	var tagIds = [];
	var pong = false;
	var TUNNEL_DEBUG = false;
	var linkId = 0;
	var instances = [];
	
	win.__onsocket_connect__ = function(frame){
		console.log("__onsocket_connect__",frame);
	}
	win.__onsocket_disconnect__ = function(error, reconnect){
		if(config.reconnect){
			setTimeout(reconnect, 5000);
			console.log('STOMP: Reconecting in 5 seconds');
		} else {
			console.log('STOMP: Auto reconnect not anebaled');
		}
	}
	
	try{
		if(win.sessionStorage && win.sessionStorage.getItem)
		TUNNEL_DEBUG = !!win.sessionStorage.getItem("TUNNEL_DEBUG");
	} catch(e) {
		console.error("Error Captured, but we can live without it",e)
	}
	
	function connect() {
		$dfd = $dfd || jQuery.Deferred();
		var socket = new SockJS(config.context + '/stomp-tunnel',{
			debug : TUNNEL_DEBUG,
			reconnect_delay: 2500
		});
		stompClient = Stomp.over(socket);
		stompClient.heartbeat.outgoing = 0;
		stompClient.heartbeat.incoming = 0;
		stompClient.reconnect_delay = 1000;
		if(!TUNNEL_DEBUG){
			stompClient.debug = () => {};
		}
		let xSessionId = config.options?.session?.xsessionId || document.querySelector('meta[name="xsessionid"]')?.content;
		let jSessionId = config.options?.session?.jsessionId || document.querySelector('meta[name="jsessionid"]')?.content;
		let tenant = config.options?.session?.tnt || document.querySelector('meta[name="tenant"]')?.content;
		console.log("XFLICT",xSessionId, config.options?.session?.xsessionId)
		stompClient.connect({
			user : config.user,
			token : config.token,
			xSessionId : xSessionId
		}, function(frame) {
			console.log('Connected: ', frame);
			let url = 	["/app/stomp/tunnel/meta"];
			if(tenant){
				url.push(tenant);
			}
			if(xSessionId && jSessionId){
				url.push(xSessionId);
				url.push(jSessionId);
			}		
			stompClient.subscribe(url.join("/") , function(greeting) {
				var resp = JSON.parse(greeting.body);
				console.log("@SubscribeMapping:XFLICT",resp);
				sessionToken = resp["x-session-uid"];
				tenantToken = resp["x-tenant-token"];
				tagIds = resp["tags"] || [];
				$dfd.resolve(linkId++);
				for(var i in instances){
					instances[i].reconnect();
				}
				if(typeof win.__onsocket_connect__ == 'function'){
					win.__onsocket_connect__(frame);
				}
				for(var i in instances){
					let details = {frame : frame, type : "CONNECTED"};
					if(!instances[i].inactive && typeof instances[i].__change__ == 'function'){
						instances[i].__change__(details);
					}
				}
			});
		}, function(error){
			let details = {error : error,type : "ERROR"};
			console.error("__onsocket_disconnect__",details);
			$connectd = null;
			if(typeof win.__onsocket_disconnect__ == 'function'){
				win.__onsocket_disconnect__(details, function(){
					$dfd = null;
				   	connect();	
				});
				for(var i in instances){
					if(!instances[i].inactive && typeof instances[i].__change__ == 'function'){
						instances[i].__change__(details);
					}
				}
			}
		}, function(CloseEvent){
			let details = {closeEvent : CloseEvent, type : "CLOSED"};
			console.error("__onsocket_close__",details);
			$connectd = null;
			if(typeof win.__onsocket_disconnect__ == 'function'){
				win.__onsocket_disconnect__(details, function(){
					$dfd = null;
				   	connect();	
				});
			}
			for(var i in instances){
				if(!instances[i].inactive && typeof instances[i].__change__ == 'function'){
					instances[i].__change__(details);
				}
			}
		});
		return $dfd.promise();
	}
	function guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16)
					.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4()
				+ s4() + s4();
	}
	function onConnect() {
		if (!$connectd) {
			$connectd = connect();
		}
		return $connectd;
	}
	function printSub(news,headline){
		if(news && news.unsub)
			console.log("tunnel:sub",news.linkId,news.unsub.id,headline);
	}
	function TunnelClient (){
		this.ids = [];
	}
	TunnelClient.prototype = {
		push : function(news,_linkId){
			news.unsub = stompClient.subscribe(news.headline,function(greeting){
				let body = JSON.parse(greeting.body);
				console.log("tunnel:event", _linkId, greeting.headers.subscription, 
				greeting.headers.destination, news.topic, body,greeting.headers);
				news.sub(body,news.topic, greeting);
			});
			news.linkId = _linkId;
			if(news.index === undefined){
				this.ids.push(news);
				news.index = this.ids.length-1;
			}
			printSub(news,news.headline);
		},
		on : function subscribe(topic, fun) {
			console.log("tunnel:topic",topic);
			var THAT = this;
			let sub = function(body,topic, greeting) {
				fun(body.data, topic, greeting);
			};
			onConnect().then(function(linkId) {
				THAT.push({ 
					topic : topic,
					headline : "/topic/_" + topic,
					fun : fun, sub : sub,
				},linkId);
			});
			onConnect().then(function(linkId) {
				THAT.push({ 
					topic : topic, 
					headline : "/topic/" + tenantToken + topic, 
					fun : fun, sub : sub,
				},linkId);
			});
			onConnect().then(function(linkId) {
				THAT.push({ 
					topic : topic,
					headline : "/queue/" + sessionToken + topic, 
					fun : fun, sub : sub,
				},linkId);
			});			
			onConnect().then(function(linkId) {
				tagIds.map(function(tagId){
					THAT.push({ 
						topic : topic,
						headline : "/tag/" + (tenantToken + "/" + tagId) + topic,
						fun : fun, sub : sub,
					},linkId);
				});
			});
			return this;
		},	
		send : function send(topic, msg) {
			onConnect().then(function() {
				stompClient.send("/app" + topic, {}, JSON.stringify(msg));
			});
			return this;
		},
		off : function(){
			console.log(this.ids)
			for(var i in this.ids){
				this.ids[i].inactive=true;
				this.ids[i].unsub.unsubscribe();
				console.log("tunnel:unsubscribe",topic);
			}
			this.inactive = true;
			console.log('tunnel:inactive')
		},
		reconnect : function(){
			var THAT = this;
			onConnect().then(function(linkId){
				for(var i in THAT.ids){
					if(!THAT.ids[i].inactive){
						let headline = THAT.ids[i].headline;
						console.log("tunnel:unsub",THAT.ids[i].linkId,THAT.ids[i].unsub.id,headline);
						THAT.ids[i].unsub.unsubscribe();
						THAT.push(THAT.ids[i],linkId);
					}
				}
			});
		},
		ping : function send(topic, msg) {
			//if(!pong){
				this.on("/pong", function(pong,pong1,pong2,pong3){
					console.log("PONG : ",pong,pong1,pong2,pong3)
				});
				pong = true;
			//}
			this.send("/ping",{ ping : "Hello"});
            jQuery.getJSON(config.context+"/stomp/tunnel/ping").done(function(resp){
                console.log("/stomp/tunnel/ping response : ",resp)
            });
			return this;
		},
        pong :  function(){
            this.on("/stomp/tunnel/pong" , function(greeting) {
                console.log("PONG:",greeting);
            });
			return this;
        },
		change: function(fun){
			this.__change__ = fun;
			return this;
		}
	}
	

	return {
		debug : false,
		global : null, 
		config : function (_config){
			_config.options = {
				...config.options,
				..._config.options
			}
			for(var key in _config){
				config[key] = _config[key]
			}
			if(!this.global){
				this.global = this.instance();
				this.global.pong();
			}
			return this;
		},
		connect : function() {
			onConnect();
			return this;
		},
		instance :  function(){
			let inst = new TunnelClient();
			instances.push(inst)
			return inst;
		},
		disconnect : function disconnect() {
			if (stompClient !== null) {
				stompClient.disconnect();
			}
			setConnected(false);
			console.log("Disconnected");
			return this;
		},
		triggerChange :  function(type,event){
			console.log('tunnel:triggerChange')
			for(var i in instances){
				if(!instances[i].inactive && typeof instances[i].__change__ == 'function'){
					instances[i].__change__({type : type,event : event });
				}
			}
		}
	};
})(this);