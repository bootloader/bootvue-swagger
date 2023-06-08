//alert("deeplink"+window.CONST.DEEP_LINK);
window.onload =  function(){
    console.log("DEEP_LINK========",window.CONST.DEEP_LINK)
    const handleDeepLinkFailure = () => {
        document.removeEventListener('visibilitychange', handleDeepLinkFailure);
         window.close();
    };
    document.addEventListener('visibilitychange', handleDeepLinkFailure);
    window.location = window.CONST.DEEP_LINK;
}


