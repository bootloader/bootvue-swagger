//alert("deeplink"+window.CONST.DEEP_LINK);

function bodyConsole(text){
    let log = document.createElement('div');
    log.innerText = text;
    document.body.appendChild(log)
}
window.onload =  function(){
    let deepWindow  = null;
    console.log("DEEP_LINK:onload",window.CONST.DEEP_LINK)
    let handleDeepLinkTimer = null;
    let handleDeepLinkStamp = Date.now()+5*1000;
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
                window.close();
            } else {
                console.log("DEEP_LINK_FAILURE");
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
    deepWindow.onload = function(){
        handleDeepLinkStamp = Date.now()+5*1000;
    }
    handleDeepLinkFailure();
}


