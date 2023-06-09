//alert("deeplink"+window.CONST.DEEP_LINK);

function bodyConsole(text){
    let log = document.createElement('div');
    log.innerText = text;
    document.body.appendChild(log)
}

window.onload =  function(){
    console.log("DEEP_LINK:onload",window.CONST.DEEP_LINK)
    const handleDeepLinkFailure = () => {
        //alert("=====")
        console.log("DEEP_LINK:visibilitychange",window.CONST.DEEP_LINK)
        document.removeEventListener('visibilitychange', handleDeepLinkFailure);
        window.close();
    };
    document.addEventListener('visibilitychange', handleDeepLinkFailure);
    //bodyConsole("LINK="+decodeURIComponent(window.CONST.DEEP_LINK));
    window.open(window.CONST.DEEP_LINK,'deep_link');
}


