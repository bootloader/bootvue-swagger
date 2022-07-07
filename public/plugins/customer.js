(function (win) {

    var maxHeight = 500;
    var minHeight = 70;
    var maxWidth = 400;
    var minWidth = 70;
    var UNIQUEID = '3ix5ju9kqbtr2W';
    var OPTIONS = {};

    var myChat = {
        init : function (options) {
            options = Object.assign({
                entity : "api", // After which chat is expired
            },options);
            OPTIONS = options;

            options.domain =  options.domain || [options.entity,".mehery.com"].join("");
            options.path = ["https://", options.domain ,"/postman/ext/plugin/customer/app/chat/"].join("");

            if(options.local){
                options.path = [options.local, "/ext/plugin/customer/app/chat/"].join("");
            }

            //local-kwt.amxremit.com:8083/agent/app/home
            //options.query = ["CDN_URL=http://127.0.0.1:8080&CDN_DEBUG=true"]
            console.log("init",options);
            var div = document.createElement("div");
            document.getElementsByTagName('body')[0].appendChild(div);
            div.outerHTML = `
            <div id='myChatDiv' class="myChatDivClose">
                <div id='myChatTitleBar' 
                     style='height: ${minHeight}px; width: ${minWidth}px; position:fixed; cursor: pointer;'></div>
                <div id='myChatFrame' style='margin: 0px 0px 0px 0px;'>
                    <iframe id="myChatIFrame-${UNIQUEID}"
                            src=${options.path}?${options.query}></iframe>
                <div>
            </div>
            <style>
                #myChatDiv {
                    height: ${minHeight+2}px; width: ${minWidth+2}px; 
                    position: fixed; bottom: 0px; right:0px; z-index: 100000; 
                    background-color: transparent; 
                    padding:0px!important; 
                    margin:0px!important
                }
                #myChatDiv #myChatFrame {
                    maring: 0px 0px 0px 0px; 
                    position:relative;
                    bottom:0;
                }
                #myChatDiv #myChatFrame #myChatIFrame-${UNIQUEID} {
                    border-width: 0px; 
                    margin: 1px 1px 1px 1px;
                    height: ${minHeight}px; width: ${minWidth}px; 
                }
                .myChatDivOpen#myChatDiv {
                    border-radius: 10px!important;
                    height: ${maxHeight}px; width: ${maxWidth}px; 
                    height: calc(100vh - 55px);
                    max-height: ${maxHeight}px;
                }
                .myChatDivOpen#myChatDiv #myChatFrame {
                    maring: 0px 0px 0px 0px; 
                }
                .myChatDivOpen#myChatDiv #myChatTitleBar {
                    display : none;
                }
                .myChatDivOpen#myChatDiv #myChatFrame #myChatIFrame-${UNIQUEID} {
                    margin: 0px 0px 0px 0px;
                    height: ${maxHeight}px; width: ${maxWidth}px; 
                    height: calc(100vh - 55px);
                    max-height: ${maxHeight}px;
                }
                @media (max-width: 450px) {
                    .myChatDivOpen#myChatDiv,
                    .myChatDivOpen#myChatDiv #myChatFrame #myChatIFrame-${UNIQUEID} {
                        width: 100vw;
                        height: 100vh;
                        max-height: 100vh;
                        right: 0;
                        bottom: 0;
                        border-radius: 0px!important;
                        transition: .1s ease-in-out;
                    }
                }

            </style>
            `;
            this.$myChatIFrame = document.getElementById(`myChatIFrame-${UNIQUEID}`);
            this.$myChatDiv = document.querySelector('#myChatDiv');
            this.$myChatFrame = document.querySelector('#myChatFrame');

            var THAT = this;
            document.querySelector('body').addEventListener('click', function (e) {
                e.target.matches = e.target.matches || e.target.msMatchesSelector;
                if (e.target.matches('#myChatTitleBar')) { 
                    THAT.postMessage( { event : "CHAT_TOGGLE" });
                };
            });



        },

        open : function(){
            this.postMessage( { event : "CHAT_TOGGLE" });
        },
        ON_CHAT_LOAD : function () {
           this.postMessage({event : "SET_OPTIONS", options : OPTIONS });
        },
        chatOnClose : function (argument) {
            this.$myChatDiv.className = this.$myChatDiv.className.replace("myChatDivOpen",'myChatDivClose');
        },
        chatOnOpen : function (argument) {
            this.$myChatDiv.className = this.$myChatDiv.className.replace("myChatDivClose",'myChatDivOpen');
        },
        postMessage : function (obj) {
            var msg = JSON.stringify({myChatEvent : obj});
            console.log("PARENT:sendPostMessage",msg);
            this.$myChatIFrame.contentWindow.postMessage(msg, '*');
        },
        bindEvent : function(element, eventName, eventHandler) {
            if (element.addEventListener){
                element.addEventListener(eventName, eventHandler, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + eventName, eventHandler);
            }
        }
    };

    myChat.bindEvent(win,'message',function (e) {
        console.log("PARENT:onPostMessage",e);
        if(!e || !e.data || typeof e.data != 'string' || e.data.trim().indexOf("{")!=0){
            return;
        }
        var data = JSON.parse(e.data);
        if(!data.myChatEvent){
            return;
        }
        var myChatEvent = data.myChatEvent;
        if(myChatEvent.event == "ON_CHAT_TOGGLE"){
            if(myChatEvent.isChatOpen) myChat.chatOnOpen(); else myChat.chatOnClose();
        } else if(typeof myChat[myChatEvent.event] == 'function'){
            myChat[myChatEvent.event](myChatEvent);
        }
    });

    var scripts = document.getElementsByTagName('script');    
    var index = scripts.length - 1;
    var myScript = scripts[index];
    var serviceUrl = myScript.src; 
    try {
        myChat.init(JSON.parse(myScript.innerHTML));
        win.myChat = myChat;
    } catch(e){
        console.error(e);
    }
    
}(this));