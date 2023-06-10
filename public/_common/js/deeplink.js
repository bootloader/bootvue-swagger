//alert("deeplink"+window.CONST.DEEP_LINK);

function sendPostMessage(obj) {
    var msg = JSON.stringify({payload : obj});
    if(window.opener) window.opener.postMessage(msg, '*');
    if(window.parent) window.parent.postMessage(msg, '*');
}

function bodyConsole(text,a,b,c,d){
    let log = document.createElement('div');
    log.innerText = text;
    document.body.appendChild(text);
    sendPostMessage({ conext : "DEEP_LINK", event : 'LOG', logs : text });
}

const HANDLE_DEEPLINK_TIMEER_LIMIT = 5*1000;

window.onload =  function(){
    let deepWindow  = null;
    sendPostMessage({ conext : "DEEP_LINK", event : 'ONLOAD' });
    console.log("DEEP_LINK:onload",window.CONST.DEEP_LINK)
    let handleDeepLinkTimer = null;
    let handleDeepLinkStamp = Date.now()+HANDLE_DEEPLINK_TIMEER_LIMIT;
    const handleDeepLinkFailure = () => {
        //alert("=====")
        console.log("DEEP_LINK:visibilitychange",window.CONST.DEEP_LINK)
        document.removeEventListener('visibilitychange', handleDeepLinkFailure);
        window.clearTimeout(handleDeepLinkTimer);
        handleDeepLinkTimer = setTimeout(function(){
            console.log('document.hidden',document.hidden);
            console.log('deepWindow.location',deepWindow.location.href);
            //deepWindow.close();
            //window.close();
            if (document.hidden || (handleDeepLinkStamp < Date.now())) {
                console.log("DEEP_LINK_SUCCESS");
                sendPostMessage({ conext : "DEEP_LINK", event : 'ONCLOSE' });
                setTimeout(()=>{
                    window.close();
                });
            } else {
                console.log("DEEP_LINK_FAILURE");
                sendPostMessage({ conext : "DEEP_LINK", event : 'ONFAIL' });
                // Handle the deep link failure here
                // You can display an error message or provide an alternative action
            }
            handleDeepLinkFailure();
            // if(document.hidden && deepWindow.location.href == 'about:blank'){
            //     deepWindow.close();
            //     window.close();
            //     return
            // }
        },1000);
    };
    document.addEventListener('visibilitychange', handleDeepLinkFailure);
    //bodyConsole("LINK="+decodeURIComponent(window.CONST.DEEP_LINK));
    //deepWindow = window.open(window.CONST.DEEP_LINK,'deep_link');
    deepWindow = window.open(window.CONST.DEEP_LINK,'_self');
    sendPostMessage({ conext : "DEEP_LINK", event : 'ONOPEN' });
    deepWindow.addEventListener('load', function(){
        sendPostMessage({ conext : "DEEP_LINK", event : 'ONOPEN_ONLOAD' });
        handleDeepLinkStamp = Date.now()+HANDLE_DEEPLINK_TIMEER_LIMIT;
      }, false);
    handleDeepLinkFailure();
}


