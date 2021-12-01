import formatters from '@/services/formatters';

function toHSM(waba){
    console.log("toHSMs",waba);
    waba.template = (waba?.template?.components || []).filter(function(cmp){
        return cmp.type == "BODY";
    })[0]?.text;

    waba.header = (waba?.template?.components || []).filter(function(cmp){
        return cmp.type == "HEADER";
    })[0]?.text;

    return waba
}

const varFinder = /({{([\w\d\.]+)}})/g;
function getVars(replaceVars){
    var myArray = replaceVars.match(varFinder) || [];
    var varList = [];
    for(var i in myArray){
        varList.push({ 
            i : i,
            numVar : myArray[i],
            path : myArray[i].replace(/(\{\{)|(\}\})/g,'')
        })
    }
    return varList;
}
function replaceVars(content){
    return content.replace(varFinder, (() => {
        var number = 0;
        return () => {
          return `{{${++number}}}`;
        }
    })());
}
function cloneWABATmplSample(template,hsm) {
    hsm = hsm || {};
    let bodyText = null,headerText;
    let templateRaw = (hsm?.body || hsm?.template || "").split("---options---");
    let varMap = {};

    if(templateRaw[0]){
        varMap.body = getVars(templateRaw[0]);
        bodyText = replaceVars(templateRaw[0]);
    }

    if(hsm?.header){
        varMap.header = getVars(hsm?.header);
        headerText = replaceVars(hsm?.header);
    }
    let templateOptions = formatters.message_form_options(formatters.map_from_string(templateRaw[1]));

    return {
        channelId : template.channelId,
        code  : template.code,
        lang  : template.lang,
        category : template.category,
        contactType : template.contactType,
        channelType : template.channelType,
        varMap : varMap,
        template : {
            name : template.code,
            language : template.lang,
            category : template.category,
            components: [
                {
                    type: 'BODY',
                    text: bodyText
                },
                (function(){
                    let format = (function(){
                        switch(hsm?.meta?.contentType){
                            case "IMAGE":
                            case "VIDEO":
                            case "DOCUMENT":
                            case "TEXT":
                                return hsm?.meta?.contentType;
                            default:
                                return null;    
                        }
                    })();
                    let text = (format == "TEXT") ? (headerText) : null; 
                    return {
                        type: 'HEADER',
                        format : format,
                        text : text
                    };
                })(),
                {
                    type: 'FOOTER',
                    text: hsm?.footer,
                },
                {
                    type: 'BUTTONS',
                    buttons: (hsm?.options?.buttons || []).concat(templateOptions.buttons).map(function(button){
                        return {
                            type : button.type || "QUICK_REPLY",
                            text : button.label,
                            url : button.url,
                            phone_number : button.phone_number
                        }
                    }),
                },
            ],
        }
    }
}

function createWABATmplSample(template) {
    return {
        channelId : template.channelId,
        code  : template.code,
        lang  : template.lang,
        category : template.category,
        contactType : template.contactType,
        channelType : template.channelType,
        template : {
            name : template.code,
            language : template.lang,
            category : template.category,
            components: [
                {
                    type: 'BODY',
                    text: null,
                },
                {
                    type: 'HEADER',
                    format: null
                },
                {
                    type: 'FOOTER',
                    text: null,
                },
                {
                    type: 'BUTTONS',
                    buttons: [
                    ],
                },
            ],
        }
    }
}

function createWABATmplSimple() {
    return {
        header: {
            type: null,
            text: null,
        },
        body: {
            text: null,
        },
        footer: {
            text: null,
        },
        buttons: {
            type: 'None',
            urlType : 'STATIC',
            buttons: [],
        },
        examples : {
            header_text : null,
            header_handler : null,
            body_text : [],
            body_preview : "",
            button_url : null
        }
    }
}

export { createWABATmplSample, createWABATmplSimple ,cloneWABATmplSample,toHSM}
