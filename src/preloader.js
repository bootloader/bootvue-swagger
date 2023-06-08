/* global __webpack_public_path__:writable */
if(window.CONST && window.CONST.CDN_URL){
	__webpack_public_path__ = window.CONST.CDN_URL + "/";
}

window.CONST = (window.CONST || {});

switch(location.origin){
	case "https://notiphyapp.github.io":
	case "https://www.otpalerts.com":
		window.CONST.APP = "www";
		break;
	default:
		console.log("NO_URL_MATH");	
}
window.CONST.APP = window.CONST.APP || "content";
var pathname = location.pathname;
if(/^\/[a-z]+\/plugin\/customer\/.*$/.test(pathname) || /^\/[a-z]+\/[a-z]+\/plugin\/customer\/.*$/.test(pathname)){
	window.CONST.APP  = "customer";
} else if(pathname.indexOf("/admin") == 0){
	window.CONST.APP  = "admin";
} else if(pathname.indexOf("/agent") == 0){
	window.CONST.APP = "agent";
} else if(pathname.indexOf("/dev") == 0){
	window.CONST.APP = "dev";
} else if(pathname.indexOf("/content") == 0){
	window.CONST.APP = "content";
} else if(pathname.indexOf("/linq") == 0){
	window.CONST.APP = "linq";
}else if(pathname.indexOf("/page") == 0){
	window.CONST.APP = "page";
}else if(pathname.indexOf("/contak") == 0){
	window.CONST.APP = "contak";
} else if(pathname.indexOf("/entoc") == 0){
	window.CONST.APP = "www";
} else if(pathname.indexOf("/manifest") == 0){
	window.CONST.APP = "www";
}
window.callMobileEventListener = function(options){
	console.log("callMobileEventListener",options)
}
window.parent.postMessage("SocComApp", '*');
console.log("preloader",window.CONST);

try{
	window.localStorage.getItem;
} catch(e){
	console.error("localStorage not accible but its ok",e)
	window.localStorage = {
		getItem(key){
			return window.localStorageFallback.getItem(key)
		},setItem(k,v){
			return window.localStorageFallback.setitem(k,v)
		}
	}
}

//BFCACHE EVENT
if (document.addEventListener) {
    window.addEventListener('pageshow', function (event) {
        if (event.persisted || performance.getEntriesByType("navigation")[0].type === 'back_forward') {
            console.log("pageShow:back_forward")
        } else {
			console.log("pageShow:back_forward",event.persisted,performance.getEntriesByType("navigation")[0].type)
		}
    },
    false);
}


