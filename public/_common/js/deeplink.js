//alert("deeplink"+window.CONST.DEEP_LINK);
window.onload =  function(){
    console.log("DEEP_LINK:onload",window.CONST.DEEP_LINK)
    const handleDeepLinkFailure = () => {
        alert("=====")
        console.log("DEEP_LINK:visibilitychange",window.CONST.DEEP_LINK)
        document.removeEventListener('visibilitychange', handleDeepLinkFailure);
        // window.close();
    };
    document.addEventListener('visibilitychange', handleDeepLinkFailure);
    window.location = window.CONST.DEEP_LINK;
}


