//alert("deeplink"+window.CONST.DEEP_LINK);
window.onload =  function(){
    console.log("DEEP_LINK========",window.CONST.DEEP_LINK)
    //window.open(window.CONST.DEEP_LINK,'_self');
    window.location = window.CONST.DEEP_LINK;
    setTimeout(()=>{
        window.close();
    },1000);
}